
export type LocalizedStr = { en: string; ru: string };

export enum CropType {
  WHEAT = 'WHEAT',
  CARROT = 'CARROT',
  TOMATO = 'TOMATO',
  CORN = 'CORN',
  EGGPLANT = 'EGGPLANT',
  PUMPKIN = 'PUMPKIN',
  // Winter / Salad Crops
  WINTER_PEAS = 'WINTER_PEAS',
  FROST_LETTUCE = 'FROST_LETTUCE',
  SNOW_POTATO = 'SNOW_POTATO',
  ICE_RADISH = 'ICE_RADISH',
  GLACIER_SPINACH = 'GLACIER_SPINACH',
  POLAR_ONION = 'POLAR_ONION',
  ARCTIC_CUCUMBER = 'ARCTIC_CUCUMBER',
  HOLLY_BERRY = 'HOLLY_BERRY',
  CHRISTMAS_TREE = 'CHRISTMAS_TREE',
  // New Additions
  MANDARIN = 'MANDARIN',
  BLUEBERRY = 'BLUEBERRY',
  CABBAGE = 'CABBAGE',
  BEETROOT = 'BEETROOT',
  GARLIC = 'GARLIC',
  MUSHROOM = 'MUSHROOM',
  GINGER = 'GINGER',
  PERSIMMON = 'PERSIMMON',
  DRAGON_FRUIT = 'DRAGON_FRUIT',
  STAR_FRUIT = 'STAR_FRUIT',

  // Animal Products
  NEON_EGG = 'NEON_EGG',
  FROST_MEAT = 'FROST_MEAT',
  ICY_MILK = 'ICY_MILK',
  ALPHA_FRAGMENT = 'ALPHA_FRAGMENT'
}

export enum WeatherType {
  SUNNY = 'SUNNY',
  RAINY = 'RAINY',
  STORMY = 'STORMY',
  CLOUDY = 'CLOUDY'
}

export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';

export interface CropData {
  id: CropType;
  name: LocalizedStr;
  emoji: string;
  seedPrice: number;
  sellPrice: number;
  growthTime: number;
  xpReward: number;
  unlockLevel: number;
  rarity: Rarity;
}

export interface Plot {
  id: number;
  crop: CropType | null;
  plantedAt: number | null;
  isWatered: boolean;
  isUnlocked: boolean;
  lastWateredAt: number | null;
}

export enum UpgradeType {
  SOIL_QUALITY = 'SOIL_QUALITY',
  MARKET_CONTRACTS = 'MARKET_CONTRACTS',
  IRRIGATION = 'IRRIGATION',
  FERTILIZER_TECH = 'FERTILIZER_TECH',
  BARN_CAPACITY = 'BARN_CAPACITY',
  HOUSE_ESTATE = 'HOUSE_ESTATE'
}

export interface UpgradeData {
  id: UpgradeType;
  name: LocalizedStr;
  description: LocalizedStr;
  icon: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
}

export enum AnimalType {
  CHICKEN = 'CHICKEN',
  PIG = 'PIG',
  COW = 'COW',
  GOLDEN_GOOSE = 'GOLDEN_GOOSE'
}

export interface Animal {
  id: string;
  type: AnimalType;
  lastCollectedAt: number;
}

export interface AnimalData {
  id: AnimalType;
  name: LocalizedStr;
  emoji: string;
  productEmoji: string;
  productName: LocalizedStr;
  productType: CropType;
  productPrice: number;
  productionTime: number; // seconds
  zenPrice: number | null;
  solPrice: number;
  xpReward: number;
}

export interface UserProfile {
  id: string;
  walletAddress: string;
  name: string;
  balance: number;
  xp: number;
  level: number;
  inventory: Record<CropType, number>;
  unlockedPlots: number;
  upgrades: Record<UpgradeType, number>;
  animals: Animal[];
  securityStatus: 'verified' | 'flagged' | 'banned';
  stats: {
    totalMoneyEarned: number;
    totalCropsHarvested: number;
    houseLevel: number;
    harvestHistory: Record<CropType, number>;
    joinDate: number;
    lastActive: number;
    dailyStreak: number;
  };
}

export type ToolType = 'SEED' | 'WATER' | 'HARVEST';

