import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Plot, CropType, UserProfile, ToolType, UpgradeType, AnimalType, Animal } from './types';
import {
  CROPS, ANIMALS, EXPANSION_COSTS, INITIAL_PLOTS_COUNT, TOTAL_MAX_PLOTS,
  WATER_GROWTH_BOOST_BASE, BASE_BARN_CAPACITY, CAPACITY_PER_LEVEL,
  HOUSE_TITLES, HOUSE_VISUALS, ROADMAP, TOKENOMICS, UPGRADES
} from './constants';
import PlotComponent from './components/PlotComponent';
import Shop from './components/Shop';
import ProfileModal from './components/ProfileModal';
import { db } from './services/database';
import { security } from './services/securityService';
import { paymentService } from './services/paymentService';
import { levelingService } from './services/levelingService';
import { useLanguage } from './contexts/LanguageContext';

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
  const data = ANIMALS[animal.type];
  const now = security.getServerNow();
  const elapsed = (now - animal.lastCollectedAt) / 1000;
  const isReady = elapsed >= data.productionTime;

  // Random starting position and movement
  const [target, setTarget] = useState({ x: Math.random() * 200 - 100, y: Math.random() * 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      // Roam within a defined "yard" area relative to center
      setTarget({
        x: Math.random() * 260 - 130, // -130 to 130
        y: Math.random() * 80 + 20    // 20 to 100 (below house)
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
      <div className={`relative w-16 h-16 transition-all ${isReady ? 'filter brightness-125 drop-shadow-[0_0_10px_rgba(255,193,7,0.5)]' : 'opacity-80'}`}>
        {data.emoji.startsWith('/') ? (
          <div className="w-full h-full bg-[#Eaeaea] rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 overflow-hidden">
            <motion.img
              src={data.emoji}
              className="w-[85%] h-[85%] object-contain mix-blend-multiply filter contrast-110"
              animate={{
                scaleX: target.x > 0 ? -1 : 1, // Simple facing direction flip
                y: [0, -4, 0] // Bobbing walk animation
              }}
              transition={{ y: { repeat: Infinity, duration: 0.5 } }}
            />
          </div>
        ) : (
          <span className="text-4xl filter drop-shadow-lg">{data.emoji}</span>
        )}

        {isReady && (
          <motion.div
            animate={{ y: [-8, 0, -8] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-f2e-gold text-black px-2 py-0.5 rounded-md text-[10px] font-black border border-black shadow-lg whitespace-nowrap z-50 pointer-events-none"
          >
            !
          </motion.div>
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
    <div className="relative w-full h-[40vh] overflow-visible shrink-0 flex items-center justify-center pt-10 pb-4">

      {/* Farm House / Empire Center */}
      <motion.div
        whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onHouseClick}
        className="relative z-10 text-[180px] sm:text-[220px] drop-shadow-[0_45px_65px_rgba(0,0,0,0.7)] cursor-pointer flex flex-col items-center group -mt-10"
      >
        <span className="transition-all duration-700 select-none">{HOUSE_VISUALS[houseLevel] || '🛖'}</span>
        <div className="bg-f2e-dark text-[11px] sm:text-[13px] font-black px-10 py-3 rounded-none border border-f2e-gold/50 shadow-[0_0_20px_rgba(255,193,7,0.2)] -mt-14 z-20 whitespace-nowrap uppercase tracking-[0.3em] group-hover:bg-f2e-gold group-hover:text-black transition-colors pointer-events-none">
          {HOUSE_TITLES[houseLevel]?.[language] || 'EMPIRE'}
        </div>
      </motion.div>

      {/* Roaming Pets Layer - Replaces Static Box */}
      <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none overflow-hidden">
        <div className="pointer-events-auto h-full w-full relative">
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
  const [currentTab, setCurrentTab] = useState<'farm' | 'shop' | 'roadmap' | 'tokenomics'>('farm');
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
          setProfile(data.profile);
          setPlots(data.plots);
        } else {
          const initialProfile: UserProfile = {
            id: "farmer-1", walletAddress: activeAddress || "anonymous",
            name: "Solana Pioneer", balance: 1000, xp: 0, level: 1,
            inventory: Object.values(CropType).reduce((acc, crop) => { acc[crop] = 0; return acc; }, {} as Record<CropType, number>),
            unlockedPlots: INITIAL_PLOTS_COUNT,
            upgrades: {
              [UpgradeType.SOIL_QUALITY]: 0, [UpgradeType.MARKET_CONTRACTS]: 0,
              [UpgradeType.IRRIGATION]: 0, [UpgradeType.FERTILIZER_TECH]: 0,
              [UpgradeType.BARN_CAPACITY]: 0, [UpgradeType.HOUSE_ESTATE]: 0,
            },
            animals: [], securityStatus: 'verified',
            stats: {
              totalMoneyEarned: 0, totalCropsHarvested: 0, houseLevel: 0,
              harvestHistory: Object.values(CropType).reduce((acc, crop) => { acc[crop] = 0; return acc; }, {} as Record<CropType, number>),
              joinDate: Date.now(), lastActive: Date.now(), dailyStreak: 1
            }
          };
          setProfile(initialProfile);
          setPlots(Array(18).fill(null).map((_, i) => ({
            id: i, crop: null, plantedAt: null, isWatered: false, isUnlocked: i < INITIAL_PLOTS_COUNT
          })));
        }
      });
    }
  }, [activeAddress, isDemo]);

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
              totalMoneyEarned: prev.stats.totalMoneyEarned + gold
            }
          };
        });

        setPlots(prev => prev.map(p => p.id === plotId ? { ...p, crop: null, plantedAt: null, isWatered: false } : p));

        if (pos) {
          // Visuals
          const rewardText = isCrit
            ? `CRIT! +${gold}◎ +${xp}XP`
            : `+${gold}◎`;

          const rewards: any[] = [
            { id: Date.now(), x: pos.clientX, y: pos.clientY, text: rewardText, type: isCrit ? 'xp' : 'gold' }
          ];

          setRewards(prev => [...prev, ...rewards]);
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
      setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isWatered: true } : p));
    }
    setTimeout(() => setNotification(null), 2000);
  };

  const handleUnlock = (plotId: number) => {
    if (!profile) return;
    const plot = plots[plotId];
    if (!plot || plot.isUnlocked) return;
    const cost = 250 * (plotId + 1); // Simple scale
    if (profile.balance < cost) {
      setNotification({ msg: t('needZenToUnlock', { amount: cost }), type: 'error' });
      return;
    }
    setProfile(prev => prev ? ({ ...prev, balance: prev.balance - cost }) : null);
    setPlots(prev => prev.map(p => p.id === plotId ? { ...p, isUnlocked: true } : p));
    setNotification({ msg: t('plotUnlocked'), type: 'info' });
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
    <div className="h-screen flex flex-col bg-f2e-black text-white overflow-hidden font-sans relative">

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Farm<span className="text-f2e-gold">2</span>Earn</h1>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-[0.2em] animate-pulse">● $ZH Airdrop Live</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
            className="w-10 h-10 rounded-lg bg-f2e-dark border border-white/10 hover:border-f2e-gold/50 flex items-center justify-center font-black text-xs uppercase transition-colors"
          >
            {language}
          </button>
          <WalletMultiButton className="!bg-f2e-gold !text-black !rounded-lg !h-10 !text-xs !font-black !px-6 hover:!bg-yellow-400 transition-all shadow-[0_0_15px_rgba(255,193,7,0.3)]" />
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-5 pt-2 grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 z-10 w-full max-w-4xl mx-auto">
        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-f2e-gold/20 relative overflow-hidden group cursor-pointer hover:border-f2e-gold/50 transition-all shadow-lg shadow-black/50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 mb-1">
              <i className="fas fa-coins text-f2e-gold text-xs"></i> {t('balance')}
            </span>
            <div className="text-2xl font-black text-white tracking-tighter truncate">
              {profile.balance.toLocaleString()} <span className="text-f2e-gold text-[10px] align-top">ZEN</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 text-f2e-gold/5 text-6xl">
            <i className="fas fa-coins"></i>
          </div>
        </div>

        <div onClick={() => setShowProfile(true)} className="bg-[#0b0b0b] p-4 rounded-2xl border border-f2e-gold/20 relative overflow-hidden group cursor-pointer hover:border-blue-400/50 transition-all shadow-lg shadow-black/50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 mb-1">
              <i className="fas fa-star text-blue-400 text-xs"></i> {t('experience')}
            </span>
            <div className="text-2xl font-black text-white tracking-tighter">{profile.xp} <span className="text-blue-400 text-[10px] align-top">XP</span></div>
          </div>
          <div className="absolute top-2 right-4 text-[9px] font-black bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md uppercase tracking-wider">{t('level')} {profile.level}</div>
        </div>

        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-f2e-gold/20 relative overflow-hidden group cursor-pointer hover:border-orange-400/50 transition-all shadow-lg shadow-black/50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 mb-1">
              <i className="fas fa-box text-orange-400 text-xs"></i> {t('barn')}
            </span>
            <div className="text-2xl font-black text-white tracking-tighter">
              {(Object.values(profile.inventory) as number[]).reduce((a, b) => (a as number) + (b as number), 0)}
              <span className="text-white/30 text-sm"> / {BASE_BARN_CAPACITY + profile.upgrades[UpgradeType.BARN_CAPACITY] * CAPACITY_PER_LEVEL}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-f2e-gold/20 relative overflow-hidden group cursor-pointer hover:border-purple-400/50 transition-all shadow-lg shadow-black/50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 mb-1">
              <i className="fas fa-house-chimney text-purple-400 text-xs"></i> {t('farmstead')}
            </span>
            <div className="text-lg font-black text-white tracking-tighter truncate leading-7">
              {HOUSE_TITLES[profile.upgrades[UpgradeType.HOUSE_ESTATE]]?.[language] || 'EMPIRE'}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {currentTab === 'farm' ? (
            <motion.div key="farm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto pb-44 custom-scroll">
              <FarmScene onHouseClick={() => setCurrentTab('shop')} houseLevel={profile.upgrades[UpgradeType.HOUSE_ESTATE]} animals={profile.animals} onCollectAnimal={handleCollectAnimal} />
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-4 px-6">
                {plots.map(plot => (
                  <PlotComponent key={plot.id} plot={plot} activeTool={activeTool} selectedSeed={selectedSeed} onAction={(id) => handleAction(id)} onUnlock={(id) => handleUnlock(id)} growthMultiplier={bonuses.soil * bonuses.house} waterBoostMultiplier={bonuses.irrigation} />
                ))}
              </div>
            </motion.div>
          ) : currentTab === 'shop' ? (
            <motion.div key="shop" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 overflow-y-auto p-6 pb-44 custom-scroll">
              <Shop profile={profile} onPurchaseAnimal={handlePurchaseAnimal} onUpgrade={handleUpgrade} selectedSeed={selectedSeed} onSelectSeed={setSelectedSeed} totalCrops={(Object.values(profile.inventory) as number[]).reduce((a, b) => a + b, 0)} maxCapacity={BASE_BARN_CAPACITY + profile.upgrades[UpgradeType.BARN_CAPACITY] * CAPACITY_PER_LEVEL} onSell={(crop) => {
                const count = profile.inventory[crop];
                const earned = Math.floor(count * CROPS[crop].sellPrice * bonuses.market);
                setProfile(prev => prev ? ({ ...prev, balance: prev.balance + earned, inventory: { ...prev.inventory, [crop]: 0 } }) : null);
              }} />
            </motion.div>
          ) : currentTab === 'roadmap' ? (
            <motion.div key="roadmap" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex-1 overflow-y-auto p-6 pb-44 custom-scroll">
              <RoadmapView />
            </motion.div>
          ) : (
            <motion.div key="token" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex-1 overflow-y-auto p-6 pb-44 custom-scroll">
              <TokenomicsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Dock */}
      <div className="fixed bottom-6 left-6 right-6 z-[90]">
        <div className="max-w-xl mx-auto bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl flex items-center justify-between gap-2">
          {['farm', 'shop', 'roadmap', 'tokenomics'].map((tab) => {
            const isActive = currentTab === tab;
            const icons = { farm: 'fa-tractor', shop: 'fa-store', roadmap: 'fa-map', tokenomics: 'fa-parachute-box' };
            const labels = { farm: t('work'), shop: t('dex'), roadmap: t('map'), tokenomics: t('drop') };

            return (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab as any)}
                className={`flex-1 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isActive
                  ? 'bg-f2e-gold text-black shadow-[0_0_20px_rgba(255,193,7,0.4)] scale-105'
                  : 'text-white/30 hover:text-white hover:bg-white/5'
                  }`}
              >
                <i className={`fas ${icons[tab as keyof typeof icons]} text-xl mb-0.5`}></i>
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">{labels[tab as keyof typeof labels]}</span>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }} className={`fixed top-24 left-1/2 -translate-x-1/2 px-10 py-4 rounded-xl font-black text-xs z-[100] border shadow-2xl backdrop-blur-xl ${notification.type === 'error' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-f2e-gold/10 border-f2e-gold text-f2e-gold'}`}>
            {notification.msg}
          </motion.div>
        )}
        {showProfile && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <ProfileModal profile={profile} onClose={() => setShowProfile(false)} />
          </div>
        )}
        {rewards.map(r => <FloatingReward key={r.id} {...r} />)}
      </AnimatePresence>
    </div>
  );
};

export default App;