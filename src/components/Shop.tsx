import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CropType, UserProfile, UpgradeType, AnimalType } from '../types';
import { CROPS, UPGRADES, ANIMALS } from '../utils/constants';
import { useLanguage } from '../contexts/LanguageContext';

interface ShopProps {
  profile: UserProfile;
  onSell: (crop: CropType) => void;
  onUpgrade: (upgrade: UpgradeType, currency: 'ZEN' | 'GOLD' | 'SOL') => void;
  onPurchaseAnimal: (type: AnimalType, currency: 'ZEN' | 'SOL') => void;
  selectedSeed: CropType | null;
  onSelectSeed: (crop: CropType) => void;
  totalCrops: number;
  maxCapacity: number;
  onPurchaseWater: () => void;
  onTonPayment: (amount: number, type: 'UPGRADE' | 'ANIMAL' | 'WATER', itemId?: string) => void;
}

const Shop: React.FC<ShopProps> = ({ profile, onSell, onUpgrade, onPurchaseAnimal, selectedSeed, onSelectSeed, onPurchaseWater, totalCrops, maxCapacity, onTonPayment }) => {
  const [tab, setTab] = useState<'seeds' | 'sell' | 'upgrades' | 'pets' | 'estate' | 'resources'>('seeds');
  const { language, t } = useLanguage();

  const getCost = (type: UpgradeType) => {
    const lvl = profile.upgrades[type] || 0;
    return Math.floor(UPGRADES[type].baseCost * Math.pow(UPGRADES[type].costMultiplier, lvl));
  };

  const getSolCost = (type: UpgradeType) => {
    const lvl = profile.upgrades[type] || 0;
    const base = UPGRADES[type].solBaseCost || 0;
    // Don't use Math.floor for SOL, we need precision
    return base * Math.pow(UPGRADES[type].costMultiplier, lvl);
  };

  return (
    <div className="h-full flex flex-col bg-[#FFF8E1] rounded-2xl overflow-hidden border-[6px] border-[#8D6E63] shadow-[0_10px_0_#5D4037]">
      {/* Tab Navigation */}
      <div className="p-4 bg-[#D7CCC8]/30 flex gap-2 overflow-x-auto custom-scroll shrink-0 border-b-[3px] border-[#8D6E63]">
        {(['seeds', 'sell', 'pets', 'upgrades', 'estate', 'resources'] as const).map(tabName => (
          <button
            key={tabName} onClick={() => setTab(tabName)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:opacity-100 border-[2px] ${tab === tabName ? 'bg-[#FFB74D] text-[#5D4037] border-[#E65100] shadow-[0_2px_0_#E65100] active:shadow-none active:translate-y-0.5' : 'bg-[#EFEBE9] text-[#8D6E63] border-transparent hover:border-[#8D6E63]/30'}`}
          >
            {tabName === 'seeds' ? t('seeds') : tabName === 'sell' ? t('sell') : tabName === 'pets' ? t('livestock') : tabName === 'upgrades' ? t('upgrades') : tabName === 'estate' ? t('farmstead') : 'Resources'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll p-6 space-y-4 pb-24">
        <AnimatePresence mode="wait">
          {tab === 'seeds' && (
            <motion.div key="seeds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <h3 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.3em] px-2 flex justify-between">
                <span>{t('shopTitle')}</span>
                <span className="text-[#FFB74D] font-black drop-shadow-sm">{Object.keys(CROPS).length} Varieties</span>
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
                      className={`group relative p-4 rounded-2xl flex flex-col gap-3 transition-all duration-300 border-[3px] shadow-[0_4px_0_rgba(93,64,55,0.2)] ${locked
                        ? 'opacity-60 bg-[#D7CCC8]/50 border-dashed border-[#8D6E63] grayscale'
                        : active
                          ? 'bg-[#FFF3E0] border-[#FFB74D] shadow-[0_4px_0_#FFB74D]'
                          : 'bg-white border-[#D7CCC8] hover:border-[#8D6E63]'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 flex items-center justify-center bg-[#FFF8E1] rounded-xl overflow-hidden border-[2px] border-[#D7CCC8] group-hover:scale-110 transition-transform">
                          <span className="text-5xl drop-shadow-sm">{crop.emoji}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-[12px] uppercase tracking-tighter leading-tight text-[#5D4037]">{crop.name[language]}</h4>
                          <p className="text-[9px] font-bold opacity-50 uppercase tracking-[0.1em] text-[#8D6E63]">{crop.rarity}</p>
                          <p className="text-[12px] text-[#FBC02D] font-black mt-1 drop-shadow-sm">◎ {crop.seedPrice}</p>
                        </div>
                      </div>

                      {!locked ? (
                        <button
                          onClick={() => onSelectSeed(crop.id)}
                          className={`w-full py-3 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 shadow-[0_3px_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-0.5 ${active ? 'bg-[#FFB74D] text-[#5D4037] border-2 border-[#E65100] shadow-[0_3px_0_#E65100]' : 'bg-[#EFEBE9] hover:bg-[#D7CCC8] text-[#5D4037]'}`}
                        >
                          {active ? 'SELECTED' : t('buy')}
                        </button>
                      ) : (
                        <div className="w-full py-3 bg-[#D7CCC8]/50 rounded-xl text-[9px] font-black opacity-60 uppercase text-center flex items-center justify-center gap-2 border border-[#8D6E63]/30 text-[#5D4037]">
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
              <div className="p-6 bg-[#EFEBE9] rounded-2xl border-[3px] border-[#8D6E63] flex justify-between items-center relative overflow-hidden shadow-inner">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63]">{t('barn')}</span>
                  <h2 className="text-2xl font-black mt-1 uppercase text-[#5D4037]">{totalCrops} <span className="text-sm opacity-40">/ {maxCapacity}</span></h2>
                </div>
                <i className="fas fa-warehouse absolute -bottom-4 -right-4 text-8xl text-[#8D6E63]/10"></i>
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
                      className="bg-white p-4 rounded-xl flex flex-col gap-3 border-[3px] border-[#D7CCC8] shadow-[0_4px_0_rgba(93,64,55,0.1)] group hover:border-[#8D6E63] transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-[#FFF8E1] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden border border-[#D7CCC8]">
                          <span className="text-5xl">{crop.emoji}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-[12px] uppercase tracking-tighter leading-tight text-[#5D4037]">{crop.name[language]}</h4>
                          <p className="text-[10px] opacity-60 uppercase font-bold text-[#8D6E63]">Stock: {count}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => onSell(crop.id)}
                        className="bg-[#FFB74D] text-[#5D4037] w-full py-3 rounded-xl text-[10px] font-black uppercase shadow-[0_3px_0_#E65100] border-2 border-[#E65100] active:translate-y-0.5 active:shadow-none transition-all hover:bg-[#FFA726]"
                      >
                        {t('sell')} (◎{Math.floor(count * crop.sellPrice)})
                      </button>
                    </motion.div>
                  );
                })}
              </div>
              {totalCrops === 0 && <div className="text-center py-24 opacity-40 text-[11px] font-black uppercase italic tracking-[0.4em] flex flex-col items-center gap-4 text-[#8D6E63]">
                <i className="fas fa-box-open text-4xl mb-2"></i>
                Stock is Dry
              </div>}
            </motion.div>
          )}

          {tab === 'pets' && (
            <motion.div key="pets" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <h3 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.3em] px-2">{t('livestockUnit')} Marketplace</h3>
              {Object.values(ANIMALS).map(animal => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  key={animal.id}
                  className="bg-white p-5 rounded-2xl border-[3px] border-[#D7CCC8] shadow-[0_4px_0_rgba(93,64,55,0.1)] flex flex-col gap-4 group hover:border-[#8D6E63] transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform bg-[#FFF8E1] rounded-xl overflow-hidden border border-[#D7CCC8]">
                      <img src={animal.image} className="w-full h-full object-contain p-2 mix-blend-multiply" alt={animal.name[language]} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-[15px] uppercase tracking-tighter text-[#5D4037]">{animal.name[language]}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] bg-[#EFEBE9] text-[#8D6E63] px-2 py-0.5 rounded-md uppercase font-bold border border-[#D7CCC8]">Produces {animal.productName[language]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {animal.zenPrice && (
                      <button
                        onClick={() => onPurchaseAnimal(animal.id, 'ZEN')}
                        className="flex-1 bg-[#EFEBE9] hover:bg-[#D7CCC8] py-3 rounded-xl text-[10px] font-black uppercase transition-all text-[#5D4037]"
                      >
                        {t('buy')} ◎ {animal.zenPrice}
                      </button>
                    )}
                    <div className="flex flex-col gap-1 flex-1">
                      <button
                        onClick={() => onPurchaseAnimal(animal.id, 'SOL')}
                        className="w-full bg-[#FFB74D] text-[#5D4037] hover:bg-[#FFA726] py-3 rounded-xl text-[10px] font-black uppercase shadow-[0_3px_0_#E65100] border-2 border-[#E65100] active:translate-y-0.5 active:shadow-none transition-all flex flex-col items-center justify-center leading-none"
                      >
                        <span className="opacity-60 text-[8px] mt-0.5">{(animal.solPrice * 1.015).toFixed(4)} SOL</span>
                      </button>
                      <button
                        onClick={() => onTonPayment(animal.solPrice * 30, 'ANIMAL', animal.id)}
                        className="w-full bg-[#0098EA] text-white hover:brightness-110 py-3 rounded-xl text-[10px] font-black uppercase shadow-[0_3px_0_#0077B5] border-2 border-[#0077B5] active:translate-y-0.5 active:shadow-none transition-all flex flex-col items-center justify-center leading-none"
                      >
                        <span>💎 TON</span>
                        <span className="opacity-60 text-[8px] mt-0.5">{(animal.solPrice * 31).toFixed(2)} TON</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {tab === 'resources' && (
            <motion.div key="resources" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <h3 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.3em] px-2">Resources</h3>

              <div className="bg-[#E3F2FD] p-6 rounded-2xl border-[3px] border-[#90CAF9] shadow-[0_4px_0_#64B5F6] flex flex-col gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-5xl text-blue-400 border border-blue-100">
                    <i className="fas fa-faucet-drip animate-bounce"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-[16px] uppercase tracking-tighter text-[#1565C0]">Water Reserve</h4>
                    <p className="text-[10px] opacity-60 font-bold uppercase mt-1 text-[#1E88E5]">Accelerates growth significantly</p>
                    <div className="mt-2 text-2xl font-black text-[#0D47A1]">{profile.waterCharges || 0} <span className="text-sm opacity-50">Charges</span></div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={onPurchaseWater}
                    className="w-full bg-[#FFB74D] text-[#5D4037] py-4 rounded-xl text-xs font-black uppercase shadow-[0_3px_0_#E65100] border-2 border-[#E65100] hover:bg-[#FFA726] flex items-center justify-center gap-3 transition-all active:translate-y-0.5 active:shadow-none"
                  >
                    <span>+100 Charges</span>
                    <span className="text-[#5D4037]/30">|</span>
                    <span>0.001 SOL</span>
                  </button>
                  <button
                    onClick={() => onTonPayment(0.001 * 30, 'WATER')}
                    className="w-full bg-[#0098EA] text-white py-4 rounded-xl text-xs font-black uppercase shadow-[0_3px_0_#0077B5] border-2 border-[#0077B5] hover:brightness-110 flex items-center justify-center gap-3 transition-all active:translate-y-0.5 active:shadow-none"
                  >
                    <span>+100 Charges (TON)</span>
                    <span className="text-white/30">|</span>
                    <span>0.03 TON</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {(tab === 'upgrades' || tab === 'estate') && (
            <motion.div key={tab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h3 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.3em] px-2">{tab === 'estate' ? 'Headquarters Upgrades' : 'Technical Upgrades'}</h3>
              {Object.values(UPGRADES).filter(u => tab === 'estate' ? (u.id === UpgradeType.HOUSE_ESTATE || u.id === UpgradeType.WINTER_HOUSE) : (u.id !== UpgradeType.HOUSE_ESTATE && u.id !== UpgradeType.WINTER_HOUSE)).map(up => {
                const lvl = profile.upgrades[up.id] || 0;
                const cost = getCost(up.id);
                const solCost = getSolCost(up.id);
                const maxed = lvl >= up.maxLevel;
                const isGold = up.currency === 'GOLD';

                const hasSolOption = !!up.solBaseCost;

                const canAffordZen = isGold ? (profile.gold || 0) >= cost : profile.balance >= cost;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={!maxed ? { scale: 1.02 } : {}}
                    whileTap={!maxed ? { scale: 0.95 } : {}}
                    key={up.id}
                    className={`bg-white p-6 rounded-2xl border-[3px] shadow-[0_4px_0_rgba(93,64,55,0.1)] transition-all ${maxed ? 'border-transparent opacity-50 grayscale' : 'border-[#D7CCC8] hover:border-[#8D6E63]'
                      }`}
                  >
                    <div className="flex items-center gap-5 mb-5">
                      <div className={`w-20 h-20 bg-[#FFF8E1] rounded-xl flex items-center justify-center text-4xl border border-[#D7CCC8] ${isGold ? 'text-[#FBC02D]' : 'text-[#8D6E63]'}`}><i className={`fas ${up.icon}`}></i></div>
                      <div className="flex-1">
                        <h4 className="font-black text-[14px] uppercase tracking-tighter text-[#5D4037]">{up.name[language]}</h4>
                        <p className="text-[9px] opacity-60 uppercase mt-0.5 leading-relaxed text-[#8D6E63] font-bold">{up.description[language]}</p>
                      </div>
                      <div className="text-xs font-black bg-[#EFEBE9] px-3 py-1.5 rounded-lg text-[#8D6E63] border border-[#D7CCC8]">{t('level')} {lvl}</div>
                    </div>

                    <div className="space-y-2">
                      {/* ZEN/GOLD Button */}
                      <button
                        disabled={maxed || !canAffordZen}
                        onClick={() => onUpgrade(up.id, isGold ? 'GOLD' : 'ZEN')}
                        className={`w-full py-3 rounded-xl text-[11px] font-black uppercase transition-all active:scale-[0.98] ${maxed ? 'bg-[#EFEBE9] text-[#BCAAA4]' : canAffordZen ? 'bg-[#EFEBE9] hover:bg-[#D7CCC8] text-[#5D4037]' : 'bg-[#EFEBE9] text-[#BCAAA4]'}`}
                      >
                        {maxed ? t('max') : `${t('buy')} (${isGold ? 'GOLD ' : '◎ '}${cost.toLocaleString()})`}
                      </button>

                      {/* SOL Button */}
                      {!maxed && hasSolOption && (
                        <>
                          <button
                            onClick={() => onUpgrade(up.id, 'SOL')}
                            className="w-full py-4 bg-[#FFB74D] text-[#5D4037] rounded-xl text-[11px] font-black uppercase shadow-[0_3px_0_#E65100] border-2 border-[#E65100] hover:bg-[#FFA726] active:shadow-none active:translate-y-0.5 flex flex-col items-center justify-center leading-none"
                          >
                            <span>⚡ Upgrade with SOL</span>
                            <span className="opacity-60 text-[8px] mt-0.5">{(solCost * 1.015).toFixed(4)} SOL (Instant)</span>
                          </button>
                          <button
                            onClick={() => onTonPayment(solCost * 30, 'UPGRADE', up.id)}
                            className="w-full py-4 bg-[#0098EA] text-white rounded-xl text-[11px] font-black uppercase shadow-[0_3px_0_#0077B5] border-2 border-[#0077B5] hover:brightness-110 active:shadow-none active:translate-y-0.5 flex flex-col items-center justify-center leading-none mt-2"
                          >
                            <span>💎 Upgrade with TON</span>
                            <span className="opacity-60 text-[8px] mt-0.5">{(solCost * 31).toFixed(2)} TON</span>
                          </button>
                        </>
                      )}
                    </div>
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