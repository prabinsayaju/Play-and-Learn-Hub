import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ParentalGateProps {
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function ParentalGate({ onSuccess, onCancel, isOpen }: ParentalGateProps) {
  const [num1] = useState(() => Math.floor(Math.random() * 9) + 2);
  const [num2] = useState(() => Math.floor(Math.random() * 9) + 2);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer, 10) === num1 * num2) {
      setError(false);
      onSuccess();
      setAnswer('');
    } else {
      setError(true);
      setAnswer('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-sm relative"
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="text-2xl font-bold text-[var(--color-fun-navy)] mb-2 text-center text-red-600">
            Parents Only!
          </h2>
          <p className="text-slate-600 text-center mb-6">
            Please solve the following to continue:
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="text-4xl font-bold text-[var(--color-fun-blue)] mb-6">
              {num1} &times; {num2} = ?
            </div>

            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer"
              className={`w-full text-center text-2xl p-4 rounded-xl border-4 outline-none transition-colors mb-6 ${
                error ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-200 focus:border-[var(--color-fun-blue)]'
              }`}
              autoFocus
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 font-bold mb-4"
              >
                Oops! Try again.
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full bg-[var(--color-fun-green)] text-white font-bold text-xl py-4 rounded-full shadow-[0_4px_0_0_#04936D] active:translate-y-1 active:shadow-none transition-all"
            >
              Submit
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
