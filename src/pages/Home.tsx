import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Brain, BookOpen, LibraryBig, Flame, SpellCheck, Puzzle } from 'lucide-react';
import { useAppStore } from '../store';

export default function Home() {
  const navigate = useNavigate();
  const { lastDailyChallengeDate } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const isDailyCompleted = lastDailyChallengeDate === today;

  const games = [
    {
      id: 'add-sub',
      title: 'Add & Subtract',
      description: 'Addition & subtraction!',
      icon: Calculator,
      color: 'bg-[var(--color-fun-red)]',
      shadow: 'shadow-[0_8px_0_0_#A81C3F]', 
      path: '/levels/add-sub'
    },
    {
      id: 'multiply',
      title: 'Multiplication',
      description: 'Learn to multiply!',
      icon: Calculator,
      color: 'bg-orange-500',
      shadow: 'shadow-[0_8px_0_0_#C2410C]', 
      path: '/levels/multiply'
    },
    {
      id: 'divide',
      title: 'Division',
      description: 'Learn to divide!',
      icon: Calculator,
      color: 'bg-teal-500',
      shadow: 'shadow-[0_8px_0_0_#0F766E]', 
      path: '/levels/divide'
    },
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Find the pairs!',
      icon: Brain,
      color: 'bg-[var(--color-fun-blue)]',
      shadow: 'shadow-[0_8px_0_0_#0B5D7A]',
      path: '/levels/memory'
    },
    {
      id: 'quiz',
      title: 'Quiz Hero',
      description: 'Fun trivia!',
      icon: LibraryBig,
      color: 'bg-[var(--color-fun-green)]',
      shadow: 'shadow-[0_8px_0_0_#04936D]',
      path: '/levels/quiz'
    },
    {
      id: 'nepali',
      title: 'Nepali',
      description: 'नेपाली सिक्नुहोस्',
      icon: BookOpen,
      color: 'bg-[var(--color-fun-yellow)]',
      shadow: 'shadow-[0_8px_0_0_#D4A017]',
      path: '/levels/nepali'
    },
    {
      id: 'spelling',
      title: 'Spelling Bee',
      description: 'Spell the words!',
      icon: SpellCheck,
      color: 'bg-violet-500',
      shadow: 'shadow-[0_8px_0_0_#5B21B6]',
      path: '/levels/spelling'
    },
    {
      id: 'logic',
      title: 'Logic Puzzles',
      description: 'Think brainy!',
      icon: Puzzle,
      color: 'bg-pink-500',
      shadow: 'shadow-[0_8px_0_0_#BE185D]',
      path: '/levels/logic'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12 max-w-6xl mx-auto min-h-[70vh]">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-[var(--color-fun-navy)]">
          Play <span className="text-[var(--color-fun-red)]">&</span> Learn
        </h1>
        <p className="text-xl md:text-2xl text-[var(--color-fun-navy)]/70 mt-3 font-medium">Choose a game to play!</p>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-5xl mb-8"
      >
        <motion.button
          onClick={() => navigate('/daily')}
          whileHover={{ scale: 1.02, y: -4, transition: { type: "spring", bounce: 0.5 } }}
          whileTap={{ scale: 0.98, y: 4, boxShadow: '0 0px 0 0 transparent' }}
          className={`w-full ${isDailyCompleted ? 'bg-slate-300 shadow-[0_6px_0_0_#94A3B8]' : 'bg-[var(--color-fun-purple)] shadow-[0_6px_0_0_#7B0E6C]'} rounded-3xl p-6 md:p-8 flex items-center justify-between text-white relative overflow-hidden group transition-colors text-left`}
        >
          <div className="flex items-center gap-6 relative z-10">
            <div className={`p-4 rounded-2xl ${isDailyCompleted ? 'bg-slate-400' : 'bg-white/20 backdrop-blur-sm'}`}>
              <Flame className={`w-10 h-10 md:w-12 md:h-12 ${isDailyCompleted ? 'text-slate-200' : 'text-yellow-300'}`} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                {isDailyCompleted ? 'Daily Challenge Complete!' : 'Daily Challenge'}
              </h2>
              <p className="text-lg md:text-xl font-medium opacity-90">
                {isDailyCompleted ? "You've earned your bonus stars today!" : 'Complete a quick puzzle for +50 Bonus Stars!'}
              </p>
            </div>
          </div>
          
          {!isDailyCompleted && (
            <div className="hidden md:flex bg-white text-[var(--color-fun-purple)] font-bold px-6 py-3 rounded-full text-lg shadow-sm relative z-10">
              Play Now
            </div>
          )}
          
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-700" />
        </motion.button>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {games.map((game, i) => {
          const Icon = game.icon;
          return (
            <motion.button
              key={game.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
              whileHover={{ scale: 1.05, y: -6, transition: { type: "spring", bounce: 0.5 } }}
              whileTap={{ scale: 0.95, y: 8, boxShadow: '0 0px 0 0 transparent' }}
              onClick={() => game.path !== '#' && navigate(game.path)}
              className={`${game.color} ${game.shadow} rounded-3xl p-8 flex flex-col items-center text-center text-white relative overflow-hidden group transition-colors cursor-pointer`}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500" />
              
              <div className="bg-white/20 p-6 rounded-3xl mb-6 backdrop-blur-sm">
                <Icon className="w-16 h-16 md:w-20 md:h-20" strokeWidth={2.5} />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{game.title}</h2>
              <p className="text-lg md:text-xl font-medium opacity-90">{game.description}</p>
              
              {game.path === '#' && (
                <div className="absolute top-4 right-4 bg-white/30 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm text-white">
                  Soon!
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  );
}
