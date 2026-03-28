export interface Question {
  id: string;
  text: string;
  type: "aptitude" | "psychometric";
  options?: string[];
}

const aptitudeQuestions: Question[] = [
  { id: "Q1", text: "If a train travels 300 km in 5 hours, what is its average speed?", type: "aptitude", options: ["50 km/h", "60 km/h", "75 km/h", "45 km/h"] },
  { id: "Q2", text: "Which number comes next in the series: 2, 6, 12, 20, …?", type: "aptitude", options: ["28", "30", "32", "26"] },
  { id: "Q3", text: "Find the odd one out: Apple, Mango, Potato, Banana.", type: "aptitude", options: ["Apple", "Mango", "Potato", "Banana"] },
  { id: "Q4", text: "If CLOUD is coded as DMPVE, how is BRAIN coded?", type: "aptitude", options: ["CSBJO", "CSBKO", "DSBJO", "CRAJN"] },
  { id: "Q5", text: "A clock shows 3:15. What is the angle between the hour and minute hands?", type: "aptitude", options: ["0°", "7.5°", "15°", "22.5°"] },
  { id: "Q6", text: "Complete the analogy: Pen : Writer :: Scalpel : ?", type: "aptitude", options: ["Butcher", "Surgeon", "Carpenter", "Painter"] },
  { id: "Q7", text: "If you rearrange 'CIFAIPC', you get the name of a(n):", type: "aptitude", options: ["City", "Ocean", "Animal", "Country"] },
  { id: "Q8", text: "Which shape has the most sides: hexagon, pentagon, octagon, or triangle?", type: "aptitude", options: ["Hexagon", "Pentagon", "Octagon", "Triangle"] },
  { id: "Q9", text: "25% of 440 is:", type: "aptitude", options: ["100", "110", "120", "105"] },
  { id: "Q10", text: "If all roses are flowers, and some flowers fade quickly, which is true?", type: "aptitude", options: ["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "Roses are not flowers"] },
];

// Generate remaining aptitude (Q11-Q20)
for (let i = 11; i <= 20; i++) {
  aptitudeQuestions.push({
    id: `Q${i}`,
    text: `Aptitude question ${i}: Select the best answer from the options below.`,
    type: "aptitude",
    options: ["Option A", "Option B", "Option C", "Option D"],
  });
}

const psychometricQuestions: Question[] = [];

const psychoTexts = [
  "I enjoy solving puzzles and logical problems.",
  "I prefer working with my hands to build or fix things.",
  "I find it easy to express my ideas through writing or art.",
  "I feel energized when helping others with their problems.",
  "I like organizing tasks and making detailed plans.",
  "I am curious about how machines and technology work.",
  "I enjoy being the leader in group projects.",
  "I prefer working alone over working in a team.",
  "I get excited about learning new scientific concepts.",
  "I enjoy public speaking and persuading others.",
];

for (let i = 21; i <= 70; i++) {
  const textIndex = (i - 21) % psychoTexts.length;
  psychometricQuestions.push({
    id: `Q${i}`,
    text: i <= 30 ? psychoTexts[i - 21] : `${psychoTexts[textIndex]} (Trait dimension ${Math.ceil((i - 20) / 10)})`,
    type: "psychometric",
  });
}

export const questions: Question[] = [...aptitudeQuestions, ...psychometricQuestions];

export const TOTAL_QUESTIONS = 70;
export const QUESTIONS_PER_PAGE = 5;
export const TOTAL_PAGES = TOTAL_QUESTIONS / QUESTIONS_PER_PAGE;
