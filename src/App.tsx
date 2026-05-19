import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import MathGame from './pages/MathGame';
import MemoryGame from './pages/MemoryGame';
import QuizGame from './pages/QuizGame';
import NepaliGame from './pages/NepaliGame';
import SpellingBee from './pages/SpellingBee';
import LogicPuzzles from './pages/LogicPuzzles';
import LevelSelect from './pages/LevelSelect';
import DailyChallenge from './pages/DailyChallenge';
import Header from './components/Header';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Only fetch for stars logic, etc
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-fun-bg)]">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {/* @ts-expect-error AnimatePresence needs a key here */}
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/daily" element={<DailyChallenge />} />
            <Route path="/levels/:gameId" element={<LevelSelect />} />
            <Route path="/add-sub/:grade/:level" element={<MathGame gameType="add-sub" />} />
            <Route path="/multiply/:grade/:level" element={<MathGame gameType="multiply" />} />
            <Route path="/divide/:grade/:level" element={<MathGame gameType="divide" />} />
            <Route path="/memory/:grade/:level" element={<MemoryGame />} />
            <Route path="/quiz/:grade/:level" element={<QuizGame />} />
            <Route path="/nepali/:grade/:level" element={<NepaliGame />} />
            <Route path="/spelling/:grade/:level" element={<SpellingBee />} />
            <Route path="/logic/:grade/:level" element={<LogicPuzzles />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
