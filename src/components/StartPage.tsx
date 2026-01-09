import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { useTonConnectUI } from '@tonconnect/ui-react';

interface StartPageProps {
    onGuestLogin: () => void;
}

const StartPage: React.FC<StartPageProps> = ({ onGuestLogin }) => {
    const [tonConnectUI] = useTonConnectUI();
    const { setVisible } = useWalletModal();

    return (
        <div className="h-screen w-full bg-f2e-black relative overflow-hidden flex flex-col items-center justify-center p-6">

            {/* Full Screen Background */}
            <div className="absolute inset-0 z-0">
                <img src="/winter_banner.png" className="w-full h-full object-cover" alt="Background" />
                <div className="absolute inset-0 bg-black/40" />
            </div>
            {/* Top Section: Banner Image - Mobile Only */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-h-[50vh] lg:hidden">
                <img
                    src="/winter_banner.png"
                    alt="Winter Season"
                    className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
                />
            </div>

            {/* Bottom Section: Actions - Pinned to bottom comfortably */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                className="w-full flex flex-col gap-3 pb-8"
            >
                {/* 1. Connect Solana */}
                <div className="w-full relative group">
                    <button
                        onClick={() => setVisible(true)}
                        className="relative w-full bg-[#FFCA28] border-b-[4px] border-[#FFA000] text-[#5D4037] font-black text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_4px_0_#FFA000] active:translate-y-[2px] active:shadow-none hover:brightness-105"
                    >
                        Connect Solana Wallet
                    </button>
                </div>

                {/* 1.5 Connect TON */}
                <div className="w-full relative group">
                    <button
                        onClick={() => tonConnectUI.connected ? tonConnectUI.disconnect() : tonConnectUI.openModal()}
                        className={`relative w-full bg-[#FFCA28] border-b-[4px] border-[#FFA000] text-[#5D4037] font-black text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_4px_0_#FFA000] active:translate-y-[2px] active:shadow-none hover:brightness-105 flex items-center justify-center gap-2`}
                    >
                        <span className="text-xl drop-shadow-sm">{tonConnectUI.connected ? '❌' : '💎'}</span>
                        <span className="drop-shadow-sm">{tonConnectUI.connected ? 'Disconnect TON' : 'Connect TON Wallet'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                    {/* 2. Guest Mode (Secondary) */}
                    <button
                        onClick={onGuestLogin}
                        className="w-full bg-[#1A1A1A]/80 backdrop-blur-md text-[#D7CCC8] font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl border border-white/10 hover:bg-[#2A2A2A] active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                    >
                        <i className="fas fa-user-secret text-base mb-0.5"></i>
                        <span>Guest</span>
                    </button>

                    {/* 3. Website Link (Secondary) */}
                    <a
                        href="https://farm2earn.website"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#1A1A1A]/80 backdrop-blur-md text-white/80 font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl border border-white/10 hover:bg-[#2A2A2A] active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                    >
                        <i className="fas fa-globe text-base mb-0.5"></i>
                        <span>Website</span>
                    </a>
                </div>

                {/* Footer Info */}
                <div className="text-center mt-2">
                    <p className="text-white/30 text-[9px] uppercase font-bold tracking-[0.2em]">
                        Farm2Earn v1.0.0
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default StartPage;
