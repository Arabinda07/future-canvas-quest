import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Answer Key (Q1–Q20) ───
const ANSWER_KEY: Record<string, string> = {
  Q1:"A",Q2:"C",Q3:"B",Q4:"C",Q5:"D",Q6:"D",Q7:"D",
  Q8:"D",Q9:"B",Q10:"B",Q11:"A",Q12:"B",Q13:"B",Q14:"D",
  Q15:"C",Q16:"A",Q17:"B",Q18:"A",Q19:"C",Q20:"C",
};

const REVERSE_QUESTIONS = new Set(["Q54","Q58","Q62","Q66","Q70"]);

// ─── Text Snippets Lookup Table ───
const SNIPPETS = {
  intro: "This report has been prepared to help you understand your unique strengths and explore the academic and career paths where you are most likely to thrive.",
  disclaimer: "Note: This report offers insights based on standardized psychometric data. It is meant to guide exploration — not limit your choices. Final career decisions should consider your goals, exposure, and evolving interests.",
  tieNote: "Note: Having multiple core strengths is common and indicates a versatile and well-rounded profile.",

  riasec: {
    R: {
      label: "Realistic",
      title: "The 'Doer'",
      def: "You enjoy practical, hands-on work and are skilled with tools, machines, and physical activities. You prefer to work with tangible things you can see and touch, and you learn best by doing. In the Indian context, this mindset is the foundation of our engineering and infrastructure backbone.",
      activities: ["Join a workshop on robotics, carpentry, or electronics.", "Take part in maker fairs or school repair clubs."],
      careers: ["Mechanical, Civil, or Electrical Engineering", "Architecture & Urban Planning", "Robotics & Automation", "Agriculture Technology (Agritech)", "Merchant Navy or Defence Services"],
    },
    I: {
      label: "Investigative",
      title: "The 'Thinker'",
      def: "You are analytical, curious, and enjoy solving complex problems through research, data, and experimentation. You are drawn to ideas and thrive on understanding how things work. This is the mindset that excels in competitive exams and deep-tech fields.",
      activities: ["Design a science fair project.", "Learn to use data analysis or coding tools."],
      careers: ["Data Scientist or AI/ML Specialist", "Scientific Research (e.g., at ISRO, CSIR labs)", "Doctor, Surgeon, or Veterinarian", "Financial Analyst or Equity Researcher", "Cyber Security Analyst or Ethical Hacker"],
    },
    A: {
      label: "Artistic",
      title: "The 'Creator'",
      def: "You are imaginative, expressive, and enjoy unstructured activities where you can use your creativity. You are drawn to self-expression through art, music, design, or writing. This trait is driving India's booming design and media industries.",
      activities: ["Join creative writing, music, or art clubs.", "Design posters, animations, or short films."],
      careers: ["Graphic Designer or UI/UX Designer", "Animator or VFX Artist", "Fashion or Interior Designer", "Content Creator, Writer, or Journalist", "Architect or Film Director"],
    },
    S: {
      label: "Social",
      title: "The 'Helper'",
      def: "You are empathetic, cooperative, and enjoy working with people to teach, help, and provide service. You find meaning in collaboration and contributing to the community. This is the core of India's strong service and education sectors.",
      activities: ["Volunteer for school mentorship or community programs.", "Participate in group teaching or awareness campaigns."],
      careers: ["Teacher, Professor, or Corporate Trainer", "Clinical Psychologist or Counselor", "Social Worker (with NGOs or in CSR)", "Doctor, Nurse, or Physiotherapist", "Human Resources (HR) Manager"],
    },
    E: {
      label: "Enterprising",
      title: "The 'Persuader'",
      def: "You are ambitious, energetic, and enjoy leading teams, persuading others, and taking on business challenges. You are a natural leader who enjoys setting and achieving goals, reflecting India's vibrant startup ecosystem.",
      activities: ["Start a small business or initiative.", "Take leadership in student clubs or events."],
      careers: ["Entrepreneur or Startup Founder", "Business Development or Sales Manager", "Marketing or Brand Manager", "Management Consultant", "Lawyer or Public Policy Analyst"],
    },
    C: {
      label: "Conventional",
      title: "The 'Organizer'",
      def: "You are detail-oriented, methodical, and dependable. You like structure, planning, and working with data in a precise and organized manner. This trait is essential for careers that form the backbone of our economy, like finance and administration.",
      activities: ["Help maintain school data or event records.", "Create spreadsheets, budgets, or plans for school projects."],
      careers: ["Chartered Accountant (CA) or Financial Auditor", "Data Analyst or Actuary", "Supply Chain & Logistics Manager", "Civil Services (e.g., IAS, IFS)", "Bank Officer or Operations Manager"],
    },
  },

  bigFive: {
    O: {
      label: "Openness",
      high: "You are curious and creative. For you, learning is about exploring new ideas, not just memorizing facts. This is a great asset for project-based work and for careers in fast-changing fields like technology and design.",
      low: "You are practical and prefer clear, proven methods. Your strength lies in your reliability and ability to master established systems. This makes you dependable and efficient, especially in fields that require precision and consistency.",
    },
    Co: {
      label: "Conscientiousness",
      high: "You are organized, disciplined, and have a strong sense of duty. This is a significant advantage for managing the demanding syllabus of the Indian education system and for excelling in any profession that requires reliability and planning.",
      low: "You are flexible, spontaneous, and can adapt quickly to changing plans. While this is a strength, you can boost your academic success by using tools like a daily planner to manage deadlines and stay on track with your studies.",
    },
    Ex: {
      label: "Extraversion",
      high: "You are outgoing and energized by interacting with people. You are likely to be a confident presenter and enjoy group projects. This is a natural leadership quality that is highly valued in team-oriented careers.",
      low: "You are reflective and thoughtful, preferring to focus deeply on tasks. You work best independently or in small groups. This ability to concentrate is a superpower in fields that require deep analysis and expertise.",
    },
    Ag: {
      label: "Agreeableness",
      high: "You are cooperative, empathetic, and a natural team player. You build harmony in groups and are skilled at understanding others' perspectives. This is an essential skill for collaborative work and for any career that involves helping people.",
      low: "You are direct, assertive, and not afraid to challenge ideas. This can be a strong leadership trait, as you are willing to voice your opinion to achieve the best results. Balance this by practicing active listening to build consensus.",
    },
    Ne: {
      label: "Neuroticism",
      high: "You feel emotions deeply and are highly attuned to your environment. This sensitivity can be a great asset in creative and empathetic fields. Developing steady routines and mindfulness can help you manage stress and use this trait to your advantage.",
      low: "You remain calm and composed, even under pressure. This resilience is a powerful strength that helps you handle challenges, deadlines, and competitive situations with confidence.",
    },
  },

  flags: {
    HIGH_NEUROTICISM: "You tend to experience emotions intensely, which is part of being self-aware. Focus on building calm habits like journaling or exercise. Emotional depth is a strength when balanced with resilience.",
    LOW_CONSCIENTIOUSNESS: "You may prefer flexibility over strict planning. To ensure success, start by breaking big goals into smaller, manageable steps and use daily checklists to track your progress.",
    No_Flags: "Your profile is consistent and provides a solid foundation for your academic and career journey.",
  },

  aptitude: {
    N: { label: "Numerical Reasoning", high: "Strong quantitative aptitude, excellent for subjects like Physics and Maths.", moderate: "Solid numerical skills, suitable for core subjects with dedicated practice.", low: "Will benefit from strengthening foundational concepts in number-based logic." },
    L: { label: "Logical Reasoning", high: "Excellent logical and abstract reasoning, a key skill for problem-solving.", moderate: "Good pattern recognition skills that can be sharpened with practice.", low: "Will benefit from focusing on step-by-step problem-solving techniques." },
    V: { label: "Verbal Reasoning", high: "Strong verbal comprehension and expression, excellent for theory-heavy subjects.", moderate: "Good communication skills; can be enhanced by wider reading.", low: "Will benefit from regular reading and vocabulary-building exercises." },
  },

  actions: {
    Foundational_Science: [
      "CBSE Skill Subjects: Explore a subject like Artificial Intelligence or Information Technology to see if you enjoy applying your technical aptitude.",
      "School Clubs: Actively participate in the Science and Maths Circle to discover which topics in STEM truly excite you.",
      "Competitions: Prepare for the Junior Science Olympiad (JSO) to test your skills and build a strong foundation.",
    ],
    Foundational_Commerce: [
      "CBSE Skill Subjects: Explore a subject like Banking & Insurance or Marketing to get a practical feel for business concepts.",
      "School Activities: Volunteer to manage the accounts for a school club or event to see if you enjoy organized, detail-oriented work.",
      "Competitions: Participate in school-level business quizzes or case study competitions to explore the world of commerce.",
    ],
    Foundational_Humanities: [
      "CBSE Skill Subjects: Explore a subject like Mass Media or Tourism to see how your communication skills apply in the real world.",
      "School Clubs: Join the Debate Club, Model UN, or the school magazine to hone your verbal and analytical abilities.",
      "Competitions: Participate in elocution, essay writing, or social science exhibitions to build confidence and showcase your talents.",
    ],
    Specialization_Science: [
      "Elective Subjects: To deepen your specialization, consider choosing Computer Science, Engineering Graphics, or Biotechnology as your elective.",
      "CBSE Project: Focus your mandatory project on a topic aligned with a potential career, such as renewable energy, AI applications, or a local biodiversity study.",
      "Olympiads & Exams: Prepare strategically for the National Science Olympiad (NSO), National Standard Examination (NSE), and major entrance exams like JEE/NEET.",
    ],
    Specialization_Commerce: [
      "Elective Subjects: To gain a competitive edge, consider choosing Applied Mathematics or Informatics Practices to strengthen your analytical skills for finance.",
      "CBSE Project: Focus your mandatory project on a topic like the stock market, digital marketing strategies, or a case study of a local business.",
      "Olympiads & Exams: Prepare for the International Commerce Olympiad (ICO), National Accounting Talent Search, and begin foundational studies for professional exams like CA/CS.",
    ],
    Specialization_Humanities: [
      "Elective Subjects: To build expertise, consider choosing Psychology, Legal Studies, or Fine Arts to deepen your understanding of your chosen field.",
      "CBSE Project: Focus your mandatory project on a topic like local history, a sociological survey, or an analysis of contemporary media to build a portfolio.",
      "Olympiads & Exams: Prepare for the International Social Science Olympiad (ISSO) and relevant entrance exams like CLAT (for Law) or begin foundational reading for Civil Services.",
    ],
  },

  narratives: {
    Foundational_High: "Your strongest academic direction appears to be in the {Stream} stream. You show core strengths in {Aptitudes}, supported by interests in {Interests} — a combination that aligns well with subjects in this stream, making it an excellent path for you to explore.",
    Foundational_Moderate: "Your profile indicates a good alignment with the {Stream} stream, based on your core strengths in {Aptitudes} and interests in {Interests}. As you also have a versatile skill set, this is a great time to explore subjects in this stream while also staying open to other areas that interest you.",
    Foundational_Low: "Your versatile profile shows strong potential in multiple areas, particularly aligning with the {Stream1} and {Stream2} streams. Your core strengths in {Aptitudes}, supported by your interests in {Interests}, are valuable assets you can apply in either direction. This is an excellent opportunity to explore both paths.",
    Specialization_High: "Your profile validates your choice of the {Stream} stream. Your core strengths in {Aptitudes}, supported by interests in {Interests}, are a combination that aligns perfectly with the demands of this specialization. With consistent effort, you can excel here.",
    Specialization_Moderate: "Your profile validates your choice of the {Stream} stream. While your strengths in {Aptitudes} and interests in {Interests} align well, your versatile skill set suggests that continuing to explore related specializations could be beneficial as you finalize your long-term goals.",
    Specialization_Low: "Your versatile profile shows strong potential for success in both the {Stream1} and {Stream2} specializations. Your core strengths in {Aptitudes} and interests in {Interests} are transferable assets. This is an excellent opportunity to deepen your knowledge in both areas before making a final commitment.",
  },
};

// ─── Scoring Functions ───
function scoreAptitude(answers: Record<string, string>) {
  let N_raw = 0, L_raw = 0, V_raw = 0;
  for (let i = 1; i <= 7; i++) {
    const a = (answers[`Q${i}`] || "").trim().toUpperCase();
    if (a === ANSWER_KEY[`Q${i}`]) N_raw++;
  }
  for (let i = 8; i <= 14; i++) {
    const a = (answers[`Q${i}`] || "").trim().toUpperCase();
    if (a === ANSWER_KEY[`Q${i}`]) L_raw++;
  }
  for (let i = 15; i <= 20; i++) {
    const a = (answers[`Q${i}`] || "").trim().toUpperCase();
    if (a === ANSWER_KEY[`Q${i}`]) V_raw++;
  }
  return {
    N_raw, N_scaled: r2((N_raw / 7) * 100),
    L_raw, L_scaled: r2((L_raw / 7) * 100),
    V_raw, V_scaled: r2((V_raw / 6) * 100),
  };
}

function convertPsychometric(answer: string, questionId: string): number {
  const a = (answer || "").trim().toUpperCase();
  if (!["A","B","C","D"].includes(a)) return 0;
  const forward: Record<string, number> = { A: 3, B: 2, C: 1, D: 0 };
  const reverse: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  return REVERSE_QUESTIONS.has(questionId) ? reverse[a] : forward[a];
}

function sumRange(answers: Record<string, string>, start: number, end: number): number {
  let total = 0;
  for (let i = start; i <= end; i++) {
    total += convertPsychometric(answers[`Q${i}`] || "", `Q${i}`);
  }
  return total;
}

function scorePsychometric(answers: Record<string, string>) {
  const R_raw = sumRange(answers, 21, 25), I_raw = sumRange(answers, 26, 30);
  const A_raw = sumRange(answers, 31, 35), S_raw = sumRange(answers, 36, 40);
  const E_raw = sumRange(answers, 41, 45), C_raw = sumRange(answers, 46, 50);
  const O_raw = sumRange(answers, 51, 54), Co_raw = sumRange(answers, 55, 58);
  const Ex_raw = sumRange(answers, 59, 62), Ag_raw = sumRange(answers, 63, 66);
  const Ne_raw = sumRange(answers, 67, 70);

  return {
    R_raw, R_scaled: r2((R_raw / 15) * 100),
    I_raw, I_scaled: r2((I_raw / 15) * 100),
    A_raw, A_scaled: r2((A_raw / 15) * 100),
    S_raw, S_scaled: r2((S_raw / 15) * 100),
    E_raw, E_scaled: r2((E_raw / 15) * 100),
    C_raw, C_scaled: r2((C_raw / 15) * 100),
    O_raw, O_scaled: r2((O_raw / 12) * 100),
    Co_raw, Co_scaled: r2((Co_raw / 12) * 100),
    Ex_raw, Ex_scaled: r2((Ex_raw / 12) * 100),
    Ag_raw, Ag_scaled: r2((Ag_raw / 12) * 100),
    Ne_raw, Ne_scaled: r2((Ne_raw / 12) * 100),
  };
}

function r2(n: number): number { return Math.round(n * 100) / 100; }

function getLevel(score: number, trait?: string): string {
  if (trait === "Ex") return score >= 60 ? "High" : score >= 40 ? "Moderate" : "Low";
  return score >= 70 ? "High" : score >= 40 ? "Moderate" : "Low";
}

function computeStreams(apt: ReturnType<typeof scoreAptitude>, psy: ReturnType<typeof scorePsychometric>) {
  const Science_Score = r2(0.50 * apt.N_scaled + 0.25 * apt.L_scaled + 0.10 * psy.I_scaled + 0.08 * psy.R_scaled + 0.07 * ((psy.Co_scaled + psy.O_scaled) / 2));
  const Commerce_Score = r2(0.40 * apt.N_scaled + 0.30 * apt.V_scaled + 0.15 * psy.C_scaled + 0.10 * psy.E_scaled + 0.05 * psy.Co_scaled);
  const Humanities_Score = r2(0.50 * apt.V_scaled + 0.20 * psy.O_scaled + 0.15 * psy.S_scaled + 0.10 * psy.A_scaled + 0.05 * psy.Ag_scaled);

  const streams = [
    { name: "Science", score: Science_Score },
    { name: "Commerce", score: Commerce_Score },
    { name: "Humanities", score: Humanities_Score },
  ].sort((a, b) => b.score - a.score);

  const gap = streams[0].score - streams[1].score;
  const Confidence = gap >= 10 ? "High" : gap >= 5 ? "Moderate" : "Low";

  const flags: string[] = [];
  if (psy.Ne_scaled >= 75) flags.push("HIGH_NEUROTICISM");
  if (psy.Co_scaled <= 35) flags.push("LOW_CONSCIENTIOUSNESS");

  return { Science_Score, Commerce_Score, Humanities_Score, Top_Stream: streams[0].name, Confidence, flags, streams };
}

// ─── Report Assembly ───
function assembleReport(
  studentName: string, studentClass: string, apt: ReturnType<typeof scoreAptitude>,
  psy: ReturnType<typeof scorePsychometric>, streamData: ReturnType<typeof computeStreams>
) {
  const { Top_Stream, Confidence, flags, streams } = streamData;

  // Determine class stage
  const classNum = parseInt(studentClass.replace(/\D/g, ""), 10) || 10;
  const stage = classNum <= 10 ? "Foundational" : "Specialization";

  // Top aptitudes
  const aptScores = [
    { key: "N", label: "Numerical", scaled: apt.N_scaled },
    { key: "L", label: "Logical", scaled: apt.L_scaled },
    { key: "V", label: "Verbal", scaled: apt.V_scaled },
  ].sort((a, b) => b.scaled - a.scaled);
  const topAptitudes = aptScores.filter(a => a.scaled >= 70).map(a => a.label);
  if (topAptitudes.length === 0) topAptitudes.push(aptScores[0].label);
  const aptitudesText = topAptitudes.join(" & ");

  // Top 2 RIASEC
  const riasecScores = [
    { key: "R", scaled: psy.R_scaled }, { key: "I", scaled: psy.I_scaled },
    { key: "A", scaled: psy.A_scaled }, { key: "S", scaled: psy.S_scaled },
    { key: "E", scaled: psy.E_scaled }, { key: "C", scaled: psy.C_scaled },
  ].sort((a, b) => b.scaled - a.scaled);
  const topRiasec = riasecScores.slice(0, 3).filter(r => r.scaled > 0);
  const interestsText = topRiasec.map(r => (SNIPPETS.riasec as any)[r.key].label).join(" & ");

  // Dominant Big Five traits
  const bigFiveScores = [
    { key: "O", scaled: psy.O_scaled }, { key: "Co", scaled: psy.Co_scaled },
    { key: "Ex", scaled: psy.Ex_scaled }, { key: "Ag", scaled: psy.Ag_scaled },
    { key: "Ne", scaled: psy.Ne_scaled },
  ];
  const dominantTraits = bigFiveScores
    .map(t => ({ ...t, distance: Math.abs(t.scaled - 50) }))
    .sort((a, b) => b.distance - a.distance)
    .slice(0, 2)
    .map(t => (SNIPPETS.bigFive as any)[t.key].label);
  const traitsText = dominantTraits.join(" & ");

  // Narrative
  const narrativeKey = `${stage}_${Confidence}` as keyof typeof SNIPPETS.narratives;
  let narrative = SNIPPETS.narratives[narrativeKey] || SNIPPETS.narratives[`${stage}_Moderate` as keyof typeof SNIPPETS.narratives];
  narrative = narrative
    .replace("{Stream}", Top_Stream)
    .replace("{Stream1}", streams[0].name)
    .replace("{Stream2}", streams[1].name)
    .replace("{Aptitudes}", aptitudesText)
    .replace("{Interests}", interestsText);

  // Actions
  const streamKey = Top_Stream === "Science" ? "Science" : Top_Stream === "Commerce" ? "Commerce" : "Humanities";
  const actionKey = `${stage}_${streamKey}` as keyof typeof SNIPPETS.actions;
  const actions = SNIPPETS.actions[actionKey] || SNIPPETS.actions[`${stage}_Science` as keyof typeof SNIPPETS.actions];

  // Section A
  const sectionA = {
    coreProfile: {
      aptitudes: aptitudesText,
      interests: interestsText,
      traits: traitsText,
    },
    narrative,
    showTieNote: Confidence === "Low",
  };

  // Section B
  const sectionB = [
    { key: "N", label: SNIPPETS.aptitude.N.label, scaled: apt.N_scaled, level: getLevel(apt.N_scaled), interpretation: (SNIPPETS.aptitude.N as any)[getLevel(apt.N_scaled).toLowerCase()] },
    { key: "L", label: SNIPPETS.aptitude.L.label, scaled: apt.L_scaled, level: getLevel(apt.L_scaled), interpretation: (SNIPPETS.aptitude.L as any)[getLevel(apt.L_scaled).toLowerCase()] },
    { key: "V", label: SNIPPETS.aptitude.V.label, scaled: apt.V_scaled, level: getLevel(apt.V_scaled), interpretation: (SNIPPETS.aptitude.V as any)[getLevel(apt.V_scaled).toLowerCase()] },
  ];

  // Section C
  const sectionC = {
    riasec: topRiasec.map(r => {
      const data = (SNIPPETS.riasec as any)[r.key];
      return { key: r.key, label: data.label, title: data.title, score: r.scaled, def: data.def, activities: data.activities, careers: data.careers };
    }),
    bigFive: bigFiveScores.map(t => {
      const data = (SNIPPETS.bigFive as any)[t.key];
      const level = getLevel(t.scaled, t.key);
      return { key: t.key, label: data.label, score: t.scaled, level, interpretation: level === "High" ? data.high : data.low };
    }),
  };

  // Section D
  const sectionD = actions.map(a => {
    const [area, ...rest] = a.split(": ");
    return { area: area.trim(), recommendation: rest.join(": ").trim() };
  });

  // Section E
  const sectionE = topRiasec.map(r => {
    const data = (SNIPPETS.riasec as any)[r.key];
    return { label: data.label, careers: data.careers };
  });

  // Section F
  const sectionF = flags.length > 0
    ? flags.map(f => ({ flag: f, text: (SNIPPETS.flags as any)[f] || "" }))
    : [{ flag: "No_Flags", text: SNIPPETS.flags.No_Flags }];

  return {
    studentName,
    studentClass,
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    intro: SNIPPETS.intro,
    disclaimer: SNIPPETS.disclaimer,
    topStream: Top_Stream,
    confidence: Confidence,
    sectionA,
    sectionB,
    sectionC,
    sectionD,
    sectionE,
    sectionF,
    scores: {
      aptitude: { N: apt.N_scaled, L: apt.L_scaled, V: apt.V_scaled },
      riasec: { R: psy.R_scaled, I: psy.I_scaled, A: psy.A_scaled, S: psy.S_scaled, E: psy.E_scaled, C: psy.C_scaled },
      bigFive: { O: psy.O_scaled, Co: psy.Co_scaled, Ex: psy.Ex_scaled, Ag: psy.Ag_scaled, Ne: psy.Ne_scaled },
      streams: { Science: streamData.Science_Score, Commerce: streamData.Commerce_Score, Humanities: streamData.Humanities_Score },
    },
  };
}

// ─── Handler ───
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { assessmentId } = await req.json();
    if (!assessmentId) {
      return new Response(JSON.stringify({ error: "Missing assessmentId" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: assessment, error: fetchErr } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", assessmentId)
      .single();

    if (fetchErr || !assessment) {
      return new Response(JSON.stringify({ error: "Assessment not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // If report already generated, return it
    if (assessment.generated_report) {
      return new Response(JSON.stringify({ report: assessment.generated_report }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const answers = (assessment.answers || {}) as Record<string, string>;

    // Score
    const apt = scoreAptitude(answers);
    const psy = scorePsychometric(answers);
    const streamData = computeStreams(apt, psy);

    // Assemble report
    const report = assembleReport(
      assessment.student_name,
      assessment.student_class || "X",
      apt, psy, streamData,
    );

    // Save to DB
    const allScores = { ...apt, ...psy, ...streamData };
    const { error: updateErr } = await supabase
      .from("assessments")
      .update({ generated_report: report, scores: allScores, updated_at: new Date().toISOString() })
      .eq("id", assessmentId);

    if (updateErr) console.error("Failed to save report:", updateErr);

    return new Response(JSON.stringify({ report }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    console.error("generate-report error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
