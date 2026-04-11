import { recommendationRuleMetadata, scoreAssessment } from "./recommendationRules.ts";
import type {
  AptitudeCode,
  AptitudeTableRow,
  AssessmentAnswers,
  CareerClusterRecommendation,
  CounsellingFlagDetail,
  InterestCode,
  InterestInsight,
  PersonalityCode,
  PersonalityInsight,
  PersonalityLevel,
  Report,
  ReportStudentProfile,
  StreamCode,
  StreamRecommendationDetail,
} from "./types.ts";

interface BuildAssessmentReportInput {
  id: string;
  sessionId: string;
  studentId: string;
  generatedAt: string;
  answers: AssessmentAnswers;
  student: ReportStudentProfile;
}

const REPORT_TITLE = "CAREER CLARITY REPORT";
const REPORT_SUBTITLE = "An Analysis of Aptitude, Interests, and Personality for Career Exploration";
const EXACT_DISCLAIMER =
  "Disclaimer: This report is a tool for guidance based on your responses. It is one important data point among many, including academic performance, personal aspirations, and realworld experiences. Final career and academic decisions should be made in consultation with parents, teachers, and qualified career counsellors.";
const EXACT_NO_FLAG_SENTENCE =
  "No major concerns were identified. The student's profile is consistent and provides a solid foundation.";

const RIASEC_INSIGHTS: Record<
  InterestCode,
  {
    definition: string;
    practicalActivities: [string, string];
  }
> = {
  R: {
    definition: "You prefer hands-on work, practical tools, and tasks where you can see a concrete result.",
    practicalActivities: [
      "Join robotics, maker, or model-building activities where you assemble or test something real.",
      "Volunteer for lab setup, exhibition builds, or maintenance-style school projects that need practical problem solving.",
    ],
  },
  I: {
    definition: "You enjoy investigating how things work, testing ideas, and solving questions through evidence and logic.",
    practicalActivities: [
      "Take part in science lab investigations or data-analysis mini projects and record what each result suggests.",
      "Prepare for Olympiads or puzzle-based competitions with a weekly log of hypotheses, mistakes, and improvements.",
    ],
  },
  A: {
    definition: "You like expressing ideas through writing, design, performance, or original creative work.",
    practicalActivities: [
      "Contribute to the school magazine, stage production, poster team, or digital media club.",
      "Build a small portfolio through storytelling, music, sketching, photography, or visual design projects.",
    ],
  },
  S: {
    definition: "You gain energy from helping, teaching, mentoring, or working directly with people.",
    practicalActivities: [
      "Support peer tutoring, reading buddy sessions, or community teaching drives in school.",
      "Take responsibility in wellbeing, outreach, or event teams where coordination and empathy matter.",
    ],
  },
  E: {
    definition: "You are drawn to leading, persuading, pitching ideas, and taking initiative in public settings.",
    practicalActivities: [
      "Join entrepreneurship clubs, business fests, or student council roles that require planning and persuasion.",
      "Practice pitching an idea, leading a fundraiser, or managing a small event budget with classmates.",
    ],
  },
  C: {
    definition: "You prefer structure, accuracy, and tasks that reward organisation, process, and careful follow-through.",
    practicalActivities: [
      "Take charge of documentation, budgeting, scheduling, or inventory tasks in clubs and school events.",
      "Build a system for notes, deadlines, and revision tracking to test whether organised work feels satisfying.",
    ],
  },
};

const PERSONALITY_LEVELS = {
  low: 35,
  high: 65,
} as const;

function roundScore(score: number) {
  return Math.round(score);
}

function getTopScores<Code extends string>(
  scores: Record<Code, { code: Code; scaled: number }>,
  order: Code[],
  count: number,
) {
  return order
    .map((code) => scores[code])
    .sort((left, right) => right.scaled - left.scaled || order.indexOf(left.code) - order.indexOf(right.code))
    .slice(0, count);
}

function getPersonalityLevel(score: number): PersonalityLevel {
  if (score <= PERSONALITY_LEVELS.low) {
    return "Low";
  }

  if (score >= PERSONALITY_LEVELS.high) {
    return "High";
  }

  return "Balanced";
}

function getBalancedImplication(code: PersonalityCode, level: PersonalityLevel) {
  const label = recommendationRuleMetadata.personalityLabels[code];

  if (level === "High") {
    return `High ${label.toLowerCase()} can be a strength, while still needing balance when pressure or expectations rise.`;
  }

  if (level === "Low") {
    return `Low ${label.toLowerCase()} is not a weakness, but the student may need deliberate support in situations that lean heavily on it.`;
  }

  return `${label} sits in a balanced range, which can support flexibility across different learning and work settings.`;
}

function getAptitudeLevel(score: number): AptitudeTableRow["level"] {
  if (score >= 75) {
    return "Strong";
  }

  if (score >= 40) {
    return "Developing";
  }

  return "Emerging";
}

function getAptitudeInterpretation(code: AptitudeCode, score: number) {
  const level = getAptitudeLevel(score);

  if (code === "N") {
    return level === "Strong"
      ? "Strong support for Mathematics, Physics numericals, Economics data work, and Accountancy calculations."
      : level === "Developing"
        ? "Useful support for Mathematics and data-heavy CBSE subjects, with room to strengthen speed and accuracy."
        : "Needs more practice for Mathematics-heavy or calculation-led CBSE subjects before this becomes a core advantage.";
  }

  if (code === "L") {
    return level === "Strong"
      ? "Supports Mathematics reasoning, Computer Science logic, and structured Science problem solving."
      : level === "Developing"
        ? "Can support logical sections in Mathematics and Science, especially with repeated practice."
        : "Would benefit from more structured reasoning practice in Mathematics, Science, and coding-style tasks.";
  }

  return level === "Strong"
    ? "Supports English, Humanities writing, Business Studies case responses, and theory-heavy CBSE subjects."
    : level === "Developing"
      ? "Provides a workable base for language-rich subjects, with scope to sharpen reading and written clarity."
      : "Needs deliberate support in reading, expression, and theory-heavy subjects that rely on verbal clarity.";
}

function buildAptitudeTable(scoring: ReturnType<typeof scoreAssessment>): AptitudeTableRow[] {
  return recommendationRuleMetadata.aptitudeOrder.map((code) => {
    const score = scoring.aptitude[code];

    return {
      code,
      label: score.label,
      score: score.scaled,
      level: getAptitudeLevel(score.scaled),
      cbseSubjectInterpretation: getAptitudeInterpretation(code, score.scaled),
    };
  });
}

function buildSnapshotBullets(scoring: ReturnType<typeof scoreAssessment>): [string, string, string, string] {
  const topAptitude = getTopScores(scoring.aptitude, recommendationRuleMetadata.aptitudeOrder, 1)[0];
  const topInterests = getTopScores(scoring.interests, recommendationRuleMetadata.interestOrder, 2);
  const dominantTrait = scoring.dominantPersonalityTrait;

  return [
    `Top Aptitude: ${topAptitude.label} (${roundScore(topAptitude.scaled)}%)`,
    `Top 2 Interests: ${topInterests[0].label} and ${topInterests[1].label}`,
    `Dominant Personality Trait: ${dominantTrait.label} (${dominantTrait.direction}, ${roundScore(dominantTrait.score)}%)`,
    `Top Recommended Stream: ${scoring.topStream.label} (${scoring.confidence} confidence)`,
  ];
}

function buildStreamRationale(streamCode: StreamCode, scoring: ReturnType<typeof scoreAssessment>) {
  if (streamCode === "Science") {
    return `${scoring.aptitude.N.label} (${roundScore(scoring.aptitude.N.scaled)}%) and ${scoring.aptitude.L.label} (${roundScore(
      scoring.aptitude.L.scaled,
    )}%) are the strongest aptitude supports, while ${scoring.interests.I.label} and ${scoring.interests.R.label} reinforce investigation, experimentation, and practical problem solving. ${
      scoring.personality.Co.scaled <= 35
        ? "Lower conscientiousness means this fit improves with stronger routines and deadline support."
        : "Conscientiousness and openness help sustain deeper technical learning."
    }`;
  }

  if (streamCode === "Commerce") {
    return `${scoring.aptitude.N.label} (${roundScore(scoring.aptitude.N.scaled)}%) and ${scoring.aptitude.V.label} (${roundScore(
      scoring.aptitude.V.scaled,
    )}%) support commercial reasoning, while ${scoring.interests.C.label} and ${scoring.interests.E.label} point toward structure, systems, and initiative. ${
      scoring.personality.Co.scaled <= 35
        ? "Stronger planning habits would make this pathway easier to sustain."
        : "Conscientiousness adds useful follow-through for data, accounts, and business tasks."
    }`;
  }

  return `${scoring.aptitude.V.label} (${roundScore(scoring.aptitude.V.scaled)}%) is the key aptitude support, while ${scoring.interests.S.label} and ${scoring.interests.A.label} point toward people, ideas, and expression. ${scoring.personality.O.label} at ${roundScore(
    scoring.personality.O.scaled,
  )}% strengthens fit for exploratory, reflective, and communication-led pathways.`;
}

function describeDominantTrait(scoring: ReturnType<typeof scoreAssessment>) {
  const trait = scoring.dominantPersonalityTrait;

  if (trait.direction === "High") {
    return `${trait.label} is the strongest personality signal at ${roundScore(
      trait.score,
    )}%, which suggests this trait shows up clearly in everyday choices and learning style.`;
  }

  return `${trait.label} is the strongest personality signal at ${roundScore(
    trait.score,
  )}%, which suggests the student may prefer environments that do not demand this trait too heavily all the time.`;
}

function buildWhyBestFit(
  studentName: string,
  scoring: ReturnType<typeof scoreAssessment>,
  streamTable: StreamRecommendationDetail[],
) {
  const [topAptitude, secondAptitude] = getTopScores(scoring.aptitude, recommendationRuleMetadata.aptitudeOrder, 2);
  const [firstInterest, secondInterest] = getTopScores(scoring.interests, recommendationRuleMetadata.interestOrder, 2);
  const secondStream = streamTable[1];
  const gap = scoring.topStream.score - secondStream.score;

  return [
    `${studentName}'s profile supports ${scoring.topStream.label} through ${topAptitude.label} at ${roundScore(
      topAptitude.scaled,
    )}% and ${secondAptitude.label} at ${roundScore(secondAptitude.scaled)}%.`,
    `${firstInterest.label} and ${secondInterest.label} are the clearest interest signals, pointing toward environments that fit this stream well.`,
    describeDominantTrait(scoring),
    `${scoring.topStream.label} leads with a composite of ${roundScore(scoring.topStream.score)}%, staying ${roundScore(
      gap,
    )} points ahead of ${secondStream.label}, so the recommendation confidence is ${scoring.confidence.toLowerCase()}.`,
    `Taken together, these signals make ${scoring.topStream.label} the strongest stream to validate through subjects, projects, and competitions next.`,
  ];
}

function buildQuickActions(studentClass: ReportStudentProfile["class"], streamCode: StreamCode) {
  const junior = studentClass === "IX" || studentClass === "X";

  if (junior && streamCode === "Science") {
    return [
      "Pick a CBSE skill subject like AI or IT to test technical curiosity.",
      "Join robotics, science club, or lab demos and build one working model.",
      "Enter quizzes or exhibitions that reward experiments, models, and analytical thinking.",
    ];
  }

  if (junior && streamCode === "Commerce") {
    return [
      "Pick a CBSE skill subject like Financial Markets or IT for business exposure.",
      "Join budgeting, enterprise, or event-finance teams and track one real plan.",
      "Enter market-day, quiz, or pitch events to test commercial decision-making.",
    ];
  }

  if (junior && streamCode === "Humanities") {
    return [
      "Pick a CBSE skill subject like Design Thinking or Mass Media.",
      "Join debate, theatre, writing, or outreach clubs and lead one activity.",
      "Enter debates, MUNs, or literary events to test expression and empathy.",
    ];
  }

  if (!junior && streamCode === "Science") {
    return [
      "Choose elective combinations that keep Maths or Applied Maths in your pathway.",
      "Pick a CBSE project using experiments, coding, measurement, or data interpretation.",
      "Enter Olympiads, hackathons, or research fairs to test scientific stamina.",
    ];
  }

  if (!junior && streamCode === "Commerce") {
    return [
      "Choose elective combinations that keep Accountancy, Economics, or Applied Maths open.",
      "Pick a CBSE project using budgeting, market research, or operations data.",
      "Enter business-plan contests, finance quizzes, or simulations to test fit.",
    ];
  }

  return [
    "Choose elective combinations that keep Psychology, Sociology, or Political Science open.",
    "Pick a CBSE project using interviews, writing, surveys, or field observation.",
    "Enter debates, MUNs, writing contests, or social innovation challenges.",
  ];
}

function buildCareerClusters(streamCode: StreamCode): CareerClusterRecommendation[] {
  if (streamCode === "Science") {
    return [
      {
        title: "Engineering, Robotics, and Product Technology",
        reason: "Strong numerical and investigative scores support environments where systems, tools, and iterative problem solving matter.",
        isLessConventional: false,
      },
      {
        title: "Medical, Allied Health, and Biotech",
        reason: "Analytical ability and evidence-based interest can translate well into health, diagnostics, or lab-led pathways.",
        isLessConventional: false,
      },
      {
        title: "Forensic Science, Climate Tech, or Geospatial Analytics",
        reason: "This less conventional cluster still uses investigation, data, and practical application in emerging fields.",
        isLessConventional: true,
      },
    ];
  }

  if (streamCode === "Commerce") {
    return [
      {
        title: "Accounting, Finance, and Audit",
        reason: "Structured commercial pathways reward accuracy, numerical reasoning, and measurable decision making.",
        isLessConventional: false,
      },
      {
        title: "Business Analytics, Operations, and Strategy",
        reason: "This cluster fits students who want to work with systems, commercial data, and organisational decisions.",
        isLessConventional: false,
      },
      {
        title: "Sports Analytics, Revenue Operations, or Pricing Strategy",
        reason: "This less conventional cluster applies commercial thinking to fast-growing and digital-first sectors.",
        isLessConventional: true,
      },
    ];
  }

  return [
    {
      title: "Psychology, Education, and Human Development",
      reason: "Human-centred pathways fit students who want to work with behaviour, learning, support, or development.",
      isLessConventional: false,
    },
    {
      title: "Law, Media, and Public Policy",
      reason: "This cluster rewards communication, interpretation, and the ability to understand systems and people together.",
      isLessConventional: false,
    },
    {
      title: "UX Research, Behavioural Insights, or Cultural Strategy",
      reason: "This less conventional cluster uses humanities strengths in modern product, research, and communication-heavy roles.",
      isLessConventional: true,
    },
  ];
}

function buildCounsellingFlags(scoring: ReturnType<typeof scoreAssessment>): CounsellingFlagDetail[] {
  const flags: CounsellingFlagDetail[] = [];

  if (scoring.personality.Ne.scaled >= 75) {
    flags.push({
      flag: "HIGH_NEUROTICISM",
      score: roundScore(scoring.personality.Ne.scaled),
      empatheticFraming: "This may reflect high emotional sensitivity, especially during pressure or uncertainty.",
      supportiveNextStep: "Use check-ins, stress-management routines, and smaller milestones during important academic decisions.",
    });
  }

  if (scoring.personality.Co.scaled <= 35) {
    flags.push({
      flag: "LOW_CONSCIENTIOUSNESS",
      score: roundScore(scoring.personality.Co.scaled),
      empatheticFraming: "This can show up as planning or consistency challenges, not a lack of ability.",
      supportiveNextStep: "Use weekly planners, visible deadlines, and adult accountability to strengthen follow-through.",
    });
  }

  return flags;
}

function buildCounsellingSection(scoring: ReturnType<typeof scoreAssessment>) {
  const flags = buildCounsellingFlags(scoring);

  if (flags.length === 0) {
    return {
      summary: EXACT_NO_FLAG_SENTENCE,
      flags,
    };
  }

  return {
    summary: "Supportive follow-up on the flagged areas below can strengthen the student's decision process.",
    flags,
  };
}

export function buildAssessmentReport(input: BuildAssessmentReportInput): Report {
  const scoring = scoreAssessment(input.answers);
  const topAptitude = getTopScores(scoring.aptitude, recommendationRuleMetadata.aptitudeOrder, 1)[0];
  const topInterests = getTopScores(scoring.interests, recommendationRuleMetadata.interestOrder, 2);

  const interestInsights: InterestInsight[] = topInterests.map((interest) => ({
    code: interest.code,
    label: interest.label,
    score: interest.scaled,
    definition: RIASEC_INSIGHTS[interest.code].definition,
    practicalActivities: [...RIASEC_INSIGHTS[interest.code].practicalActivities],
  }));

  const bigFive: PersonalityInsight[] = recommendationRuleMetadata.personalityOrder.map((code) => {
    const score = scoring.personality[code];
    const level = getPersonalityLevel(score.scaled);

    return {
      code,
      label: score.label,
      score: score.scaled,
      level,
      balancedImplication: getBalancedImplication(code, level),
    };
  });

  const streamTable: StreamRecommendationDetail[] = scoring.rankedStreams.map((stream, index) => ({
    code: stream.code,
    label: stream.label,
    score: stream.score,
    fitLabel: index === 0 ? "Best Fit" : index === 1 ? "Explore Next" : "Keep as Backup",
    rationale: buildStreamRationale(stream.code, scoring),
  }));

  return {
    id: input.id,
    sessionId: input.sessionId,
    studentId: input.studentId,
    generatedAt: input.generatedAt,
    cover: {
      title: REPORT_TITLE,
      subtitle: REPORT_SUBTITLE,
      studentName: input.student.name,
      rollNo: input.student.rollNo,
      class: input.student.class,
      section: input.student.section,
      school: input.student.school,
      date: input.generatedAt,
    },
    snapshot: {
      topAptitude,
      topInterests,
      dominantPersonalityTrait: scoring.dominantPersonalityTrait,
      topRecommendedStream: {
        ...scoring.topStream,
        confidence: scoring.confidence,
      },
      atAGlance: buildSnapshotBullets(scoring),
    },
    scoring,
    aptitudeTable: buildAptitudeTable(scoring),
    interestInsights,
    bigFive,
    streamTable,
    whyBestFit: buildWhyBestFit(input.student.name, scoring, streamTable),
    quickActions: buildQuickActions(input.student.class, scoring.topStream.code),
    careerClusters: buildCareerClusters(scoring.topStream.code),
    counselling: buildCounsellingSection(scoring),
    disclaimer: EXACT_DISCLAIMER,
  };
}
