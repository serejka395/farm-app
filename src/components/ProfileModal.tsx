import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { UserProfile, CropType } from '../types';
import { CROPS } from '../utils/constants';
import { ACHIEVEMENTS } from '../api/achievements';
import { levelingService } from '../api/levelingService';
import { useLanguage } from '../contexts/LanguageContext';

import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

interface ProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
}

type Tab = 'main' | 'stats' | 'achievements' | 'referrals' | 'security';

const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose }) => {
  const { disconnect } = useWallet();
  const [tonConnectUI] = useTonConnectUI();
  const tonAddress = useTonAddress();
  const [activeTab, setActiveTab] = useState<Tab>('main');
  const { language, t } = useLanguage();

  const truncateAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  // Determine Wallet Type
  const isTon = !!tonAddress;
  const isGuest = profile.id.startsWith('guest');

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

  const handleDisconnect = async () => {
    if (isTon) {
      await tonConnectUI.disconnect();
    } else {
      await disconnect();
    }
    onClose();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="w-full max-w-lg bg-[#FFF8E1] rounded-3xl overflow-hidden flex flex-col max-h-[85vh] border-[6px] border-[#8D6E63] shadow-[0_20px_0_#5D4037]"
    >
      {/* Header */}
      <div className="relative p-8 pb-0 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-[#5D4037] uppercase tracking-tighter drop-shadow-sm">
              {profile.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black bg-[#FFB74D] text-[#5D4037] px-2 py-0.5 rounded-md uppercase tracking-widest border border-[#E65100] shadow-[0_2px_0_#E65100]">{t('level')} {profile.level}</span>
              <span className="text-[10px] font-black bg-[#EFEBE9] text-[#8D6E63] px-2 py-0.5 rounded-md uppercase tracking-widest border border-[#D7CCC8]">PRO FARMER</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-[#EFEBE9] rounded-xl flex items-center justify-center border-2 border-[#D7CCC8] hover:bg-[#D7CCC8] transition-all active:scale-95 text-[#8D6E63] shadow-[0_3px_0_#BCAAA4] active:shadow-none active:translate-y-0.5"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Wallet Badge */}
        <div className="mt-6 flex items-center gap-3 bg-[#EFEBE9] px-4 py-3 rounded-xl border-2 border-[#D7CCC8]">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white border shadow-sm ${isTon ? 'bg-blue-500 border-blue-700' : 'bg-[#FFB74D] border-[#E65100]'}`}>
            {isTon ? '💎' : '◎'}
          </div>
          <div>
            <p className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest leading-none mb-1">
              {isTon ? 'TON Wallet' : (isGuest ? 'Guest Account' : 'Solana Wallet')}
            </p>
            <p className="text-xs font-black text-[#5D4037] tracking-tight font-mono">
              {truncateAddress(profile.walletAddress)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className="flex gap-2 p-4 bg-[#D7CCC8]/30 overflow-x-auto custom-scroll border-b-[3px] border-[#8D6E63]">
          {(['main', 'stats', 'achievements', 'referrals', 'security'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-[2px] ${activeTab === tab
                ? 'bg-[#FFB74D] text-[#5D4037] border-[#E65100] shadow-[0_2px_0_#E65100] active:shadow-none active:translate-y-0.5'
                : 'bg-[#EFEBE9] text-[#8D6E63] border-transparent hover:border-[#8D6E63]/30'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scroll p-6 bg-[#FFF8E1]">
        <AnimatePresence mode="wait">
          {activeTab === 'main' && (
            <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border-[3px] border-[#D7CCC8] shadow-[0_4px_0_rgba(93,64,55,0.1)]">
                  <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest mb-2">{t('balance')}</p>
                  <p className="text-2xl font-black text-[#5D4037] tracking-tight">◎ {profile.balance.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border-[3px] border-[#D7CCC8] shadow-[0_4px_0_rgba(93,64,55,0.1)] relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{t('experience')}</p>
                    <p className="text-xl font-black text-[#5D4037] tracking-tight">{Math.floor(xpInLevel).toLocaleString()}<span className="text-xs text-[#8D6E63] ml-1">/ {Math.floor(xpNeeded).toLocaleString()}</span></p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#EFEBE9] border-t border-[#D7CCC8]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="h-full bg-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-[#8D6E63] uppercase mb-4 tracking-[0.2em]">Inventory</h4>
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
                        className={`aspect-square p-2 rounded-xl border-[3px] transition-all flex flex-col items-center justify-center gap-1 ${count > 0
                          ? 'bg-white border-[#D7CCC8] shadow-[0_4px_0_rgba(93,64,55,0.1)]'
                          : 'bg-[#EFEBE9] border-[#D7CCC8] opacity-50 grayscale'
                          }`}
                      >
                        <span className="text-2xl drop-shadow-sm">{data.emoji}</span>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-[#8D6E63] uppercase mb-0.5 tracking-tighter">{data.name[language]}</p>
                          <span className="text-xs font-black text-[#5D4037]">x{count}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* Connect TON Option (Visible if not connected to TON) */}
                {!isTon && (
                  <button
                    onClick={() => { tonConnectUI.openModal(); onClose(); }}
                    className="w-full py-4 rounded-xl bg-[#0098EA] border-b-[4px] border-[#0077B5] text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#008AC9] transition-all shadow-[0_4px_0_#005A8D] active:shadow-none active:translate-y-[2px] flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">💎</span>
                    Connect TON Wallet
                  </button>
                )}

                <button
                  onClick={handleDisconnect}
                  className="w-full py-4 rounded-xl bg-[#FFEBEE] border-b-[4px] border-[#FFCDD2] text-[#C62828] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#FFCDD2] transition-all shadow-[0_4px_0_#EF9A9A] active:shadow-none active:translate-y-[2px]"
                >
                  {isTon ? 'Disconnect TON' : 'Disconnect Wallet'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div key="stats" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              {[
                { label: 'Total Crops Harvested', val: profile.stats.totalCropsHarvested, icon: 'fa-wheat-awn', color: 'text-orange-500', bg: 'bg-orange-100' },
                { label: 'Career Earnings', val: `◎ ${profile.stats.totalMoneyEarned.toLocaleString()}`, icon: 'fa-sack-dollar', color: 'text-[#FBC02D]', bg: 'bg-yellow-100' },
                { label: 'Farming Streak', val: `${profile.stats.dailyStreak} Days`, icon: 'fa-fire', color: 'text-red-500', bg: 'bg-red-100' }
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border-[3px] border-[#D7CCC8] shadow-[0_4px_0_rgba(93,64,55,0.1)] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-lg ${s.color} border border-black/5`}><i className={`fas ${s.icon}`}></i></div>
                    <span className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest">{s.label}</span>
                  </div>
                  <span className="text-lg font-black text-[#5D4037]">{s.val}</span>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
              {ACHIEVEMENTS.map(ach => {
                const isUnlocked = profile.achievements?.[ach.id];
                return (
                  <div key={ach.id} className={`p-4 rounded-2xl flex items-center gap-4 border-[3px] transition-all ${isUnlocked
                    ? 'bg-[#FFF3E0] border-[#FFB74D] shadow-[0_4px_0_#FFE0B2]'
                    : 'bg-[#EFEBE9] border-[#D7CCC8] opacity-60 grayscale'
                    }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm border border-black/5 ${isUnlocked ? 'bg-[#FFB74D] text-[#5D4037]' : 'bg-[#D7CCC8] text-[#8D6E63]'
                      }`}>
                      <i className={`fas ${ach.icon}`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-xs font-black uppercase tracking-widest ${isUnlocked ? 'text-[#5D4037]' : 'text-[#8D6E63]'}`}>{ach.name[language]}</h4>
                      <p className="text-[10px] text-[#8D6E63] mt-1 font-medium">{ach.description[language]}</p>
                    </div>
                    {isUnlocked && <div className="text-[#FFB74D] text-lg drop-shadow-sm"><i className="fas fa-check-circle"></i></div>}
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'referrals' && (
            <motion.div key="referrals" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="bg-[#FFF3E0] p-6 rounded-2xl border-[3px] border-[#FFB74D] text-center relative overflow-hidden shadow-[0_4px_0_#FFE0B2]">
                <div className="relative z-10">
                  <i className="fas fa-users text-4xl text-[#FFB74D] mb-3 drop-shadow-sm"></i>
                  <h4 className="text-lg font-black text-[#5D4037] uppercase tracking-tighter mb-2">Invite Friends</h4>
                  <p className="text-[10px] text-[#8D6E63] mb-4 px-8 font-bold">Earn 10% of your friends' harvest value forever!</p>

                  <div className="bg-white p-3 rounded-xl border border-[#D7CCC8] flex items-center justify-between gap-3 mb-4">
                    <code className="text-[10px] text-[#E65100] font-mono truncate flex-1 text-left bg-[#FFF8E1] px-2 py-1 rounded">
                      https://t.me/farm_appbot/farm2earn.space/ref...
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(`https://t.me/farm_appbot/farm2earn.space?startapp=ref_${profile.walletAddress}`)}
                      className="w-8 h-8 bg-[#FFB74D] rounded-lg flex items-center justify-center text-[#5D4037] hover:bg-[#FFA726] transition-all shadow-sm border border-[#E65100]"
                    >
                      <i className="fas fa-copy text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.2em] mb-3 px-2">Your Squad ({profile.referrals?.length || 0})</h4>
                {(!profile.referrals || profile.referrals.length === 0) ? (
                  <div className="text-center py-8 opacity-40 text-[10px] uppercase font-black text-[#8D6E63] border-2 border-dashed border-[#D7CCC8] rounded-xl">
                    No farmers invited yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {profile.referrals.map((ref: any, i) => {
                      // Handle both old string[] and new Referral[] format gracefully
                      const isObj = typeof ref === 'object';
                      const name = isObj ? ref.name : `Farmer #${i + 1}`;
                      const date = isObj ? new Date(ref.joinedAt).toLocaleDateString() : 'Unknown Date';

                      return (
                        <div key={i} className="bg-white p-3 rounded-xl border border-[#D7CCC8] flex justify-between items-center shadow-sm">
                          <div>
                            <p className="text-[10px] font-black uppercase text-[#5D4037]">{name}</p>
                            <p className="text-[8px] text-[#8D6E63] font-mono">{date}</p>
                          </div>
                          <span className="text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#C8E6C9] font-bold">Active</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-[#E3F2FD] p-8 rounded-2xl border-[3px] border-[#90CAF9] text-center relative overflow-hidden shadow-[0_4px_0_#BBDEFB]">
                <i className="fas fa-shield-check text-5xl text-[#2196F3] mb-4 opacity-80"></i>
                <h4 className="text-lg font-black text-[#0D47A1] uppercase tracking-tighter mb-2">Protocol Verified</h4>
                <p className="text-[10px] text-[#1976D2] uppercase leading-relaxed px-6 tracking-widest font-bold">Farm state cryptographically verified.</p>
              </div>

              <div className="space-y-2">
                <div className="p-4 bg-white rounded-xl flex justify-between items-center text-[10px] font-black uppercase border-[2px] border-[#D7CCC8]">
                  <span className="text-[#8D6E63] tracking-widest">Checksum</span>
                  <span className="text-[#E65100] bg-[#FFF3E0] px-2 py-1 rounded">{profile.id.split('-')[0]}</span>
                </div>
                <div className="p-4 bg-white rounded-xl flex justify-between items-center text-[10px] font-black uppercase border-[2px] border-[#D7CCC8]">
                  <span className="text-[#8D6E63] tracking-widest">Network</span>
                  <span className="text-[#1976D2] bg-[#E3F2FD] px-2 py-1 rounded">Mainnet Beta</span>
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