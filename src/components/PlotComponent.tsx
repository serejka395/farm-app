import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plot, CropType, ToolType, CropData } from '../types';
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

// Sub-component for rendering the correct stage image
const StageImage: React.FC<{ crop: CropData; progress: number; isReady: boolean }> = ({ crop, progress, isReady }) => {
  if (isReady) {
    if (crop.image) {
      return (
        <motion.img
          src={crop.image}
          alt={crop.name.en}
          className="w-[85%] h-[85%] object-contain drop-shadow-md z-20"
          animate={{ scale: [1.1, 1.15, 1.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      );
    }
    return (
      <div className="text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] select-none animate-bounce-slow">
        {crop.emoji}
      </div>
    );
  }

  // Growing Stages
  const stageImage = progress < 30 ? '/assets/crops/stage_sprout.png' : '/assets/crops/stage_growing.png';

  return (
    <motion.img
      key={progress < 30 ? 'sprout' : 'growing'}
      src={stageImage}
      alt="Growing"
      className="w-3/5 h-3/5 object-contain opacity-90 mobile-visible-stage"
      initial={{ scale: 0.5, y: 10 }}
      animate={{ scale: 1, y: 0 }}
    />
  );
};

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
      whileHover={{ scale: 0.95, opacity: 1 }}
      onClick={(e) => { e.stopPropagation(); onUnlock(plot.id); }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] border-2 border-dashed border-white/30 rounded-xl cursor-pointer pointer-events-auto hover:bg-black/50 hover:border-f2e-gold transition-all"
    >
      <i className="fas fa-lock text-white/70 mb-2 text-2xl group-hover:text-f2e-gold transition-colors drop-shadow-md"></i>
      <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-f2e-gold transition-colors shadow-sm">{t('unlock')}</span>
    </motion.div>
  );

  // --- Render: Main Plot ---
  return (
    <div className="w-full aspect-square relative plot-container">
      {/* 1. Base Layer: Dirt Plot */}
      <div
        onClick={handlePlotClick}
        className={`w-full h-full relative cursor-pointer flex items-center justify-center rounded-xl border-[6px] shadow-[0_5px_10px_rgba(0,0,0,0.6)] transition-all duration-300 ${plot.isWatered
          ? 'bg-blue-50/90 border-[#8B4513] shadow-[inset_0_0_20px_rgba(59,130,246,0.3)]'
          : 'bg-white/90 border-[#D7CCC8] hover:border-[#A1887F]'
          }`}
      >
        {/* Empty State Indicator */}
        {!plot.crop && (
          <div className="text-4xl text-black/20 font-black pointer-events-none select-none">+</div>
        )}

        {/* 2. Crop Layer: STRICT CENTERING - Removed overflow-hidden from parent so this POPS OUT */}
        <AnimatePresence mode="wait">
          {plot.crop && CROPS[plot.crop] && (
            <motion.div
              key={plot.plantedAt ? `plant-${plot.plantedAt}` : 'empty'}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <StageImage
                crop={CROPS[plot.crop]}
                progress={progress}
                isReady={isReady}
              />

              {/* Ready Particles / Glow */}
              {isReady && (
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-f2e-gold/20 rounded-full blur-xl z-[-1]"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Helper UI (Progress, Button, Water) - Absolute positioned but separate from crop */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Water Icon (Top Right) */}
          {plot.crop && !plot.isWatered && !isReady && (
            <div className="absolute top-1 right-1 lg:top-2 lg:right-2 text-blue-400 text-xs lg:text-lg drop-shadow-[0_0_5px_rgba(59,130,246,0.8)] animate-pulse">
              <i className="fas fa-tint"></i>
            </div>
          )}

          {/* Harvest Button (Bottom Center) - Takes clicks */}
          {isReady && (
            <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-auto">
              <motion.button
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onAction(plot.id);
                }}
                className="bg-f2e-gold text-black text-[9px] lg:text-[10px] font-black px-2 py-1 lg:px-3 lg:py-1 rounded shadow-lg uppercase tracking-widest hover:bg-white transition-colors"
                style={{ zIndex: 50 }}
              >
                {t('getProfit')}
              </motion.button>
            </div>
          )}
        </div>

        {/* Progress Bar (Bottom) - Only if growing */}
        {plot.crop && !isReady && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1 lg:h-1.5 bg-black/50 rounded-full overflow-hidden border border-black/10">
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