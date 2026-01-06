import { UPGRADES, CROPS } from '../utils/constants';
import { CropType } from '../types';

// CONSTANTS FOR MATH
const BASE_XP = 100;
const GROWTH_FACTOR = 1.15; // 15% increase per level.

// WEB3 TRADING MECHANICS
const HALVING_INTERVAL = 10; // Every 10 levels, difficulty spikes slightly
const MIN_EXECUTION_WINDOW = 500; // ms leeways for network latency

export const levelingService = {
    /**
     * Pure function to calculate level from XP.
     * Uses a logarithmic regression model for smooth curve scaling.
     */
    calculateLevel: (totalXp: number): number => {
        if (totalXp < BASE_XP) return 1;

        let level = 1;
        let xpRequired = BASE_XP;

        // Iterative approach is safer for integer-based progressions than log approximation
        while (totalXp >= xpRequired) {
            totalXp -= xpRequired;
            level++;
            xpRequired = Math.floor(xpRequired * GROWTH_FACTOR);
        }
        return level;
    },

    getXpRequiredForLevel: (targetLevel: number): number => {
        let total = 0;
        let currentReq = BASE_XP;
        for (let i = 1; i < targetLevel; i++) {
            total += currentReq;
            currentReq = Math.floor(currentReq * GROWTH_FACTOR);
        }
        return total;
    },

    getXpForNextLevel: (currentLevel: number): number => {
        return Math.floor(BASE_XP * Math.pow(GROWTH_FACTOR, currentLevel - 1));
    },

    /**
     * Verifies if a harvest is valid based on time constraints (Anti-Speedhack).
     * @param plantedAt Timestamp when crop was planted
     * @param cropId Crop ID
     * @param upgrades User upgrades
     */
    verifyHarvestEligibility: (plantedAt: number, cropId: CropType, upgrades: Record<string, number>): boolean => {
        const crop = CROPS[cropId];
        if (!crop) return false;

        const now = Date.now();
        const growthDuration = levelingService.getGrowthTime(crop.growthTime, upgrades);

        // Allow a small execution window deviation (lag tolerance)
        return (now - plantedAt) >= (growthDuration - MIN_EXECUTION_WINDOW);
    },

    /**
     * Calculates actual growth time including all upgrade multipliers.
     */
    getGrowthTime: (baseTime: number, upgrades: Record<string, number>): number => {
        const soilLevel = upgrades['SOIL_QUALITY'] || 0;
        // Diminishing returns on speed upgrades (Soft cap at 75% reduction)
        const speedReduction = Math.min(0.75, (soilLevel * 0.1));
        return Math.max(1000, baseTime * 1000 * (1 - speedReduction)); // Min 1 second
    },

    /**
     * "Smart Contract" style harvest calculation.
     * deterministically calculates rewards based on seed + inputs.
     */
    calculateHarvest: (cropId: CropType, userLevel: number, upgrades: Record<string, number>, plantedAt: number) => {
        const crop = CROPS[cropId];

        // 1. Base Values
        let xp = crop.xpReward;
        let gold = crop.sellPrice;

        // 2. Dynamic XP Curve (Diminishing Returns)
        // If high level farmer harvests Tier 1 crop, XP is reduced to prevent botting low-tier crops
        const levelDiff = Math.max(0, userLevel - crop.unlockLevel);
        if (levelDiff > 10) {
            const penalty = Math.min(0.9, (levelDiff - 10) * 0.05); // Up to 90% penalty
            xp = Math.floor(xp * (1 - penalty));
        }

        // 3. Upgrade Modifiers
        const marketLevel = upgrades['MARKET_CONTRACTS'] || 0;
        const marketBonus = 1 + (marketLevel * 0.15);
        gold = Math.floor(gold * marketBonus);

        const fertilizerLevel = upgrades['FERTILIZER_TECH'] || 0;
        const xpBoost = 1 + (fertilizerLevel * 0.10);
        xp = Math.floor(xp * xpBoost);

        // 4. Deterministic RNG (Pseudo-VRF)
        // We use the plantedAt timestamp as a seed. 
        // In a real blockchain game, this would use a Blockhash.
        const seed = plantedAt + crop.id.length + userLevel;
        const randomValue = levelingService.pseudoRandom(seed);

        // Critical Hit Logic (5% Base + 2% per Fertilizer Level)
        const critChance = 0.05 + (fertilizerLevel * 0.02);
        const isCrit = randomValue < critChance;

        const critMultiplier = isCrit ? 2.0 : 1;

        return {
            xp: Math.floor(xp * critMultiplier),
            gold: Math.floor(gold * critMultiplier),
            isCrit,
            critMultiplier
        };
    },

    /**
     * Simple deterministic pseudo-random generator.
     * Returns float between 0 and 1.
     */
    pseudoRandom: (seed: number): number => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }
};
