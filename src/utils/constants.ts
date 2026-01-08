import { CropType, CropData, UpgradeType, UpgradeData, AnimalType, AnimalData, WeatherType } from '../types';

export const CROPS: Record<CropType, CropData> = {
  // Common (Tier 1) - Low risk, consistent small profit. ROI ~1.4x
  [CropType.WHEAT]: { id: CropType.WHEAT, name: { en: 'Cyber Wheat', ru: 'Кибер Пшеница' }, emoji: '🌾', seedPrice: 5, sellPrice: 7, growthTime: 10, xpReward: 2, unlockLevel: 1, rarity: 'COMMON' },
  [CropType.GARLIC]: { id: CropType.GARLIC, name: { en: 'Crystal Garlic', ru: 'Кристалл Чеснок' }, emoji: '🧄', image: '/assets/crops/garlic.png', seedPrice: 15, sellPrice: 22, growthTime: 20, xpReward: 5, unlockLevel: 1, rarity: 'COMMON' },
  [CropType.CARROT]: { id: CropType.CARROT, name: { en: 'Neon Carrot', ru: 'Неон Морковь' }, emoji: '🥕', image: '/assets/crops/carrot.png', seedPrice: 30, sellPrice: 45, growthTime: 45, xpReward: 8, unlockLevel: 2, rarity: 'COMMON' },
  [CropType.WINTER_PEAS]: { id: CropType.WINTER_PEAS, name: { en: 'Frost Peas', ru: 'Морозный Горох' }, emoji: '🫛', seedPrice: 60, sellPrice: 90, growthTime: 90, xpReward: 15, unlockLevel: 3, rarity: 'COMMON' },
  [CropType.CABBAGE]: { id: CropType.CABBAGE, name: { en: 'Ice Cabbage', ru: 'Лед Капуста' }, emoji: '🥬', image: '/assets/crops/cabbage.png', seedPrice: 120, sellPrice: 180, growthTime: 180, xpReward: 25, unlockLevel: 4, rarity: 'COMMON' },
  [CropType.FROST_LETTUCE]: { id: CropType.FROST_LETTUCE, name: { en: 'Frost Leaf', ru: 'Морозный Лист' }, emoji: '🥗', image: '/assets/crops/frost_lettuce.png', seedPrice: 250, sellPrice: 380, growthTime: 300, xpReward: 45, unlockLevel: 6, rarity: 'UNCOMMON' },
  [CropType.TOMATO]: { id: CropType.TOMATO, name: { en: 'Void Tomato', ru: 'Войд Томат' }, emoji: '🍅', image: '/assets/crops/tomato.png', seedPrice: 400, sellPrice: 620, growthTime: 600, xpReward: 80, unlockLevel: 8, rarity: 'UNCOMMON' },
  [CropType.SNOW_POTATO]: { id: CropType.SNOW_POTATO, name: { en: 'Snow Potato', ru: 'Снежный Картофель' }, emoji: '🥔', seedPrice: 700, sellPrice: 1100, growthTime: 1200, xpReward: 150, unlockLevel: 10, rarity: 'UNCOMMON' },
  [CropType.BEETROOT]: { id: CropType.BEETROOT, name: { en: 'Ruby Beet', ru: 'Рубин Свекла' }, emoji: '🫚', seedPrice: 1200, sellPrice: 1900, growthTime: 1800, xpReward: 220, unlockLevel: 12, rarity: 'UNCOMMON' },
  [CropType.ARCTIC_CUCUMBER]: { id: CropType.ARCTIC_CUCUMBER, name: { en: 'Arctic Cuke', ru: 'Арктик Огурец' }, emoji: '🥒', seedPrice: 2000, sellPrice: 3200, growthTime: 2700, xpReward: 350, unlockLevel: 15, rarity: 'UNCOMMON' },

  // Rare (Tier 3) - Longer growth, decent rewards. ROI ~1.5x
  [CropType.CORN]: { id: CropType.CORN, name: { en: 'Golden Corn', ru: 'Золотая Кукуруза' }, emoji: '🌽', seedPrice: 3500, sellPrice: 5500, growthTime: 3600, xpReward: 550, unlockLevel: 18, rarity: 'RARE' },
  [CropType.ICE_RADISH]: { id: CropType.ICE_RADISH, name: { en: 'Ice Radish', ru: 'Ледяной Редс' }, emoji: '🧊', seedPrice: 6000, sellPrice: 9500, growthTime: 5400, xpReward: 850, unlockLevel: 22, rarity: 'RARE' },
  [CropType.GLACIER_SPINACH]: { id: CropType.GLACIER_SPINACH, name: { en: 'Glacier Leaf', ru: 'Ледник Шпинат' }, emoji: '🍃', seedPrice: 10000, sellPrice: 16000, growthTime: 7200, xpReward: 1200, unlockLevel: 25, rarity: 'RARE' },
  [CropType.MANDARIN]: { id: CropType.MANDARIN, name: { en: 'Frost Orange', ru: 'Мороз Мандарин' }, emoji: '🍊', seedPrice: 18000, sellPrice: 28000, growthTime: 10800, xpReward: 2000, unlockLevel: 28, rarity: 'RARE' },
  [CropType.MUSHROOM]: { id: CropType.MUSHROOM, name: { en: 'Neon Truffle', ru: 'Неон Трюфель' }, emoji: '🍄', seedPrice: 30000, sellPrice: 48000, growthTime: 14400, xpReward: 3200, unlockLevel: 32, rarity: 'RARE' },

  // Epic (Tier 4) - Significant investment. ROI ~1.55x
  [CropType.EGGPLANT]: { id: CropType.EGGPLANT, name: { en: 'Plasma Aubergine', ru: 'Плазма Баклажан' }, emoji: '🍆', seedPrice: 50000, sellPrice: 80000, growthTime: 21600, xpReward: 5000, unlockLevel: 36, rarity: 'EPIC' },
  [CropType.POLAR_ONION]: { id: CropType.POLAR_ONION, name: { en: 'Polar Onion', ru: 'Полярный Лук' }, emoji: '🧅', seedPrice: 90000, sellPrice: 145000, growthTime: 28800, xpReward: 8500, unlockLevel: 40, rarity: 'EPIC' },
  [CropType.BLUEBERRY]: { id: CropType.BLUEBERRY, name: { en: 'Nano Berry', ru: 'Нано Ягода' }, emoji: '🫐', seedPrice: 150000, sellPrice: 245000, growthTime: 43200, xpReward: 14000, unlockLevel: 45, rarity: 'EPIC' },
  [CropType.GINGER]: { id: CropType.GINGER, name: { en: 'Storm Ginger', ru: 'Шторм Имбирь' }, emoji: '🫚', seedPrice: 250000, sellPrice: 410000, growthTime: 57600, xpReward: 22000, unlockLevel: 50, rarity: 'EPIC' },
  [CropType.PERSIMMON]: { id: CropType.PERSIMMON, name: { en: 'Zen Fruit', ru: 'Дзен Фрукт' }, emoji: '🍅', seedPrice: 400000, sellPrice: 660000, growthTime: 86400, xpReward: 35000, unlockLevel: 55, rarity: 'EPIC' },

  // Legendary (Tier 5) - High stakes, high reward but controlled. ROI ~1.6x
  [CropType.PUMPKIN]: { id: CropType.PUMPKIN, name: { en: 'Void Gourd', ru: 'Войд Тыква' }, emoji: '🎃', seedPrice: 800000, sellPrice: 1350000, growthTime: 172800, xpReward: 65000, unlockLevel: 60, rarity: 'LEGENDARY' },
  [CropType.HOLLY_BERRY]: { id: CropType.HOLLY_BERRY, name: { en: 'Frost Holly', ru: 'Мороз Холли' }, emoji: '🍒', seedPrice: 2000000, sellPrice: 3400000, growthTime: 259200, xpReward: 150000, unlockLevel: 65, rarity: 'LEGENDARY' },
  [CropType.DRAGON_FRUIT]: { id: CropType.DRAGON_FRUIT, name: { en: 'Solar Dragon', ru: 'Солар Дракон' }, emoji: '🐉', seedPrice: 4500000, sellPrice: 7800000, growthTime: 432000, xpReward: 320000, unlockLevel: 70, rarity: 'LEGENDARY' },
  [CropType.STAR_FRUIT]: { id: CropType.STAR_FRUIT, name: { en: 'Astral Star', ru: 'Астрал Стар' }, emoji: '⭐', seedPrice: 9000000, sellPrice: 16000000, growthTime: 604800, xpReward: 600000, unlockLevel: 80, rarity: 'LEGENDARY' },

  // Mythic (Tier 6) - Status symbols. ROI ~1.65x
  [CropType.CHRISTMAS_TREE]: { id: CropType.CHRISTMAS_TREE, name: { en: 'Origin Yule', ru: 'Ориджин Ель' }, emoji: '🎄', seedPrice: 40000000, sellPrice: 72000000, growthTime: 1209600, xpReward: 2500000, unlockLevel: 90, rarity: 'MYTHIC' },

  // Animal Products (Not Plantable)
  [CropType.NEON_EGG]: { id: CropType.NEON_EGG, name: { en: 'Neon Egg', ru: 'Неон Яйцо' }, emoji: '🥚', seedPrice: 0, sellPrice: 45, growthTime: 0, xpReward: 0, unlockLevel: 1, rarity: 'COMMON' },
  [CropType.FROST_MEAT]: { id: CropType.FROST_MEAT, name: { en: 'Frost Meat', ru: 'Мороз Мясо' }, emoji: '🥩', seedPrice: 0, sellPrice: 250, growthTime: 0, xpReward: 0, unlockLevel: 1, rarity: 'UNCOMMON' },
  [CropType.ICY_MILK]: { id: CropType.ICY_MILK, name: { en: 'Icy Milk', ru: 'Лед Молоко' }, emoji: '🥛', seedPrice: 0, sellPrice: 1200, growthTime: 0, xpReward: 0, unlockLevel: 1, rarity: 'RARE' },
  [CropType.ALPHA_FRAGMENT]: { id: CropType.ALPHA_FRAGMENT, name: { en: 'Alpha Fragment', ru: 'Альфа Фрагмент' }, emoji: '✨', seedPrice: 0, sellPrice: 15000, growthTime: 0, xpReward: 0, unlockLevel: 1, rarity: 'LEGENDARY' },
  [CropType.GOLD]: { id: CropType.GOLD, name: { en: 'Gold', ru: 'Золото' }, emoji: '💰', seedPrice: 0, sellPrice: 1, growthTime: 0, xpReward: 0, unlockLevel: 1, rarity: 'COMMON' }
};

export const ANIMALS: Record<AnimalType, AnimalData> = {
  [AnimalType.CHICKEN]: {
    id: AnimalType.CHICKEN, name: { en: 'Cyber Chicken', ru: 'Кибер Курица' }, emoji: '🐔', image: '/assets/animals/chicken.png', productEmoji: '🥚', productName: { en: 'Neon Egg', ru: 'Неон Яйцо' },
    productType: CropType.NEON_EGG,
    productPrice: 45, productionTime: 300, zenPrice: 1000, solPrice: 0.001, xpReward: 15
  },
  [AnimalType.PIG]: {
    id: AnimalType.PIG, name: { en: 'Frost Pig', ru: 'Мороз Свинья' }, emoji: '🐷', image: '/assets/animals/pig.png', productEmoji: '🥩', productName: { en: 'Frost Meat', ru: 'Мороз Мясо' },
    productType: CropType.FROST_MEAT,
    productPrice: 250, productionTime: 900, zenPrice: 5000, solPrice: 0.01, xpReward: 75
  },
  [AnimalType.COW]: {
    id: AnimalType.COW, name: { en: 'Glacier Cow', ru: 'Ледник Корова' }, emoji: '🐮', image: '/assets/animals/cow.png', productEmoji: '🥛', productName: { en: 'Icy Milk', ru: 'Лед Молоко' },
    productType: CropType.ICY_MILK,
    productPrice: 1200, productionTime: 1800, zenPrice: 25000, solPrice: 0.05, xpReward: 300
  },
  [AnimalType.GOLDEN_GOOSE]: {
    id: AnimalType.GOLDEN_GOOSE, name: { en: 'Alpha Goose', ru: 'Альфа Гусь' }, emoji: '🦢', image: '/assets/animals/goose.png', productEmoji: '✨', productName: { en: 'Alpha Fragment', ru: 'Альфа Фрагмент' },
    productType: CropType.ALPHA_FRAGMENT,
    productPrice: 15000, productionTime: 3600, zenPrice: null, solPrice: 0.2, xpReward: 2500
  }
};

export const UPGRADES: Record<UpgradeType, UpgradeData> = {
  [UpgradeType.SOIL_QUALITY]: { id: UpgradeType.SOIL_QUALITY, name: { en: 'Nano-Soil', ru: 'Нано-Почва' }, icon: 'fa-mountain', description: { en: 'Increases crop growth speed by 25%', ru: 'Ускоряет рост урожая на 25%' }, baseCost: 3500, solBaseCost: 0.005, costMultiplier: 2.2, maxLevel: 10 },
  [UpgradeType.MARKET_CONTRACTS]: { id: UpgradeType.MARKET_CONTRACTS, name: { en: 'Global Liquidity', ru: 'Ликвидность' }, icon: 'fa-chart-line', description: { en: 'Increases sell price by 15%', ru: 'Увеличивает цену продажи на 15%' }, baseCost: 7500, solBaseCost: 0.01, costMultiplier: 2.5, maxLevel: 5 },
  [UpgradeType.IRRIGATION]: { id: UpgradeType.IRRIGATION, name: { en: 'Plasma Water', ru: 'Плазма Вода' }, icon: 'fa-faucet-drip', description: { en: 'Doubles water boost power', ru: 'Удваивает эффект полива' }, baseCost: 5000, solBaseCost: 0.008, costMultiplier: 2.0, maxLevel: 8 },
  [UpgradeType.FERTILIZER_TECH]: { id: UpgradeType.FERTILIZER_TECH, name: { en: 'Quantum Growth', ru: 'Квант Рост' }, icon: 'fa-flask-vial', description: { en: 'Higher chance for instant harvest', ru: 'Шанс мгновенного созревания' }, baseCost: 15000, solBaseCost: 0.02, costMultiplier: 3.0, maxLevel: 5 },
  [UpgradeType.BARN_CAPACITY]: { id: UpgradeType.BARN_CAPACITY, name: { en: 'Hyperspace Barn', ru: 'Гипер Амбар' }, icon: 'fa-warehouse', description: { en: 'Increases storage by 500', ru: 'Увеличивает склад на 500' }, baseCost: 2500, solBaseCost: 0.005, costMultiplier: 1.6, maxLevel: 20 },
  [UpgradeType.HOUSE_ESTATE]: { id: UpgradeType.HOUSE_ESTATE, name: { en: 'Estate Rank', ru: 'Уровень Усадьбы' }, icon: 'fa-house-chimney', description: { en: 'Unlocks ultimate farm aesthetics', ru: 'Открывает эстетику фермы' }, baseCost: 40000, solBaseCost: 0.05, costMultiplier: 4.5, maxLevel: 10 },
  [UpgradeType.WINTER_HOUSE]: {
    id: UpgradeType.WINTER_HOUSE,
    name: { en: 'Winter Lodge', ru: 'Зимний Домик' },
    icon: 'fa-snowflake',
    description: { en: 'Cozy winter vibes + 0.5 Gold / 3h', ru: 'Зимний уют + 0.5 Золота / 3ч' },
    baseCost: 100,
    solBaseCost: 0.1, // Premium Item
    costMultiplier: 1,
    maxLevel: 1,
    currency: 'GOLD'
  }
};

export const ROADMAP = [
  { phase: "PHASE 1", title: { en: "ALPHA SEASON", ru: "АЛЬФА СЕЗОН" }, status: { en: "Live Now", ru: "Активен" }, details: { en: "Core loop live. Earn XP to qualify for $F2E Airdrop allocation.", ru: "Игра запущена. Зарабатывай XP для аллокации $F2E." } },
  { phase: "PHASE 2", title: { en: "CHEAT TEST", ru: "ТЕСТ ЧИТОВ" }, status: { en: "Active", ru: "Активен" }, details: { en: "Security hardening. Honeypot deployment. Bot elimination protocol.", ru: "Усиление защиты. Ловушки для ботов. Протокол зачистки." } },
  { phase: "PHASE 3", title: { en: "TOKEN GENERATION", ru: "ГЕНЕРАЦИЯ ТОКЕНА" }, status: { en: "Loading...", ru: "Загрузка..." }, details: { en: "TGE Event. $F2E listed on Raydium. Rewards for Testers & Holders.", ru: "TGE Событие. Листинг $F2E на Raydium. Награды тестерам и холдерам." } },
  { phase: "PHASE 4", title: { en: "MARKETPLACE", ru: "МАРКЕТПЛЕЙС" }, status: { en: "Upcoming", ru: "Скоро" }, details: { en: "P2P Trading System. Sell resources to other players. Economy 2.0.", ru: "P2P Торговля. Продажа ресурсов игрокам. Экономика 2.0." } },
  { phase: "PHASE 5", title: { en: "PVP FARM RAIDS", ru: "PVP РЕЙДЫ" }, status: { en: "Planning", ru: "В планах" }, details: { en: "Attack rival farms. Steal crops. Build defenses for your estate.", ru: "Атаки на фермы. Кража урожая. Строительство защиты." } },
  { phase: "PHASE 6", title: { en: "OPEN WORLD", ru: "ОТКРЫТЫЙ МИР" }, status: { en: "Concept", ru: "Концепт" }, details: { en: "Visit neighbors. Social hubs. Global map exploration.", ru: "Визиты к соседям. Социальные хабы. Исследование карты." } },
  { phase: "PHASE 7", title: { en: "GUILDS & DAO", ru: "ГИЛЬДИИ И DAO" }, status: { en: "Concept", ru: "Концепт" }, details: { en: "Create alliances. Community governance. Cooperative farming events.", ru: "Создание альянсов. Управление сообществом. Совместные ивенты." } },
  { phase: "PHASE 8", title: { en: "METAVERSE", ru: "МЕТАВСЕЛЕННАЯ" }, status: { en: "Future", ru: "Будущее" }, details: { en: "Full 3D immersive world. VR support. Cross-chain asset integration.", ru: "Полноценный 3D мир. VR поддержка. Кросс-чейн интеграция." } }
];

export const TOKENOMICS = {
  totalSupply: "1,000,000,000 $F2E",
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
  '🛖',
  '🏡',
  '🏘️',
  '🏰',
  '🏯',
  '🏛️',
  '🕍',
  '🏢',
  '🏤',
  '🏫'
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

export const DAILY_QUEST_TEMPLATES = [
  // HARVEST TYPE
  { type: 'HARVEST', target: 5, description: { en: 'Harvest 5 Crops', ru: 'Собрать 5 урожаев' }, rewardGold: 1 },
  { type: 'HARVEST', target: 10, description: { en: 'Harvest 10 Crops', ru: 'Собрать 10 урожаев' }, rewardGold: 2 },
  { type: 'HARVEST', target: 20, description: { en: 'Harvest 20 Crops', ru: 'Собрать 20 урожаев' }, rewardGold: 3 },
  { type: 'HARVEST', target: 50, description: { en: 'Harvest 50 Crops', ru: 'Собрать 50 урожаев' }, rewardGold: 5 },

  // EARN TYPE
  { type: 'EARN', target: 100, description: { en: 'Earn 100 Zen', ru: 'Заработать 100 Zen' }, rewardGold: 1 },
  { type: 'EARN', target: 500, description: { en: 'Earn 500 Zen', ru: 'Заработать 500 Zen' }, rewardGold: 2 },
  { type: 'EARN', target: 1000, description: { en: 'Earn 1,000 Zen', ru: 'Заработать 1,000 Zen' }, rewardGold: 3 },

  // SPECIFIC CROPS (Using IDs)
  { type: 'HARVEST_CROP', target: 5, cropId: 'WHEAT', description: { en: 'Harvest 5 Wheat', ru: 'Собрать 5 Пшеницы' }, rewardGold: 2 },
  { type: 'HARVEST_CROP', target: 3, cropId: 'CARROT', description: { en: 'Harvest 3 Carrots', ru: 'Собрать 3 Моркови' }, rewardGold: 2 },

  // WATERING (If tracked) - Assuming 'Use Water' is an action
  // { type: 'WATER', target: 5, description: { en: 'Water 5 Plots', ru: 'Полить 5 грядок' }, rewardGold: 1 },
];
