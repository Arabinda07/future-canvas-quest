import { beforeEach, describe, expect, it } from "vitest";
import { calculateConfidenceLevel, scoreAssessment } from "@/domain/recommendationRules";
import { createLocalAssessmentRepository } from "@/repositories/local/localAssessmentRepository";

function buildAnswers(entries: Record<number, string>) {
  return Object.fromEntries(Object.entries(entries).map(([questionNumber, answer]) => [`Q${questionNumber}`, answer]));
}

describe("recommendation rules repository seam", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("can create and reload a saved assessment session", () => {
    const repository = createLocalAssessmentRepository();
    const session = repository.createSession({
      studentId: "student-1",
      counselorId: "counselor-9",
      entryPath: "school-issued",
      studentClass: "XI",
    });

    repository.saveSession({
      ...session,
      answers: { Q1: "A" },
      completed: true,
    });

    const reloadedRepository = createLocalAssessmentRepository();
    expect(reloadedRepository.getSession(session.id)).toEqual({
      ...session,
      answers: { Q1: "A" },
      completed: true,
    });
  });

  it("surfaces assessment session write failures", () => {
    const repository = createLocalAssessmentRepository({
      getItem: () => null,
      setItem: () => {
        throw new Error("quota exceeded");
      },
      removeItem: () => undefined,
    });

    expect(() =>
      repository.createSession({
        studentId: "student-2",
        counselorId: "counselor-4",
        entryPath: "self-serve",
        studentClass: "X",
      }),
    ).toThrow("quota exceeded");
  });

  it("falls back to an empty assessment session store for corrupted JSON", () => {
    const repository = createLocalAssessmentRepository({
      getItem: (key) =>
        key === "fcq.assessmentSessions"
          ? JSON.stringify({
              sessionA: {
                id: "sessionA",
                studentId: "student-3",
                studentClass: "X",
                entryPath: "school-issued",
                answers: [],
                completed: "yes",
              },
            })
          : null,
      setItem: () => undefined,
      removeItem: () => undefined,
    });

    expect(repository.getSession("sessionA")).toBeNull();
    expect(repository.listSessions()).toEqual([]);
  });
});

describe("scoreAssessment", () => {
  it("scores aptitude answers with case-insensitive matching and zero for blank or multiple responses", () => {
    const result = scoreAssessment(
      buildAnswers({
        1: " a ",
        2: "c",
        3: "B",
        4: "A",
        5: "D",
        6: "A, B",
        7: "",
        8: "D",
        9: " b ",
        10: "B",
        11: "A",
        12: "C",
        13: "B",
        14: "D",
        15: "C",
        16: "a",
        17: "D",
        18: "A",
        19: "C",
        20: "C",
      }),
    );

    expect(result.aptitude.N).toMatchObject({ raw: 4, maxRaw: 7 });
    expect(result.aptitude.L).toMatchObject({ raw: 6, maxRaw: 7 });
    expect(result.aptitude.V).toMatchObject({ raw: 5, maxRaw: 6 });
    expect(result.aptitude.N.scaled).toBeCloseTo(57.14, 2);
    expect(result.aptitude.L.scaled).toBeCloseTo(85.71, 2);
    expect(result.aptitude.V.scaled).toBeCloseTo(83.33, 2);
  });

  it("scores RIASEC and Big Five groups with forward and reverse conversion rules", () => {
    const result = scoreAssessment(
      buildAnswers({
        21: "A",
        22: "A",
        23: "A",
        24: "A",
        25: "A",
        26: "B",
        27: "B",
        28: "B",
        29: "B",
        30: "B",
        31: "C",
        32: "C",
        33: "C",
        34: "C",
        35: "C",
        36: "D",
        37: "D",
        38: "D",
        39: "D",
        40: "D",
        41: "A",
        42: "B",
        43: "C",
        44: "D",
        45: "A B",
        46: "A",
        47: "A",
        48: "A",
        49: "A",
        50: "A",
        51: "A",
        52: "B",
        53: "C",
        54: "D",
        55: "A",
        56: "A",
        57: "A",
        58: "A",
        59: "D",
        60: "C",
        61: "B",
        62: "A",
        63: "B",
        64: "B",
        65: "B",
        66: "B",
        67: "C",
        68: "C",
        69: "C",
        70: "C",
      }),
    );

    expect(result.interests.R).toMatchObject({ raw: 15, maxRaw: 15 });
    expect(result.interests.I).toMatchObject({ raw: 10, maxRaw: 15 });
    expect(result.interests.A).toMatchObject({ raw: 5, maxRaw: 15 });
    expect(result.interests.S).toMatchObject({ raw: 0, maxRaw: 15 });
    expect(result.interests.E).toMatchObject({ raw: 6, maxRaw: 15 });
    expect(result.interests.C).toMatchObject({ raw: 15, maxRaw: 15 });
    expect(result.personality.O).toMatchObject({ raw: 9, maxRaw: 12 });
    expect(result.personality.Co).toMatchObject({ raw: 9, maxRaw: 12 });
    expect(result.personality.Ex).toMatchObject({ raw: 3, maxRaw: 12 });
    expect(result.personality.Ag).toMatchObject({ raw: 7, maxRaw: 12 });
    expect(result.personality.Ne).toMatchObject({ raw: 5, maxRaw: 12 });
    expect(result.personality.O.scaled).toBeCloseTo(75, 5);
    expect(result.personality.Co.scaled).toBeCloseTo(75, 5);
    expect(result.personality.Ex.scaled).toBeCloseTo(25, 5);
    expect(result.personality.Ag.scaled).toBeCloseTo(58.33, 2);
    expect(result.personality.Ne.scaled).toBeCloseTo(41.67, 2);
  });

  it("calculates stream composites, confidence, and flags from the exact scoring model", () => {
    const result = scoreAssessment(
      buildAnswers({
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
        14: "A",
        15: "D",
        16: "D",
        17: "D",
        18: "D",
        19: "D",
        20: "D",
        21: "A",
        22: "A",
        23: "A",
        24: "A",
        25: "A",
        26: "A",
        27: "A",
        28: "A",
        29: "A",
        30: "A",
        31: "D",
        32: "D",
        33: "D",
        34: "D",
        35: "D",
        36: "D",
        37: "D",
        38: "D",
        39: "D",
        40: "D",
        41: "D",
        42: "D",
        43: "D",
        44: "D",
        45: "D",
        46: "D",
        47: "D",
        48: "D",
        49: "D",
        50: "D",
        51: "A",
        52: "A",
        53: "A",
        54: "D",
        55: "D",
        56: "D",
        57: "D",
        58: "A",
        59: "D",
        60: "D",
        61: "D",
        62: "A",
        63: "D",
        64: "D",
        65: "D",
        66: "A",
        67: "A",
        68: "A",
        69: "A",
        70: "D",
      }),
    );

    expect(result.streams.Science.score).toBeCloseTo(92.93, 2);
    expect(result.streams.Commerce.score).toBeCloseTo(40, 5);
    expect(result.streams.Humanities.score).toBeCloseTo(20, 5);
    expect(result.topStream.code).toBe("Science");
    expect(result.confidence).toBe("High");
    expect(result.flags).toEqual(["HIGH_NEUROTICISM", "LOW_CONSCIENTIOUSNESS"]);
  });
});

describe("calculateConfidenceLevel", () => {
  it("uses the approved thresholds, including ties as low confidence", () => {
    expect(
      calculateConfidenceLevel([
        { code: "Science", score: 82 },
        { code: "Commerce", score: 71.99 },
        { code: "Humanities", score: 50 },
      ]),
    ).toBe("High");

    expect(
      calculateConfidenceLevel([
        { code: "Science", score: 82 },
        { code: "Commerce", score: 77 },
        { code: "Humanities", score: 50 },
      ]),
    ).toBe("Moderate");

    expect(
      calculateConfidenceLevel([
        { code: "Science", score: 82 },
        { code: "Commerce", score: 82 },
        { code: "Humanities", score: 50 },
      ]),
    ).toBe("Low");
  });
});
