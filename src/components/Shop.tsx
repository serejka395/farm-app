import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CropType, UserProfile, UpgradeType, AnimalType } from '../types';
import { CROPS, UPGRADES, ANIMALS } from '../utils/constants';
import { useLanguage } from '../contexts/LanguageContext';

interface ShopProps {
  profile: UserProfile;
  onSell: (crop: CropType) => void;
  onUpgrade: (upgrade: UpgradeType) => void;
  onPurchaseAnimal: (type: AnimalType, currency: 'ZEN' | 'SOL') => void;
  selectedSeed: CropType | null;
  onSelectSeed: (crop: CropType) => void;
  totalCrops: number;
  maxCapacity: number;
  onPurchaseWater: () => void;
}

const Shop: React.FC<ShopProps> = ({ profile, onSell, onUpgrade, onPurchaseAnimal, selectedSeed, onSelectSeed, onPurchaseWater, totalCrops, maxCapacity }) => {
  const [tab, setTab] = useState<'seeds' | 'sell' | 'upgrades' | 'pets' | 'estate' | 'resources'>('seeds');
  const { language, t } = useLanguage();

  const getCost = (type: UpgradeType) => {
    const lvl = profile.upgrades[type] || 0;
    return Math.floor(UPGRADES[type].baseCost * Math.pow(UPGRADES[type].costMultiplier, lvl));
  };

  return (
    <div className="h-full flex flex-col f2e-panel rounded-2xl overflow-hidden bg-f2e-dark border-f2e-gold/10">
      {/* Tab Navigation */}
      <div className="p-4 bg-black/20 flex gap-2 overflow-x-auto custom-scroll shrink-0 border-b border-white/5">
        {(['seeds', 'sell', 'pets', 'upgrades', 'estate', 'resources'] as const).map(tabName => (
          <button
            key={tabName} onClick={() => setTab(tabName)}
            className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:opacity-100 ${tab === tabName ? 'bg-f2e-gold text-black shadow-lg shadow-f2e-gold/20 active:text-black' : 'text-white/30 hover:text-white/50 bg-white/5 active:bg-white/10 active:text-white'}`}
          >
            {tabName === 'seeds' ? t('seeds') : tabName === 'sell' ? t('sell') : tabName === 'pets' ? t('livestock') : tabName === 'upgrades' ? t('upgrades') : tabName === 'estate' ? t('farmstead') : 'Resources'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-4 pb-24">
        <AnimatePresence mode="wait">
          {tab === 'seeds' && (
            <motion.div key="seeds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-2 flex justify-between">
                <span>{t('shopTitle')}</span>
                <span className="text-f2e-gold/60">{Object.keys(CROPS).length} Varieties</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(CROPS).filter(crop => crop.seedPrice > 0).map(crop => {
                  const locked = profile.level < crop.unlockLevel;
                  const active = selectedSeed === crop.id;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.95 }}
                      key={crop.id}
                      className={`group relative p-4 rounded-xl flex flex-col gap-3 transition-all duration-300 border-[6px] shadow-[0_5px_10px_rgba(0,0,0,0.6)] ${locked
                        ? 'opacity-50 bg-black/60 border-[#3E2723] grayscale'
                        : active
                          ? 'bg-f2e-gold/10 border-f2e-gold shadow-[0_0_20px_rgba(255,193,7,0.3)]'
                          : 'bg-black/40 border-[#5D4037] hover:border-[#8D6E63]'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 flex items-center justify-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform bg-black/20 rounded-lg overflow-hidden border border-white/5">
                          {crop.emoji.startsWith('/') ? <img src={crop.emoji} className={`w-full h-full object-contain ${['WHEAT', 'GARLIC', 'CARROT', 'WINTER_PEAS', 'CABBAGE', 'FROST_LETTUCE', 'TOMATO'].includes(crop.id) ? 'scale-[2.5] origin-top-left translate-x-4 translate-y-4' : ''}`} /> : <span className="text-6xl">{crop.emoji}</span>}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-[12px] uppercase tracking-tighter leading-tight text-white">{crop.name[language]}</h4>
                          <p className="text-[9px] font-bold opacity-30 uppercase tracking-[0.1em]">{crop.rarity}</p>
                          <p className="text-[10px] text-f2e-gold font-black mt-1">◎ {crop.seedPrice}</p>
                        </div>
                      </div>

                      {!locked ? (
                        <button
                          onClick={() => onSelectSeed(crop.id)}
                          className={`w-full py-2.5 rounded-lg text-[10px] font-black uppercase transition-all active:scale-95 active:opacity-100 ${active ? 'bg-f2e-gold text-black shadow-lg shadow-f2e-gold/20 active:text-black' : 'bg-white/10 hover:bg-white/20 active:bg-white/20 active:text-white'}`}
                        >
                          {active ? 'SELECTED' : t('buy')}
                        </button>
                      ) : (
                        <div className="w-full py-2.5 bg-black/40 rounded-lg text-[9px] font-black opacity-60 uppercase text-center flex items-center justify-center gap-2 border border-white/5">
                          <i className="fas fa-lock text-[8px]"></i> {t('level')} {crop.unlockLevel}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === 'sell' && (
            <motion.div key="sell" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="p-6 bg-black/40 rounded-2xl border border-f2e-gold/30 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{t('barn')}</span>
                  <h2 className="text-2xl font-black mt-1 uppercase text-f2e-gold">{totalCrops} <span className="text-sm opacity-40 text-white">/ {maxCapacity}</span></h2>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-f2e-gold/5 blur-[40px] rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(CROPS).map(crop => {
                  const count = (profile.inventory[crop.id] as number) || 0;
                  if (count === 0) return null;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      key={crop.id}
                      className="bg-black/40 p-4 rounded-xl flex flex-col gap-3 border-[6px] border-[#5D4037] shadow-[0_5px_10px_rgba(0,0,0,0.6)] group hover:border-[#8D6E63] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-black/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden border border-white/5">
                          {crop.emoji.startsWith('/') ? <img src={crop.emoji} className={`w-full h-full object-contain ${['WHEAT', 'GARLIC', 'CARROT', 'WINTER_PEAS', 'CABBAGE', 'FROST_LETTUCE', 'TOMATO'].includes(crop.id) ? 'scale-[2.5] origin-top-left translate-x-4 translate-y-4' : ''}`} /> : <span className="text-6xl">{crop.emoji}</span>}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-[12px] uppercase tracking-tighter leading-tight">{crop.name[language]}</h4>
                          <p className="text-[10px] opacity-40 uppercase font-black">Stock: {count}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onSell(crop.id)}
                        className="bg-f2e-gold text-black w-full py-2.5 rounded-lg text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all hover:bg-yellow-400 active:text-black active:bg-f2e-gold"
                      >
                        {t('sell')} (◎{Math.floor(count * crop.sellPrice)})
                      </button>
                    </motion.div>
                  );
                })}
              </div>
              {totalCrops === 0 && <div className="text-center py-24 opacity-20 text-[11px] font-black uppercase italic tracking-[0.4em] flex flex-col items-center gap-4">
                <i className="fas fa-box-open text-4xl mb-2"></i>
                Stock is Dry
              </div>}
            </motion.div>
          )}

          {tab === 'pets' && (
            <motion.div key="pets" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-2">{t('livestockUnit')} Marketplace</h3>
              {Object.values(ANIMALS).map(animal => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  key={animal.id}
                  className="bg-black/40 p-5 rounded-xl border-[6px] border-[#5D4037] shadow-[0_5px_10px_rgba(0,0,0,0.6)] flex flex-col gap-4 group hover:border-[#8D6E63] transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-28 h-28 flex items-center justify-center drop-shadow-xl group-hover:scale-110 transition-transform bg-black/20 rounded-xl overflow-hidden border border-white/5">
                      {animal.emoji.startsWith('/') ? <img src={animal.emoji} className="w-full h-full object-contain" /> : <span className="text-7xl">{animal.emoji}</span>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-[15px] uppercase tracking-tighter">{animal.name[language]}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-sm opacity-60 uppercase font-bold">Produces {animal.productName[language]}</span>
                        <span className="text-[9px] bg-f2e-gold/10 text-f2e-gold px-2 py-0.5 rounded-sm font-bold">ROI: {animal.productPrice} ZEN</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {animal.zenPrice && (
                      <button
                        onClick={() => onPurchaseAnimal(animal.id, 'ZEN')}
                        className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg text-[10px] font-black uppercase transition-all"
                      >
                        {t('buy')} ◎ {animal.zenPrice}
                      </button>
                    )}
                    <div className="flex flex-col gap-1 flex-1">
                      <button
                        onClick={() => onPurchaseAnimal(animal.id, 'SOL')}
                        className="w-full bg-f2e-gold text-black hover:bg-yellow-400 py-2.5 rounded-lg text-[10px] font-black uppercase shadow-lg transition-all flex flex-col items-center justify-center leading-none"
                      >
                        <span>⚡ INSTANT</span>
                        <span className="opacity-60 text-[8px] mt-0.5">Total: {(animal.solPrice * 1.015).toFixed(4)} SOL</span>
                      </button>
                      <div className="text-[8px] text-center text-white/20 font-mono">
                        {animal.solPrice} + 1.5% fee
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === 'resources' && (
            <motion.div key="resources" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-2">Resources</h3>

              <div className="bg-blue-900/30 p-6 rounded-xl border-[6px] border-blue-900/50 shadow-[0_5px_10px_rgba(0,0,0,0.6)] flex flex-col gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-24 h-24 bg-blue-500/10 rounded-xl flex items-center justify-center text-5xl text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <i className="fas fa-faucet-drip animate-bounce"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-[16px] uppercase tracking-tighter text-blue-200">Plasma Water Reserve</h4>
                    <p className="text-[10px] opacity-60 font-bold uppercase mt-1">Accelerates growth significantly</p>
                    <div className="mt-2 text-2xl font-black text-white">{profile.waterCharges || 0} <span className="text-sm opacity-50">Charges</span></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={onPurchaseWater}
                    className="w-full bg-f2e-gold text-black py-4 rounded-xl text-xs font-black uppercase shadow-lg hover:bg-yellow-400 flex items-center justify-center gap-3 transition-transform active:scale-95"
                  >
                    <span>+100 Charges</span>
                    <span className="text-black/50">|</span>
                    <span>0.001 SOL</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {(tab === 'upgrades' || tab === 'estate') && (
            <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-2">{tab === 'estate' ? 'Headquarters Upgrades' : 'Technical Upgrades'}</h3>
              {Object.values(UPGRADES).filter(u => tab === 'estate' ? u.id === UpgradeType.HOUSE_ESTATE : u.id !== UpgradeType.HOUSE_ESTATE).map(up => {
                const lvl = profile.upgrades[up.id] || 0;
                const cost = getCost(up.id);
                const maxed = lvl >= up.maxLevel;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={!maxed && profile.balance >= cost ? { scale: 1.02 } : {}}
                    whileTap={!maxed && profile.balance >= cost ? { scale: 0.95 } : {}}
                    key={up.id}
                    className={`bg-black/40 p-6 rounded-xl border-[6px] shadow-[0_5px_10px_rgba(0,0,0,0.6)] transition-all ${maxed ? 'border-transparent opacity-50 grayscale' : 'border-[#5D4037] hover:border-[#8D6E63]'
                      }`}
                  >
                    <div className="flex items-center gap-5 mb-5">
                      <div className="w-20 h-20 bg-black/30 rounded-lg flex items-center justify-center text-4xl border border-white/5 text-f2e-gold shadow-inner"><i className={`fas ${up.icon}`}></i></div>
                      <div className="flex-1">
                        <h4 className="font-black text-[14px] uppercase tracking-tighter">{up.name[language]}</h4>
                        <p className="text-[9px] opacity-50 uppercase mt-0.5 leading-relaxed">{up.description[language]}</p>
                      </div>
                      <div className="text-xs font-black bg-white/10 px-3 py-1.5 rounded-lg text-white/60">{t('level')} {lvl}</div>
                    </div>
                    <button
                      disabled={maxed || profile.balance < cost}
                      onClick={() => onUpgrade(up.id)}
                      className={`w-full py-4 rounded-lg text-[11px] font-black uppercase transition-all active:scale-[0.98] ${maxed ? 'bg-white/5 text-white/10' : profile.balance >= cost ? 'bg-f2e-gold text-black shadow-lg shadow-f2e-gold/20' : 'bg-white/10 text-white/20'}`}
                    >
                      {maxed ? t('max') : `${t('buy')} (◎ ${cost.toLocaleString()})`}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Shop;