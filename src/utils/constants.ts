import { CropType, CropData, UpgradeType, UpgradeData, AnimalType, AnimalData, WeatherType } from '../types';

export const CROPS: Record<CropType, CropData> = {
  // Common (Tier 1) - Fast reinforcement loop
  [CropType.WHEAT]: { id: CropType.WHEAT, name: { en: 'Cyber Wheat', ru: 'Кибер Пшеница' }, emoji: '/assets/crops/wheat.png', seedPrice: 10, sellPrice: 18, growthTime: 10, xpReward: 5, unlockLevel: 1, rarity: 'COMMON' },
  [CropType.GARLIC]: { id: CropType.GARLIC, name: { en: 'Crystal Garlic', ru: 'Кристалл Чеснок' }, emoji: '/assets/crops/garlic.png', seedPrice: 20, sellPrice: 45, growthTime: 20, xpReward: 12, unlockLevel: 1, rarity: 'COMMON' },
  [CropType.CARROT]: { id: CropType.CARROT, name: { en: 'Neon Carrot', ru: 'Неон Морковь' }, emoji: '/assets/crops/carrot.png', seedPrice: 40, sellPrice: 100, growthTime: 45, xpReward: 25, unlockLevel: 2, rarity: 'COMMON' },
  [CropType.WINTER_PEAS]: { id: CropType.WINTER_PEAS, name: { en: 'Frost Peas', ru: 'Морозный Горох' }, emoji: '/assets/crops/winter_peas.png', seedPrice: 80, sellPrice: 220, growthTime: 90, xpReward: 55, unlockLevel: 3, rarity: 'COMMON' },
  [CropType.CABBAGE]: { id: CropType.CABBAGE, name: { en: 'Ice Cabbage', ru: 'Лед Капуста' }, emoji: '/assets/crops/cabbage.png', seedPrice: 150, sellPrice: 450, growthTime: 180, xpReward: 120, unlockLevel: 4, rarity: 'COMMON' },

  // Uncommon (Tier 2) - Mid-term investment
  [CropType.FROST_LETTUCE]: { id: CropType.FROST_LETTUCE, name: { en: 'Frost Leaf', ru: 'Морозный Лист' }, emoji: '/assets/crops/frost_lettuce.png', seedPrice: 300, sellPrice: 950, growthTime: 300, xpReward: 250, unlockLevel: 6, rarity: 'UNCOMMON' },
  [CropType.TOMATO]: { id: CropType.TOMATO, name: { en: 'Void Tomato', ru: 'Войд Томат' }, emoji: '/assets/crops/tomato.png', seedPrice: 500, sellPrice: 1600, growthTime: 600, xpReward: 550, unlockLevel: 8, rarity: 'UNCOMMON' },
  [CropType.SNOW_POTATO]: { id: CropType.SNOW_POTATO, name: { en: 'Snow Potato', ru: 'Снежный Картофель' }, emoji: '🥔', seedPrice: 800, sellPrice: 2800, growthTime: 1200, xpReward: 1200, unlockLevel: 10, rarity: 'UNCOMMON' },
  [CropType.BEETROOT]: { id: CropType.BEETROOT, name: { en: 'Ruby Beet', ru: 'Рубин Свекла' }, emoji: '🫚', seedPrice: 1500, sellPrice: 5500, growthTime: 1800, xpReward: 2000, unlockLevel: 12, rarity: 'UNCOMMON' },
  [CropType.ARCTIC_CUCUMBER]: { id: CropType.ARCTIC_CUCUMBER, name: { en: 'Arctic Cuke', ru: 'Арктик Огурец' }, emoji: '🥒', seedPrice: 2500, sellPrice: 9000, growthTime: 2700, xpReward: 3200, unlockLevel: 15, rarity: 'UNCOMMON' },

  // Rare (Tier 3) - Significant rewards
  [CropType.CORN]: { id: CropType.CORN, name: { en: 'Golden Corn', ru: 'Золотая Кукуруза' }, emoji: '🌽', seedPrice: 4000, sellPrice: 15000, growthTime: 3600, xpReward: 5000, unlockLevel: 18, rarity: 'RARE' },
  [CropType.ICE_RADISH]: { id: CropType.ICE_RADISH, name: { en: 'Ice Radish', ru: 'Ледяной Редс' }, emoji: '🧊', seedPrice: 7000, sellPrice: 28000, growthTime: 5400, xpReward: 8500, unlockLevel: 22, rarity: 'RARE' },
  [CropType.GLACIER_SPINACH]: { id: CropType.GLACIER_SPINACH, name: { en: 'Glacier Leaf', ru: 'Ледник Шпинат' }, emoji: '🍃', seedPrice: 12000, sellPrice: 50000, growthTime: 7200, xpReward: 12000, unlockLevel: 25, rarity: 'RARE' },
  [CropType.MANDARIN]: { id: CropType.MANDARIN, name: { en: 'Frost Orange', ru: 'Мороз Мандарин' }, emoji: '🍊', seedPrice: 20000, sellPrice: 85000, growthTime: 10800, xpReward: 20000, unlockLevel: 28, rarity: 'RARE' },
  [CropType.MUSHROOM]: { id: CropType.MUSHROOM, name: { en: 'Neon Truffle', ru: 'Неон Трюфель' }, emoji: '🍄', seedPrice: 35000, sellPrice: 150000, growthTime: 14400, xpReward: 35000, unlockLevel: 32, rarity: 'RARE' },

  // Epic (Tier 4) - Long term strategic crops
  [CropType.EGGPLANT]: { id: CropType.EGGPLANT, name: { en: 'Plasma Aubergine', ru: 'Плазма Баклажан' }, emoji: '🍆', seedPrice: 60000, sellPrice: 280000, growthTime: 21600, xpReward: 65000, unlockLevel: 36, rarity: 'EPIC' },
  [CropType.POLAR_ONION]: { id: CropType.POLAR_ONION, name: { en: 'Polar Onion', ru: 'Полярный Лук' }, emoji: '🧅', seedPrice: 100000, sellPrice: 480000, growthTime: 28800, xpReward: 95000, unlockLevel: 40, rarity: 'EPIC' },
  [CropType.BLUEBERRY]: { id: CropType.BLUEBERRY, name: { en: 'Nano Berry', ru: 'Нано Ягода' }, emoji: '🫐', seedPrice: 180000, sellPrice: 900000, growthTime: 43200, xpReward: 150000, unlockLevel: 45, rarity: 'EPIC' },
  [CropType.GINGER]: { id: CropType.GINGER, name: { en: 'Storm Ginger', ru: 'Шторм Имбирь' }, emoji: '🫚', seedPrice: 300000, sellPrice: 1600000, growthTime: 57600, xpReward: 250000, unlockLevel: 50, rarity: 'EPIC' },
  [CropType.PERSIMMON]: { id: CropType.PERSIMMON, name: { en: 'Zen Fruit', ru: 'Дзен Фрукт' }, emoji: '🍅', seedPrice: 500000, sellPrice: 2800000, growthTime: 86400, xpReward: 400000, unlockLevel: 55, rarity: 'EPIC' },

  // Legendary (Tier 5) - "Jackpot" crops
  [CropType.PUMPKIN]: { id: CropType.PUMPKIN, name: { en: 'Void Gourd', ru: 'Войд Тыква' }, emoji: '🎃', seedPrice: 1000000, sellPrice: 6000000, growthTime: 172800, xpReward: 800000, unlockLevel: 60, rarity: 'LEGENDARY' },
  [CropType.HOLLY_BERRY]: { id: CropType.HOLLY_BERRY, name: { en: 'Frost Holly', ru: 'Мороз Холли' }, emoji: '🍒', seedPrice: 2500000, sellPrice: 16000000, growthTime: 259200, xpReward: 2000000, unlockLevel: 65, rarity: 'LEGENDARY' },
  [CropType.DRAGON_FRUIT]: { id: CropType.DRAGON_FRUIT, name: { en: 'Solar Dragon', ru: 'Солар Дракон' }, emoji: '🐉', seedPrice: 5000000, sellPrice: 35000000, growthTime: 432000, xpReward: 5000000, unlockLevel: 70, rarity: 'LEGENDARY' },
  [CropType.STAR_FRUIT]: { id: CropType.STAR_FRUIT, name: { en: 'Astral Star', ru: 'Астрал Стар' }, emoji: '⭐', seedPrice: 10000000, sellPrice: 75000000, growthTime: 604800, xpReward: 12000000, unlockLevel: 80, rarity: 'LEGENDARY' },

  // Mythic (Tier 6) - End game
  [CropType.CHRISTMAS_TREE]: { id: CropType.CHRISTMAS_TREE, name: { en: 'Origin Yule', ru: 'Ориджин Ель' }, emoji: '🎄', seedPrice: 50000000, sellPrice: 400000000, growthTime: 1209600, xpReward: 50000000, unlockLevel: 90, rarity: 'MYTHIC' },

  // Animal Products (Not Plantable)
  [CropType.NEON_EGG]: { id: CropType.NEON_EGG, name: { en: 'Neon Egg', ru: 'Неон Яйцо' }, emoji: '🥚', seedPrice: 0, sellPrice: 150, growthTime: 0, xpReward: 0, unlockLevel: 1, rarity: 'COMMON' },
  [CropType.FROST_MEAT]: { id: CropType.FROST_MEAT, name: { en: 'Frost Meat', ru: 'Мороз Мясо' }, emoji: '🥩', seedPrice: 0, sellPrice: 800, growthTime: 0, xpReward: 0, unlockLevel: 1, rarity: 'UNCOMMON' },
  [CropType.ICY_MILK]: { id: CropType.ICY_MILK, name: { en: 'Icy Milk', ru: 'Лед Молоко' }, emoji: '🥛', seedPrice: 0, sellPrice: 4000, growthTime: 0, xpReward: 0, unlockLevel: 1, rarity: 'RARE' },
  [CropType.ALPHA_FRAGMENT]: { id: CropType.ALPHA_FRAGMENT, name: { en: 'Alpha Fragment', ru: 'Альфа Фрагмент' }, emoji: '✨', seedPrice: 0, sellPrice: 25000, growthTime: 0, xpReward: 0, unlockLevel: 1, rarity: 'LEGENDARY' }
};

export const ANIMALS: Record<AnimalType, AnimalData> = {
  [AnimalType.CHICKEN]: {
    id: AnimalType.CHICKEN, name: { en: 'Cyber Chicken', ru: 'Кибер Курица' }, emoji: '/assets/animals/chicken.png', productEmoji: '🥚', productName: { en: 'Neon Egg', ru: 'Неон Яйцо' },
    productType: CropType.NEON_EGG,
    productPrice: 150, productionTime: 300, zenPrice: 1000, solPrice: 0.001, xpReward: 50
  },
  [AnimalType.PIG]: {
    id: AnimalType.PIG, name: { en: 'Frost Pig', ru: 'Мороз Свинья' }, emoji: '/assets/animals/pig.png', productEmoji: '🥩', productName: { en: 'Frost Meat', ru: 'Мороз Мясо' },
    productType: CropType.FROST_MEAT,
    productPrice: 800, productionTime: 900, zenPrice: 5000, solPrice: 0.01, xpReward: 200
  },
  [AnimalType.COW]: {
    id: AnimalType.COW, name: { en: 'Glacier Cow', ru: 'Ледник Корова' }, emoji: '/assets/animals/cow.png', productEmoji: '🥛', productName: { en: 'Icy Milk', ru: 'Лед Молоко' },
    productType: CropType.ICY_MILK,
    productPrice: 4000, productionTime: 1800, zenPrice: 25000, solPrice: 0.05, xpReward: 800
  },
  [AnimalType.GOLDEN_GOOSE]: {
    id: AnimalType.GOLDEN_GOOSE, name: { en: 'Alpha Goose', ru: 'Альфа Гусь' }, emoji: '/assets/animals/goose.png', productEmoji: '✨', productName: { en: 'Alpha Fragment', ru: 'Альфа Фрагмент' },
    productType: CropType.ALPHA_FRAGMENT,
    productPrice: 25000, productionTime: 3600, zenPrice: null, solPrice: 0.2, xpReward: 5000
  }
};

export const UPGRADES: Record<UpgradeType, UpgradeData> = {
  [UpgradeType.SOIL_QUALITY]: { id: UpgradeType.SOIL_QUALITY, name: { en: 'Nano-Soil', ru: 'Нано-Почва' }, icon: 'fa-mountain', description: { en: 'Increases crop growth speed by 25%', ru: 'Ускоряет рост урожая на 25%' }, baseCost: 5000, costMultiplier: 2.5, maxLevel: 10 },
  [UpgradeType.MARKET_CONTRACTS]: { id: UpgradeType.MARKET_CONTRACTS, name: { en: 'Global Liquidity', ru: 'Ликвидность' }, icon: 'fa-chart-line', description: { en: 'Increases sell price by 15%', ru: 'Увеличивает цену продажи на 15%' }, baseCost: 10000, costMultiplier: 2.8, maxLevel: 5 },
  [UpgradeType.IRRIGATION]: { id: UpgradeType.IRRIGATION, name: { en: 'Plasma Water', ru: 'Плазма Вода' }, icon: 'fa-faucet-drip', description: { en: 'Doubles water boost power', ru: 'Удваивает эффект полива' }, baseCost: 8000, costMultiplier: 2.2, maxLevel: 8 },
  [UpgradeType.FERTILIZER_TECH]: { id: UpgradeType.FERTILIZER_TECH, name: { en: 'Quantum Growth', ru: 'Квант Рост' }, icon: 'fa-flask-vial', description: { en: 'Higher chance for instant harvest', ru: 'Шанс мгновенного созревания' }, baseCost: 20000, costMultiplier: 3.5, maxLevel: 5 },
  [UpgradeType.BARN_CAPACITY]: { id: UpgradeType.BARN_CAPACITY, name: { en: 'Hyperspace Barn', ru: 'Гипер Амбар' }, icon: 'fa-warehouse', description: { en: 'Increases storage by 500', ru: 'Увеличивает склад на 500' }, baseCost: 5000, costMultiplier: 1.8, maxLevel: 20 },
  [UpgradeType.HOUSE_ESTATE]: { id: UpgradeType.HOUSE_ESTATE, name: { en: 'Estate Rank', ru: 'Уровень Усадьбы' }, icon: 'fa-house-chimney', description: { en: 'Unlocks ultimate farm aesthetics', ru: 'Открывает эстетику фермы' }, baseCost: 50000, costMultiplier: 5.0, maxLevel: 10 }
};

export const ROADMAP = [
  { phase: "PHASE 1", title: { en: "ALPHA SEASON", ru: "АЛЬФА СЕЗОН" }, status: { en: "Live Now", ru: "Активен" }, details: { en: "Core loop live. Earn XP to qualify for $ZH Airdrop allocation.", ru: "Игра запущена. Зарабатывай XP для аллокации $ZH." } },
  { phase: "PHASE 2", title: { en: "TOKEN GENERATION", ru: "ГЕНЕРАЦИЯ ТОКЕНА" }, status: { en: "Loading...", ru: "Загрузка..." }, details: { en: "TGE Event. $ZH listed on Raydium. Early farmers snapshot.", ru: "TGE Событие. Листинг $ZH на Raydium. Снапшот ранних фермеров." } },
  { phase: "PHASE 3", title: { en: "MAINNET HARVEST", ru: "MAINNET УРОЖАЙ" }, status: { en: "Upcoming", ru: "Скоро" }, details: { en: "DAO Governance, PvP Farm Raids, Staking Rewards.", ru: "DAO управление, PvP рейды, Награды за стейкинг." } }
];

export const TOKENOMICS = {
  totalSupply: "1,000,000,000 $ZH",
  distribution: [
    { label: { en: "Community", ru: "Сообщество" }, value: "40%", description: { en: "Play-to-Earn Rewards", ru: "Награды P2E" } },
    { label: { en: "Liquidity", ru: "Ликвидность" }, value: "20%", description: { en: "Exchange backing", ru: "Обеспечение бирж" } },
    { label: { en: "Team", ru: "Команда" }, value: "20%", description: { en: "1 year vested", ru: "Заморозка на 1 год" } },
    { label: { en: "Adopters", ru: "Ранние" }, value: "10%", description: { en: "Alpha Season Reward", ru: "Награда Альфа Сезона" } },
    { label: { en: "Staking", ru: "Стейкинг" }, value: "10%", description: { en: "Long term rewards", ru: "Долгосрочные награды" } }
  ]
};

export const INITIAL_PLOTS_COUNT = 6;
export const TOTAL_MAX_PLOTS = 18;
export const EXPANSION_COSTS = [0, 0, 0, 0, 0, 0, 5000, 50000, 0, 75000, 250000, 1000000, 5000000, 20000000, 75000000, 250000000, 1000000000, 5000000000];
export const PLOT_SOL_PRICES: Record<number, number> = {
  6: 0.005,
  7: 0.05,
  8: 1.0
};
export const PLOT_LEVEL_REQUIREMENTS: Record<number, number> = {
  8: 100
};
export const WATER_GROWTH_BOOST_BASE = 1.6;
export const BASE_BARN_CAPACITY = 250;
export const CAPACITY_PER_LEVEL = 250;

export const HOUSE_TITLES = [
  { en: 'Shack', ru: 'Хижина' },
  { en: 'Cottage', ru: 'Коттедж' },
  { en: 'Villa', ru: 'Вилла' },
  { en: 'Manor', ru: 'Поместье' },
  { en: 'Palace', ru: 'Дворец' },
  { en: 'Keep', ru: 'Цитадель' },
  { en: 'Citadel', ru: 'Крепость' },
  { en: 'High Fortress', ru: 'Бастион' },
  { en: 'Frost Keep', ru: 'Ледяной Форт' },
  { en: 'Solana Empire', ru: 'Империя Solana' }
];

// Note: HOUSE_VISUALS uses 3D asset paths
export const HOUSE_VISUALS = [
  '/assets/houses/level_1.png',
  '/assets/houses/level_2.png',
  '/assets/houses/level_3.png',
  '/assets/houses/level_4.png',
  '/assets/houses/level_5.png',
  '/assets/houses/level_6.png',
  '/assets/houses/level_7.png',
  '/assets/houses/level_8.png',
  '/assets/houses/level_9.png',
  '/assets/houses/level_10.png'
];

// VISUAL COORDINATES (Percentages for 9:16 VERTICAL Container)
// MOBILE FIRST LAYOUT - SAFE SPACING
export const HOUSE_POSITION = { top: '5%', left: '50%', width: '30%' };

export const PLOT_POSITIONS = [
  // ROW 1 - Pushed down to avoid House Label
  { id: 0, top: '40%', left: '20%', width: '22%', height: '14%' },
  { id: 1, top: '40%', left: '50%', width: '22%', height: '14%' },
  { id: 2, top: '40%', left: '80%', width: '22%', height: '14%' },

  // ROW 2
  { id: 3, top: '60%', left: '20%', width: '22%', height: '14%' },
  { id: 4, top: '60%', left: '50%', width: '22%', height: '14%' },
  { id: 5, top: '60%', left: '80%', width: '22%', height: '14%' },

  // ROW 3
  { id: 6, top: '80%', left: '20%', width: '22%', height: '14%' },
  { id: 7, top: '80%', left: '50%', width: '22%', height: '14%' },
  { id: 8, top: '80%', left: '80%', width: '22%', height: '14%' },
];

export const ADMIN_WALLET = '7eBHyFSTNuCCdvDhKYsvPJVB3ZYjKX5TUzsaXQrmNqFE';
export const PLATFORM_FEE_PERCENT = 0.015; // 1.5%
