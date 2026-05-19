export interface NepaliQuestion {
  q: string;
  options: string[];
  a: string;
}

const consonants = ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह", "क्ष", "त्र", "ज्ञ"];
const vowels = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं", "अः"];
const simpleWords = [
  { en: "Apple", ne: "स्याउ" }, { en: "Banana", ne: "केरा" }, { en: "Cat", ne: "बिरालो" }, { en: "Dog", ne: "कुकुर" },
  { en: "Sun", ne: "सूर्य" }, { en: "Moon", ne: "चन्द्रमा" }, { en: "Water", ne: "पानी" }, { en: "Fire", ne: "आगो" },
  { en: "Eye", ne: "आँखा" }, { en: "Nose", ne: "नाक" }, { en: "Hand", ne: "हात" }, { en: "Tree", ne: "रुख" },
  { en: "Book", ne: "किताब" }, { en: "Pen", ne: "कलम" }, { en: "Boy", ne: "केटा" }, { en: "Girl", ne: "केटी" }
];

const days = ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहिबार", "शुक्रबार", "शनिबार"];
const nepaliNumbers = ["० (शून्य)", "१ (एक)", "२ (दुई)", "३ (तीन)", "४ (चार)", "५ (पाँच)", "६ (छ)", "७ (सात)", "८ (आठ)", "९ (नौ)", "१० (दश)"];
const bodyParts = [
  { ne: "कपाल", func: "हेर्नको लागि अहँ, टाउको माथि हुन्छ" }, { ne: "आँखा", func: "हेर्नको लागि प्रयोग हुने अंग" }, 
  { ne: "कान", func: "सुन्न सम्बन्धी अंग" }, { ne: "नाक", func: "सुँघ्ने अंग" }, { ne: "मुख", func: "बोल्ने वा खाने अंग" }
];

const colors = [{ en: "Red", ne: "रातो" }, { en: "Blue", ne: "निलो" }, { en: "Green", ne: "हरियो" }, { en: "Black", ne: "कालो" }, { en: "White", ne: "सेतो" }, { en: "Yellow", ne: "पहेँलो" }, { en: "Pink", ne: "गुलाबी" }];
const relations = [
  { desc: "बुबाको बुबालाई", ans: "हजुरबुबा" }, { desc: "आमाको आमालाई", ans: "हजुरआमा" }, { desc: "आमाको भाइलाई", ans: "मामा" }, 
  { desc: "बुबाको भाइलाई", ans: "काका" }, { desc: "आमाको दिदीलाई", ans: "ठूलीआमा" }, { desc: "बुबाको दिदीलाई", ans: "फुपू" }
];

const animals = [
  { ne: "गाई", sound: "नेपालको राष्ट्रिय जनावर" }, { ne: "कुकुर", sound: "घरको रुँघालु" }, 
  { ne: "बाघ", sound: "जंगलको राजा" }, { ne: "डाँफे", sound: "नेपालको राष्ट्रिय चरा" }
];

const antonymsG4 = [
  { word: "दिन", ans: "रात" }, { word: "बिहान", ans: "बेलुका" }, { word: "उज्यालो", ans: "अँध्यारो" }, 
  { word: "राम्रो", ans: "नराम्रो" }, { word: "माथि", ans: "तल" }, { word: "सानो", ans: "ठूलो" },
  { word: "तातो", ans: "चिसो" }, { word: "नयाँ", ans: "पुरानो" }, { word: "हँसाउने", ans: "रुवाउने" }
];

const gkNepal = [
  { q: "सगरमाथा कुन जिल्लामा पर्छ?", a: "सोलुखुम्बु", wrong: ["काठमाडौं", "पोखरा", "चितवन"] },
  { q: "नेपालको राजधानी कहाँ हो?", a: "काठमाडौं", wrong: ["पोखरा", "लुम्बिनी", "जनकपुर"] },
  { q: "१ वर्षमा कति महिना हुन्छन्?", a: "१२", wrong: ["१०", "१४", "३०"] },
  { q: "नेपालमा कति वटा प्रदेश छन्?", a: "७", wrong: ["५", "१४", "९"] },
  { q: "गौतम बुद्धको जन्म कहाँ भएको थियो?", a: "लुम्बिनी", wrong: ["कपिलवस्तु", "काठमाडौं", "पाटलीपुत्र"] },
  { q: "नेपालको राष्ट्रिय रङ कुन हो?", a: "सिम्रिक", wrong: ["रातो", "निलो", "हरियो"] },
  { q: "नेपालको राष्ट्रिय फूल कुन हो?", a: "लालिगुराँस", wrong: ["सयपत्री", "मखमली", "गुलाव"] },
  { q: "नेपालमा कतिवटा अञ्चलहरू थिए?", a: "१४", wrong: ["७", "५", "७५"] },
  { q: "काग तिहारमा कुन जनावरको पूजा गरिन्छ?", a: "काग", wrong: ["गाई", "कुकुर", "गोरु"] },
  { q: "कुकर तिहारमा कुन जनावरको पूजा गरिन्छ?", a: "कुकुर", wrong: ["काग", "गाई", "गोरु"] }
];

const antonymsG5 = [
  ...antonymsG4,
  { word: "ज्ञानी", ans: "मूर्ख" }, { word: "मित्र", ans: "शत्रु" }, { word: "स्वर्ग", ans: "नर्क" }, 
  { word: "न्याय", ans: "अन्याय" }, { word: "सत्य", ans: "असत्य" }, { word: "आशा", ans: "निराशा" },
  { word: "जन्म", ans: "मृत्यु" }, { word: "आदर", ans: "अनादर" }, { word: "उपस्थित", ans: "अनुपस्थित" }
];

const grammar5 = [
  { q: "तलका मध्ये कुन नामपद हो?", options: ["राम", "खायो", "राम्रो", "भोलि"], a: "राम" },
  { q: "तलका मध्ये कुन क्रियापद हो?", options: ["घर", "खायो", "रातो", "राम"], a: "खायो" },
  { q: "तलका मध्ये कुन विशेषण हो?", options: ["हरियो", "पानी", "हामी", "गयो"], a: "हरियो" },
  { q: "तलका मध्ये कुन सर्वनाम हो?", options: ["म", "स्याउ", "दौड्यो", "मीठो"], a: "म" },
  { q: "‘उनीहरू’ कुन पुरुष हो?", options: ["प्रथम पुरुष", "द्वितीय पुरुष", "तृतीय पुरुष", "कुनै पनि होइन"], a: "तृतीय पुरुष" },
  { q: "‘म’ कुन पुरुष हो?", options: ["प्रथम पुरुष", "द्वितीय पुरुष", "तृतीय पुरुष", "कुनै पनि होइन"], a: "प्रथम पुरुष" }
];

function getRandomItems<T>(arr: T[], count: number, exclude: T[] = []): T[] {
  const available = arr.filter(item => !exclude.includes(item));
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateNepaliQuestion(grade: number, levelNum: number, usedQuestions: Set<string> = new Set()): NepaliQuestion {
  let attempt = 0;
  let result: NepaliQuestion | null = null;
  do {
    result = _generateNepaliQuestion(grade, levelNum);
    attempt++;
  } while (usedQuestions.has(result.q) && attempt < 50);
  return result;
}

function _generateNepaliQuestion(grade: number, levelNum: number): NepaliQuestion {
  const qType = Math.random();

  if (grade === 1) {
    if (qType < 0.4) {
      const idx = Math.floor(Math.random() * (consonants.length - 1));
      const target = consonants[idx];
      const ans = consonants[idx + 1];
      const wrong = getRandomItems(consonants, 3, [target, ans]);
      return { q: `${target} पछि कुन अक्षर आउँछ?`, options: [ans, ...wrong], a: ans };
    } else if (qType < 0.7) {
      const idx = Math.floor(Math.random() * (vowels.length - 1));
      const target = vowels[idx];
      const ans = vowels[idx + 1];
      const wrong = getRandomItems(vowels, 3, [target, ans]);
      return { q: `${target} पछि कुन अक्षर आउँछ?`, options: [ans, ...wrong], a: ans };
    } else {
      const word = simpleWords[Math.floor(Math.random() * simpleWords.length)];
      const wrongPairs = getRandomItems(simpleWords, 3, [word]);
      const wrong = wrongPairs.map(w => w.ne);
      return { q: `'${word.en}' लाई नेपालीमा के भनिन्छ?`, options: [word.ne, ...wrong], a: word.ne };
    }
  }

  if (grade === 2) {
    if (qType < 0.33) {
      const dayIdx = Math.floor(Math.random() * 7);
      const target = days[dayIdx];
      const ans = days[(dayIdx + 1) % 7];
      const wrong = getRandomItems(days, 3, [target, ans]);
      return { q: `${target} पछि कुन बार आउँछ?`, options: [ans, ...wrong], a: ans };
    } else if (qType < 0.66) {
      const idx = Math.floor(Math.random() * 9) + 1; // 1 to 9
      const target = nepaliNumbers[idx];
      const ans = nepaliNumbers[idx + 1];
      const wrong = getRandomItems(nepaliNumbers, 3, [target, ans]);
      return { q: `${target} पछि कुन अङ्क आउँछ?`, options: [ans, ...wrong], a: ans };
    } else {
      const part = bodyParts[Math.floor(Math.random() * (bodyParts.length - 1)) + 1];
      const wrongPairs = getRandomItems(bodyParts, 3, [part]);
      const wrong = wrongPairs.map(w => w.ne);
      return { q: `${part.func} कुन हो?`, options: [part.ne, ...wrong], a: part.ne };
    }
  }

  if (grade === 3) {
    if (qType < 0.33) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const wrongPairs = getRandomItems(colors, 3, [color]);
      const wrong = wrongPairs.map(c => c.ne);
      return { q: `'${color.en}' लाई नेपालीमा कुन रङ्ग भनिन्छ?`, options: [color.ne, ...wrong], a: color.ne };
    } else if (qType < 0.66) {
      const rel = relations[Math.floor(Math.random() * relations.length)];
      const wrongPairs = getRandomItems(relations, 3, [rel]);
      const wrong = wrongPairs.map(r => r.ans);
      return { q: `${rel.desc} के भनिन्छ?`, options: [rel.ans, ...wrong], a: rel.ans };
    } else {
      const animal = animals[Math.floor(Math.random() * animals.length)];
      const wrongPairs = getRandomItems(animals, 3, [animal]);
      const wrong = wrongPairs.map(a => a.ne);
      return { q: `${animal.sound} कुन हो?`, options: [animal.ne, ...wrong], a: animal.ne };
    }
  }

  if (grade === 4) {
    if (qType < 0.6) {
      const ant = antonymsG4[Math.floor(Math.random() * antonymsG4.length)];
      const wrongPairs = getRandomItems(antonymsG4, 3, [ant]);
      const wrong = wrongPairs.map(a => a.ans);
      return { q: `'${ant.word}' को उल्टो अर्थ दिने शब्द कुन हो?`, options: [ant.ans, ...wrong], a: ant.ans };
    } else {
      const q = gkNepal[Math.floor(Math.random() * gkNepal.length)];
      const shuffledOptions = [q.a, ...q.wrong].sort(() => 0.5 - Math.random());
      return { q: q.q, options: shuffledOptions, a: q.a };
    }
  }

  // Grade 5
  if (qType < 0.4) {
    const ant = antonymsG5[Math.floor(Math.random() * antonymsG5.length)];
    const wrongPairs = getRandomItems(antonymsG5, 3, [ant]);
    const wrong = wrongPairs.map(a => a.ans);
    return { q: `'${ant.word}' को उल्टो अर्थ (विपरीतार्थी शब्द) कुन हो?`, options: [ant.ans, ...wrong], a: ant.ans };
  } else if (qType < 0.7) {
    const q = gkNepal[Math.floor(Math.random() * gkNepal.length)];
    const shuffledOptions = [q.a, ...q.wrong].sort(() => 0.5 - Math.random());
    return { q: q.q, options: shuffledOptions, a: q.a };
  } else {
    const gr = grammar5[Math.floor(Math.random() * grammar5.length)];
    return { q: gr.q, options: gr.options, a: gr.a };
  }
}
