import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store';
import { soundManager } from '../lib/sounds';

function generateProblem(gameType: string, grade: number, levelNum: number, difficulty: string, usedQuestions: Set<string> = new Set()) {
  let ops = ['+'];
  if (gameType === 'add-sub') ops = ['+', '-'];
  if (gameType === 'multiply') ops = ['*'];
  if (gameType === 'divide') ops = ['/'];

  let op = '+', num1 = 0, num2 = 0, answer = 0, qStr = '';
  let attempt = 0;
  
  // Difficulty scales smoothly across absolute levels (1 to 250)
  let absLevel = (grade - 1) * 50 + levelNum;
  if (difficulty === 'easy') absLevel = Math.max(1, Math.floor(absLevel * 0.5));
  if (difficulty === 'hard') absLevel = Math.floor(absLevel * 1.5);
  
  let maxNum1 = 5;
  let maxNum2 = 5;

  do {
    op = ops[Math.floor(Math.random() * ops.length)];

    if (op === '+' || op === '-') {
        maxNum1 = 5 + Math.floor(absLevel * 0.8);
        maxNum2 = 5 + Math.floor(absLevel * 0.8);
    } else if (op === '*') {
        maxNum1 = 3 + Math.floor(absLevel * 0.15);
        maxNum2 = 3 + Math.floor(absLevel * 0.15);
    } else if (op === '/') {
        maxNum1 = 3 + Math.floor(absLevel * 0.15);
        maxNum2 = 3 + Math.floor(absLevel * 0.15);
    }

    num1 = Math.floor(Math.random() * maxNum1) + 1;
    num2 = Math.floor(Math.random() * maxNum2) + 1;

    if (op === '-' && num1 < num2) {
      const temp = num1;
      num1 = num2;
      num2 = temp;
    }

    if (op === '/') {
      // Make division clean
      const product = num1 * num2;
      num1 = product;
    }

    answer = 
      op === '+' ? num1 + num2 : 
      op === '-' ? num1 - num2 : 
      op === '*' ? num1 * num2 : 
      num1 / num2;
    
    qStr = `${num1}${op}${num2}`;
    attempt++;
  } while (usedQuestions.has(qStr) && attempt < 50);

  const options = new Set<number>();
  options.add(answer);
  while (options.size < 4) {
    const offsetRange = Math.max(3, Math.floor(answer * 0.4));
    let wrong = answer + (Math.floor(Math.random() * (offsetRange * 2 + 1)) - offsetRange);
    if (wrong === answer) continue;
    if (wrong < 0) wrong = Math.abs(wrong) + 1;
    options.add(wrong);
  }

  return {
    num1,
    num2,
    op: op === '/' ? '÷' : op === '*' ? '×' : op,
    answer,
    options: Array.from(options).sort(() => Math.random() - 0.5)
  };
}

export default function MathGame({ gameType }: { gameType: string }) {
  const { grade, level } = useParams();
  const navigate = useNavigate();
  const gradeNum = parseInt(grade || '1', 10);
  const levelNum = parseInt(level || '1', 10);
  const difficulty = useAppStore(state => state.difficulty);
  const usedQuestionsRef = React.useRef<Set<string>>(new Set());
  
  let winTarget = Math.min(3 + Math.floor(levelNum / 15), 6);
  if (difficulty === 'easy') winTarget = Math.max(2, winTarget - 1);
  if (difficulty === 'hard') winTarget = Math.min(10, winTarget + 2);
  
  const [problem, setProblem] = useState(() => {
    const p = generateProblem(gameType, gradeNum, levelNum, difficulty, usedQuestionsRef.current);
    usedQuestionsRef.current.add(`${p.num1}${p.op}${p.num2}`);
    return p;
  });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [progress, setProgress] = useState(0); 
  const [levelComplete, setLevelComplete] = useState(false);
  
  useEffect(() => {
    usedQuestionsRef.current.clear();
    const p = generateProblem(gameType, gradeNum, levelNum, difficulty, usedQuestionsRef.current);
    usedQuestionsRef.current.add(`${p.num1}${p.op}${p.num2}`);
    setProblem(p);
    setProgress(0);
    setLevelComplete(false);
    setFeedback(null);
  }, [gameType, gradeNum, levelNum, difficulty]);

  const { addStars, completeLevel } = useAppStore();

  const handleGuess = (guess: number) => {
    if (feedback || levelComplete) return;

    if (guess === problem.answer) {
      setFeedback('correct');
      
      const newProgress = progress + 1;
      setProgress(newProgress);
      
      if (newProgress >= winTarget) {
        soundManager.playLevelComplete();
        addStars(10);
        completeLevel(gameType, gradeNum, levelNum);
        setLevelComplete(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FFD166', '#EF476F', '#06D6A0', '#118AB2']
        });
      } else {
        soundManager.playCorrect();
        addStars(2);
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#FFD166', '#EF476F']
        });
        setTimeout(() => {
          const p = generateProblem(gameType, gradeNum, levelNum, difficulty, usedQuestionsRef.current);
          usedQuestionsRef.current.add(`${p.num1}${p.op}${p.num2}`);
          setProblem(p);
          setFeedback(null);
        }, 1200);
      }
    } else {
      soundManager.playWrong();
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 md:p-12 max-w-4xl mx-auto">
      <div className="w-full max-w-2xl bg-slate-200 rounded-full h-4 md:h-5 mb-4 border border-slate-300 overflow-hidden relative shadow-inner mt-2">
        <div 
          className="bg-[var(--color-fun-green)] h-full transition-all duration-500 ease-out absolute left-0 top-0 shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]"
          style={{ width: `${(progress / winTarget) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_0_0_#CBD5E1] w-full max-w-2xl text-center mb-8 relative">
        <div className="absolute -top-6 right-6 bg-[var(--color-fun-yellow)] text-[var(--color-fun-navy)] px-6 py-2 rounded-full font-bold text-xl shadow-[0_4px_0_0_#D4A017]">
          Grade {gradeNum} / Level {levelNum}
        </div>
        <div className="absolute -top-6 left-6 bg-[var(--color-fun-blue)] text-white px-6 py-2 rounded-full font-bold text-xl shadow-[0_4px_0_0_#0B5D7A]">
          {progress}/{winTarget}
        </div>
        
        <h2 className="text-2xl font-bold text-slate-400 mb-6 uppercase tracking-wider mt-4">Solve this!</h2>
        
        <div className="flex items-center justify-center gap-4 md:gap-8 text-6xl md:text-8xl font-bold text-[var(--color-fun-navy)] py-4">
          <span>{problem.num1}</span>
          <span className="text-[var(--color-fun-red)]">{problem.op}</span>
          <span>{problem.num2}</span>
          <span className="text-[var(--color-fun-blue)] hidden sm:inline">=</span>
          <span className="text-slate-300 hidden sm:inline">?</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
        {problem.options.map((opt, i) => (
          <motion.button
            key={`${problem.num1}-${problem.num2}-${opt}-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGuess(opt)}
            className="bg-[var(--color-fun-blue)] shadow-[0_8px_0_0_#0B5D7A] text-white text-5xl md:text-6xl font-bold rounded-3xl py-8 md:py-10 active:translate-y-2 active:shadow-[0_0px_0_0_#0B5D7A] transition-colors relative overflow-hidden"
          >
            {opt}
            {feedback === 'wrong' && opt !== problem.answer && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-[var(--color-fun-red)] flex items-center justify-center opacity-90"
              >
                <span className="text-white">❌</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {feedback === 'correct' && !levelComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
          >
            <div className="bg-[var(--color-fun-green)] text-white text-4xl md:text-6xl font-bold px-12 py-6 rounded-full shadow-2xl rotate-12 drop-shadow-xl border-4 border-white">
              Great! +2
            </div>
          </motion.div>
        )}
        
        {levelComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white text-[var(--color-fun-navy)] text-5xl font-bold px-12 py-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-8 border-[var(--color-fun-yellow)] pointer-events-auto">
              Level {levelNum} Beaten! <span className="text-[var(--color-fun-yellow)] drop-shadow-md">+10 Stars ⭐</span>
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => navigate(`/levels/${gameType}`)}
                  className="bg-slate-200 text-slate-700 text-xl px-8 py-4 rounded-full shadow-[0_6px_0_0_#CBD5E1] active:translate-y-1 active:shadow-none transition-all"
                >
                  Levels
                </button>
                <button 
                  onClick={() => {
                    navigate(`/${gameType}/${gradeNum}/${levelNum + 1}`);
                  }}
                  className="bg-[var(--color-fun-green)] text-white text-xl px-8 py-4 rounded-full shadow-[0_6px_0_0_#04936D] active:translate-y-1 active:shadow-none transition-all"
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
