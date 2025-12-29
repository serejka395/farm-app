import { UserProfile } from '../types';
import { ACHIEVEMENTS } from './achievements';

export const achievementService = {
    checkAchievements(profile: UserProfile): { profile: UserProfile, unlocked: string[] } {
        let hasChanges = false;
        const unlockedIds: string[] = [];
        const newAchievements = { ...profile.achievements };

        // Ensure achievements object exists
        if (!newAchievements) {
            // Initialize if missing
        }

        let earnedGold = 0;
        let earnedXp = 0;

        ACHIEVEMENTS.forEach(ach => {
            // If not already unlocked
            if (!newAchievements[ach.id]) {
                // Check condition
                if (ach.condition(profile)) {
                    newAchievements[ach.id] = true;
                    unlockedIds.push(ach.id);
                    earnedGold += ach.rewardGold;
                    earnedXp += ach.rewardXp;
                    hasChanges = true;
                }
            }
        });

        if (hasChanges) {
            return {
                profile: {
                    ...profile,
                    achievements: newAchievements,
                    balance: profile.balance + earnedGold, // Direct balance update? Or Gold? Assuming Balance = ZEN
                    xp: profile.xp + earnedXp
                    // Note: In real app, we might want to let user "Claim" them visually, 
                    // but for auto-unlock, we apply rewards immediately.
                },
                unlocked: unlockedIds
            };
        }

        return { profile, unlocked: [] };
    },

    getAchievementProgress(profile: UserProfile, achievementId: string): number {
        // This would require achievements to have a specific "progress" accessor if valid
        // For now, simpler boolean check
        return 0;
    }
};
