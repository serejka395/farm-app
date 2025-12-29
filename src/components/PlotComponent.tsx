import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plot, CropType, ToolType } from '../types';
import { CROPS, WATER_GROWTH_BOOST_BASE } from '../utils/constants';
import { security } from '../api/securityService';
import { useLanguage } from '../contexts/LanguageContext';

interface PlotComponentProps {
  plot: Plot;
  activeTool: ToolType;
  selectedSeed: CropType | null;
  onAction: (plotId: number) => void;
  onUnlock: (plotId: number) => void;
  growthMultiplier: number;
  waterBoostMultiplier: number;
}

const PlotComponent: React.FC<PlotComponentProps> = ({
  plot, activeTool, selectedSeed, onAction, onUnlock, growthMultiplier, waterBoostMultiplier
}) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const { language, t } = useLanguage();

  // --- Growth Logic ---
  useEffect(() => {
    let interval: number;
    if (plot.crop && plot.plantedAt) {
      const crop = CROPS[plot.crop];
      const update = () => {
        const now = security.getServerNow();
        const waterBoost = plot.isWatered ? (WATER_GROWTH_BOOST_BASE + waterBoostMultiplier) : 1;
        const totalDuration = crop.growthTime / growthMultiplier;
        const elapsed = (now - plot.plantedAt!) / 1000;
        const p = Math.min(100, (elapsed * waterBoost / totalDuration) * 100);

        setProgress(p);
        setIsReady(p >= 100);
        if (p >= 100) clearInterval(interval);
      };
      update();
      interval = window.setInterval(update, 1000);
    } else {
      setProgress(0);
      setIsReady(false);
    }
    return () => clearInterval(interval);
  }, [plot.crop, plot.plantedAt, plot.isWatered, growthMultiplier, waterBoostMultiplier]);

  const handlePlotClick = () => {
    onAction(plot.id);
  };

  // --- Render: Locked State ---
  if (!plot.isUnlocked) return (
    <motion.div
      whileHover={{ scale: 0.95, opacity: 0.8 }}
      onClick={() => onUnlock(plot.id)}
      className="aspect-square bg-white/10 backdrop-blur-[2px] border border-white/10 border-dashed rounded-xl flex flex-col items-center justify-center opacity-70 cursor-pointer group hover:border-f2e-gold/50 hover:bg-white/20 transition-all"
    >
      <i className="fas fa-lock text-white/30 mb-2 text-xl group-hover:text-f2e-gold transition-colors"></i>
      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-f2e-gold transition-colors">{t('unlock')}</span>
    </motion.div>
  );

  // --- Render: Main Plot ---
  return (
    <div className="w-full aspect-square relative">
      {/* 1. Base Layer: Dirt Plot (Relative to hold space) */}
      <div
        onClick={handlePlotClick}
        className={`w-full h-full relative cursor-pointer flex items-center justify-center rounded-xl border-[6px] shadow-[0_5px_10px_rgba(0,0,0,0.6)] transition-all duration-300 ${plot.isWatered
          ? 'bg-blue-900/40 border-[#8B4513] shadow-[inset_0_0_20px_rgba(59,130,246,0.5)]'
          : 'bg-black/40 border-[#5D4037] hover:border-[#6D4C41] hover:bg-black/50'
          }`}
      >
        {/* Empty State Indicator */}
        {!plot.crop && (
          <div className="text-4xl text-white/30 font-black pointer-events-none select-none">+</div>
        )}
      </div>

      {/* 2. Crop Layer: Stacked via Grid Centering */}
      {/* Using Grid place-items-center is the most robust centering method */}
      <div className="absolute inset-0 pointer-events-none z-10 grid place-items-center">
        <AnimatePresence mode="wait">
          {plot.crop && (
            <motion.div
              key={plot.plantedAt}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              // Wrapper is strictly limited size, centered by parent Grid
              className="relative w-[75%] h-[75%] flex items-center justify-center"
            >
              {/* Glow */}
              {isReady && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-f2e-gold/40 blur-[25px] rounded-full scale-125"
                />
              )}

              {/* Image */}
              <motion.div
                className="w-full h-full flex items-center justify-center"
                animate={!isReady ? {
                  scale: 0.5 + (progress / 100) * 0.5,
                } : {
                  scale: [1, 1.05, 1],
                  transition: { repeat: Infinity, duration: 2 }
                }}
              >
                {CROPS[plot.crop].emoji.startsWith('/') ? (
                  <img
                    src={CROPS[plot.crop].emoji}
                    className="w-full h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                    alt="Crop"
                  />
                ) : (
                  <span className="text-6xl drop-shadow-md">{CROPS[plot.crop].emoji}</span>
                )}
              </motion.div>

              {/* Ready Badge - Absolute to this centered wrapper */}
              {isReady && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/80 text-f2e-gold text-[9px] font-black px-2 py-0.5 rounded border border-f2e-gold/50 shadow-sm whitespace-nowrap z-30">
                  READY
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. UI Layer: Controls (Absolute Layout) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Progress Bar (Bottom Center) */}
        {plot.crop && !isReady && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-f2e-gold rounded-full"
            />
          </div>
        )}

        {/* Harvest Button (Bottom Center) */}
        {isReady && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto">
            <motion.button
              initial={{ scale: 0, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onAction(plot.id);
              }}
              className="bg-f2e-gold text-black text-[10px] font-black px-4 py-1.5 rounded-lg shadow-lg uppercase tracking-widest hover:bg-white transition-colors"
            >
              {t('getProfit')}
            </motion.button>
          </div>
        )}

        {/* Water Icon (Top Right) */}
        {plot.crop && !plot.isWatered && !isReady && (
          <div className="absolute top-2 right-2 text-blue-400 text-lg drop-shadow-[0_0_5px_rgba(59,130,246,0.8)] animate-pulse">
            <i className="fas fa-tint"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotComponent;