import { UserProfile, Quest, LocalizedStr } from '../types';
import { security } from './securityService';

// Daily Quest Templates
const QUEST_TEMPLATES: { type: 'INVITE' | 'HARVEST' | 'EARN', targets: number[], reward: number, desc: LocalizedStr }[] = [
    {
        type: 'INVITE',
        targets: [1],
        reward: 10,
        desc: { en: 'Invite a Friend', ru: 'Пригласи друга' }
    },
    {
        type: 'HARVEST',
        targets: [10, 20, 50],
        reward: 5,
        desc: { en: 'Harvest Crops', ru: 'Собери урожай' }
    },
    {
        type: 'EARN',
        targets: [1000, 5000, 10000],
        reward: 5,
        desc: { en: 'Earn Zen', ru: 'Заработай Zen' }
    }
];

export const questService = {
    checkDailyReset(profile: UserProfile): UserProfile {
        const now = Date.now();
        const lastReset = new Date(profile.lastDailyReset || 0);
        const today = new Date(now);

        // Check if it's a new day (simple check: different date string)
        if (lastReset.toDateString() !== today.toDateString()) {
            return this.generateDailyQuests({
                ...profile,
                lastDailyReset: now,
                dailyQuests: [] // Clear old
            });
        }
        return profile;
    },

    generateDailyQuests(profile: UserProfile): UserProfile {
        const quests: Quest[] = [];

        // 1. Always Invite Friend
        quests.push({
            id: `q_invite_${Date.now()}`,
            type: 'INVITE',
            target: 1,
            progress: 0,
            claimed: false,
            rewardGold: 10,
            description: { en: 'Invite 1 Friend', ru: 'Пригласи 1 друга' }
        });

        // 2. Random Harvest Quest
        const harvestTarget = [10, 20, 30][Math.floor(Math.random() * 3)];
        quests.push({
            id: `q_harvest_${Date.now()}`,
            type: 'HARVEST',
            target: harvestTarget,
            progress: 0,
            claimed: false,
            rewardGold: 5 + Math.floor(harvestTarget / 5),
            description: { en: `Harvest ${harvestTarget} Crops`, ru: `Собери ${harvestTarget} урожая` }
        });

        // 3. Random Earn Quest
        const earnTarget = [1000, 2500, 5000][Math.floor(Math.random() * 3)];
        quests.push({
            id: `q_earn_${Date.now()}`,
            type: 'EARN',
            target: earnTarget,
            progress: 0,
            claimed: false,
            rewardGold: 5 + Math.floor(earnTarget / 500),
            description: { en: `Earn ${earnTarget} Zen`, ru: `Заработай ${earnTarget} Zen` }
        });

        return { ...profile, dailyQuests: quests };
    },

    updateProgress(profile: UserProfile, type: 'HARVEST' | 'EARN' | 'INVITE', amount: number): UserProfile {
        let updated = false;
        const newQuests = profile.dailyQuests.map(q => {
            if (q.type === type && !q.claimed && q.progress < q.target) {
                updated = true;
                return { ...q, progress: Math.min(q.target, q.progress + amount) };
            }
            return q;
        });

        return updated ? { ...profile, dailyQuests: newQuests } : profile;
    },

    claimReward(profile: UserProfile, questId: string): { profile: UserProfile, reward: number, bonus: boolean } {
        const quest = profile.dailyQuests.find(q => q.id === questId);
        if (!quest || quest.claimed || quest.progress < quest.target) {
            return { profile, reward: 0, bonus: false };
        }

        let reward = quest.rewardGold;
        let bonus = false;

        // Mark as claimed
        const newQuests = profile.dailyQuests.map(q => q.id === questId ? { ...q, claimed: true } : q);

        // Check if ALL claimed after this one
        const allClaimed = newQuests.every(q => q.claimed);

        if (allClaimed) {
            // Bonus 15% to Gold if all daily finished? 
            // User said: "if all daily tasks are completed then another bonus is given 15% in gold"
            // Interpretation: 15% of TOTAL rewards? Or just a flat bonus?
            // "bonus is given 15% in gold" might mean +15% of the total daily earnings?
            // Let's sum up total daily rewards:
            const totalDaily = newQuests.reduce((acc, q) => acc + q.rewardGold, 0);
            const bonusAmount = Math.floor(totalDaily * 0.15);
            reward += bonusAmount;
            bonus = true;
        }

        return {
            profile: {
                ...profile,
                gold: (profile.gold || 0) + reward,
                dailyQuests: newQuests
            },
            reward,
            bonus
        };
    }
};
