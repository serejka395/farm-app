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
import Shop from './components/Shop';
import ProfileModal from './components/ProfileModal';
import UnlockModal from './components/UnlockModal';
import StartPage from './components/StartPage';
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
        <div className="w-full h-full flex items-center justify-center">
          <motion.img
            src={data.image}
            alt={data.name[language]}
            className="w-full h-full object-contain drop-shadow-md"
            animate={{
              y: [0, -4, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

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
  hasWinterHouse: boolean,
  animals: Animal[],
  onCollectAnimal: (id: string) => void
}> = ({ onHouseClick, houseLevel, hasWinterHouse, animals, onCollectAnimal }) => {
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
          {hasWinterHouse ? (
            <img src="/assets/houses/winter_house.png" className="w-32 h-32 object-contain drop-shadow-2xl" alt="Winter House" />
          ) : (
            '🏠'
          )}
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
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-[#5D4037] uppercase tracking-[0.4em] drop-shadow-sm">{t('missionControl')}</h2>
        <p className="text-[#8D6E63] text-[10px] font-black tracking-widest mt-2 uppercase">{t('roadmapSubtitle')}</p>
      </div>
      <div className="grid gap-6">
        {ROADMAP.map((item, i) => (
          <div key={i} className="bg-[#FFF8E1] p-8 rounded-xl relative overflow-hidden group border-[3px] border-[#8D6E63] shadow-[0_4px_0_#5D4037]">
            <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black rounded-bl-xl border-l-[3px] border-b-[3px] border-[#8D6E63] ${item.status[language] === 'In Progress' ? 'bg-[#FFB74D] text-[#5D4037]' : 'bg-[#D7CCC8] text-[#5D4037]/50'}`}>
              {item.status[language]}
            </div>
            <div className="text-[#8D6E63] text-xs font-black mb-1 uppercase tracking-widest">{item.phase}</div>
            <div className={`text-2xl font-black mb-3 uppercase tracking-wider ${item.status[language] === 'In Progress' ? 'text-[#3E2723]' : 'text-[#5D4037]/60'}`}>{item.title[language]}</div>
            <p className="text-[#5D4037] text-sm leading-relaxed font-bold opacity-80">{item.details[language]}</p>
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

import { TonConnectUI, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { tonPaymentService } from './api/tonPaymentService';

// Declare Telegram global
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe: {
          start_param?: string;
          user?: any;
        };
        ready: () => void;
        expand: () => void;
      }
    }
  }
}

const App: React.FC = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [tonConnectUI] = useTonConnectUI();
  const tonAddress = useTonAddress();

  const { language, setLanguage, t } = useLanguage();
  const [isDemo, setIsDemo] = useState(false);

  // Unified Address: Solana OR TON OR Demo
  const activeAddress = publicKey?.toBase58() || tonAddress || (isDemo ? "dev_solana_farmer" : null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>('SEED');
  const [selectedSeed, setSelectedSeed] = useState<CropType | null>(CropType.WHEAT);
  const [currentTab, setCurrentTab] = useState<'farm' | 'shop' | 'roadmap' | 'tokenomics' | 'quests'>('farm');
  const [showProfile, setShowProfile] = useState(false);
  const [rewards, setRewards] = useState<{ id: number, x: number, y: number, text: string, type: 'xp' | 'gold' }[]>([]);
  const [notification, setNotification] = useState<{ msg: string, type: 'info' | 'error' } | null>(null);

  // Unlock Modal State
  const [unlockModal, setUnlockModal] = useState<{ plotId: number, solCost: number, zenCost: number, tonCost: number } | null>(null);

  useEffect(() => {
    security.syncTime();
    // Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  // Referral Logic
  useEffect(() => {
    const handleReferral = async () => {
      if (!profile || !activeAddress || profile.referredBy) return;

      const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
      if (startParam && startParam.startsWith('ref_')) {
        const referrerAddress = startParam.replace('ref_', '');

        // Prevent self-referral
        if (referrerAddress === activeAddress) return;

        // 1. Mark current user as referred
        const updatedProfile = { ...profile, referredBy: referrerAddress };
        setProfile(updatedProfile);

        // Save immediately to prevent double counting
        await db.saveUser(activeAddress, updatedProfile, plots);

        // 2. Add to Referrer's list
        try {
          const referrerData = await db.loadUser(referrerAddress);
          if (referrerData) {
            const referrerProfile = referrerData.profile;
            // Check if already in list (double safety)
            if (!referrerProfile.referrals.includes(activeAddress)) {
              const newReferrals = [...(referrerProfile.referrals || []), activeAddress];
              const updatedReferrer = { ...referrerProfile, referrals: newReferrals };

              // Add bonus to referrer? (Optional, maybe handled by quest claim later)
              // For now just tracking

              await db.saveUser(referrerAddress, updatedReferrer, referrerData.plots);
              setNotification({ msg: "Referral Bonus Registered!", type: 'info' });
            }
          }
        } catch (e) {
          console.error("Failed to update referrer", e);
        }
      }
    };

    handleReferral();
  }, [profile, activeAddress, plots]);

  useEffect(() => {
    if (isDemo) {
      // Guest Mode: Initialize transient profile immediately without loading from DB
      const baseProfile: UserProfile = {
        id: "guest-farmer", walletAddress: "guest_mode",
        name: "Guest Farmer", balance: 1000, xp: 0, level: 1, gold: 0,
        inventory: Object.values(CropType).reduce((acc, crop) => { acc[crop] = 0; return acc; }, {} as Record<CropType, number>),
        unlockedPlots: INITIAL_PLOTS_COUNT,
        upgrades: {
          [UpgradeType.SOIL_QUALITY]: 0, [UpgradeType.MARKET_CONTRACTS]: 0,
          [UpgradeType.IRRIGATION]: 0, [UpgradeType.FERTILIZER_TECH]: 0,
          [UpgradeType.BARN_CAPACITY]: 0, [UpgradeType.HOUSE_ESTATE]: 0,
          [UpgradeType.WINTER_HOUSE]: 0 // Ensure this is initialized
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
      return;
    }

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
              [UpgradeType.WINTER_HOUSE]: 0 // Ensure this is initialized
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

  // Winter House Passive Income Logic
  useEffect(() => {
    if (!profile) return;
    const hasWinterHouse = (profile.upgrades[UpgradeType.WINTER_HOUSE] || 0) > 0;
    if (!hasWinterHouse) return;

    const checkPassiveIncome = () => {
      const now = Date.now();
      const lastClaim = profile.lastWinterHouseClaim || now;
      // 3 hours in ms = 3 * 60 * 60 * 1000 = 10800000
      const interval = 10800000;

      if (now - lastClaim >= interval) {
        setProfile(prev => {
          if (!prev) return null;
          return {
            ...prev,
            gold: prev.gold + 0.5,
            lastWinterHouseClaim: now
          };
        });
        setNotification({ msg: "Winter House Income: +0.5 GOLD", type: 'info' });
      }
    };

    // Initial check (if valid upon load)
    if (!profile.lastWinterHouseClaim) {
      // First time initialization
      setProfile(prev => prev ? ({ ...prev, lastWinterHouseClaim: Date.now() }) : null);
    } else {
      checkPassiveIncome();
    }

    const intervalId = setInterval(checkPassiveIncome, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [profile?.upgrades[UpgradeType.WINTER_HOUSE], profile?.lastWinterHouseClaim]);

  const handleInvite = () => {
    // Mock Invite
    navigator.clipboard.writeText(`https://t.me/farm_appbot/farm2earn.space?startapp=ref_${profile?.id}`);
    setNotification({ msg: "Link Copied! (Simulated Invite)", type: 'info' });
    // Simulating invite success for testing
    setProfile(prev => prev ? questService.updateProgress(prev, 'INVITE', 1) : null);
  };



  // ... (Add 'quests' to Tab Dock and Render View)


  useEffect(() => {
    // Only save if NOT demo mode and user is logged in
    if (!isDemo && activeAddress && profile && plots.length > 0) {
      db.saveUser(activeAddress, profile, plots);
    }
  }, [profile, plots, activeAddress, isDemo]);

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
    // Security check with behavioral biometrics
    if (!profile || !security.validateAction(profile, pos ? { x: pos.clientX, y: pos.clientY } : undefined)) {
      // If validation failed, UI might have been updated by reference in service, but we should force update state if needed
      if (profile?.securityStatus === 'banned' || profile?.securityStatus === 'flagged') {
        setProfile({ ...profile }); // Trigger re-render to show badges
      }
      return;
    }

    const plot = plots[plotId];
    if (!plot || !plot.isUnlocked) return;

    if (plot.crop) {
      const crop = CROPS[plot.crop];
      const elapsed = (security.getServerNow() - (plot.plantedAt || 0)) / 1000;
      const boost = (plot.isWatered ? (1.5 + bonuses.irrigation) : 1) * bonuses.soil * bonuses.house;

      if (elapsed * boost >= crop.growthTime) {
        // Calculate Harvest Rewards using Service (Probability & Math) with Web3 Logic
        const { xp, gold, isCrit, critMultiplier } = levelingService.calculateHarvest(
          plot.crop,
          profile.level,
          profile.upgrades,
          plot.plantedAt || 0
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

  const handleUnlock = (plotId: number) => {
    if (!profile) return;
    const plot = plots[plotId];
    if (!plot || plot.isUnlocked) return;

    // Costs - defaulting to 0 to prevent undefined errors
    const zenCost = EXPANSION_COSTS[plotId] || 0;
    const solCost = PLOT_SOL_PRICES[plotId] || 0;
    const tonCost = solCost > 0 ? parseFloat((solCost * 30).toFixed(2)) : 0; // Approx 1 SOL = 30 TON

    // Check Level Requirement
    const levelReq = PLOT_LEVEL_REQUIREMENTS[plotId];
    // Only auto-unlock if level is met AND there's no mandatory payment override (assuming lvl 100 implies free)
    if (levelReq && profile.level >= levelReq) {
      setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isUnlocked: true } : p));
      setNotification({ msg: t('plotUnlocked'), type: 'info' });
      return;
    }

    // Open Modal with all options
    setUnlockModal({ plotId, solCost, zenCost, tonCost });
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
      setNotification({ msg: "Verifying Water Purchase...", type: 'info' });

      const result = await paymentService.validateTransaction(connection, sig, cost);
      if (result.success) {
        setProfile(prev => prev ? ({ ...prev, waterCharges: prev.waterCharges + 100 }) : null);
        setNotification({ msg: "+100 Water Charges!", type: 'info' });
      } else {
        setNotification({ msg: `Verification Failed: ${result.error}`, type: 'error' });
      }
    } catch (e) {
      setNotification({ msg: "Purchase Canceled", type: 'error' });
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

        setNotification({ msg: "Verifying Purchase...", type: 'info' });

        const result = await paymentService.validateTransaction(connection, sig, data.solPrice);
        if (result.success) {
          setProfile(prev => prev ? ({
            ...prev, animals: [...prev.animals, { id: `animal-${Date.now()}`, type, lastCollectedAt: security.getServerNow() }]
          }) : null);
          setNotification({ msg: "Purchase Verified!", type: 'info' });
        } else {
          setNotification({ msg: `Failed: ${result.error}`, type: 'error' });
        }
      } catch (e) { setNotification({ msg: "Payment Canceled", type: 'error' }); }
    }
  };

  const handleUpgrade = async (type: UpgradeType, currency: 'ZEN' | 'GOLD' | 'SOL' = 'ZEN') => {
    if (!profile) return;
    const current = profile.upgrades[type];
    const data = UPGRADES[type];
    if (current >= data.maxLevel) return;

    if (currency === 'SOL') {
      if (!publicKey) {
        setNotification({ msg: "Connect Wallet for SOL", type: 'error' });
        return;
      }
      // Calculate dynamic SOL cost
      const baseSol = data.solBaseCost || 999; // Fallback if not defined (shouldn't happen if button shown)
      // No floor for SOL, keep precision
      const cost = baseSol * Math.pow(data.costMultiplier, current);

      try {
        const tx = await paymentService.createPaymentTransaction(publicKey, cost);
        const sig = await sendTransaction(tx, connection);

        setNotification({ msg: "Verifying on Blockchain...", type: 'info' });

        const result = await paymentService.validateTransaction(connection, sig, cost);
        if (result.success) {
          setProfile(prev => {
            if (!prev) return null;
            const nextLvl = (prev.upgrades[type] || 0) + 1;
            return {
              ...prev,
              upgrades: { ...prev.upgrades, [type]: nextLvl },
              // If House, update stats
              stats: { ...prev.stats, houseLevel: type === UpgradeType.HOUSE_ESTATE ? nextLvl : prev.stats.houseLevel },
              // If Winter House, init claim
              lastWinterHouseClaim: type === UpgradeType.WINTER_HOUSE ? Date.now() : prev.lastWinterHouseClaim
            };
          });
          setNotification({ msg: "Upgrade Successful! (SOL)", type: 'info' });
        } else {
          setNotification({ msg: `Verification Failed: ${result.error}`, type: 'error' });
        }
      } catch (e) {
        console.error(e);
        setNotification({ msg: "SOL Payment Failed", type: 'error' });
      }
      return;
    }

    // Default ZEN/GOLD Logic
    const cost = Math.floor(data.baseCost * Math.pow(data.costMultiplier, current));

    if (currency === 'GOLD' || data.currency === 'GOLD') { // Handle explicit GOLD request or legacy default
      if (profile.gold < cost) {
        setNotification({ msg: `Need ${cost} GOLD`, type: 'error' });
        return;
      }
      setProfile(prev => prev ? ({
        ...prev,
        gold: prev.gold - cost,
        upgrades: { ...prev.upgrades, [type]: current + 1 },
        lastWinterHouseClaim: type === UpgradeType.WINTER_HOUSE ? Date.now() : prev.lastWinterHouseClaim
      }) : null);
    } else {
      if (profile.balance < cost) {
        setNotification({ msg: t('insufficientZen'), type: 'error' });
        return;
      }
      setProfile(prev => prev ? ({
        ...prev, balance: prev.balance - cost,
        upgrades: { ...prev.upgrades, [type]: current + 1 },
        stats: { ...prev.stats, houseLevel: type === UpgradeType.HOUSE_ESTATE ? current + 1 : prev.stats.houseLevel }
      }) : null);
    }
  };

  const handleTonPayment = async (amount: number, type: 'UPGRADE' | 'ANIMAL' | 'WATER' | 'PLOT', itemId?: string) => {
    if (!tonConnectUI.connected) {
      setNotification({ msg: "Please Connect TON Wallet", type: 'error' });
      tonConnectUI.openModal();
      return;
    }

    setNotification({ msg: "Creating TON Transaction...", type: 'info' });

    try {
      const tx = tonPaymentService.createPaymentTransaction(amount);
      const result = await tonConnectUI.sendTransaction(tx);

      setNotification({ msg: "Verifying TON Payment...", type: 'info' });

      const verified = await tonPaymentService.verifyTransaction(result);

      if (verified) {
        if (type === 'WATER') {
          setProfile(prev => prev ? ({ ...prev, waterCharges: prev.waterCharges + 100 }) : null);
          setNotification({ msg: "+100 Water (TON Success!)", type: 'info' });
        } else if (type === 'ANIMAL' && itemId) { // itemId here is animal Type (e.g. CHICKEN) or ID?
          // Shop passes 'ANIMAL', animal.id. But animal.id in loop is 'chicken', 'cow' etc (AnimalType) or unique?
          // In Shop: onTonPayment(..., 'ANIMAL', animal.id). animal.id in loop is 'chicken', 'cow' (from ANIMALS keys).
          // Type mismatch: handleTonPayment(..., itemId) -> itemId is string.
          // handlePurchaseAnimal expects AnimalType.

          // Let's assume itemId is AnimalType
          const animalType = itemId as AnimalType;
          setProfile(prev => prev ? ({
            ...prev, animals: [...prev.animals, { id: `animal-${Date.now()}`, type: animalType, lastCollectedAt: security.getServerNow() }]
          }) : null);
          setNotification({ msg: "Animal Purchased (TON)!", type: 'info' });
        } else if (type === 'UPGRADE' && itemId) {
          const upgradeType = itemId as UpgradeType;
          setProfile(prev => {
            if (!prev) return null;
            const nextLvl = (prev.upgrades[upgradeType] || 0) + 1;
            return {
              ...prev,
              upgrades: { ...prev.upgrades, [upgradeType]: nextLvl },
              stats: { ...prev.stats, houseLevel: upgradeType === UpgradeType.HOUSE_ESTATE ? nextLvl : prev.stats.houseLevel },
              lastWinterHouseClaim: upgradeType === UpgradeType.WINTER_HOUSE ? Date.now() : prev.lastWinterHouseClaim
            };
          });
          setNotification({ msg: "Upgrade Successful (TON)!", type: 'info' });
        } else if (type === 'PLOT' && itemId) {
          // Unlock Plot
          const plotId = parseInt(itemId);
          setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isUnlocked: true } : p));
          setNotification({ msg: "Plot Unlocked (TON)!", type: 'info' });
          setUnlockModal(null); // Close modal
        }
      } else {
        setNotification({ msg: "TON Verification Failed", type: 'error' });
      }
    } catch (e) {
      console.error(e);
      setNotification({ msg: "TON Transaction Cancelled", type: 'error' });
    }
  };

  if (!profile) {
    if (activeAddress) {
      return <div className="h-screen w-full flex items-center justify-center bg-f2e-black text-white font-black text-xl animate-pulse">ENTERING FARM...</div>;
    }
    return <StartPage onGuestLogin={() => setIsDemo(true)} />;
  }

  return (
    <div className="h-screen w-full bg-f2e-black text-white font-sans overflow-hidden relative selection:bg-f2e-gold selection:text-black">

      {/* --- BACKGROUND EFFECTS --- */}
      {/* --- BACKGROUND EFFECTS REMOVED --- */}

      <Snowfall />

      {/* --- TOP HEADER (FIXED) --- */}
      {/* --- TOP HEADER (FIXED) --- */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-2 bg-[#FFF8E1] border-b-[4px] border-[#8D6E63] shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <img src="/assets/logo.png" alt="Farm2Earn" className="h-[56px] w-auto object-contain mix-blend-multiply" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
            className="h-9 px-3 rounded-xl bg-[#8D6E63] text-[#FFF8E1] border-2 border-[#5D4037] flex items-center justify-center font-black text-xs uppercase shadow-[0_2px_0_#5D4037] active:translate-y-0.5 active:shadow-none transition-all"
          >
            {language}
          </button>
          <div className="scale-90 origin-right">
            {tonAddress ? (
              <button
                onClick={() => tonConnectUI.disconnect()}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#0098EA] text-white border-2 border-[#0077B5] shadow-[0_2px_0_#005A8D] font-black text-xs uppercase hover:brightness-110 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <span className="text-sm">💎</span>
                <span>{tonAddress.slice(0, 4)}...{tonAddress.slice(-4)}</span>
                <i className="fas fa-sign-out-alt ml-1 opacity-60"></i>
              </button>
            ) : (
              <WalletMultiButton className="!bg-[#FFB74D] !text-[#5D4037] !rounded-xl !h-10 !text-xs !font-black !px-5 hover:!bg-[#FFA726] !border-2 !border-[#E65100] !shadow-[0_2px_0_#E65100] !font-sans" />
            )}
          </div>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT AREA --- */}
      <div className="absolute inset-0 top-[70px] bottom-0 overflow-y-auto overflow-x-hidden custom-scroll z-10 pb-32">
        <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-12">

          {/* STATS BAR (Scrolls with content) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {/* Balances */}
            <div className="bg-[#FFF8E1] p-3 rounded-2xl border-[3px] border-[#8D6E63] shadow-[0_4px_0_#5D4037] relative overflow-hidden flex flex-col gap-1 justify-center">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black text-[#8D6E63] uppercase tracking-wider">ZEN</span>
                <span className="text-sm font-black text-[#5D4037]">{profile.balance.toLocaleString()}</span>
              </div>
              <div className="w-full h-[2px] bg-[#8D6E63]/20 rounded-full my-1"></div>
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black text-[#8D6E63] uppercase tracking-wider">GOLD</span>
                <span className="text-sm font-black text-[#FBC02D] drop-shadow-sm">{profile.gold?.toLocaleString() || 0}</span>
              </div>
            </div>

            {/* XP */}
            <div onClick={() => setShowProfile(true)} className="bg-[#FFF8E1] p-3 rounded-2xl border-[3px] border-[#8D6E63] shadow-[0_4px_0_#5D4037] relative overflow-hidden cursor-pointer active:translate-y-1 active:shadow-none transition-all">
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] mb-1 flex items-center gap-1.5 font-sans">
                  <i className="fas fa-star text-[#FFB74D]"></i> {t('experience')}
                </span>
                <span className="text-xl font-black text-[#5D4037] tracking-wide">
                  {profile.xp} <span className="text-[#8D6E63] text-xs ml-0.5">XP</span>
                </span>
              </div>
              <div className="absolute top-2 right-2 bg-[#8D6E63] text-[#FFF8E1] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#5D4037] uppercase">
                LVL {profile.level}
              </div>
            </div>

            {/* Barn */}
            <div className="bg-[#FFF8E1] p-3 rounded-2xl border-[3px] border-[#8D6E63] shadow-[0_4px_0_#5D4037] relative overflow-hidden">
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] mb-1 flex items-center gap-1.5 font-sans">
                  <i className="fas fa-warehouse text-[#FFB74D]"></i> {t('barn')}
                </span>
                <span className="text-xl font-black text-[#5D4037] tracking-wide">
                  {(Object.values(profile.inventory) as number[]).reduce((a, b) => (a as number) + (b as number), 0)}
                  <span className="text-[#8D6E63]/60 text-sm font-sans font-bold"> / {BASE_BARN_CAPACITY + profile.upgrades[UpgradeType.BARN_CAPACITY] * CAPACITY_PER_LEVEL}</span>
                </span>
              </div>
            </div>

            {/* Estate */}
            <div className="bg-[#FFF8E1] p-3 rounded-2xl border-[3px] border-[#8D6E63] shadow-[0_4px_0_#5D4037] relative overflow-hidden">
              <div className="relative z-10 flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] mb-1 flex items-center gap-1.5 font-sans">
                  <i className="fas fa-landmark"></i> {t('farmstead')}
                </span>
                <span className="text-sm font-black text-[#5D4037] tracking-wide truncate mt-1">
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
                        hasWinterHouse={(profile.upgrades[UpgradeType.WINTER_HOUSE] || 0) > 0}
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
              {currentTab === 'shop' && <div className="pb-20"><Shop profile={profile} onPurchaseAnimal={handlePurchaseAnimal} onPurchaseWater={handlePurchaseWater} onUpgrade={handleUpgrade} onTonPayment={handleTonPayment} selectedSeed={selectedSeed} onSelectSeed={setSelectedSeed} totalCrops={(Object.values(profile.inventory) as number[]).reduce((a, b) => a + b, 0)} maxCapacity={BASE_BARN_CAPACITY + profile.upgrades[UpgradeType.BARN_CAPACITY] * CAPACITY_PER_LEVEL} onSell={(crop) => {
                const count = profile.inventory[crop]; const earned = Math.floor(count * CROPS[crop].sellPrice * bonuses.market); setProfile(prev => {
                  if (!prev) return null;
                  const next = { ...prev, balance: prev.balance + earned, inventory: { ...prev.inventory, [crop]: 0 } };
                  const { profile: final, unlocked } = achievementService.checkAchievements(next);
                  if (unlocked.length > 0) setNotification({ msg: "ACHIEVEMENT UNLOCKED!", type: 'info' });
                  return final;
                });
              }} /></div>}
              {currentTab === 'quests' && (
                <div className="pb-20 h-full overflow-y-auto space-y-4 px-4 pt-4 custom-scroll">
                  <div className="bg-[#FFF8E1] border-[3px] border-[#8D6E63] p-6 rounded-2xl flex items-center justify-between shadow-[0_4px_0_#5D4037]">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63] mb-1">GOLD Balance</div>
                      <div className="text-3xl font-black text-[#5D4037]">{profile?.gold || 0} G</div>
                    </div>
                    <i className="fas fa-coins text-4xl text-[#FBC02D] drop-shadow-sm"></i>
                  </div>

                  <div className="bg-[#FFF8E1] border-[3px] border-[#8D6E63] p-6 rounded-2xl shadow-[0_4px_0_#5D4037]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-black text-[#5D4037] uppercase tracking-widest">Daily Quests</h3>
                      <div className="flex gap-2">
                        <div className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded border border-blue-200 font-bold">Reset in 24h</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {profile?.dailyQuests.map(q => (
                        <div key={q.id} className="bg-[#FFFFF0] p-4 rounded-xl flex items-center justify-between border-[2px] border-[#D7CCC8]">
                          <div>
                            <div className="text-xs font-black text-[#5D4037] mb-1">{q.description[language]}</div>
                            <div className="text-[10px] text-[#8D6E63] uppercase tracking-wide font-bold">Reward: <span className="text-[#FBC02D]">{q.rewardGold} GOLD</span></div>
                            <div className="w-32 h-2 bg-[#D7CCC8] rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-[#FFB74D]" style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}></div>
                            </div>
                            <div className="text-[9px] text-[#8D6E63] mt-1 font-bold">{q.progress} / {q.target}</div>
                          </div>
                          <button
                            disabled={q.claimed || q.progress < q.target}
                            onClick={() => {
                              if (!profile) return;
                              const res = questService.claimReward(profile, q.id);
                              if (res.reward > 0) {
                                setProfile(res.profile);
                                const bonusMsg = res.bonus ? ' + 10 GOLD BONUS!' : '';
                                setNotification({ msg: `+${res.reward} GOLD${bonusMsg}`, type: 'info' });
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all shadow-[0_2px_0_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none ${q.claimed ? 'bg-green-100 text-green-600' : q.progress >= q.target ? 'bg-[#FFB74D] text-[#5D4037] animate-pulse' : 'bg-[#D7CCC8] text-[#5D4037]/40'}`}
                          >
                            {q.claimed ? 'Claimed' : q.progress >= q.target ? 'Claim' : 'In Progress'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#FFF8E1] border-[3px] border-[#8D6E63] p-6 rounded-2xl shadow-[0_4px_0_#5D4037]">
                    <h3 className="text-sm font-black text-[#5D4037] uppercase tracking-widest mb-4">Referrals</h3>
                    <button onClick={handleInvite} className="w-full py-3 bg-[#FFB74D] text-[#5D4037] font-black uppercase rounded-xl hover:bg-[#FFA726] active:translate-y-0.5 shadow-[0_4px_0_#E65100] active:shadow-none transition-all text-xs border border-[#E65100]">
                      Invte a Friend (+10 Gold)
                    </button>
                    <div className="mt-4 text-center text-[10px] text-[#8D6E63] uppercase font-bold">
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

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-2">
        {/* Dock Container - Cartoon Cute Farm Style */}
        <div className="bg-[#FFF8E1] p-2 rounded-[40px] border-[6px] border-[#8D6E63] shadow-[0_10px_0_#5D4037,0_20px_20px_rgba(0,0,0,0.4)] flex items-center justify-between gap-1 relative h-24">

          {/* Farm2Earn Logo Stamp */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 w-20 h-20 bg-white rounded-full border-[4px] border-[#8D6E63] flex items-center justify-center shadow-lg z-20 overflow-hidden">
            <img src="/assets/logo.png" className="w-full h-full object-contain mix-blend-multiply p-1" alt="Logo" />
          </div>

          {['farm', 'shop', 'quests', 'roadmap'].map((tab, idx) => {
            const isActive = currentTab === tab;
            const emojis = {
              farm: '🏠',
              shop: '🛒',
              quests: '📜',
              roadmap: '🗺️'
            };
            const labels = { farm: t('work'), shop: t('dex'), quests: 'Quests', roadmap: t('map') };

            return (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab as any)}
                className={`relative flex-1 h-full flex flex-col items-center justify-end pb-2 transition-all duration-300 group z-10 ${idx === 0 ? 'ml-24' : ''}`}
              >
                {/* Icon */}
                <div className={`transition-transform duration-300 ${isActive ? 'scale-125 -translate-y-4' : 'group-hover:-translate-y-2'}`}>
                  <span className="text-4xl filter drop-shadow-md grayscale-0">
                    {emojis[tab as keyof typeof emojis]}
                  </span>
                </div>

                {/* Label (Hidden when active to reduce clutter, or just small) */}
                <span className={`text-[10px] font-black uppercase tracking-wider text-[#5D4037] transition-all bg-white/80 px-2 rounded-full backdrop-blur-sm ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100'}`}>
                  {labels[tab as keyof typeof labels]}
                </span>

                {/* Active Indicator (Cute Wood Plank or underline) */}
                {isActive && (
                  <div className="absolute bottom-1 w-8 h-1.5 bg-[#FFB74D] rounded-full" />
                )}
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

        {/* Unlock Modal */}
        {unlockModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm">
              <UnlockModal
                data={unlockModal}
                onClose={() => setUnlockModal(null)}
                onPurchase={(currency) => {
                  // Handle Purchase Logic Here (Inline or separate function)
                  if (!profile) return;

                  if (currency === 'ZEN') {
                    if (profile.balance >= unlockModal.zenCost) {
                      setProfile(prev => prev ? ({ ...prev, balance: prev.balance - unlockModal.zenCost }) : null);
                      setPlots(prev => prev.map(p => p.id === unlockModal.plotId ? { ...p, isUnlocked: true } : p));
                      setNotification({ msg: "Plot Unlocked!", type: 'info' });
                      setUnlockModal(null);
                    } else {
                      setNotification({ msg: "Insufficient ZEN", type: 'error' });
                    }
                  } else if (currency === 'SOL') {
                    // Trigger SOL flow
                    const handleSolUnlock = async () => {
                      if (!publicKey) return setNotification({ msg: "Connect Wallet!", type: 'error' });
                      try {
                        const tx = await paymentService.createPaymentTransaction(publicKey, unlockModal.solCost);
                        const sig = await sendTransaction(tx, connection);
                        setNotification({ msg: "Verifying...", type: 'info' });
                        const res = await paymentService.validateTransaction(connection, sig, unlockModal.solCost);
                        if (res.success) {
                          setPlots(prev => prev.map(p => p.id === unlockModal.plotId ? { ...p, isUnlocked: true } : p));
                          setNotification({ msg: "Plot Unlocked (SOL)!", type: 'info' });
                          setUnlockModal(null);
                        } else {
                          setNotification({ msg: "Failed verification", type: 'error' });
                        }
                      } catch (e) { setNotification({ msg: "Transaction Failed", type: 'error' }); }
                    };
                    handleSolUnlock();
                  } else if (currency === 'TON') {
                    handleTonPayment(unlockModal.tonCost, 'PLOT', unlockModal.plotId.toString());
                  }
                }}
              />
            </div>
          </div>
        )}

        {rewards.map(r => <FloatingReward key={r.id} {...r} />)}
      </AnimatePresence>

      {/* HONEYPOT TRAP: Invisible element for bots */}
      <button
        onClick={() => { if (profile) security.triggerHoneypot(profile); setProfile({ ...profile!, securityStatus: 'banned' }); }}
        className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-auto z-[9999]"
        aria-hidden="true"
        tabIndex={-1}
      >
        System Check
      </button>

      {/* CHEATER BADGE */}
      {profile.securityStatus !== 'verified' && (
        <div className="fixed top-16 right-4 z-[100] bg-red-600/90 text-white text-[10px] font-black px-2 py-1 rounded border border-red-400 animate-pulse">
          {profile.securityStatus === 'banned' ? '🚫 BANNED' : '⚠️ FLAGGED'}
        </div>
      )}
    </div>
  );
};

export default App;