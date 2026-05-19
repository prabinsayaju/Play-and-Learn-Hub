import { generate } from 'random-words';

export interface SpellingQuestion {
  q: string;
  word: string;
  options: string[];
  a: string;
}

function getRandomItems<T>(arr: T[], count: number, exclude: T[] = []): T[] {
  const available = arr.filter(item => !exclude.includes(item));
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const wordsGrade1 = ["cat", "dog", "sun", "bat", "run", "red", "blue", "ball", "book", "tree", "bird", "fish", "moon", "star", "hand"];
const wordsGrade2 = ["apple", "happy", "water", "small", "house", "mouse", "green", "black", "white", "smile", "laugh", "train", "plane"];
const wordsGrade3 = ["school", "friend", "family", "always", "yellow", "orange", "purple", "animal", "window", "picture", "teacher", "garden"];
const wordsGrade4 = ["beautiful", "together", "different", "important", "favorite", "children", "language", "question", "suddenly", "remember"];
const wordsGrade5 = ["environment", "government", "knowledge", "technology", "experience", "restaurant", "especially", "understand", "temperature"];

export const wordEmojiMap: Record<string, string> = {
  cat: "🐱", dog: "🐶", sun: "☀️", bat: "🦇", run: "🏃", red: "🔴", blue: "🔵", ball: "⚽", book: "📖", tree: "🌳", bird: "🐦", fish: "🐟", moon: "🌙", star: "⭐", hand: "🤚",
  apple: "🍎", happy: "😄", water: "💧", small: "🤏", house: "🏠", mouse: "🐭", green: "🟢", black: "⚫", white: "⚪", smile: "🙂", laugh: "😆", train: "🚂", plane: "✈️",
  school: "🏫", friend: "🧑‍🤝‍🧑", family: "👨‍👩‍👧‍👦", always: "♾️", yellow: "🟡", orange: "🟠", purple: "🟣", animal: "🦁", window: "🪟", picture: "🖼️", teacher: "👩‍🏫", garden: "🪴",
  beautiful: "✨", together: "🫂", different: "🔀", important: "❗", favorite: "❤️", children: "🧒", language: "🗣️", question: "❓", suddenly: "⚡", remember: "🧠",
  environment: "🌍", government: "🏛️", knowledge: "📚", technology: "💻", experience: "🎓", restaurant: "🍽️", especially: "🌟", understand: "💡", temperature: "🌡️"
};

function makeFillInBlank(word: string): SpellingQuestion {
  // Pick one random character to remove
  const idx = Math.floor(Math.random() * word.length);
  const letter = word[idx];
  const blanked = word.substring(0, idx) + "_" + word.substring(idx + 1);
  
  const allLetters = "abcdefghijklmnopqrstuvwxyz".split("");
  const wrongOptions = getRandomItems(allLetters, 3, [letter]);
  
  const options = [letter, ...wrongOptions].sort(() => 0.5 - Math.random());
  
  return {
    q: `Fill in the missing letter:\n${blanked}`,
    word: word,
    options: options,
    a: letter
  };
}

function makeCorrectSpelling(word: string): SpellingQuestion {
  // Generate 3 wrong spellings by common mistakes
  const wrong1 = word.replace(/[aeiou]/, (v) => {
    const vowels = ['a','e','i','o','u'].filter(x => x !== v);
    return vowels[Math.floor(Math.random() * vowels.length)];
  });
  
  // Double a random letter, or swap two adjacent
  let wrong2 = word;
  if (word.length > 3) {
    const swapIdx = Math.floor(Math.random() * (word.length - 1));
    wrong2 = word.substring(0, swapIdx) + word[swapIdx + 1] + word[swapIdx] + word.substring(swapIdx + 2);
    if (wrong2 === word) wrong2 = word + "e"; // fallback
  }

  // Remove a random letter from the middle
  let wrong3 = word;
  if (word.length > 2) {
      const rmIdx = Math.floor(Math.random() * (word.length - 2)) + 1;
      wrong3 = word.substring(0, rmIdx) + word.substring(rmIdx + 1);
  }

  const optionsSet = new Set([word, wrong1, wrong2, wrong3]);
  while(optionsSet.size < 4) {
      optionsSet.add(word + "s");
  }
  
  const options = Array.from(optionsSet).slice(0, 4).sort(() => 0.5 - Math.random());
  
  return {
    q: "Which word is spelled correctly?",
    word: word,
    options: options,
    a: word
  };
}

export function generateSpellingQuestion(grade: number, levelNum: number, usedWords: Set<string> = new Set()): SpellingQuestion {
  const isFill = Math.random() > 0.5;
  let words = wordsGrade1;
  if (grade === 2) words = wordsGrade2;
  if (grade === 3) words = wordsGrade3;
  if (grade === 4) words = wordsGrade4;
  if (grade === 5) words = wordsGrade5;

  const available = words.filter(w => !usedWords.has(w));
  let word = available[Math.floor(Math.random() * available.length)];

  if (!word) {
      let minLength = 3;
      let maxLength = 5;
      if (grade === 2) { minLength = 4; maxLength = 6; }
      else if (grade === 3) { minLength = 5; maxLength = 7; }
      else if (grade === 4) { minLength = 6; maxLength = 8; }
      else if (grade >= 5) { minLength = 7; maxLength = 12; }
      
      let attempts = 0;
      do {
          const generated = generate({ minLength, maxLength });
          word = Array.isArray(generated) ? generated[0] : generated;
          attempts++;
      } while(usedWords.has(word) && attempts < 100);
      
      if (!word) word = "unlimited";
  }
  
  if (grade <= 2 || isFill) {
      return makeFillInBlank(word);
  } else {
      return makeCorrectSpelling(word);
  }
}
