import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store';
import { soundManager } from '../lib/sounds';
import { Volume2 } from 'lucide-react';
import { generateSpellingQuestion, SpellingQuestion, wordEmojiMap } from '../lib/spellingGenerator';

export default function SpellingBee() {
  const { grade, level } = useParams();
  const navigate = useNavigate();
  const gradeNum = parseInt(grade || '1', 10);
  const levelNum = parseInt(level || '1', 10);
  const difficulty = useAppStore(state => state.difficulty);
  const usedWordsRef = React.useRef<Set<string>>(new Set());

  const [question, setQuestion] = useState<SpellingQuestion>(() => {
    const q = generateSpellingQuestion(gradeNum, levelNum, usedWordsRef.current);
    if (q && q.word) usedWordsRef.current.add(q.word);
    return q;
  });
  
  useEffect(() => {
    usedWordsRef.current.clear();
    const q = generateSpellingQuestion(gradeNum, levelNum, usedWordsRef.current);
    if (q && q.word) usedWordsRef.current.add(q.word);
    setQuestion(q);
    setFeedback(null);
    setProgress(0);
    setLevelComplete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeNum, levelNum]);

  let winTarget = Math.min(3 + Math.floor(levelNum / 15), 6);
  if (difficulty === 'easy') winTarget = Math.max(2, winTarget - 1);
  if (difficulty === 'hard') winTarget = Math.min(10, winTarget + 2);
  
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [progress, setProgress] = useState(0); 
  const [levelComplete, setLevelComplete] = useState(false);
  
  // Timer
  const timeLimit = difficulty === 'hard' ? 10 : difficulty === 'medium' ? 20 : 30;
  
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  
  const { addStars, completeLevel } = useAppStore();
  
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  useEffect(() => {
    if (question) {
      setCurrentOptions([...question.options]); // options already shuffled
    }
  }, [question]);

  useEffect(() => {
    if (levelComplete || feedback) return;
    
    if (timeLeft <= 0) {
      handleAnswer(null); // Timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, levelComplete, feedback]);

  const speakWord = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; 
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (question && question.word) {
      // Small delay so it feels natural
      setTimeout(() => speakWord(question.word), 300);
    }
  }, [question]);

  const handleAnswer = (answer: string | null) => {
    if (feedback || levelComplete) return;
    
    if (answer === question.a) {
      setFeedback('correct');
      const nextProgress = progress + 1;
      setProgress(nextProgress);
      
      if (nextProgress >= winTarget) {
        soundManager.playLevelComplete();
        addStars(10);
        completeLevel('spelling', gradeNum, levelNum);
        setLevelComplete(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#8B5CF6', '#FFD166', '#EF476F']
        });
      } else {
        soundManager.playCorrect();
        addStars(2);
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 }, colors: ['#8B5CF6', '#FFD166'] });
        setTimeout(nextQuestion, 1200);
      }
    } else {
      soundManager.playWrong();
      setFeedback(answer === null ? 'timeout' : 'wrong');
      setTimeout(nextQuestion, 1200);
    }
  };

  const nextQuestion = () => {
    const q = generateSpellingQuestion(gradeNum, levelNum, usedWordsRef.current);
    if (q && q.word) usedWordsRef.current.add(q.word);
    setQuestion(q);
    setFeedback(null);
    setTimeLeft(timeLimit);
  };

  if (!question) return null;

  return (
    <div className="flex flex-col items-center p-4 md:p-12 max-w-4xl mx-auto">
      <div className="w-full max-w-2xl bg-slate-200 rounded-full h-4 md:h-5 mb-4 border border-slate-300 overflow-hidden relative shadow-inner mt-2">
        <div 
          className="bg-violet-500 h-full transition-all duration-500 ease-out absolute left-0 top-0 shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]"
          style={{ width: `${(progress / winTarget) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between w-full max-w-2xl mb-4 md:mb-6 px-2">
        <div className="bg-[var(--color-fun-yellow)] text-[var(--color-fun-navy)] px-6 py-2 rounded-full font-bold text-lg md:text-xl shadow-[0_4px_0_0_#D4A017]">
          Grade {gradeNum} / Level {levelNum}
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

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_0_0_#CBD5E1] w-full max-w-2xl text-center mb-6 border-4 border-violet-500">
        <h2 className="text-xl md:text-2xl font-bold text-violet-600 mb-4 uppercase tracking-wider mt-2">Spelling Bee</h2>
        {question.word && wordEmojiMap[question.word] && (
           <div className="text-6xl md:text-8xl mb-6">
             {wordEmojiMap[question.word]}
           </div>
        )}
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl md:text-4xl font-bold text-[var(--color-fun-navy)] leading-tight whitespace-pre-line">{question.q}</p>
          {question.word && (
            <button 
              onClick={() => speakWord(question.word)}
              className="bg-violet-100 text-violet-600 p-4 rounded-full shadow-[0_4px_0_0_#C4B5FD] active:translate-y-1 active:shadow-none transition-colors"
              aria-label="Hear word again"
            >
              <Volume2 className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl">
        {currentOptions.map((opt, i) => (
          <motion.button
            key={`${question.q}-${opt}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(opt)}
            className="bg-violet-500 shadow-[0_8px_0_0_#5B21B6] text-white text-2xl md:text-3xl font-bold rounded-3xl py-6 active:translate-y-2 active:shadow-[0_0px_0_0_#5B21B6] transition-colors relative overflow-hidden"
          >
            {opt}
            {feedback === 'wrong' && opt !== question.a && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-[var(--color-fun-red)] flex items-center justify-center opacity-90"
              >
                <span className="text-white">❌</span>
              </motion.div>
            )}
            {feedback === 'correct' && opt === question.a && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-green-500/30 flex items-center justify-center"
              />
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
            <div className="bg-[var(--color-fun-yellow)] text-[var(--color-fun-navy)] text-5xl md:text-6xl font-bold px-12 py-6 rounded-full shadow-2xl -rotate-6 drop-shadow-xl border-4 border-white">
              Super! +2
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

        {levelComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white text-[var(--color-fun-navy)] text-3xl md:text-5xl font-bold px-8 md:px-12 py-8 md:py-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-8 border-violet-500 pointer-events-auto text-center mx-4">
              Level {levelNum} Mastered! 
              <span className="text-[var(--color-fun-yellow)] drop-shadow-md">+10 Stars ⭐</span>
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => navigate('/levels/spelling')}
                  className="bg-slate-200 text-slate-700 text-lg md:text-xl px-6 py-3 md:px-8 md:py-4 rounded-full shadow-[0_6px_0_0_#CBD5E1] active:translate-y-1 active:shadow-none transition-all"
                >
                  Levels
                </button>
                <button 
                  onClick={() => {
                    navigate(`/spelling/${gradeNum}/${levelNum + 1}`);
                    setProgress(0);
                    setLevelComplete(false);
                    setFeedback(null);
                    const timeLimitN = difficulty === 'hard' ? 10 : difficulty === 'medium' ? 20 : 30;
                    setTimeLeft(timeLimitN);
                  }}
                  className="bg-violet-500 text-white text-lg md:text-xl px-6 py-3 md:px-8 md:py-4 rounded-full shadow-[0_6px_0_0_#5B21B6] active:translate-y-1 active:shadow-none transition-all"
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
