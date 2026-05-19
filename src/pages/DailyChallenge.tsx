import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store';
import { soundManager } from '../lib/sounds';

function generateProblem(usedQuestions: Set<string> = new Set()) {
  const ops = ['+', '-', '*'];
  let attempt = 0;
  let num1 = 0, num2 = 0, op = '+', answer = 0, qString = '';
  
  do {
    op = ops[Math.floor(Math.random() * ops.length)];
    let max = op === '*' ? 6 : 15;
    num1 = Math.floor(Math.random() * max) + 2;
    num2 = Math.floor(Math.random() * max) + 2;

    if (op === '-' && num1 < num2) {
      const temp = num1;
      num1 = num2;
      num2 = temp;
    }

    if (op === '+') answer = num1 + num2;
    else if (op === '-') answer = num1 - num2;
    else if (op === '*') answer = num1 * num2;
    
    qString = `${num1}${op}${num2}`;
    attempt++;
  } while(usedQuestions.has(qString) && attempt < 50);

  const options = new Set<number>();
  options.add(answer);
  while (options.size < 4) {
    let wrong = answer + (Math.floor(Math.random() * 11) - 5);
    if (wrong === answer) continue;
    if (wrong < 0) wrong = Math.abs(wrong) + 1;
    options.add(wrong);
  }

  return { num1, num2, op, answer, options: Array.from(options).sort(() => Math.random() - 0.5) };
}

export default function DailyChallenge() {
  const navigate = useNavigate();
  const { addStars, completeDailyChallenge, lastDailyChallengeDate, difficulty } = useAppStore();
  const usedQuestionsRef = React.useRef<Set<string>>(new Set());

  const [problem, setProblem] = useState(() => {
    const p = generateProblem(usedQuestionsRef.current);
    usedQuestionsRef.current.add(`${p.num1}${p.op}${p.num2}`);
    return p;
  });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [progress, setProgress] = useState(0); 
  const [gameComplete, setGameComplete] = useState(false);
  const winTarget = 5;

  const timeLimit = difficulty === 'hard' ? 10 : difficulty === 'medium' ? 20 : 30;
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const today = new Date().toISOString().split('T')[0];
  const isAlreadyCompleted = lastDailyChallengeDate === today;

  useEffect(() => {
    if (gameComplete || feedback || isAlreadyCompleted) return;
    
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameComplete, feedback, isAlreadyCompleted]);

  const handleAnswer = (answer: number | null) => {
    if (feedback || gameComplete) return;
    
    if (answer === problem.answer) {
      soundManager.playCorrect();
      setFeedback('correct');
      const nextProgress = progress + 1;
      setProgress(nextProgress);
      
      if (nextProgress >= winTarget) {
        soundManager.playLevelComplete();
        addStars(50); // Big bonus!
        completeDailyChallenge();
        setGameComplete(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#FFD166', '#EF476F', '#06D6A0', '#118AB2']
        });
      } else {
        addStars(5);
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        setTimeout(nextQuestion, 1000);
      }
    } else {
      soundManager.playWrong();
      setFeedback(answer === null ? 'timeout' : 'wrong');
      setTimeout(nextQuestion, 1200);
    }
  };

  const nextQuestion = () => {
    const p = generateProblem(usedQuestionsRef.current);
    usedQuestionsRef.current.add(`${p.num1}${p.op}${p.num2}`);
    setProblem(p);
    setFeedback(null);
    setTimeLeft(timeLimit);
  };

  if (isAlreadyCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h2 className="text-4xl font-bold text-[var(--color-fun-navy)] mb-4">Daily Challenge Complete!</h2>
        <p className="text-xl text-slate-600 mb-8">Great job! Come back tomorrow for another challenge and more bonus stars.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[var(--color-fun-blue)] text-white text-xl px-8 py-4 rounded-full font-bold shadow-[0_6px_0_0_#0B5D7A] active:translate-y-1 active:shadow-none transition-all"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 md:p-12 max-w-4xl mx-auto">
      <div className="w-full max-w-2xl bg-slate-200 rounded-full h-4 md:h-5 mb-4 border border-slate-300 overflow-hidden relative shadow-inner mt-2">
        <div 
          className="bg-[var(--color-fun-green)] h-full transition-all duration-500 ease-out absolute left-0 top-0 shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]"
          style={{ width: `${(progress / winTarget) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between w-full max-w-2xl mb-4 md:mb-6 px-2">
        <div className="bg-[var(--color-fun-purple)] text-white px-6 py-2 rounded-full font-bold text-lg md:text-xl shadow-[0_4px_0_0_#7B0E6C]">
          Daily Challenge
        </div>
        <div className="flex gap-2">
          <div className="bg-[var(--color-fun-blue)] text-white px-6 py-2 rounded-full font-bold text-lg md:text-xl shadow-[0_4px_0_0_#0B5D7A]">
            {progress}/{winTarget}
          </div>
          <div className={`px-6 py-2 rounded-full font-bold text-lg md:text-xl shadow-[0_4px_0_0_#A81C3F] ${timeLeft <= 3 ? 'bg-red-500 animate-pulse text-white' : 'bg-[var(--color-fun-red)] text-white'}`}>
            0:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_0_0_#CBD5E1] w-full max-w-2xl text-center mb-8 relative">
        <h2 className="text-2xl font-bold text-slate-400 mb-6 uppercase tracking-wider mt-2">Solve this quickly!</h2>
        <div className="text-6xl md:text-8xl font-black text-[var(--color-fun-navy)] py-8 tracking-widest break-all">
          {problem.num1} {problem.op} {problem.num2}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
        {problem.options.map((option, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(option)}
            disabled={feedback !== null}
            className="bg-[var(--color-fun-blue)] text-white text-4xl md:text-5xl font-bold py-6 md:py-8 rounded-3xl shadow-[0_6px_0_0_#0B5D7A] active:shadow-none active:translate-y-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {option}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === 'correct' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-green-500 text-white text-5xl md:text-6xl font-bold px-12 py-6 rounded-full shadow-2xl rotate-12 drop-shadow-xl border-4 border-white">
              Super!
            </div>
          </motion.div>
        )}

        {feedback === 'wrong' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-red-500 text-white text-5xl md:text-6xl font-bold px-12 py-6 rounded-full shadow-2xl -rotate-12 drop-shadow-xl border-4 border-white">
              Oops!
            </div>
          </motion.div>
        )}

        {feedback === 'timeout' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-red-500 text-white text-5xl md:text-6xl font-bold px-12 py-6 rounded-full shadow-2xl rotate-6 drop-shadow-xl border-4 border-white">
              Time's Up!
            </div>
          </motion.div>
        )}

        {gameComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-lg w-full shadow-2xl border-8 border-[var(--color-fun-yellow)]">
              <div className="text-6xl md:text-8xl mb-6 flex justify-center gap-4">
                 🌟🔥🌟
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--color-fun-navy)] mb-4 leading-tight">
                Challenge Complete!
              </h2>
              <p className="text-xl md:text-2xl font-bold text-[var(--color-fun-green)] mb-8">
                +50 Bonus Stars!
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => navigate('/')}
                  className="bg-[var(--color-fun-purple)] text-white text-xl md:text-2xl font-bold px-8 py-4 rounded-full shadow-[0_6px_0_0_#7B0E6C] active:translate-y-1 active:shadow-none transition-all"
                >
                  Awesome!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
