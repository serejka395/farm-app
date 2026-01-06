import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const GitbookView: React.FC = () => {
    const { language } = useLanguage();

    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-24 text-[#5D4037]">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-block bg-[#FFF8E1] border-[3px] border-[#8D6E63] px-6 py-2 rounded-full shadow-[0_4px_0_#5D4037] mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#8D6E63]">v0.8.2 ALPHA</span>
                </div>
                <h2 className="text-5xl font-black uppercase tracking-[0.2em] drop-shadow-sm text-[#5D4037]">Whitepaper</h2>
                <p className="text-[#8D6E63] text-sm font-bold tracking-widest mt-2 uppercase">Protocol Documentation</p>
            </div>

            {/* Introduction Card */}
            <section className="bg-[#FFF8E1] p-8 rounded-2xl border-[3px] border-[#8D6E63] shadow-[0_4px_0_#5D4037]">
                <h3 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                    <span className="text-3xl">🚜</span> The Vision
                </h3>
                <div className="prose prose-brown font-bold text-[#5D4037]/80 leading-relaxed space-y-4">
                    <p>
                        **Farm2Earn** is not just a game; it is a **gamified DeFi protocol** built on Solana.
                        We bridge the gap between casual idle gaming and high-yield decentralized finance.
                    </p>
                    <div className="bg-[#FFFFF0] p-4 rounded-xl border border-[#D7CCC8] text-center my-6">
                        <p className="text-lg italic text-[#8D6E63]">"Plant seeds, grow assets, harvest value."</p>
                    </div>
                    <p>
                        Our mission is to create a sustainable, player-owned economy. leveraging Solana's speed
                        to make every action—planting, watering, harvesting—feel tangible and rewarding.
                    </p>
                </div>
            </section>

            {/* Zenomics Grid */}
            <section>
                <h3 className="text-2xl font-black uppercase tracking-wider mb-6 px-4 text-center">The Zenomics</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {/* ZEN */}
                    <div className="bg-[#FFF8E1] p-6 rounded-2xl border-[3px] border-[#8D6E63] shadow-[0_4px_0_#5D4037] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 bg-[#8D6E63] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">Soft Currency</div>
                        <div className="text-4xl mb-4">🪙</div>
                        <h4 className="text-xl font-black uppercase tracking-wide mb-2">ZEN</h4>
                        <p className="text-xs font-bold text-[#8D6E63] leading-relaxed">
                            The fuel of the farm. Used for seeds and maintenance. Burned efficiently through gameplay loops.
                        </p>
                    </div>

                    {/* GOLD */}
                    <div className="bg-[#FFF8E1] p-6 rounded-2xl border-[3px] border-f2e-gold shadow-[0_4px_0_#F57F17] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 bg-f2e-gold text-black text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">Premium</div>
                        <div className="text-4xl mb-4">🟡</div>
                        <h4 className="text-xl font-black uppercase tracking-wide mb-2">GOLD</h4>
                        <p className="text-xs font-bold text-[#8D6E63] leading-relaxed">
                            The wealth standard. Required for high-value animals and estate upgrades. Scarcity driven.
                        </p>
                    </div>

                    {/* F2E */}
                    <div className="bg-[#3E2723] p-6 rounded-2xl border-[3px] border-[#5D4037] shadow-[0_4px_0_#1A1A1A] relative overflow-hidden text-white group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 bg-[#FF5252] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase">Governance</div>
                        <div className="text-4xl mb-4">⚡</div>
                        <h4 className="text-xl font-black uppercase tracking-wide mb-2">$F2E</h4>
                        <p className="text-xs font-bold text-white/70 leading-relaxed">
                            Ownership layer. Staking, voting, and marketplace currency. TGE Pending.
                        </p>
                    </div>
                </div>
            </section>

            {/* Gameplay Mechanics */}
            <section className="bg-[#FFF8E1] p-8 rounded-2xl border-[3px] border-[#8D6E63] shadow-[0_4px_0_#5D4037]">
                <h3 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                    <span className="text-3xl">🌾</span> Core Mechanics
                </h3>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-[#8D6E63] text-white w-8 h-8 rounded-lg flex items-center justify-center font-black shrink-0">1</div>
                        <div>
                            <h5 className="font-black uppercase text-[#5D4037]">Farming Loop</h5>
                            <p className="text-sm font-bold text-[#8D6E63]">Unlock plots. Plant crops. Water for 1.6x boost. Harvest for XP & Loot.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-[#8D6E63] text-white w-8 h-8 rounded-lg flex items-center justify-center font-black shrink-0">2</div>
                        <div>
                            <h5 className="font-black uppercase text-[#5D4037]">Ranching</h5>
                            <p className="text-sm font-bold text-[#8D6E63]">Passive income. Animals don't wither. High cost, consistent yield.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-[#8D6E63] text-white w-8 h-8 rounded-lg flex items-center justify-center font-black shrink-0">3</div>
                        <div>
                            <h5 className="font-black uppercase text-[#5D4037]">Estate Levels</h5>
                            <p className="text-sm font-bold text-[#8D6E63]">Upgrade your house to multiply global yield from 1.0x up to 5.0x.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Web3 */}
            <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C] p-8 rounded-2xl border-[3px] border-[#5D4037] shadow-[0_4px_0_#000] text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-3 text-f2e-gold">
                        <span className="text-3xl">🔗</span> Web3 Integration
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-black uppercase text-sm text-white/50 mb-2">Hybrid Payments</h4>
                            <p className="text-sm font-bold leading-relaxed">
                                Pay with <span className="text-[#8D6E63] bg-white px-1 rounded text-xs">ZEN</span> grind OR fast-track with <span className="text-black bg-f2e-gold px-1 rounded text-xs">SOL</span>. Instantly unlock later game content.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-black uppercase text-sm text-white/50 mb-2">Security</h4>
                            <p className="text-sm font-bold leading-relaxed">
                                Non-custodial. We use standard Solana instructions. Assets are verified on-chain.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-8 opacity-50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8D6E63]">Farm2Earn • Cultivate Your Future</p>
            </div>

        </div>
    );
};

export default GitbookView;
