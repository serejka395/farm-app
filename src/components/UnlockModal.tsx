import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface UnlockModalProps {
    data: {
        plotId: number;
        solCost: number;
        zenCost: number;
        tonCost: number;
    };
    onClose: () => void;
    onPurchase: (currency: 'ZEN' | 'SOL' | 'TON') => void;
}

const UnlockModal: React.FC<UnlockModalProps> = ({ data, onClose, onPurchase }) => {
    const { language, t } = useLanguage();

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#FFF8E1] w-full p-6 rounded-3xl border-[6px] border-[#8D6E63] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#EFEBE9] rounded-full border-2 border-[#D7CCC8] text-[#8D6E63] hover:bg-[#D7CCC8] transition-colors"
            >
                <i className="fas fa-times"></i>
            </button>

            <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-[#5D4037] uppercase tracking-widest">{t('unlockPlot')} #{data.plotId + 1}</h2>
                <p className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wider mt-1">Expand your farming empire!</p>
            </div>

            <div className="space-y-3">
                {/* ZEN Option */}
                <button
                    onClick={() => onPurchase('ZEN')}
                    className="w-full bg-[#FFF3E0] p-4 rounded-xl border-[3px] border-[#FFB74D] flex items-center justify-between group hover:bg-[#FFE0B2] transition-colors relative overflow-hidden active:scale-98"
                >
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-[#FFB74D] rounded-lg flex items-center justify-center text-xl shadow-sm">
                            🏔️
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] font-black text-[#E65100] uppercase tracking-widest">Game Balance</div>
                            <div className="text-lg font-black text-[#5D4037]">{data.zenCost.toLocaleString()} ZEN</div>
                        </div>
                    </div>
                    <i className="fas fa-arrow-right text-[#FFB74D] group-hover:translate-x-1 transition-transform"></i>
                </button>

                {/* SOL Option */}
                {data.solCost > 0 && (
                    <button
                        onClick={() => onPurchase('SOL')}
                        className="w-full bg-[#E0F7FA] p-4 rounded-xl border-[3px] border-[#4DD0E1] flex items-center justify-between group hover:bg-[#B2EBF2] transition-colors relative overflow-hidden active:scale-98"
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-[#4DD0E1] rounded-lg flex items-center justify-center text-xl shadow-sm text-white">
                                ◎
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-black text-[#0097A7] uppercase tracking-widest">Solana</div>
                                <div className="text-lg font-black text-[#006064]">{data.solCost} SOL</div>
                            </div>
                        </div>
                        <i className="fas fa-arrow-right text-[#4DD0E1] group-hover:translate-x-1 transition-transform"></i>
                    </button>
                )}

                {/* TON Option */}
                {data.tonCost > 0 && (
                    <button
                        onClick={() => onPurchase('TON')}
                        className="w-full bg-[#E3F2FD] p-4 rounded-xl border-[3px] border-[#64B5F6] flex items-center justify-between group hover:bg-[#BBDEFB] transition-colors relative overflow-hidden active:scale-98"
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 bg-[#42A5F5] rounded-lg flex items-center justify-center text-xl shadow-sm text-white">
                                💎
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-black text-[#1565C0] uppercase tracking-widest">TON Wallet</div>
                                <div className="text-lg font-black text-[#0D47A1]">{data.tonCost} TON</div>
                            </div>
                        </div>
                        <i className="fas fa-arrow-right text-[#42A5F5] group-hover:translate-x-1 transition-transform"></i>
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default UnlockModal;
