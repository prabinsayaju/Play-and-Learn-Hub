import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, ArrowLeft, Settings } from 'lucide-react';
import { useAppStore } from '../store';
import { motion } from 'motion/react';
import ParentalGate from './ParentalGate';
import SettingsModal from './SettingsModal';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const stars = useAppStore((state) => state.stars[state.difficulty]);
  const [showGate, setShowGate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isHome = location.pathname === '/';

  const handleSettingsClick = () => {
    setShowGate(true);
  };

  const handleGateSuccess = () => {
    setShowGate(false);
    setShowSettings(true);
  };

  return (
    <>
      <ParentalGate 
        isOpen={showGate} 
        onSuccess={handleGateSuccess} 
        onCancel={() => setShowGate(false)} 
      />
      
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <header className="sticky top-0 z-50 w-full px-4 py-4 md:px-8 md:py-6">
        <div className="mx-auto max-w-6xl w-full flex items-center justify-between">
          {!isHome ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white rounded-full text-[var(--color-fun-blue)] shadow-[0_4px_0_0_#CBD5E1] active:shadow-[0_0px_0_0_#CBD5E1] active:translate-y-1 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
            </motion.button>
          ) : (
            <div className="w-12 md:w-14"></div> // Spacer
          )}

          <div className="flex-1 text-center hidden md:block">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-fun-navy)] tracking-wide cursor-pointer" onClick={() => navigate('/')}>
              Play <span className="text-[var(--color-fun-red)]">&</span> Learn
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-[0_4px_0_0_#CBD5E1]"
            >
              <motion.div
                key={stars}
                initial={{ scale: 1.5, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 fill-yellow-500" />
              </motion.div>
              <span className="text-xl md:text-2xl font-bold text-[var(--color-fun-navy)]">{stars}</span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSettingsClick}
              className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white rounded-full text-[var(--color-fun-purple)] shadow-[0_4px_0_0_#CBD5E1] active:shadow-[0_0px_0_0_#CBD5E1] active:translate-y-1 transition-colors focus:outline-none"
              aria-label="Parents Settings"
            >
              <Settings className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </header>
    </>
  );
}
