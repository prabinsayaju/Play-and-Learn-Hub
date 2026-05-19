import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Trash2, Settings2 } from 'lucide-react';
import { useAppStore } from '../store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { difficulty, setDifficulty, resetProgress, stars } = useAppStore();
  const currentStars = stars[difficulty];

  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) {
    if (showConfirm) setShowConfirm(false);
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Settings2 className="w-7 h-7 text-[var(--color-fun-purple)]" />
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Settings Content */}
          <div className="space-y-6">
            {/* Difficulty Setting */}
            <div>
              <label className="block text-xl font-bold text-gray-800 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-3 px-2 rounded-xl text-lg font-bold capitalize border-4 transition-all ${
                      difficulty === diff
                        ? 'border-[var(--color-fun-purple)] bg-purple-50 text-[var(--color-fun-purple)]'
                        : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Stats */}
            <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Total Output</p>
                  <p className="text-2xl font-black text-gray-800">{currentStars} Stars</p>
                </div>
              </div>
            </div>

            {/* Reset Progress */}
            <div className="pt-4 border-t-2 border-gray-100">
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-red-100 hover:bg-red-200 text-red-600 rounded-2xl font-bold text-lg border-b-4 border-red-300 active:border-b-0 active:translate-y-1 transition-all"
                >
                  <Trash2 className="w-6 h-6" />
                  Reset All Progress
                </button>
              ) : (
                <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                  <p className="text-red-800 font-bold mb-3 text-center text-sm md:text-base">
                    Are you sure? This cannot be undone!
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        resetProgress();
                        setShowConfirm(false);
                        onClose();
                      }}
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-[0_4px_0_0_#991B1B] active:translate-y-1 active:shadow-none transition-all"
                    >
                      Yes, Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
