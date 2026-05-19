export interface QuizQuestion {
  q: string;
  options: string[];
  a: string;
}

function getRandomItems<T>(arr: T[], count: number, exclude: T[] = []): T[] {
  const available = arr.filter(item => !exclude.includes(item));
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Data for Grade 1
const colors = ["Blue", "Green", "Red", "Yellow", "Purple", "Orange", "Black", "White"];
const animalsG1 = [
  { group: "barks", ans: "Dog", wrong: ["Cat", "Cow", "Bird", "Fish"] },
  { group: "meows", ans: "Cat", wrong: ["Dog", "Cow", "Tiger", "Bird"] },
  { group: "moos", ans: "Cow", wrong: ["Pig", "Sheep", "Dog", "Bird"] },
  { group: "lays eggs", ans: "Bird", wrong: ["Dog", "Cat", "Cow", "Horse"] },
  { group: "swims in water", ans: "Fish", wrong: ["Dog", "Cat", "Bird", "Cow"] }
];
const simpleMathWords = [
  { item: "dog", num: "4" }, { item: "bird", num: "2" }, { item: "spider", num: "8" }, { item: "insect", num: "6" }
];
const itemColors = [
  { item: "an apple", color: "Red" }, { item: "a banana", color: "Yellow" }, { item: "the sky", color: "Blue" }, 
  { item: "grass", color: "Green" }, { item: "milk", color: "White" }, { item: "wood", color: "Brown" }
];
const shapes = [
  { item: "a ball", shape: "Round" }, { item: "a box", shape: "Square" }, { item: "a slice of pizza", shape: "Triangle" }, 
  { item: "a book", shape: "Rectangle" }
];

// Data for Grade 2
const planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
const animalProducts = [
  { animal: "bees", product: "Honey" }, { animal: "cows", product: "Milk" }, { animal: "chickens", product: "Eggs" }, 
  { animal: "sheep", product: "Wool" }
];
const timeFacts = [
  { q: "How many days are in a week?", a: "7", wrong: ["5", "6", "8", "9"] },
  { q: "How many hours in a day?", a: "24", wrong: ["12", "48", "36", "60"] },
  { q: "How many months in a year?", a: "12", wrong: ["10", "14", "24", "6"] }
];

// Data for Grade 3
const continents = ["Asia", "Africa", "North America", "South America", "Antarctica", "Europe", "Australia"];
const stateChanges = [
  { process: "freezes into ice", ans: "Water", wrong: ["Milk", "Juice", "Oil"] },
  { process: "melts in the sun", ans: "Ice", wrong: ["Wood", "Stone", "Metal"] },
  { process: "boils to become steam", ans: "Water", wrong: ["Oil", "Sand", "Salt"] }
];
const animalFacts = [
  { q: "What is the largest land animal?", a: "Elephant", wrong: ["Giraffe", "Rhino", "Hippo"] },
  { q: "Which bird can't fly but swims?", a: "Penguin", wrong: ["Parrot", "Eagle", "Duck"] },
  { q: "What is the fastest land animal?", a: "Cheetah", wrong: ["Lion", "Tiger", "Horse"] },
  { q: "Which animal has a long trunk?", a: "Elephant", wrong: ["Giraffe", "Rhino", "Monkey"] }
];

// Grade 4
const scienceG4 = [
  { q: "What gives plants their green color?", a: "Chlorophyll", wrong: ["Sunlight", "Water", "Earth"] },
  { q: "What is the boiling point of water?", a: "100°C", wrong: ["90°C", "50°C", "120°C"] },
  { q: "What gas do humans breathe to live?", a: "Oxygen", wrong: ["Carbon Dioxide", "Helium", "Nitrogen"] },
  { q: "Which is the tallest mountain?", a: "Mt. Everest", wrong: ["K2", "Kangchenjunga", "Makalu"] },
  { q: "What is the capital of Nepal?", a: "Kathmandu", wrong: ["Pokhara", "Lalitpur", "Bhaktapur"] },
  { q: "What powers the water cycle?", a: "The Sun", wrong: ["The Moon", "The Wind", "The Ocean"] }
];

// Grade 5
const scienceG5 = [
  { q: "Which gas do plants absorb?", a: "Carbon Dioxide", wrong: ["Oxygen", "Nitrogen", "Helium"] },
  { q: "What is the hardest natural substance?", a: "Diamond", wrong: ["Gold", "Iron", "Quartz"] },
  { q: "What is the closest planet to the Sun?", a: "Mercury", wrong: ["Venus", "Earth", "Mars"] },
  { q: "How many bones are in the adult human body?", a: "206", wrong: ["196", "216", "226"] },
  { q: "Who painted the Mona Lisa?", a: "Da Vinci", wrong: ["Picasso", "Van Gogh", "Michelangelo"] },
  { q: "Which force constantly pulls us to Earth?", a: "Gravity", wrong: ["Friction", "Magnetism", "Inertia"] },
  { q: "What is the main organ of the circulatory system?", a: "Heart", wrong: ["Brain", "Lungs", "Stomach"] },
  { q: "What energy comes from splitting atoms?", a: "Nuclear", wrong: ["Solar", "Geothermal", "Kinetic"] }
];

export function generateQuizQuestion(grade: number, levelNum: number, usedQuestions: Set<string> = new Set()): QuizQuestion {
  let attempt = 0;
  let result: QuizQuestion | null = null;
  
  do {
    result = _generateQuizQuestion(grade, levelNum);
    attempt++;
  } while (usedQuestions.has(result.q) && attempt < 50);
  
  return result;
}

function _generateQuizQuestion(grade: number, levelNum: number): QuizQuestion {
  const qType = Math.random();

  if (grade === 1) {
    if (qType < 0.25) {
      const animal = animalsG1[Math.floor(Math.random() * animalsG1.length)];
      return { q: `Which animal ${animal.group}?`, options: [animal.ans, ...getRandomItems(animal.wrong, 3)], a: animal.ans };
    } else if (qType < 0.5) {
      const pair = itemColors[Math.floor(Math.random() * itemColors.length)];
      const wrong = getRandomItems(colors, 3, [pair.color]);
      return { q: `What color is ${pair.item}?`, options: [pair.color, ...wrong], a: pair.color };
    } else if (qType < 0.75) {
      const pair = shapes[Math.floor(Math.random() * shapes.length)];
      const allShapes = ["Round", "Square", "Triangle", "Rectangle", "Flat", "Oval"];
      const wrong = getRandomItems(allShapes, 3, [pair.shape]);
      return { q: `What shape is ${pair.item}?`, options: [pair.shape, ...wrong], a: pair.shape };
    } else {
      const pair = simpleMathWords[Math.floor(Math.random() * simpleMathWords.length)];
      return { q: `How many legs does a ${pair.item} have?`, options: [pair.num, ...getRandomItems(["2", "4", "6", "8", "10", "100"], 3, [pair.num])], a: pair.num };
    }
  }

  if (grade === 2) {
    if (qType < 0.33) {
      const fact = timeFacts[Math.floor(Math.random() * timeFacts.length)];
      return { q: fact.q, options: [fact.a, ...getRandomItems(fact.wrong, 3)], a: fact.a };
    } else if (qType < 0.66) {
      const pair = animalProducts[Math.floor(Math.random() * animalProducts.length)];
      const wrongProducts = ["Honey", "Milk", "Eggs", "Wool", "Silk", "Webs"].filter(x => x !== pair.product);
      return { q: `What do ${pair.animal} make?`, options: [pair.product, ...getRandomItems(wrongProducts, 3)], a: pair.product };
    } else {
      return { q: "Which planet do we live on?", options: ["Earth", ...getRandomItems(planets, 3, ["Earth"])], a: "Earth" };
    }
  }

  if (grade === 3) {
    if (qType < 0.33) {
      const fact = animalFacts[Math.floor(Math.random() * animalFacts.length)];
      return { q: fact.q, options: [fact.a, ...getRandomItems(fact.wrong, 3)], a: fact.a };
    } else if (qType < 0.66) {
      const st = stateChanges[Math.floor(Math.random() * stateChanges.length)];
      return { q: `What ${st.process}?`, options: [st.ans, ...getRandomItems(st.wrong, 3)], a: st.ans };
    } else {
      return { q: "How many continents are there?", options: ["7", "6", "5", "4"], a: "7" };
    }
  }

  if (grade === 4) {
    const q = scienceG4[Math.floor(Math.random() * scienceG4.length)];
    return { q: q.q, options: [q.a, ...getRandomItems(q.wrong, 3)], a: q.a };
  }

  // Grade 5
  const q = scienceG5[Math.floor(Math.random() * scienceG5.length)];
  return { q: q.q, options: [q.a, ...getRandomItems(q.wrong, 3)], a: q.a };
}
