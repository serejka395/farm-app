import { UPGRADES } from '../constants';

// CONSTANTS FOR MATH
const BASE_XP = 100; // XP needed for Level 2
const GROWTH_FACTOR = 1.15; // 15% increase per level. Exponential curve.

// PROBABILITY CONSTANTS
const BASE_CRIT_CHANCE = 0.05; // 5% chance by default
const BASE_CRIT_MULTIPLIER = 2.0;

export const levelingService = {
    /**
     * Calculates the level based on total XP using an inverse exponential curve.
     * Formula: TotalXP = Base * (Factor^Level - 1) / (Factor - 1)
     * Inverse: Level = log(TotalXP * (Factor - 1) / Base + 1) / log(Factor)
     */
    calculateLevel: (totalXp: number): number => {
        if (totalXp < BASE_XP) return 1;
        // Approximated for easier implementation and "good enough" steps
        // We use a simple cumulative geometric sequence sum formula for precise thresholds
        // But for a continuous "current level", we can iterate or use log.
        // Iterative is safer for discreet levels to avoid floating point weirdness at boundaries.

        let level = 1;
        let xpRequired = BASE_XP;

        // Performance optimization: We could use log, but a loop for max level 100 is negligible.
        // This ensures exact integer matching with getXpForNextLevel
        while (totalXp >= xpRequired) {
            totalXp -= xpRequired;
            level++;
            xpRequired = Math.floor(xpRequired * GROWTH_FACTOR);
        }

        return level;
    },

    /**
     * Returns the Total XP required to reach a specific level from scratch.
     */
    getXpRequiredForLevel: (targetLevel: number): number => {
        let total = 0;
        let currentReq = BASE_XP;
        for (let i = 1; i < targetLevel; i++) {
            total += currentReq;
            currentReq = Math.floor(currentReq * GROWTH_FACTOR);
        }
        return total;
    },

    /**
     * Returns XP needed to complete the CURRENT level.
     */
    getXpForNextLevel: (currentLevel: number): number => {
        return Math.floor(BASE_XP * Math.pow(GROWTH_FACTOR, currentLevel - 1));
    },

    /**
     * Calculates harvest rewards using Probability Theory (RNG).
     * @param baseExReward Base XP of the crop
     * @param baseGoldReward Base Sell Price of the crop
     * @param upgrades User upgrades object
     */
    calculateHarvest: (baseXp: number, baseGold: number, upgrades: Record<string, number>) => {
        // 1. Calculate Multipliers
        // UpgradeType.FERTILIZER_TECH logic:
        // Previously gave flat 30% per level. Now we split it: 15% flat + Crit Chance.
        const fertilizerLevel = upgrades['FERTILIZER_TECH'] || 0;
        const xpBonus = 1 + (fertilizerLevel * 0.15);

        const marketLevel = upgrades['MARKET_CONTRACTS'] || 0;
        const marketBonus = 1 + (marketLevel * 0.15);

        // 2. Probability: Critical Harvest (Entropy)
        // Fertilizer Tech increases Crit Chance by 5% per level
        const critChance = BASE_CRIT_CHANCE + (fertilizerLevel * 0.05);
        const isCrit = Math.random() < critChance;

        // Crit Multiplier
        const critMultiplier = isCrit ? BASE_CRIT_MULTIPLIER + (fertilizerLevel * 0.1) : 1;

        // 3. Final Calculation
        const totalXp = Math.floor(baseXp * xpBonus * critMultiplier);
        const totalGold = Math.floor(baseGold * marketBonus * critMultiplier);

        return {
            xp: totalXp,
            gold: totalGold,
            isCrit,
            critMultiplier
        };
    }
};
