import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { UserProfile, CropType } from '../types';
import { CROPS } from '../utils/constants';
import { ACHIEVEMENTS } from '../api/achievements';
import { levelingService } from '../api/levelingService';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
}

type Tab = 'main' | 'stats' | 'achievements' | 'referrals' | 'security';

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose }) => {
  const { disconnect, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>('main');
  const { language, t } = useLanguage();

  const truncateAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  // Level Progression Math
  const currentLevelBaseXP = levelingService.getXpRequiredForLevel(profile.level);
  const nextLevelBaseXP = levelingService.getXpRequiredForLevel(profile.level + 1);
  const xpInLevel = Math.max(0, profile.xp - currentLevelBaseXP);
  const xpNeeded = nextLevelBaseXP - currentLevelBaseXP;
  const progressPercent = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="f2e-panel w-full max-w-lg bg-f2e-dark rounded-3xl overflow-hidden flex flex-col max-h-[85vh] border border-f2e-gold/10 shadow-2xl"
    >
      {/* Header */}
      <div className="relative p-8 pb-0 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
              {profile.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black bg-f2e-gold text-black px-2 py-0.5 rounded-md uppercase tracking-widest">{t('level')} {profile.level}</span>
              <span className="text-[10px] font-black bg-white/5 text-white/40 px-2 py-0.5 rounded-md uppercase tracking-widest border border-white/5">PRO FARMER</span>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 text-white/40 hover:text-white">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Wallet Badge */}
        <div className="mt-6 flex items-center gap-3 bg-black/30 px-4 py-3 rounded-xl border border-white/5">
          <div className="w-8 h-8 bg-f2e-gold/10 rounded-lg flex items-center justify-center text-xs text-f2e-gold">◎</div>
          <div>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">Solana Wallet</p>
            <p className="text-xs font-black text-white tracking-tight font-mono opacity-80">{truncateAddress(profile.walletAddress)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 mt-6">
        <div className="flex gap-2 border-b border-white/5 pb-1">
          {(['main', 'stats', 'achievements', 'referrals', 'security'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-f2e-gold' : 'text-white/20 hover:text-white/40'}`}
            >
              {tab}
              {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-f2e-gold" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scroll p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'main' && (
            <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-f2e-gold uppercase tracking-widest mb-2 opacity-80">{t('balance')}</p>
                  <p className="text-2xl font-black text-white tracking-tight">◎ {profile.balance.toLocaleString()}</p>
                </div>
                <div className="bg-black/20 p-5 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 opacity-80">{t('experience')}</p>
                    <p className="text-xl font-black text-white tracking-tight">{Math.floor(xpInLevel).toLocaleString()}<span className="text-xs text-white/30 ml-1">/ {Math.floor(xpNeeded).toLocaleString()}</span></p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/40 border-t border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-white/20 uppercase mb-4 tracking-[0.2em]">{t('barn')} Inventory</h4>
                <div className="grid grid-cols-4 gap-3">
                  {Object.values(CropType).map(type => {
                    const count = profile.inventory[type] || 0;
                    const data = CROPS[type];
                    if (!data) return null;
                    return (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={type}
                        className={`aspect-square p-2 rounded-xl border-[4px] shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-all flex flex-col items-center justify-center gap-1 ${count > 0
                          ? 'bg-black/40 border-[#5D4037] hover:border-[#8D6E63]'
                          : 'bg-black/20 border-white/5 opacity-40 select-none grayscale'
                          }`}
                      >
                        <span className="text-2xl drop-shadow-md grayscale-[0.5]">{data.emoji}</span>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-white/40 uppercase mb-0.5 tracking-tighter">{data.name[language]}</p>
                          <span className="text-xs font-black text-white">x{count}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => { disconnect(); onClose(); }}
                className="w-full py-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 transition-all"
              >
                Disconnect Wallet
              </button>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              {[
                { label: 'Total Crops Harvested', val: profile.stats.totalCropsHarvested, icon: 'fa-wheat-awn', color: 'text-orange-400' },
                { label: 'Career Earnings', val: `◎ ${profile.stats.totalMoneyEarned.toLocaleString()}`, icon: 'fa-sack-dollar', color: 'text-f2e-gold' },
                { label: 'Farming Streak', val: `${profile.stats.dailyStreak} Days`, icon: 'fa-fire', color: 'text-red-400' }
              ].map((s, idx) => (
                <div key={idx} className="bg-black/20 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg ${s.color}`}><i className={`fas ${s.icon}`}></i></div>
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{s.label}</span>
                  </div>
                  <span className="text-lg font-black text-white">{s.val}</span>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
              {ACHIEVEMENTS.map(ach => {
                const isUnlocked = profile.achievements?.[ach.id];
                return (
                  <div key={ach.id} className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${isUnlocked ? 'bg-f2e-gold/10 border-f2e-gold/30' : 'bg-black/20 border-white/5 opacity-50 grayscale'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${isUnlocked ? 'bg-f2e-gold text-black' : 'bg-white/5 text-white/20'}`}>
                      <i className={`fas ${ach.icon}`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xs font-black uppercase tracking-widest ${isUnlocked ? 'text-white' : 'text-white/40'}`}>{ach.name[language]}</h4>
                      <p className="text-[10px] text-white/40 mt-1">{ach.description[language]}</p>
                    </div>
                    {isUnlocked && <div className="text-f2e-gold text-lg"><i className="fas fa-check-circle"></i></div>}
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'referrals' && (
            <motion.div key="referrals" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="bg-f2e-gold/10 p-6 rounded-2xl border border-f2e-gold/30 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <i className="fas fa-users text-4xl text-f2e-gold mb-3"></i>
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Invite Friends</h4>
                  <p className="text-[10px] text-white/60 mb-4 px-8">Earn 10% of your friends' harvest value forever!</p>

                  <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3 mb-4">
                    <code className="text-[10px] text-f2e-gold font-mono truncate flex-1 text-left">
                      https://farm2earn.vercel.app?ref={profile.walletAddress.slice(0, 8)}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(`https://farm2earn.vercel.app?ref=${profile.walletAddress}`)}
                      className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                    >
                      <i className="fas fa-copy text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 px-2">Your Squad ({profile.referrals?.length || 0})</h4>
                {(!profile.referrals || profile.referrals.length === 0) ? (
                  <div className="text-center py-8 opacity-20 text-[10px] uppercase font-black">
                    No farmers invited yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.referrals.map((ref, i) => (
                      <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-white/60">Farmer #{i + 1}</span>
                        <span className="text-[10px] text-f2e-gold font-bold">Active</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-f2e-gold/5 p-8 rounded-2xl border border-f2e-gold/10 text-center relative overflow-hidden">
                <i className="fas fa-shield-check text-5xl text-f2e-gold mb-4 opacity-80"></i>
                <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Protocol Verified</h4>
                <p className="text-[10px] text-white/40 uppercase leading-relaxed px-6 tracking-widest">Farm state cryptographically verified.</p>
              </div>

              <div className="space-y-2">
                <div className="p-4 bg-white/5 rounded-xl flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-white/30 tracking-widest">Checksum</span>
                  <span className="text-f2e-gold">{profile.id.split('-')[0]}</span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-white/30 tracking-widest">Network</span>
                  <span className="text-blue-400">Mainnet Beta</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProfileModal;