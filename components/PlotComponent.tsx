import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plot, CropType, ToolType } from '../types';
import { CROPS, WATER_GROWTH_BOOST_BASE } from '../constants';
import { security } from '../services/securityService';
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

const ParticleBurst: React.FC<{ color: string }> = ({ color }) => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            x: (Math.random() - 0.5) * 150,
            y: (Math.random() - 0.5) * 150,
            opacity: 0
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="particle-unit"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

const PlotComponent: React.FC<PlotComponentProps> = ({
  plot, activeTool, selectedSeed, onAction, onUnlock, growthMultiplier, waterBoostMultiplier
}) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const { language, t } = useLanguage();

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
    if (isReady) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 800);
    }
    onAction(plot.id);
  };

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

  return (
    <div className="relative aspect-square flex items-center justify-center overflow-visible">
      {/* Visual Dirt Plot - Farm2Earn Edition */}
      <motion.div
        id={`plot-${plot.id}`}
        whileTap={{ scale: 0.95 }}
        onClick={handlePlotClick}
        className="absolute w-full h-full cursor-pointer flex items-center justify-center overflow-visible group"
      >
        {/* 3D Plot Base */}
        <img
          src="/assets/cartoon_plot.png"
          alt="Soil"
          className={`w-[110%] h-[110%] max-w-none object-contain transition-all duration-300 ${plot.isWatered ? 'filter brightness-90 contrast-125 saturate-125' : 'filter brightness-100 hover:brightness-110'} drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]`}
        />

        {/* Highlight for interactivity */}
        <div className="absolute inset-0 m-auto w-[60%] h-[60%] rounded-full bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none" />

        <AnimatePresence mode="wait">
          {!plot.crop && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.5, y: -10 }} className="absolute z-10 text-3xl text-white/20 font-black pointer-events-none">+</motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Growing Crop */}
      <div className="relative pointer-events-none z-10 w-full h-full flex items-center justify-center">
        <AnimatePresence>
          {plot.crop && (
            <motion.div
              key={plot.plantedAt}
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isReady ? {
                  scale: [1, 1.1, 1],
                  filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                } : {
                  scale: 0.4 + (progress / 100) * 0.6,
                }}
                transition={isReady ? {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                } : {
                  type: 'spring',
                  stiffness: 100
                }}
                className="w-[90%] h-[90%] flex items-center justify-center select-none group relative"
              >
                {isReady && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-f2e-gold/20 blur-[20px] rounded-full"
                  />
                )}

                {(() => {
                  const emoji = CROPS[plot.crop!].emoji;
                  if (!isReady) {
                    return progress < 30 ? '🌱' : progress < 70 ? '🌿' : (
                      emoji.startsWith('/') ?
                        <img
                          src={emoji}
                          className="w-full h-full object-contain opacity-80 grayscale-[0.3]"
                        /> : emoji
                    );
                  }
                  return emoji.startsWith('/') ? (
                    <img
                      src={emoji}
                      className={`w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] ${['WHEAT', 'GARLIC', 'CARROT', 'WINTER_PEAS', 'CABBAGE', 'FROST_LETTUCE', 'TOMATO'].includes(plot.crop!) ? 'scale-[2.5] origin-top-left translate-x-3 translate-y-3' : ''}`}
                    />
                  ) : emoji;
                })()}

                {isReady && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-f2e-black px-4 py-1.5 rounded-lg text-[10px] font-black text-f2e-gold whitespace-nowrap border border-f2e-gold/30 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-xl z-50 pointer-events-none">
                    READY
                  </div>
                )}
              </motion.div>

              {!isReady && (
                <div className="absolute bottom-3 w-16 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-f2e-gold rounded-full" />
                </div>
              )}

              {isReady && (
                <motion.div
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAction.bind(null, plot.id)}
                  className="absolute bottom-3 bg-f2e-gold text-black text-[9px] font-black px-4 py-1.5 rounded-lg shadow-[0_5px_15px_rgba(255,193,7,0.3)] z-50 uppercase tracking-widest cursor-pointer pointer-events-auto hover:bg-yellow-400"
                >
                  {t('getProfit')}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showParticles && <ParticleBurst color="#FFC107" />}

      {/* Action Indicators */}
      {plot.crop && !plot.isWatered && !isReady && (
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute top-2 right-2 text-blue-400 text-xl z-20"
        >
          <i className="fas fa-tint drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]"></i>
        </motion.div>
      )}
    </div>
  );
};

export default PlotComponent;