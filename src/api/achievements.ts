import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
    // --- HARVESTING ---
    {
        id: 'ach_harvest_100',
        name: { en: 'Novice Farmer', ru: 'Начинающий Фермер' },
        description: { en: 'Harvest 100 crops', ru: 'Собери 100 ед. урожая' },
        icon: 'fa-seedling',
        condition: (p) => p.stats.totalCropsHarvested >= 100,
        rewardGold: 100,
        rewardXp: 50
    },
    {
        id: 'ach_harvest_1000',
        name: { en: 'Master Gatherer', ru: 'Мастер Сбора' },
        description: { en: 'Harvest 1,000 crops', ru: 'Собери 1,000 ед. урожая' },
        icon: 'fa-wheat-awn',
        condition: (p) => p.stats.totalCropsHarvested >= 1000,
        rewardGold: 1000,
        rewardXp: 500
    },
    {
        id: 'ach_harvest_5000',
        name: { en: 'Crop Tycoon', ru: 'Магнат Урожая' },
        description: { en: 'Harvest 5,000 crops', ru: 'Собери 5,000 ед. урожая' },
        icon: 'fa-tractor',
        condition: (p) => p.stats.totalCropsHarvested >= 5000,
        rewardGold: 5000,
        rewardXp: 2000
    },

    // --- WEALTH ---
    {
        id: 'ach_wealth_10k',
        name: { en: 'Profitable', ru: 'Прибыльный' },
        description: { en: 'Earn 10,000 ZEN total', ru: 'Заработай 10,000 ZEN всего' },
        icon: 'fa-coins',
        condition: (p) => p.stats.totalMoneyEarned >= 10000,
        rewardGold: 500,
        rewardXp: 100
    },
    {
        id: 'ach_wealth_100k',
        name: { en: 'Millionaire Steps', ru: 'Шаги к Миллиону' },
        description: { en: 'Earn 100,000 ZEN total', ru: 'Заработай 100,000 ZEN всего' },
        icon: 'fa-sack-dollar',
        condition: (p) => p.stats.totalMoneyEarned >= 100000,
        rewardGold: 2500,
        rewardXp: 1000
    },
    {
        id: 'ach_wealth_1m',
        name: { en: 'Zen Billionaire', ru: 'Zen Миллиардер' },
        description: { en: 'Earn 1,000,000 ZEN total', ru: 'Заработай 1,000,000 ZEN всего' },
        icon: 'fa-vault',
        condition: (p) => p.stats.totalMoneyEarned >= 1000000,
        rewardGold: 10000,
        rewardXp: 5000
    },

    // --- PROGRESSION ---
    {
        id: 'ach_level_10',
        name: { en: 'Rising Star', ru: 'Восходящая Звезда' },
        description: { en: 'Reach Level 10', ru: 'Достигни 10 уровня' },
        icon: 'fa-star',
        condition: (p) => p.level >= 10,
        rewardGold: 500,
        rewardXp: 0
    },
    {
        id: 'ach_level_50',
        name: { en: 'Legendary Farmer', ru: 'Легендарный Фермер' },
        description: { en: 'Reach Level 50', ru: 'Достигни 50 уровня' },
        icon: 'fa-crown',
        condition: (p) => p.level >= 50,
        rewardGold: 5000,
        rewardXp: 0
    },

    // --- ESTATE ---
    {
        id: 'ach_house_5',
        name: { en: 'Manor Lord', ru: 'Лорд Поместья' },
        description: { en: 'Upgrade House to Level 5', ru: 'Улучши дом до 5 уровня' },
        icon: 'fa-house-chimney',
        condition: (p) => p.stats.houseLevel >= 5,
        rewardGold: 2000,
        rewardXp: 500
    },
    {
        id: 'ach_house_10',
        name: { en: 'Empire Ruler', ru: 'Правитель Империи' },
        description: { en: 'Upgrade House to Max Level', ru: 'Улучши дом до Макс. уровня' },
        icon: 'fa-fort-awesome',
        condition: (p) => p.stats.houseLevel >= 10,
        rewardGold: 10000,
        rewardXp: 5000
    }
];
