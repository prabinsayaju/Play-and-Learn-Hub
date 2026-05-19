import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock } from 'lucide-react';
import { useAppStore } from '../store';

const LEVELS_PER_GRADE = 50;
const GRADES = [1, 2, 3, 4, 5];

export default function LevelSelect() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const unlockedLevels = useAppStore(state => state.unlockedLevels);
  const difficulty = useAppStore(state => state.difficulty);
  const setDifficulty = useAppStore(state => state.setDifficulty);
  
  const [activeGrade, setActiveGrade] = useState(1);

  if (!gameId) return null;

  const key = `${gameId}_${activeGrade}_${difficulty}`;
  const currentUnlocked = unlockedLevels[key] || 1;

  const gameColors: Record<string, string> = {
    'add-sub': 'var(--color-fun-red)',
    'multiply': '#F97316',
    'divide': '#14B8A6',
    memory: 'var(--color-fun-blue)',
    quiz: 'var(--color-fun-green)',
    nepali: 'var(--color-fun-yellow)',
    spelling: '#8B5CF6',
    logic: '#EC4899',
  };
  
  const shadowColors: Record<string, string> = {
    'add-sub': '#A81C3F',
    'multiply': '#C2410C',
    'divide': '#0F766E',
    memory: '#0B5D7A',
    quiz: '#04936D',
    nepali: '#D4A017',
    spelling: '#5B21B6',
    logic: '#BE185D',
  };

  const gameColor = gameColors[gameId] || 'var(--color-fun-purple)';
  const shadowColor = shadowColors[gameId] || '#7B0E6C';

  const titleMap: Record<string, string> = {
    'add-sub': 'Addition & Subtraction',
    'multiply': 'Multiplication',
    'divide': 'Division',
    memory: 'Memory Match',
    quiz: 'Quiz Hero',
    nepali: 'Nepali (नेपाली)',
    spelling: 'Spelling Bee',
    logic: 'Logic Puzzles'
  };

  const levels = Array.from({ length: LEVELS_PER_GRADE }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center p-6 md:p-12 max-w-6xl mx-auto min-h-[70vh]">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 w-full"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-fun-navy)] mb-2">
          {titleMap[gameId] || 'Level Select'}
        </h1>
        <p className="text-lg text-[var(--color-fun-navy)]/60 font-medium">Select a level to play!</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 w-full max-w-4xl">
        {GRADES.map((grade) => (
          <button
            key={grade}
            onClick={() => setActiveGrade(grade)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeGrade === grade 
                ? 'bg-[var(--color-fun-navy)] text-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)]'
                : 'bg-white text-[var(--color-fun-navy)] hover:bg-slate-50 border-2 border-slate-200'
            }`}
          >
            Grade {grade}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-8 w-full max-w-4xl">
        {(['easy', 'medium', 'hard'] as const).map((diff) => (
          <button
            key={diff}
            onClick={() => setDifficulty(diff)}
            className={`px-6 py-2 rounded-full font-bold transition-all capitalize ${
              difficulty === diff
                ? 'bg-[var(--color-fun-purple)] text-white shadow-[0_4px_0_0_#7B0E6C]'
                : 'bg-white text-[var(--color-fun-purple)] hover:bg-slate-50 border-2 border-[var(--color-fun-purple)]'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeGrade}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4 w-full"
        >
          {levels.map((level, i) => {
            const isUnlocked = level <= currentUnlocked;

            return (
              <motion.button
                key={`${activeGrade}-${level}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: (i % 20) * 0.02 }}
                whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
                whileTap={isUnlocked ? { scale: 0.95, y: 4, boxShadow: '0 0px 0 0 transparent' } : {}}
                onClick={() => isUnlocked && navigate(`/${gameId}/${activeGrade}/${level}`)}
                disabled={!isUnlocked}
                style={{
                  backgroundColor: isUnlocked ? gameColor : '#E2E8F0',
                  boxShadow: isUnlocked ? `0 4px 0 0 ${shadowColor}` : '0 4px 0 0 #CBD5E1',
                  color: isUnlocked ? 'white' : '#94A3B8'
                }}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center p-2 relative transition-colors duration-200
                  ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
              >
                {!isUnlocked ? (
                  <Lock className="w-6 h-6 opacity-50" strokeWidth={2.5} />
                ) : (
                  <span className="text-2xl font-bold">{level}</span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
