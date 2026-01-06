import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';

interface StartPageProps {
    onGuestLogin: () => void;
}

const StartPage: React.FC<StartPageProps> = ({ onGuestLogin }) => {
    return (
        <div className="h-screen w-full bg-f2e-black relative overflow-hidden flex flex-col items-center justify-center p-6">

            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('/assets/winter_field_bg.png')] bg-cover bg-center opacity-40 blur-sm pointer-events-none transform scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-f2e-black via-f2e-black/90 to-black/40 pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-between h-full max-h-[800px] w-full max-w-sm py-12">

                {/* Top Section: Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="flex flex-col items-center gap-6"
                >
                    {/* Logo Container - White Background */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/5 relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-200 rounded-[2.3rem] -z-10" />
                        <img
                            src="/assets/logo.png"
                            alt="Farm2Earn"
                            className="w-32 h-32 object-contain drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>

                    <div className="text-center">
                        <h1 className="text-3xl font-black text-white tracking-wider uppercase drop-shadow-md">
                            Zen Harvest
                        </h1>
                        <p className="text-white/50 text-xs font-bold tracking-[0.2em] uppercase mt-2">
                            Winter Season
                        </p>
                    </div>
                </motion.div>

                {/* Bottom Section: Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                    className="w-full flex flex-col gap-4"
                >

                    {/* 1. Connect Wallet (Primary Action) */}
                    <div className="w-full relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-f2e-gold to-[#FFA000] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000" />
                        <div className="wallet-adapter-dropdown w-full relative">
                            <WalletMultiButton className="!w-full !justify-center !bg-gradient-to-b !from-f2e-gold !to-[#FF8F00] !text-black !font-black !text-sm !uppercase !tracking-wider !py-5 !h-auto !rounded-2xl transition-all !shadow-[0_4px_0_#E65100] active:!translate-y-[2px] active:!shadow-none hover:!brightness-110" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* 2. Guest Mode (Secondary) */}
                        <button
                            onClick={onGuestLogin}
                            className="w-full bg-[#3E2723] text-[#D7CCC8] font-bold text-xs uppercase tracking-wider py-4 rounded-xl border border-[#5D4037] shadow-lg hover:bg-[#4E342E] active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                        >
                            <i className="fas fa-user-secret text-lg mb-1"></i>
                            <span>Guest</span>
                        </button>

                        {/* 3. Website Link (Secondary) */}
                        <a
                            href="https://farm2earn.website"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#1A1A1A] text-white/80 font-bold text-xs uppercase tracking-wider py-4 rounded-xl border border-white/10 shadow-lg hover:bg-[#2A2A2A] active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
                        >
                            <i className="fas fa-globe text-lg mb-1"></i>
                            <span>Website</span>
                        </a>
                    </div>
                </motion.div>

                {/* Footer Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-4 left-0 right-0 text-center"
                >
                    <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">
                        v1.0.0 • Farm2Earn
                    </p>
                </motion.div>

            </div>
        </div>
    );
};

export default StartPage;
