import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store';
import { soundManager } from '../lib/sounds';

const EMOJIS = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", 
  "🐷", "🐸", "🐵", "🦄", "🐙", "🐢", "🐍", "🐳", "🐊", "🦖", "🦕", "🍎", 
  "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🍑", "🥭", "🍍", 
  "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🌽", "🥕", "🥔", 
  "🍔", "🍕", "🌭", "🥪", "🌮", "🌯", "🥙", "🍜", "🍝", "🍞", "🍩", "🍦"
];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const { grade, level } = useParams();
  const navigate = useNavigate();
  const gradeNum = parseInt(grade || '1', 10);
  const levelNum = parseInt(level || '1', 10);
  const difficulty = useAppStore(state => state.difficulty);

  // Difficulty scaling based on grade and level smoothly
  let absLevel = (gradeNum - 1) * 50 + levelNum;
  if (difficulty === 'easy') absLevel = Math.max(1, Math.floor(absLevel * 0.5));
  if (difficulty === 'hard') absLevel = Math.floor(absLevel * 1.5);
  
  // Start with 3 pairs, add 1 pair every 8 absolute levels. Max is 30 pairs.
  let MAX_PAIRS = Math.min(3 + Math.floor(absLevel / 8), 30);
  if (difficulty === 'easy') MAX_PAIRS = Math.max(2, MAX_PAIRS - 1);
  if (difficulty === 'hard') MAX_PAIRS = Math.min(30, MAX_PAIRS + 2);

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  
  const { addStars, completeLevel } = useAppStore();

  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeNum, levelNum]);

  useEffect(() => {
    if (matches > 0 && matches === MAX_PAIRS) {
      winLevel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matches, MAX_PAIRS]);

  const startNewGame = () => {
    const shuffledEmojis = [...EMOJIS].sort(() => Math.random() - 0.5);
    const selected = shuffledEmojis.slice(0, MAX_PAIRS);
    const duplicated = [...selected, ...selected];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffled);
    setFlippedIds([]);
    setIsLocked(false);
    setMoves(0);
    setMatches(0);
    setLevelComplete(false);
  };

  const handleCardClick = (id: number) => {
    if (isLocked || levelComplete) return;
    if (flippedIds.includes(id)) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isMatched) return;

    const newFlippedIds = [...flippedIds, id];
    setFlippedIds(newFlippedIds);
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    if (newFlippedIds.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);

      const card1 = cards.find(c => c.id === newFlippedIds[0])!;
      const card2 = cards.find(c => c.id === newFlippedIds[1])!;

      if (card1.emoji === card2.emoji) {
        soundManager.playCorrect();
        // Match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlippedIds.includes(c.id) ? { ...c, isMatched: true } : c
          ));
          setFlippedIds([]);
          setIsLocked(false);
          setMatches(m => m + 1);
        }, 500);
      } else {
        soundManager.playWrong();
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            newFlippedIds.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedIds([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  const winLevel = () => {
    soundManager.playLevelComplete();
    setLevelComplete(true);
    addStars(15);
    completeLevel('memory', gradeNum, levelNum);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFD166', '#EF476F', '#06D6A0', '#118AB2', '#B5179E']
    });
  };

  // Determine grid layout
  const totalCards = MAX_PAIRS * 2;
  let gridColsClasses = 'grid-cols-3 sm:grid-cols-4';
  if (totalCards > 40) gridColsClasses = 'grid-cols-6 sm:grid-cols-8';
  else if (totalCards > 30) gridColsClasses = 'grid-cols-5 sm:grid-cols-6';
  else if (totalCards > 20) gridColsClasses = 'grid-cols-4 sm:grid-cols-5';
  else if (totalCards > 12) gridColsClasses = 'grid-cols-4 sm:grid-cols-5';
  
  let emojiClasses = 'text-4xl md:text-6xl';
  if (totalCards > 40) emojiClasses = 'text-xl md:text-3xl';
  else if (totalCards > 20) emojiClasses = 'text-2xl md:text-4xl';
  else if (totalCards > 12) emojiClasses = 'text-3xl md:text-5xl';

  return (
    <div className="flex flex-col items-center p-4 md:p-8 max-w-4xl mx-auto">
      <div className="w-full max-w-2xl bg-slate-200 rounded-full h-4 md:h-5 mb-4 border border-slate-300 overflow-hidden relative shadow-inner mt-2">
        <div 
          className="bg-[var(--color-fun-green)] h-full transition-all duration-500 ease-out absolute left-0 top-0 shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]"
          style={{ width: `${(matches / MAX_PAIRS) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between w-full max-w-2xl mb-8 px-2">
        <div className="bg-[var(--color-fun-yellow)] text-[var(--color-fun-navy)] px-6 py-2 rounded-full font-bold text-lg md:text-xl shadow-[0_4px_0_0_#D4A017]">
          Grade {gradeNum} / Level {levelNum}
        </div>
        <div className="bg-[var(--color-fun-blue)] text-white px-6 py-2 rounded-full font-bold text-lg md:text-xl shadow-[0_4px_0_0_#0B5D7A]">
          Moves: {moves}
        </div>
        <button 
          onClick={startNewGame}
          className="bg-[var(--color-fun-purple)] text-white px-6 py-2 rounded-full font-bold text-lg md:text-xl shadow-[0_4px_0_0_#7B0E6C] active:translate-y-1 active:shadow-[0_0px_0_0_#7B0E6C]"
        >
          Restart
        </button>
      </div>

      <div className={`grid ${gridColsClasses} gap-3 md:gap-4 w-full max-w-2xl`}>
        {cards.map((card) => (
          <motion.button
            key={card.id}
            whileHover={!card.isMatched && !card.isFlipped ? { scale: 1.05 } : {}}
            whileTap={!card.isMatched && !card.isFlipped ? { scale: 0.95 } : {}}
            animate={card.isMatched ? { y: 8, filter: "grayscale(100%)", opacity: 0.5, scale: 1 } : { y: 0, filter: "grayscale(0%)", opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-2xl cursor-pointer relative preserve-3d shadow-[0_6px_0_0_#CBD5E1] border-2 border-slate-100 ${
              card.isMatched ? 'shadow-none' : ''
            }`}
          >
            <div className={`w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 ${card.isFlipped || card.isMatched ? 'bg-white' : 'bg-[var(--color-fun-blue)]'}`}>
              { (card.isFlipped || card.isMatched) ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={emojiClasses}
                >
                  {card.emoji}
                </motion.div>
              ) : (
                <div className="w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIiBmaWxsPSIjZmZmZmZmIj48L2NpcmNsZT4KPC9zdmc+')]"/>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {levelComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white text-[var(--color-fun-navy)] text-3xl md:text-5xl font-bold px-8 md:px-12 py-8 md:py-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-8 border-[var(--color-fun-yellow)] pointer-events-auto text-center mx-4">
              Wow! Level {levelNum} Beaten! 
              <span className="text-[var(--color-fun-yellow)] drop-shadow-md">+15 Stars ⭐</span>
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => navigate('/levels/memory')}
                  className="bg-slate-200 text-slate-700 text-lg md:text-xl px-6 py-3 md:px-8 md:py-4 rounded-full shadow-[0_6px_0_0_#CBD5E1] active:translate-y-1 active:shadow-none transition-all"
                >
                  Levels
                </button>
                <button 
                  onClick={() => navigate(`/memory/${gradeNum}/${levelNum + 1}`)}
                  className="bg-[var(--color-fun-green)] text-white text-lg md:text-xl px-6 py-3 md:px-8 md:py-4 rounded-full shadow-[0_6px_0_0_#04936D] active:translate-y-1 active:shadow-none transition-all"
                >
                  Next Level
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
