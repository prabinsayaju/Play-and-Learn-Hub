export interface LogicQuestion {
  q: string;
  options: string[];
  a: string;
}

function getRandomItems<T>(arr: T[], count: number, exclude: T[] = []): T[] {
  const available = arr.filter(item => !exclude.includes(item));
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePattern(grade: number): LogicQuestion {
  const emojis = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒"];
  const selected = getRandomItems(emojis, 3);
  
  if (grade <= 2) {
    // ABAB pattern
    const pattern = `${selected[0]} ${selected[1]} ${selected[0]} ${selected[1]} ${selected[0]} ?`;
    const ans = selected[1];
    const wrong = getRandomItems(emojis, 3, [ans]);
    return {
      q: `What comes next in the pattern?\n${pattern}`,
      options: [ans, ...wrong].sort(() => 0.5 - Math.random()),
      a: ans
    };
  } else {
    // AABB or ABCABC
    const patType = Math.random() > 0.5 ? "AABB" : "ABCABC";
    let pattern = "";
    let ans = "";
    if (patType === "AABB") {
         pattern = `${selected[0]} ${selected[0]} ${selected[1]} ${selected[1]} ${selected[0]} ${selected[0]} ${selected[1]} ?`;
         ans = selected[1];
    } else {
         pattern = `${selected[0]} ${selected[1]} ${selected[2]} ${selected[0]} ${selected[1]} ${selected[2]} ${selected[0]} ${selected[1]} ?`;
         ans = selected[2];
    }
    const wrong = getRandomItems(emojis, 3, [ans]);
    return {
      q: `What comes next in the pattern?\n${pattern}`,
      options: [ans, ...wrong].sort(() => 0.5 - Math.random()),
      a: ans
    };
  }
}

function generateNumberSequence(grade: number): LogicQuestion {
  const start = Math.floor(Math.random() * 10) + 1;
  const step = Math.floor(Math.random() * 4) + (grade > 3 ? 3 : 1);
  const isAdd = Math.random() > (grade > 3 ? 0.3 : 0.7); // mostly add for lower grades

  let seq = [];
  let current = start;
  for (let i = 0; i < 4; i++) {
    seq.push(current);
    if (isAdd) {
        current += step;
    } else {
        current -= step;
    }
  }
  const ans = current.toString();
  const optionsSet = new Set([ans]);
  let offset = 1;
  while(optionsSet.size < 4) {
      optionsSet.add((current + offset).toString());
      if (optionsSet.size < 4) {
          optionsSet.add((current - offset).toString());
      }
      if (optionsSet.size < 4 && offset === 1) {
          optionsSet.add((current + step).toString());
          optionsSet.add((current - step).toString());
      }
      offset++;
  }
  const options = Array.from(optionsSet).slice(0, 4);
  
  return {
    q: `What number comes next?\n${seq.join(", ")}, ?`,
    options: options.sort(() => 0.5 - Math.random()),
    a: ans
  };
}

function generateWordLogic(): LogicQuestion {
  const templates = [
    {
      q: "If ALL cats are animals, and Fluffy is a cat. Is Fluffy an animal?",
      a: "Yes",
      wrong: ["No", "Maybe", "Cannot tell"]
    },
    {
      q: "If John is taller than Mary, and Mary is taller than Sue. Who is the tallest?",
      a: "John",
      wrong: ["Mary", "Sue", "Cannot tell"]
    },
    {
       q: "Today is Tuesday. What day was it yesterday?",
       a: "Monday",
       wrong: ["Wednesday", "Sunday", "Thursday"]
    },
    {
        q: "If it takes 2 hours to drive to the city, and you leave at 1:00 PM, when will you arrive?",
        a: "3:00 PM",
        wrong: ["2:00 PM", "4:00 PM", "12:00 PM"]
    }
  ];
  const item = templates[Math.floor(Math.random() * templates.length)];
  return {
    q: item.q,
    options: [item.a, ...item.wrong].sort(() => 0.5 - Math.random()),
    a: item.a
  };
}

export function generateLogicQuestion(grade: number, levelNum: number, usedQuestions: Set<string> = new Set()): LogicQuestion {
  let attempt = 0;
  let result: LogicQuestion | null = null;
  do {
    result = _generateLogicQuestion(grade, levelNum);
    attempt++;
  } while (usedQuestions.has(result.q) && attempt < 50);
  return result;
}

function _generateLogicQuestion(grade: number, levelNum: number): LogicQuestion {
  const type = Math.random();
  if (grade === 1) {
    if (type < 0.7) return generatePattern(grade);
    return generateNumberSequence(grade);
  } else if (grade === 2) {
    if (type < 0.5) return generatePattern(grade);
    return generateNumberSequence(grade);
  } else if (grade === 3) {
    if (type < 0.3) return generatePattern(grade);
    if (type < 0.7) return generateNumberSequence(grade);
    return generateWordLogic();
  } else {
    if (type < 0.5) return generateNumberSequence(grade);
    return generateWordLogic();
  }
}
