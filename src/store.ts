import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface AppState {
  stars: Record<Difficulty, number>;
  addStars: (amount: number) => void;
  resetStars: () => void;
  unlockedLevels: Record<string, number>;
  completeLevel: (gameId: string, grade: number, level: number) => void;
  lastDailyChallengeDate: string | null;
  completeDailyChallenge: () => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  resetProgress: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      stars: { easy: 0, medium: 0, hard: 0 },
      addStars: (amount) => set((state) => ({ 
        stars: { ...state.stars, [state.difficulty]: state.stars[state.difficulty] + amount } 
      })),
      resetStars: () => set((state) => ({ 
        stars: { ...state.stars, [state.difficulty]: 0 } 
      })),
      unlockedLevels: {},
      completeLevel: (gameId, grade, level) => set((state) => {
        const key = `${gameId}_${grade}_${state.difficulty}`;
        const currentUnlocked = state.unlockedLevels[key] || 1;
        if (level >= currentUnlocked) {
          return {
            unlockedLevels: {
              ...state.unlockedLevels,
              [key]: level + 1
            }
          };
        }
        return state;
      }),
      lastDailyChallengeDate: null,
      completeDailyChallenge: () => set(() => {
        const today = new Date().toISOString().split('T')[0];
        return { lastDailyChallengeDate: today };
      }),
      difficulty: 'medium',
      setDifficulty: (diff) => set({ difficulty: diff }),
      resetProgress: () => set({ stars: { easy: 0, medium: 0, hard: 0 }, unlockedLevels: {}, lastDailyChallengeDate: null }),
    }),
    {
      name: 'play-learn-storage-v2',
    }
  )
);
