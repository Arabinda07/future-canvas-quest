export interface Question {
  id: string;
  text: string;
  type: "aptitude" | "psychometric";
  options?: string[];
  visualSlot?: {
    alt: string;
    placement?: "side" | "below";
  };
}

const aptitudeOptionLabels = ["A", "B", "C", "D"];

const aptitudeQuestions = [
  { id: "Q1", text: "A book costs ?200. A shopkeeper offers a 10% discount. What is the sale price?", type: "aptitude", options: ["?180", "?190", "?195", "?185"] },
  { id: "Q2", text: "A train covers 300 km in 5 hours. Speed?", type: "aptitude", options: ["50 km/h", "55 km/h", "60 km/h", "65 km/h"] },
  { id: "Q3", text: "Average of 24, 28, 32, 36 is:", type: "aptitude", options: ["28", "30", "32", "34"] },
  { id: "Q4", text: "Two students appeared at an examination. One of them secured 9 marks more than the other and his marks was 56% of the sum of their marks. The marks obtained by them are:", type: "aptitude", options: ["39, 30", "41, 32", "42, 33", "43, 34"] },
  { id: "Q5", text: "The price of 10 chairs is equal to that of 4 tables. The price of 15 chairs and 2 tables together is Rs. 4000. The total price of 12 chairs and 3 tables is:", type: "aptitude", options: ["Rs. 3500", "Rs. 3750", "Rs. 3840", "Rs. 3900"] },
  { id: "Q6", text: "An accurate clock shows 8 o’clock in the morning. Through how many degrees will the hour hand rotate when the clock shows 2 o’clock in the afternoon?", type: "aptitude", options: ["144°", "150°", "168°", "180°"] },
  { id: "Q7", text: "If one-third of one-fourth of a number is 15, then three-tenth of that number is:", type: "aptitude", options: ["35", "36", "45", "54"] },
  { id: "Q8", text: "Parrot : Cage :: Man : ?", type: "aptitude", options: ["Home", "Life", "House", "Prison"] },
  { id: "Q9", text: "If RUN is written as SVO, how is FUN written?", type: "aptitude", options: ["FVN", "GVO", "GUN", "FVO"] },
  { id: "Q10", text: "In a certain code, STAR is written as TUBS. How is MOON written in that code?", type: "aptitude", options: ["NPPM", "NPPO", "NQOP", "NNOM"] },
  { id: "Q11", text: "Find the direction which replaces [?] in the following.", type: "aptitude", options: ["N", "NE", "W", "SW"], visualSlot: { alt: "Reserved direction diagram slot", placement: "side" } },
  { id: "Q12", text: "Which of the following letters is 6th to the right of the 12th letter from the left in the English alphabet?", type: "aptitude", options: ["Q", "R", "S", "T"] },
  { id: "Q13", text: "Choose the alternative which closely resembles the mirror image of the given combination.", type: "aptitude", options: ["1", "2", "3", "4"], visualSlot: { alt: "Reserved mirror-image visual slot", placement: "below" } },
  { id: "Q14", text: "Choose the alternative which closely resembles the water-image of the given combination.", type: "aptitude", options: ["1", "2", "3", "4"], visualSlot: { alt: "Reserved water-image visual slot", placement: "below" } },
  { id: "Q15", text: "Even if it rains I shall come means ……", type: "aptitude", options: ["if I come it will not rain", "if it rains I shall not come", "I will certainly come whether it rains or not", "whenever there is rain I shall come"] },
  { id: "Q16", text: "The word most similar to “HARMONY”?", type: "aptitude", options: ["Peace", "Noise", "Anger", "Fight"] },
  { id: "Q17", text: "The correct meaning of the proverb/idiom: “To put one’s hand to plough”", type: "aptitude", options: ["To take up agricultural farming", "To take a difficult task", "To get entangled into unnecessary things", "Take interest in technical work"] },
  { id: "Q18", text: "Find the correctly spelt word:", type: "aptitude", options: ["Efficient", "Treatmeant", "Beterment", "Employd"] },
  { id: "Q19", text: "One Word Substitute: Extreme old age when a man behaves like a fool", type: "aptitude", options: ["Imbecility", "Senility", "Dotage", "Superannuation"] },
  { id: "Q20", text: "Fate smiles ____________ those who untiringly grapple with stark realities of life.", type: "aptitude", options: ["with", "over", "on", "round"] },
].map((question) => ({ ...question, type: question.type as "aptitude" | "psychometric", options: question.options?.map((option, index) => `${aptitudeOptionLabels[index]}. ${option}`) }));

const psychometricQuestions: Question[] = [
  { id: "Q21", text: "I enjoy fixing or repairing things at home.", type: "psychometric" },
  { id: "Q22", text: "I like outdoor tasks such as gardening or setting up sports equipment.", type: "psychometric" },
  { id: "Q23", text: "I enjoy practical science experiments in the lab.", type: "psychometric" },
  { id: "Q24", text: "I prefer building or making models with my hands.", type: "psychometric" },
  { id: "Q25", text: "I feel confident using simple tools or devices.", type: "psychometric" },
  { id: "Q26", text: "I enjoy solving puzzles or logical problems.", type: "psychometric" },
  { id: "Q27", text: "I like reading about science, technology or how things work.", type: "psychometric" },
  { id: "Q28", text: "I enjoy finding patterns in numbers or information.", type: "psychometric" },
  { id: "Q29", text: "I often ask “why” and “how” to understand things better.", type: "psychometric" },
  { id: "Q30", text: "I like experimenting to discover new solutions.", type: "psychometric" },
  { id: "Q31", text: "I enjoy drawing, painting, music, or creative writing.", type: "psychometric" },
  { id: "Q32", text: "I like designing posters, models or visual presentations.", type: "psychometric" },
  { id: "Q33", text: "I enjoy finding new, imaginative ways to express ideas.", type: "psychometric" },
  { id: "Q34", text: "I prefer assignments where I can be creative rather than memorise facts.", type: "psychometric" },
  { id: "Q35", text: "I like performing or showing my creative work to others.", type: "psychometric" },
  { id: "Q36", text: "I feel satisfied when I help classmates understand a topic.", type: "psychometric" },
  { id: "Q37", text: "I enjoy working in groups on class projects.", type: "psychometric" },
  { id: "Q38", text: "I like volunteering for school or community activities.", type: "psychometric" },
  { id: "Q39", text: "I feel comfortable listening and supporting friends with problems.", type: "psychometric" },
  { id: "Q40", text: "I often explain ideas to others to help them learn.", type: "psychometric" },
  { id: "Q41", text: "I enjoy leading group tasks or organising classmates.", type: "psychometric" },
  { id: "Q42", text: "I like convincing others about a good idea.", type: "psychometric" },
  { id: "Q43", text: "I feel excited about starting new projects or small ventures.", type: "psychometric" },
  { id: "Q44", text: "I take initiative when a group needs direction.", type: "psychometric" },
  { id: "Q45", text: "I enjoy planning events to reach a goal.", type: "psychometric" },
  { id: "Q46", text: "I prefer tasks that follow clear rules and steps.", type: "psychometric" },
  { id: "Q47", text: "I enjoy making lists, schedules or keeping checklists.", type: "psychometric" },
  { id: "Q48", text: "I like subjects where answers are clear and definite.", type: "psychometric" },
  { id: "Q49", text: "I feel comfortable doing organised, routine work.", type: "psychometric" },
  { id: "Q50", text: "I keep my notes and study materials neat and systematic.", type: "psychometric" },
  { id: "Q51", text: "I am curious to learn about many different topics.", type: "psychometric" },
  { id: "Q52", text: "I enjoy trying new activities or ways of learning.", type: "psychometric" },
  { id: "Q53", text: "I like assignments that let me explore ideas freely.", type: "psychometric" },
  { id: "Q54", text: "I prefer routine tasks to trying new ways of learning. (R)", type: "psychometric" },
  { id: "Q55", text: "I make a plan before I start homework or projects.", type: "psychometric" },
  { id: "Q56", text: "I finish my schoolwork before I relax or play.", type: "psychometric" },
  { id: "Q57", text: "I check my assignments carefully for mistakes.", type: "psychometric" },
  { id: "Q58", text: "I often leave tasks unfinished until later. (R)", type: "psychometric" },
  { id: "Q59", text: "I enjoy speaking up in class or group discussions.", type: "psychometric" },
  { id: "Q60", text: "I feel energised when I work with classmates.", type: "psychometric" },
  { id: "Q61", text: "I find it easy to make new friends at school.", type: "psychometric" },
  { id: "Q62", text: "I feel drained by group activities and prefer to avoid them. (R)", type: "psychometric" },
  { id: "Q63", text: "I try to get along with most of my classmates.", type: "psychometric" },
  { id: "Q64", text: "I prefer cooperating rather than arguing in a group.", type: "psychometric" },
  { id: "Q65", text: "I offer help when classmates are having trouble.", type: "psychometric" },
  { id: "Q66", text: "I often argue my point even when others disagree. (R)", type: "psychometric" },
  { id: "Q67", text: "I worry before exams or important events.", type: "psychometric" },
  { id: "Q68", text: "I get upset when my plans do not go well.", type: "psychometric" },
  { id: "Q69", text: "I find it hard to relax when I have a lot of work.", type: "psychometric" },
  { id: "Q70", text: "I remain calm and unbothered when things go wrong. (R)", type: "psychometric" },
];

export const questions: Question[] = [...aptitudeQuestions, ...psychometricQuestions];
export const TOTAL_QUESTIONS = questions.length;
export const QUESTIONS_PER_PAGE = 5;
export const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);
