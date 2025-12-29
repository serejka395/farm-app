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
      if (!crop) return;
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
      {/* 1. Base Layer: Dirt Plot */}
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

        {/* 2. Crop Layer: STRICT CENTERING */}
        <AnimatePresence mode="wait">
          {plot.crop && CROPS[plot.crop] && (
            <motion.div
              key={plot.plantedAt}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ scale: 0 }}
              animate={{
                scale: isReady
                  ? [1, 1.1, 1]
                  : 0.2 + (progress / 100) * 0.8
              }}
              transition={isReady
                ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
                : { type: "spring", stiffness: 100 }
              }
            >
              <div className="text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] select-none">
                {CROPS[plot.crop].emoji}
              </div>

              {/* Ready Particles / Glow */}
              {isReady && (
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-f2e-gold/20 rounded-full blur-xl"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Helper UI (Progress, Button, Water) - Absolute positioned but separate from crop */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Water Icon (Top Right) */}
          {plot.crop && !plot.isWatered && !isReady && (
            <div className="absolute top-2 right-2 text-blue-400 text-lg drop-shadow-[0_0_5px_rgba(59,130,246,0.8)] animate-pulse">
              <i className="fas fa-tint"></i>
            </div>
          )}

          {/* Harvest Button (Bottom Center) - Takes clicks */}
          {isReady && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-auto">
              <motion.button
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(plot.id);
                }}
                className="bg-f2e-gold text-black text-[10px] font-black px-3 py-1 rounded shadow-lg uppercase tracking-widest hover:bg-white transition-colors"
              >
                {t('getProfit')}
              </motion.button>
            </div>
          )}
        </div>

        {/* Progress Bar (Bottom) - Only if growing */}
        {plot.crop && !isReady && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
            <motion.div
              className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.5 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotComponent;