import type {
  AptitudeCode,
  AssessmentAnswers,
  AssessmentScoringResult,
  DimensionScore,
  DominantPersonalityTrait,
  InterestCode,
  PersonalityCode,
  RecommendationConfidence,
  RecommendationFlag,
  StreamCode,
  StreamScore,
} from "./types.ts";

const VALID_RESPONSES = new Set(["A", "B", "C", "D"]);
const REVERSE_SCORED_QUESTIONS = new Set([54, 58, 62, 66, 70]);

const APTITUDE_ORDER: AptitudeCode[] = ["N", "L", "V"];
const INTEREST_ORDER: InterestCode[] = ["R", "I", "A", "S", "E", "C"];
const PERSONALITY_ORDER: PersonalityCode[] = ["O", "Co", "Ex", "Ag", "Ne"];
const STREAM_ORDER: StreamCode[] = ["Science", "Commerce", "Humanities"];

const APTITUDE_LABELS: Record<AptitudeCode, string> = {
  N: "Numerical Aptitude",
  L: "Logical Reasoning",
  V: "Verbal Aptitude",
};

const INTEREST_LABELS: Record<InterestCode, string> = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

const PERSONALITY_LABELS: Record<PersonalityCode, string> = {
  O: "Openness",
  Co: "Conscientiousness",
  Ex: "Extraversion",
  Ag: "Agreeableness",
  Ne: "Neuroticism",
};

const STREAM_LABELS: Record<StreamCode, string> = {
  Science: "Science",
  Commerce: "Commerce",
  Humanities: "Humanities",
};

const APTITUDE_KEYS: Record<number, string> = {
  1: "A",
  2: "C",
  3: "B",
  4: "C",
  5: "D",
  6: "D",
  7: "D",
  8: "D",
  9: "B",
  10: "B",
  11: "A",
  12: "B",
  13: "B",
  14: "D",
  15: "C",
  16: "A",
  17: "B",
  18: "A",
  19: "C",
  20: "C",
};

const APTITUDE_GROUPS: Record<AptitudeCode, number[]> = {
  N: [1, 2, 3, 4, 5, 6, 7],
  L: [8, 9, 10, 11, 12, 13, 14],
  V: [15, 16, 17, 18, 19, 20],
};

const INTEREST_GROUPS: Record<InterestCode, number[]> = {
  R: [21, 22, 23, 24, 25],
  I: [26, 27, 28, 29, 30],
  A: [31, 32, 33, 34, 35],
  S: [36, 37, 38, 39, 40],
  E: [41, 42, 43, 44, 45],
  C: [46, 47, 48, 49, 50],
};

const PERSONALITY_GROUPS: Record<PersonalityCode, number[]> = {
  O: [51, 52, 53, 54],
  Co: [55, 56, 57, 58],
  Ex: [59, 60, 61, 62],
  Ag: [63, 64, 65, 66],
  Ne: [67, 68, 69, 70],
};

function normalizeResponse(answer: string | undefined): "A" | "B" | "C" | "D" | null {
  const normalized = answer?.trim().toUpperCase() ?? "";
  return VALID_RESPONSES.has(normalized) ? (normalized as "A" | "B" | "C" | "D") : null;
}

function createDimensionScore<Code extends string>(
  code: Code,
  label: string,
  raw: number,
  maxRaw: number,
): DimensionScore<Code> {
  return {
    code,
    label,
    raw,
    maxRaw,
    scaled: (raw / maxRaw) * 100,
  };
}

function sumPsychometricGroup(questionNumbers: number[], answers: AssessmentAnswers) {
  return questionNumbers.reduce((total, questionNumber) => {
    const response = normalizeResponse(answers[`Q${questionNumber}`]);
    if (!response) {
      return total;
    }

    const value = REVERSE_SCORED_QUESTIONS.has(questionNumber)
      ? { A: 0, B: 1, C: 2, D: 3 }[response]
      : { A: 3, B: 2, C: 1, D: 0 }[response];

    return total + value;
  }, 0);
}

function rankByScaled<Code extends string>(scores: Record<Code, DimensionScore<Code>>, order: Code[]) {
  return order
    .map((code) => scores[code])
    .sort((left, right) => right.scaled - left.scaled || order.indexOf(left.code) - order.indexOf(right.code));
}

function rankStreams(streams: Record<StreamCode, StreamScore>) {
  return STREAM_ORDER.map((code) => streams[code]).sort(
    (left, right) => right.score - left.score || STREAM_ORDER.indexOf(left.code) - STREAM_ORDER.indexOf(right.code),
  );
}

function getDominantPersonalityTrait(
  personality: Record<PersonalityCode, DimensionScore<PersonalityCode>>,
): DominantPersonalityTrait {
  const ranked = PERSONALITY_ORDER.map((code) => {
    const score = personality[code];
    const distanceFromMidpoint = Math.abs(score.scaled - 50);

    return {
      code,
      label: PERSONALITY_LABELS[code],
      score: score.scaled,
      direction: score.scaled >= 50 ? "High" : "Low",
      distanceFromMidpoint,
    } as DominantPersonalityTrait;
  }).sort(
    (left, right) =>
      right.distanceFromMidpoint - left.distanceFromMidpoint ||
      PERSONALITY_ORDER.indexOf(left.code) - PERSONALITY_ORDER.indexOf(right.code),
  );

  return ranked[0];
}

export function calculateConfidenceLevel(streams: Array<Pick<StreamScore, "code" | "score">>): RecommendationConfidence {
  const ranked = [...streams].sort(
    (left, right) => right.score - left.score || STREAM_ORDER.indexOf(left.code) - STREAM_ORDER.indexOf(right.code),
  );
  const gap = ranked[0].score - ranked[1].score;

  if (gap === 0 || gap < 5) {
    return "Low";
  }

  if (gap < 10) {
    return "Moderate";
  }

  return "High";
}

export function scoreAssessment(answers: AssessmentAnswers): AssessmentScoringResult {
  const aptitude = {
    N: createDimensionScore(
      "N",
      APTITUDE_LABELS.N,
      APTITUDE_GROUPS.N.reduce((count, questionNumber) => {
        return count + Number(normalizeResponse(answers[`Q${questionNumber}`]) === APTITUDE_KEYS[questionNumber]);
      }, 0),
      7,
    ),
    L: createDimensionScore(
      "L",
      APTITUDE_LABELS.L,
      APTITUDE_GROUPS.L.reduce((count, questionNumber) => {
        return count + Number(normalizeResponse(answers[`Q${questionNumber}`]) === APTITUDE_KEYS[questionNumber]);
      }, 0),
      7,
    ),
    V: createDimensionScore(
      "V",
      APTITUDE_LABELS.V,
      APTITUDE_GROUPS.V.reduce((count, questionNumber) => {
        return count + Number(normalizeResponse(answers[`Q${questionNumber}`]) === APTITUDE_KEYS[questionNumber]);
      }, 0),
      6,
    ),
  };

  const interests = {
    R: createDimensionScore("R", INTEREST_LABELS.R, sumPsychometricGroup(INTEREST_GROUPS.R, answers), 15),
    I: createDimensionScore("I", INTEREST_LABELS.I, sumPsychometricGroup(INTEREST_GROUPS.I, answers), 15),
    A: createDimensionScore("A", INTEREST_LABELS.A, sumPsychometricGroup(INTEREST_GROUPS.A, answers), 15),
    S: createDimensionScore("S", INTEREST_LABELS.S, sumPsychometricGroup(INTEREST_GROUPS.S, answers), 15),
    E: createDimensionScore("E", INTEREST_LABELS.E, sumPsychometricGroup(INTEREST_GROUPS.E, answers), 15),
    C: createDimensionScore("C", INTEREST_LABELS.C, sumPsychometricGroup(INTEREST_GROUPS.C, answers), 15),
  };

  const personality = {
    O: createDimensionScore("O", PERSONALITY_LABELS.O, sumPsychometricGroup(PERSONALITY_GROUPS.O, answers), 12),
    Co: createDimensionScore("Co", PERSONALITY_LABELS.Co, sumPsychometricGroup(PERSONALITY_GROUPS.Co, answers), 12),
    Ex: createDimensionScore("Ex", PERSONALITY_LABELS.Ex, sumPsychometricGroup(PERSONALITY_GROUPS.Ex, answers), 12),
    Ag: createDimensionScore("Ag", PERSONALITY_LABELS.Ag, sumPsychometricGroup(PERSONALITY_GROUPS.Ag, answers), 12),
    Ne: createDimensionScore("Ne", PERSONALITY_LABELS.Ne, sumPsychometricGroup(PERSONALITY_GROUPS.Ne, answers), 12),
  };

  const streams: Record<StreamCode, StreamScore> = {
    Science: {
      code: "Science",
      label: STREAM_LABELS.Science,
      score:
        0.5 * aptitude.N.scaled +
        0.25 * aptitude.L.scaled +
        0.1 * interests.I.scaled +
        0.08 * interests.R.scaled +
        0.07 * ((personality.Co.scaled + personality.O.scaled) / 2),
    },
    Commerce: {
      code: "Commerce",
      label: STREAM_LABELS.Commerce,
      score:
        0.4 * aptitude.N.scaled +
        0.3 * aptitude.V.scaled +
        0.15 * interests.C.scaled +
        0.1 * interests.E.scaled +
        0.05 * personality.Co.scaled,
    },
    Humanities: {
      code: "Humanities",
      label: STREAM_LABELS.Humanities,
      score:
        0.5 * aptitude.V.scaled +
        0.2 * personality.O.scaled +
        0.15 * interests.S.scaled +
        0.1 * interests.A.scaled +
        0.05 * personality.Ag.scaled,
    },
  };

  const rankedStreams = rankStreams(streams);
  const flags: RecommendationFlag[] = [];

  if (personality.Ne.scaled >= 75) {
    flags.push("HIGH_NEUROTICISM");
  }

  if (personality.Co.scaled <= 35) {
    flags.push("LOW_CONSCIENTIOUSNESS");
  }

  return {
    aptitude,
    interests,
    personality,
    streams,
    rankedStreams,
    topStream: rankedStreams[0],
    confidence: calculateConfidenceLevel(rankedStreams),
    flags,
    dominantPersonalityTrait: getDominantPersonalityTrait(personality),
  };
}

export const recommendationRuleMetadata = {
  aptitudeOrder: APTITUDE_ORDER,
  interestOrder: INTEREST_ORDER,
  personalityOrder: PERSONALITY_ORDER,
  streamOrder: STREAM_ORDER,
  aptitudeLabels: APTITUDE_LABELS,
  interestLabels: INTEREST_LABELS,
  personalityLabels: PERSONALITY_LABELS,
  streamLabels: STREAM_LABELS,
  rankByScaled,
};
