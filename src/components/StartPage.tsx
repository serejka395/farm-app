import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { useTonConnectUI } from '@tonconnect/ui-react';

interface StartPageProps {
    onGuestLogin: () => void;
}

const StartPage: React.FC<StartPageProps> = ({ onGuestLogin }) => {
    const [tonConnectUI] = useTonConnectUI();

    return (
        <div className="h-screen w-full bg-f2e-black relative overflow-hidden flex flex-col items-center justify-center p-6">

            {/* Full Screen Background */}
            <div className="absolute inset-0 z-0">
                <img src="/assets/start_bg_snow.jpg" className="w-full h-full object-cover opacity-30 blur-sm lg:opacity-100 lg:blur-none" alt="Background" />
                <div className="absolute inset-0 bg-black/40 lg:bg-black/20" />
            </div>
            {/* Top Section: Banner Image - Mobile Only */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-h-[50vh] lg:hidden">
                <img
                    src="/assets/start_bg_snow.jpg"
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

                {/* 1. Connect Wallet (Primary Action) */}
                <div className="w-full relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-f2e-gold to-[#FFA000] rounded-2xl blur-sm opacity-50 group-hover:opacity-80 transition duration-500" />
                    <div className="wallet-adapter-dropdown w-full relative">
                        <WalletMultiButton className="!w-full !justify-center !bg-gradient-to-b !from-f2e-gold !to-[#FF8F00] !text-black !font-black !text-sm !uppercase !tracking-wider !py-4 !h-auto !rounded-2xl transition-all !shadow-[0_4px_0_#E65100] active:!translate-y-[2px] active:!shadow-none hover:!brightness-110 !transform-none" />
                    </div>
                </div>

                {/* 1.5 Connect TON */}
                <div className="w-full relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#0098EA] to-[#0077B5] rounded-2xl blur-sm opacity-50 group-hover:opacity-80 transition duration-500" />
                    <button
                        onClick={() => tonConnectUI.connected ? tonConnectUI.disconnect() : tonConnectUI.openModal()}
                        className={`relative w-full bg-gradient-to-b ${tonConnectUI.connected ? 'from-red-500 to-red-600 border-red-700 shadow-[0_4px_0_#991b1b]' : 'from-[#0098EA] to-[#0077B5] border-[#006699] shadow-[0_4px_0_#005A8D]'} text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl border-b-[4px] active:translate-y-[2px] active:shadow-none hover:brightness-110 transition-all flex items-center justify-center gap-2`}
                    >
                        <span className="text-xl drop-shadow-sm">{tonConnectUI.connected ? '❌' : '💎'}</span>
                        <span className="drop-shadow-sm">{tonConnectUI.connected ? 'Disconnect TON' : 'Connect TON'}</span>
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
