import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Plot, CropType, UserProfile, ToolType, UpgradeType, AnimalType, Animal } from './types';
import {
  CROPS, ANIMALS, EXPANSION_COSTS, INITIAL_PLOTS_COUNT, TOTAL_MAX_PLOTS,
  WATER_GROWTH_BOOST_BASE, BASE_BARN_CAPACITY, CAPACITY_PER_LEVEL,
  HOUSE_TITLES, HOUSE_VISUALS, ROADMAP, TOKENOMICS, UPGRADES,
  PLOT_POSITIONS, HOUSE_POSITION, PLOT_SOL_PRICES, PLOT_LEVEL_REQUIREMENTS
} from './utils/constants';
import PlotComponent from './components/PlotComponent';
import Shop from './components/Shop';
import ProfileModal from './components/ProfileModal';
import Snowfall from './components/Snowfall';
import { db } from './api/database';
import { security } from './api/securityService';
import { paymentService } from './api/paymentService';
import { levelingService } from './api/levelingService';
import { useLanguage } from './contexts/LanguageContext';
import { questService } from './api/questService';
import { achievementService } from './api/achievementService';

const FloatingReward: React.FC<{ x: number, y: number, text: string, type: 'xp' | 'gold' }> = ({ x, y, text, type }) => (
  <motion.div
    initial={{ opacity: 0, y: y, x: x, scale: 0.5 }}
    animate={{ opacity: 1, y: y - 120, scale: 1.6 }}
    exit={{ opacity: 0 }}
    className={`fixed z-[100] font-black text-2xl pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] ${type === 'xp' ? 'text-blue-300' : 'text-f2e-gold'}`}
  >
    {text}
  </motion.div>
);

const RoamingPet: React.FC<{
  animal: Animal,
  onCollect: (id: string) => void
}> = ({ animal, onCollect }) => {
  const { language } = useLanguage();
  const data = ANIMALS[animal.type];
  const now = security.getServerNow();
  // ... (skip lines to keep it focused, actually replace_file_content needs context)
  // I will split this into two calls or be careful with context.
  // Actually, I can just target the import block and the initialization separately using multi_replace_file_content.

  const elapsed = (now - animal.lastCollectedAt) / 1000;
  const isReady = elapsed >= data.productionTime;

  // Random starting position and movement
  const [target, setTarget] = useState({ x: Math.random() * 200 - 100, y: Math.random() * 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      // Roam in the "Pasture" area (Top half, below house, above plots)
      // Container is centered. Top of screen is approx -250Y.
      // Plots start at roughly -50Y (40% of height).
      // We want range: -200 (near house) to -80 (above plots).
      setTarget({
        x: (Math.random() - 0.5) * 400, // Wide horizontal range
        y: -180 + (Math.random() * 100) // -180 to -80
      });
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{ x: target.x, y: target.y }}
      transition={{ duration: 4, ease: "linear" }}
      className="absolute bottom-20 left-1/2 z-30 cursor-pointer group"
      onClick={() => onCollect(animal.id)}
    >
      <div className={`relative w-20 h-20 transition-all ${isReady ? 'filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]' : 'opacity-80'}`}>
        {data.emoji.startsWith('/') ? (
          <div className="w-full h-full flex items-center justify-center">
            <motion.img
              src={data.emoji}
              alt={data.name[language]}
              className="w-full h-full object-contain"
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        ) : (
          <div className="text-4xl animate-bounce">{data.emoji}</div>
        )}

        {/* Collection Indicator */}
        {isReady && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-f2e-gold text-black px-3 py-1 rounded-full text-[10px] font-black animate-bounce shadow-lg whitespace-nowrap z-20">
            COLLECT
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FarmScene: React.FC<{
  onHouseClick: () => void,
  houseLevel: number,
  animals: Animal[],
  onCollectAnimal: (id: string) => void
}> = ({ onHouseClick, houseLevel, animals, onCollectAnimal }) => {
  const { language, t } = useLanguage();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-end">

      {/* Farm House / Empire Center */}
      <motion.div
        whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onHouseClick}
        className="relative z-10 cursor-pointer flex flex-col items-center group"
      >
        <div className="text-[80px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:-translate-y-2">
          🏠
        </div>
        <div className="bg-f2e-dark text-[10px] lg:text-xs font-black px-4 py-1 rounded-none border border-f2e-gold/50 shadow-[0_0_20px_rgba(255,193,7,0.2)] -mt-6 z-20 whitespace-nowrap uppercase tracking-[0.2em] group-hover:bg-f2e-gold group-hover:text-black transition-colors pointer-events-none transform translate-y-full">
          {HOUSE_TITLES[houseLevel]?.[language] || 'EMPIRE'}
        </div>
      </motion.div>

      {/* Roaming Pets Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] pointer-events-none overflow-visible">
        {/* Pets can roam widely */}
        <div className="pointer-events-auto w-full h-full relative">
          {animals.map(animal => (
            <RoamingPet key={animal.id} animal={animal} onCollect={onCollectAnimal} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RoadmapView: React.FC = () => {
  const { language, t } = useLanguage();
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white uppercase tracking-[0.4em]">{t('missionControl')}</h2>
        <p className="text-f2e-gold text-[10px] font-black tracking-widest mt-2 uppercase">{t('roadmapSubtitle')}</p>
      </div>
      <div className="grid gap-6">
        {ROADMAP.map((item, i) => (
          <div key={i} className="f2e-panel p-8 rounded-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black rounded-bl-xl ${item.status[language] === 'In Progress' ? 'bg-f2e-gold text-black' : 'bg-white/5 text-white/40'}`}>
              {item.status[language]}
            </div>
            <div className="text-f2e-gold text-xs font-black mb-1">{item.phase}</div>
            <div className="text-2xl font-black text-white mb-3 uppercase tracking-wider">{item.title[language]}</div>
            <p className="text-white/60 text-sm leading-relaxed">{item.details[language]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TokenomicsView: React.FC = () => {
  const { language, t } = useLanguage();
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white uppercase tracking-[0.4em] drop-shadow-[0_0_15px_rgba(255,193,7,0.3)] text-f2e-gold">{t('zenomics')}</h2>
        <p className="text-white/40 text-[10px] font-black tracking-widest mt-2 uppercase">{t('airdropSubtitle')}</p>
      </div>
      <div className="f2e-panel p-10 rounded-2xl border-f2e-gold/20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-f2e-gold/5 blur-[80px]" />
        <div className="relative z-10">
          <div className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">{t('totalSupply')}</div>
          <div className="text-5xl font-black text-white tracking-tight text-gold-gradient">{TOKENOMICS.totalSupply}</div>
        </div>
      </div>
      <div className="grid gap-4">
        {TOKENOMICS.distribution.map((item, i) => (
          <div key={i} className="flex items-center gap-6 f2e-panel p-6 rounded-xl hover:border-f2e-gold/30 transition-all">
            <div className="w-20 h-20 rounded-lg bg-f2e-gold/10 flex items-center justify-center text-3xl font-black text-f2e-gold group-hover:scale-110 transition-transform">
              {item.value}
            </div>
            <div>
              <div className="text-white font-black uppercase tracking-widest text-lg">{item.label[language]}</div>
              <div className="text-white/40 text-[11px] leading-relaxed">{item.description[language]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { language, setLanguage, t } = useLanguage();
  const [isDemo, setIsDemo] = useState(false);
  const activeAddress = publicKey?.toBase58() || (isDemo ? "dev_solana_farmer" : null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>('SEED');
  const [selectedSeed, setSelectedSeed] = useState<CropType | null>(CropType.WHEAT);
  const [currentTab, setCurrentTab] = useState<'farm' | 'shop' | 'roadmap' | 'tokenomics' | 'quests'>('farm');
  const [showProfile, setShowProfile] = useState(false);
  const [rewards, setRewards] = useState<{ id: number, x: number, y: number, text: string, type: 'xp' | 'gold' }[]>([]);
  const [notification, setNotification] = useState<{ msg: string, type: 'info' | 'error' } | null>(null);

  useEffect(() => {
    security.syncTime();
  }, []);

  useEffect(() => {
    if (activeAddress) {
      db.loadUser(activeAddress).then(data => {
        if (data) {
          let p = data.profile;
          if (p.gold === undefined) p.gold = 0;
          if (!p.referrals) p.referrals = [];
          if (!p.achievements) p.achievements = {};
          if (!p.dailyQuests) p = questService.generateDailyQuests(p);
          else p = questService.checkDailyReset(p);

          setProfile(p);
          setPlots(data.plots);
        } else {
          const baseProfile: UserProfile = {
            id: "farmer-1", walletAddress: activeAddress || "anonymous",
            name: "Solana Pioneer", balance: 1000, xp: 0, level: 1, gold: 0,
            inventory: Object.values(CropType).reduce((acc, crop) => { acc[crop] = 0; return acc; }, {} as Record<CropType, number>),
            unlockedPlots: INITIAL_PLOTS_COUNT,
            upgrades: {
              [UpgradeType.SOIL_QUALITY]: 0, [UpgradeType.MARKET_CONTRACTS]: 0,
              [UpgradeType.IRRIGATION]: 0, [UpgradeType.FERTILIZER_TECH]: 0,
              [UpgradeType.BARN_CAPACITY]: 0, [UpgradeType.HOUSE_ESTATE]: 0,
            },
            animals: [], securityStatus: 'verified', waterCharges: 0,
            referrals: [], achievements: {}, dailyQuests: [], lastDailyReset: 0,
            stats: {
              totalMoneyEarned: 0, totalCropsHarvested: 0, houseLevel: 0,
              harvestHistory: Object.values(CropType).reduce((acc, crop) => { acc[crop] = 0; return acc; }, {} as Record<CropType, number>),
              joinDate: Date.now(), lastActive: Date.now(), dailyStreak: 1
            }
          };
          setProfile(questService.generateDailyQuests(baseProfile));
          setPlots(Array(18).fill(null).map((_, i) => ({
            id: i, crop: null, plantedAt: null, isWatered: false, isUnlocked: i < INITIAL_PLOTS_COUNT
          })));
        }
      });
    }
  }, [activeAddress, isDemo]);

  const handleInvite = () => {
    // Mock Invite
    navigator.clipboard.writeText(`https://farm2earn.vercel.app?ref=${profile?.id}`);
    setNotification({ msg: "Link Copied! (Simulated Invite)", type: 'info' });
    // Simulating invite success for testing
    setProfile(prev => prev ? questService.updateProgress(prev, 'INVITE', 1) : null);
  };

  // ... (Add 'quests' to Tab Dock and Render View)


  useEffect(() => {
    if (activeAddress && profile && plots.length > 0) {
      db.saveUser(activeAddress, profile, plots);
    }
  }, [profile, plots, activeAddress]);

  const bonuses = useMemo(() => {
    if (!profile) return { soil: 1, market: 1, irrigation: 0, xp: 1, house: 1 };
    return {
      soil: 1 + (profile.upgrades[UpgradeType.SOIL_QUALITY] * 0.1),
      market: 1 + (profile.upgrades[UpgradeType.MARKET_CONTRACTS] * 0.15),
      irrigation: profile.upgrades[UpgradeType.IRRIGATION] * 0.25,
      xp: 1 + (profile.upgrades[UpgradeType.FERTILIZER_TECH] * 0.3),
      house: 1 + (profile.upgrades[UpgradeType.HOUSE_ESTATE] * 0.2)
    };
  }, [profile]);

  const handleCollectAnimal = (animalId: string) => {
    if (!profile) return;
    const animal = profile.animals.find(a => a.id === animalId);
    if (!animal) return;
    const data = ANIMALS[animal.type];
    const now = security.getServerNow();
    const elapsed = (now - animal.lastCollectedAt) / 1000;
    if (elapsed >= data.productionTime) {
      // Logic update: Add to inventory instead of direct cash
      const xp = data.xpReward;
      const productType = data.productType;

      setProfile(prev => prev ? ({
        ...prev,
        xp: prev.xp + xp,
        animals: prev.animals.map(a => a.id === animalId ? { ...a, lastCollectedAt: now } : a),
        inventory: {
          ...prev.inventory,
          [productType]: (prev.inventory[productType] || 0) + 1
        }
      }) : null);

      setNotification({ msg: `+1 ${data.productName[language]}`, type: 'info' });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const handleAction = (plotId: number, pos?: { clientX: number, clientY: number }) => {
    if (!profile || !security.validateAction()) return;
    const plot = plots[plotId];
    if (!plot || !plot.isUnlocked) return;

    if (plot.crop) {
      const crop = CROPS[plot.crop];
      const elapsed = (security.getServerNow() - (plot.plantedAt || 0)) / 1000;
      const boost = (plot.isWatered ? (1.5 + bonuses.irrigation) : 1) * bonuses.soil * bonuses.house;

      if (elapsed * boost >= crop.growthTime) {
        // Calculate Harvest Rewards using Service (Probability & Math)
        const { xp, gold, isCrit, critMultiplier } = levelingService.calculateHarvest(
          crop.xpReward,
          crop.sellPrice,
          profile.upgrades
        );

        setProfile(prev => {
          if (!prev) return null;
          const nextXp = prev.xp + xp;

          // New Level calculation (Exponential Curve)
          const newLevel = levelingService.calculateLevel(nextXp);

          if (newLevel > prev.level) {
            setNotification({ msg: t('levelUp', { level: newLevel }), type: 'info' });
          }

          return {
            ...prev,
            balance: prev.balance + gold,
            xp: nextXp,
            level: newLevel,
            inventory: { ...prev.inventory, [plot.crop!]: (prev.inventory[plot.crop!] || 0) + 1 },
            stats: {
              ...prev.stats,
              totalCropsHarvested: prev.stats.totalCropsHarvested + 1,
              harvestHistory: { ...prev.stats.harvestHistory, [plot.crop!]: (prev.stats.harvestHistory[plot.crop!] || 0) + 1 },
              totalMoneyEarned: prev.stats.totalMoneyEarned + gold
            }
          };
        });

        // Quest Progress
        setProfile(prev => {
          if (!prev) return null;
          let next = questService.updateProgress(prev, 'HARVEST', 1);
          next = questService.updateProgress(next, 'EARN', gold);

          // Check Achievements
          const { profile: withAchieve, unlocked } = achievementService.checkAchievements(next);
          if (unlocked.length > 0) {
            unlocked.forEach(() => setNotification({ msg: "ACHIEVEMENT UNLOCKED!", type: 'info' }));
          }

          return withAchieve;
        });

        setPlots(prev => prev.map(p => p.id === plotId ? { ...p, crop: null, plantedAt: null, isWatered: false } : p));

        if (pos) {
          const rewardText = isCrit ? `CRIT! +${gold}◎ +${xp}XP` : `+${gold}◎`;
          setRewards(prev => [...prev, { id: Date.now(), x: pos.clientX, y: pos.clientY, text: rewardText, type: isCrit ? 'xp' : 'gold' }]);
        }
        return;
      }
    }

    if (activeTool === 'SEED' && !plot.crop && selectedSeed) {
      const cropData = CROPS[selectedSeed];
      if (profile.level < cropData.unlockLevel) {
        setNotification({ msg: t('levelRequired', { level: cropData.unlockLevel, item: cropData.name[language] }), type: 'error' });
        return;
      }
      if (profile.balance < cropData.seedPrice) {
        setNotification({ msg: t('insufficientZen'), type: 'error' });
        return;
      }
      setProfile(prev => prev ? ({ ...prev, balance: prev.balance - cropData.seedPrice }) : null);
      setPlots(prev => prev.map(p => p.id === plotId ? { ...p, crop: selectedSeed, plantedAt: security.getServerNow() } : p));
      setNotification({ msg: `${cropData.name[language]} ${t('planted')}`, type: 'info' });
    } else if (activeTool === 'WATER' && plot.crop && !plot.isWatered) {
      if (profile.waterCharges > 0) {
        setProfile(prev => prev ? ({ ...prev, waterCharges: prev.waterCharges - 1 }) : null);
        setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isWatered: true } : p));
      } else {
        setNotification({ msg: "Not enough water! Buy more in Shop.", type: 'error' });
      }
    }
    setTimeout(() => setNotification(null), 2000);
  };

  const handleClaimQuest = (questId: string) => {
    if (!profile) return;
    const { profile: next, reward, bonus } = questService.claimReward(profile, questId);
    if (reward > 0) {
      setProfile(next);
      setNotification({ msg: `+${reward} GOLD${bonus ? ' (BONUS!)' : ''}`, type: 'info' });
    }
  };

  const handleUnlock = async (plotId: number) => {
    if (!profile) return;
    const plot = plots[plotId];
    if (!plot || plot.isUnlocked) return;

    // Special Logic for Plots 6, 7, 8 (Indices 6, 7, 8)
    const zenCost = EXPANSION_COSTS[plotId];
    const solCost = PLOT_SOL_PRICES[plotId];
    const levelReq = PLOT_LEVEL_REQUIREMENTS[plotId];

    // Check Level Requirement Override (e.g. Plot 8 requires Level 100 OR SOL)
    if (levelReq && profile.level >= levelReq) {
      // Free unlock if level met? Or just allowed to buy?
      // User said: "And 3rd (plot 9) opens at account level 100 OR for 1 solana"
      // Implies free unlock at level 100.
      setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isUnlocked: true } : p));
      setNotification({ msg: t('plotUnlocked'), type: 'info' });
      return;
    }

    // Interactive Unlock Choice using window.confirm (Simplest for now)
    // "Unlock Plot X? Cost: 5000 ZEN or 0.005 SOL"
    let message = `Unlock Plot ${plotId + 1}?`;
    if (zenCost > 0) message += `\nPay ${zenCost} ZEN?`;
    if (solCost > 0) message += `\nPay ${solCost} SOL?`;
    if (levelReq) message += `\n(Or reach Level ${levelReq})`;

    // Logic: Try SOL first if requested? No, we need user intent.
    // For now, if user clicks unlock:
    // If they have SOL cost defined, ask if they want to pay SOL.
    // If they say No/Cancel, ask if they want to pay ZEN.

    // Better: Check what they can afford.
    // If defined solCost check logic:
    if (solCost > 0) {
      const confirmSol = window.confirm(`Unlock Plot ${plotId + 1} for ${solCost} SOL? \n(Click Cancel to check for ZEN purchase)`);
      if (confirmSol) {
        if (!publicKey) {
          setNotification({ msg: "Connect Wallet for SOL", type: 'error' });
          return;
        }
        try {
          // 1.5% fee included in calculation usually, but standard paymentService adds it or we pass amount
          // paymentService.createPaymentTransaction takes amount. 
          const tx = await paymentService.createPaymentTransaction(publicKey, solCost);
          const sig = await sendTransaction(tx, connection);
          if (await paymentService.verifyTransaction(connection, sig)) {
            setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isUnlocked: true } : p));
            setNotification({ msg: "Plot Unlocked!", type: 'info' });
          }
        } catch (e) {
          setNotification({ msg: "SOL Payment Failed", type: 'error' });
        }
        return;
      }
    }

    if (zenCost > 0) {
      const confirmZen = window.confirm(`Unlock Plot ${plotId + 1} for ${zenCost} ZEN?`);
      if (confirmZen) {
        if (profile.balance < zenCost) {
          setNotification({ msg: t('needZenToUnlock', { amount: zenCost }), type: 'error' });
          return;
        }
        setProfile(prev => prev ? ({ ...prev, balance: prev.balance - zenCost }) : null);
        setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isUnlocked: true } : p));
        setNotification({ msg: t('plotUnlocked'), type: 'info' });
      }
    }
  };

  const handlePurchaseWater = async () => {
    if (!publicKey || !profile) {
      setNotification({ msg: "Connect Wallet to Buy", type: 'error' });
      return;
    }
    const cost = 0.001;
    try {
      const tx = await paymentService.createPaymentTransaction(publicKey, cost);
      const sig = await sendTransaction(tx, connection);
      if (await paymentService.verifyTransaction(connection, sig)) {
        setProfile(prev => prev ? ({ ...prev, waterCharges: prev.waterCharges + 100 }) : null);
        setNotification({ msg: "+100 Water Charges!", type: 'info' });
      }
    } catch (e) {
      setNotification({ msg: "Purchase Failed", type: 'error' });
    }
  };

  const handlePurchaseAnimal = async (type: AnimalType, currency: 'ZEN' | 'SOL') => {
    if (!profile) return;
    const data = ANIMALS[type];
    if (currency === 'ZEN') {
      if (data.zenPrice === null || profile.balance < data.zenPrice) return;
      setProfile(prev => prev ? ({
        ...prev, balance: prev.balance - data.zenPrice!,
        animals: [...prev.animals, { id: `animal-${Date.now()}`, type, lastCollectedAt: security.getServerNow() }]
      }) : null);
    } else if (publicKey && sendTransaction) {
      try {
        const tx = await paymentService.createPaymentTransaction(publicKey, data.solPrice);
        const sig = await sendTransaction(tx, connection);
        if (await paymentService.verifyTransaction(connection, sig)) {
          setProfile(prev => prev ? ({
            ...prev, animals: [...prev.animals, { id: `animal-${Date.now()}`, type, lastCollectedAt: security.getServerNow() }]
          }) : null);
          setNotification({ msg: "TRANSACTION VERIFIED!", type: 'info' });
        }
      } catch (e) { setNotification({ msg: "PAYMENT FAILED", type: 'error' }); }
    }
  };

  const handleUpgrade = async (type: UpgradeType) => {
    if (!profile) return;
    const current = profile.upgrades[type];
    const data = UPGRADES[type];
    if (current >= data.maxLevel) return;
    const cost = Math.floor(data.baseCost * Math.pow(data.costMultiplier, current));
    if (profile.balance < cost) return;
    setProfile(prev => prev ? ({
      ...prev, balance: prev.balance - cost,
      upgrades: { ...prev.upgrades, [type]: current + 1 },
      stats: { ...prev.stats, houseLevel: type === UpgradeType.HOUSE_ESTATE ? current + 1 : prev.stats.houseLevel }
    }) : null);
  };

  if (!profile) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-f2e-black text-white">
      <h1 className="text-6xl font-black mb-8 text-white tracking-tighter">Farm<span className="text-f2e-gold">2</span>Earn</h1>
      <div className="scale-150 mb-12"><WalletMultiButton /></div>
      <button onClick={() => setIsDemo(true)} className="px-12 py-4 bg-f2e-gold text-black rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,193,7,0.4)]">{t('trySimulator')}</button>
    </div>
  );

  return (
    <div className="h-screen w-full bg-f2e-black text-white font-sans overflow-hidden relative selection:bg-f2e-gold selection:text-black">

      {/* --- BACKGROUND EFFECTS --- */}
      {/* --- BACKGROUND EFFECTS REMOVED --- */}

      <Snowfall />

      {/* --- TOP HEADER (FIXED) --- */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 winter-glass border-b-0 shadow-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <img src="/assets/logo.png" alt="Farm2Earn" className="h-[42px] w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-f2e-gold/50 flex items-center justify-center font-bold text-xs uppercase transition-all hover:bg-white/10 text-white"
          >
            {language}
          </button>
          <div className="scale-90 origin-right">
            <WalletMultiButton className="!bg-f2e-gold !text-black !rounded-xl !h-10 !text-xs !font-black !px-5 hover:!bg-white hover:!scale-105 transition-all shadow-[0_4px_15px_rgba(255,193,7,0.3)] !font-sans" />
          </div>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT AREA --- */}
      <div className="absolute inset-0 top-[70px] bottom-0 overflow-y-auto overflow-x-hidden custom-scroll z-10 pb-32">
        <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-12">

          {/* STATS BAR (Scrolls with content) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {/* Balance */}
            <div className="winter-glass p-4 rounded-2xl relative overflow-hidden group shadow-lg">
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1 flex items-center gap-1.5 font-sans">
                  <i className="fas fa-coins text-f2e-gold"></i> {t('balance')}
                </span>
                <span className="text-2xl font-cartoon text-white tracking-wide drop-shadow-md">
                  {profile.balance.toLocaleString()} <span className="text-f2e-gold text-sm ml-0.5">ZEN</span>
                </span>
              </div>
              <div className="absolute right-0 bottom-0 opacity-5 text-6xl text-f2e-gold transform translate-x-1/4 translate-y-1/4">
                <i className="fas fa-coins"></i>
              </div>
            </div>

            {/* XP */}
            <div onClick={() => setShowProfile(true)} className="winter-glass p-4 rounded-2xl relative overflow-hidden group shadow-lg cursor-pointer hover:border-blue-500/50 transition-colors">
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1 flex items-center gap-1.5 font-sans">
                  <i className="fas fa-star text-blue-400"></i> {t('experience')}
                </span>
                <span className="text-2xl font-cartoon text-white tracking-wide drop-shadow-md">
                  {profile.xp} <span className="text-blue-400 text-sm ml-0.5">XP</span>
                </span>
              </div>
              <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30 uppercase">
                LVL {profile.level}
              </div>
            </div>

            {/* Barn */}
            <div className="winter-glass p-4 rounded-2xl relative overflow-hidden group shadow-lg">
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1 flex items-center gap-1.5 font-sans">
                  <i className="fas fa-warehouse text-orange-400"></i> {t('barn')}
                </span>
                <span className="text-2xl font-cartoon text-white tracking-wide drop-shadow-md">
                  {(Object.values(profile.inventory) as number[]).reduce((a, b) => (a as number) + (b as number), 0)}
                  <span className="text-white/30 text-base font-sans font-bold"> / {BASE_BARN_CAPACITY + profile.upgrades[UpgradeType.BARN_CAPACITY] * CAPACITY_PER_LEVEL}</span>
                </span>
              </div>
            </div>

            {/* Estate */}
            <div className="winter-glass p-4 rounded-2xl border-solana-purple/30 relative overflow-hidden group shadow-lg">
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-solana-purple mb-1 flex items-center gap-1.5 font-sans">
                  <i className="fas fa-landmark"></i> {t('farmstead')}
                </span>
                <span className="text-lg font-cartoon text-white tracking-wide truncate mt-1">
                  {HOUSE_TITLES[profile.upgrades[UpgradeType.HOUSE_ESTATE]]?.[language] || 'EMPIRE'}
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Render tab content here, ensuring component wrappers don't introduce breaking transforms if possible */}
            <div className="min-h-[50vh]">
              {currentTab === 'farm' && (
                <motion.div
                  key="farm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center pb-32"
                >
                  {/* GAME MAP CONTAINER - Mobile First 9:16 */}
                  <div className="relative w-full max-w-md mx-auto aspect-[9/16] rounded-3xl shadow-2xl overflow-hidden group select-none border border-white/10">
                    {/* Background Image: Cartoon Winter Field */}
                    <img
                      src="/assets/winter_field_bg.png"
                      alt="Winter Field"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Gradient Overlay for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-black/20" />

                    {/* House Layer */}
                    <div
                      style={{
                        position: 'absolute',
                        top: HOUSE_POSITION.top,
                        left: HOUSE_POSITION.left,
                        width: HOUSE_POSITION.width,
                        transform: 'translate(-50%, 0)', // Center horizontally, top anchored
                        zIndex: 20
                      }}
                    >
                      <FarmScene
                        onHouseClick={() => setCurrentTab('shop')}
                        houseLevel={profile.upgrades[UpgradeType.HOUSE_ESTATE]}
                        animals={profile.animals}
                        onCollectAnimal={handleCollectAnimal}
                      />
                    </div>

                    {/* Plots Layer */}
                    {plots.slice(0, PLOT_POSITIONS.length).map((plot, index) => {
                      const pos = PLOT_POSITIONS[index];
                      return (
                        <div
                          key={plot.id}
                          style={{
                            position: 'absolute',
                            top: pos.top,
                            left: pos.left,
                            width: pos.width,
                            height: pos.height,
                            transform: 'translate(-50%, -50%)', // Centered on coordinate
                            zIndex: 30
                          }}
                        >
                          <PlotComponent
                            plot={plot}
                            activeTool={activeTool}
                            selectedSeed={selectedSeed}
                            onAction={(id) => handleAction(id)}
                            onUnlock={(id) => handleUnlock(id)}
                            growthMultiplier={bonuses.soil * bonuses.house}
                            waterBoostMultiplier={bonuses.irrigation}
                          />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
              {currentTab === 'shop' && <div className="pb-20"><Shop profile={profile} onPurchaseAnimal={handlePurchaseAnimal} onPurchaseWater={handlePurchaseWater} onUpgrade={handleUpgrade} selectedSeed={selectedSeed} onSelectSeed={setSelectedSeed} totalCrops={(Object.values(profile.inventory) as number[]).reduce((a, b) => a + b, 0)} maxCapacity={BASE_BARN_CAPACITY + profile.upgrades[UpgradeType.BARN_CAPACITY] * CAPACITY_PER_LEVEL} onSell={(crop) => {
                const count = profile.inventory[crop]; const earned = Math.floor(count * CROPS[crop].sellPrice * bonuses.market); setProfile(prev => {
                  if (!prev) return null;
                  const next = { ...prev, balance: prev.balance + earned, inventory: { ...prev.inventory, [crop]: 0 } };
                  const { profile: final, unlocked } = achievementService.checkAchievements(next);
                  if (unlocked.length > 0) setNotification({ msg: "ACHIEVEMENT UNLOCKED!", type: 'info' });
                  return final;
                });
              }} /></div>}
              {currentTab === 'quests' && (
                <div className="pb-20 h-full overflow-y-auto space-y-4 px-4 pt-4">
                  <div className="bg-f2e-gold/10 border border-f2e-gold/30 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-f2e-gold mb-1">GOLD Balance</div>
                      <div className="text-3xl font-black text-white">{profile?.gold || 0} G</div>
                    </div>
                    <i className="fas fa-coins text-4xl text-f2e-gold opacity-50"></i>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Daily Quests</h3>
                      <div className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Reset in 24h</div>
                    </div>

                    <div className="space-y-3">
                      {profile?.dailyQuests.map(q => (
                        <div key={q.id} className="bg-white/5 p-4 rounded-xl flex items-center justify-between border border-white/5">
                          <div>
                            <div className="text-xs font-bold text-white mb-1">{q.description[language]}</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-wide">Reward: {q.rewardGold} GOLD</div>
                            <div className="w-32 h-1.5 bg-black/50 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-f2e-gold" style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}></div>
                            </div>
                            <div className="text-[9px] text-white/30 mt-1">{q.progress} / {q.target}</div>
                          </div>
                          <button
                            disabled={q.claimed || q.progress < q.target}
                            onClick={() => {
                              if (!profile) return;
                              const res = questService.claimReward(profile, q.id);
                              if (res.reward > 0) {
                                setProfile(res.profile);
                                setNotification({ msg: `+${res.reward} GOLD${res.bonus ? ' (BONUS!)' : ''}`, type: 'info' });
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${q.claimed ? 'bg-green-500/20 text-green-500' : q.progress >= q.target ? 'bg-f2e-gold text-black animate-pulse' : 'bg-white/10 text-white/20'}`}
                          >
                            {q.claimed ? 'Claimed' : q.progress >= q.target ? 'Claim' : 'In Progress'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Referrals</h3>
                    <button onClick={handleInvite} className="w-full py-3 bg-f2e-gold text-black font-black uppercase rounded-xl hover:bg-yellow-400 active:scale-95 transition-all text-xs">
                      Invte a Friend (+10 Gold)
                    </button>
                    <div className="mt-4 text-center text-[10px] text-white/40 uppercase">
                      You have invited {profile?.referrals?.length || 0} friends
                    </div>
                  </div>
                </div>
              )}
              {currentTab === 'roadmap' && <RoadmapView />}
              {currentTab === 'tokenomics' && <TokenomicsView />}
            </div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- BOTTOM DOCK (FIXED) --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4">
        <div className="winter-glass p-2 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-1">
          {['farm', 'shop', 'roadmap', 'tokenomics'].map((tab) => {
            const isActive = currentTab === tab;
            const icons = { farm: 'fa-wheat-awn', shop: 'fa-store', roadmap: 'fa-map-location-dot', tokenomics: 'fa-parachute-box' };
            const labels = { farm: t('work'), shop: t('dex'), roadmap: t('map'), tokenomics: t('drop') };

            return (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab as any)}
                className={`relative flex-1 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 group overflow-hidden active:opacity-100 ${isActive ? 'bg-f2e-gold shadow-[0_0_20px_rgba(255,193,7,0.3)] translate-y-[-4px] active:bg-f2e-gold active:text-black' : 'hover:bg-white/5 active:bg-white/10 active:text-white'
                  }`}
              >
                <i className={`fas ${icons[tab as keyof typeof icons]} text-lg mb-0.5 transition-colors ${isActive ? 'text-black transform scale-110' : 'text-white/40 group-hover:text-white'}`}></i>
                <span className={`text-[9px] font-black uppercase tracking-wider leading-none transition-colors font-sans ${isActive ? 'text-black' : 'text-white/30 group-hover:text-white'}`}>
                  {labels[tab as keyof typeof labels]}
                </span>
                {isActive && <div className="absolute bottom-1 w-1 h-1 bg-black rounded-full" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* --- OVERLAYS --- */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className={`fixed top-24 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-bold text-sm z-[200] shadow-2xl backdrop-blur-md flex items-center gap-3 border ${notification.type === 'error' ? 'bg-red-500/20 border-red-500 text-white' : 'bg-f2e-gold/20 border-f2e-gold text-f2e-gold'}`}>
            <i className={`fas ${notification.type === 'error' ? 'fa-triangle-exclamation' : 'fa-check-circle'}`}></i>
            {notification.msg}
          </motion.div>
        )}
        {showProfile && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md animate-bounce-in">
              <ProfileModal profile={profile} onClose={() => setShowProfile(false)} />
            </div>
          </div>
        )}
        {rewards.map(r => <FloatingReward key={r.id} {...r} />)}
      </AnimatePresence>
    </div>
  );
};

export default App;