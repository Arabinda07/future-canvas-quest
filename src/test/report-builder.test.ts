import { describe, expect, it } from "vitest";
import { buildAssessmentReport } from "@/domain/reportBuilder";

function buildAnswers(entries: Record<number, string>) {
  return Object.fromEntries(Object.entries(entries).map(([questionNumber, answer]) => [`Q${questionNumber}`, answer]));
}

const scienceLeaningAnswers = buildAnswers({
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
});

const humanitiesNoFlagAnswers = buildAnswers({
  1: "B",
  2: "A",
  3: "A",
  4: "A",
  5: "A",
  6: "A",
  7: "A",
  8: "A",
  9: "A",
  10: "A",
  11: "B",
  12: "A",
  13: "A",
  14: "A",
  15: "C",
  16: "A",
  17: "B",
  18: "A",
  19: "C",
  20: "C",
  21: "D",
  22: "D",
  23: "D",
  24: "D",
  25: "D",
  26: "D",
  27: "D",
  28: "D",
  29: "D",
  30: "D",
  31: "A",
  32: "A",
  33: "A",
  34: "A",
  35: "A",
  36: "A",
  37: "A",
  38: "A",
  39: "A",
  40: "A",
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
  55: "B",
  56: "B",
  57: "C",
  58: "C",
  59: "B",
  60: "B",
  61: "C",
  62: "C",
  63: "A",
  64: "A",
  65: "B",
  66: "D",
  67: "C",
  68: "C",
  69: "C",
  70: "B",
});

const EXACT_DISCLAIMER =
  "Disclaimer: This report is a tool for guidance based on your responses. It is one important data point among many, including academic performance, personal aspirations, and realworld experiences. Final career and academic decisions should be made in consultation with parents, teachers, and qualified career counsellors.";

const EXACT_NO_FLAG_SENTENCE =
  "No major concerns were identified. The student's profile is consistent and provides a solid foundation.";

describe("buildAssessmentReport", () => {
  it("builds report sections that match the spec, including exact disclaimer and short junior quick actions", () => {
    const report = buildAssessmentReport({
      id: "report-1",
      sessionId: "session-1",
      studentId: "student-1",
      generatedAt: "2026-04-02",
      answers: scienceLeaningAnswers,
      student: {
        name: "Aarav Mehta",
        rollNo: "12",
        class: "X",
        section: "B",
        school: "Future Canvas Public School",
      },
    });

    expect(report.cover).toEqual({
      title: "CAREER CLARITY REPORT",
      subtitle: "An Analysis of Aptitude, Interests, and Personality for Career Exploration",
      studentName: "Aarav Mehta",
      rollNo: "12",
      class: "X",
      section: "B",
      school: "Future Canvas Public School",
      date: "2026-04-02",
    });
    expect(report.snapshot.topAptitude.code).toBe("N");
    expect(report.snapshot.topInterests.map((interest) => interest.code)).toEqual(["R", "I"]);
    expect(report.snapshot.topRecommendedStream.code).toBe("Science");
    expect(report.snapshot.topRecommendedStream.confidence).toBe("High");
    expect(report.snapshot.atAGlance).toHaveLength(4);
    expect(report.aptitudeTable).toHaveLength(3);
    expect(report.aptitudeTable.every((row) => typeof row.cbseSubjectInterpretation === "string")).toBe(true);
    expect(report.aptitudeTable.map((row) => row.code)).toEqual(["N", "L", "V"]);
    expect(report.streamTable).toHaveLength(3);
    expect(report.whyBestFit).toHaveLength(5);
    expect(report.whyBestFit.some((sentence) => sentence.includes("Science"))).toBe(true);
    expect(report.whyBestFit.some((sentence) => sentence.includes("Numerical Aptitude"))).toBe(true);
    expect(report.whyBestFit.some((sentence) => sentence.includes("Realistic") || sentence.includes("Investigative"))).toBe(
      true,
    );
    expect(report.quickActions).toHaveLength(3);
    expect(report.quickActions.every((action) => action.trim().split(/\s+/).length <= 15)).toBe(true);
    expect(report.quickActions[0]).toContain("CBSE");
    expect(report.counselling.flags).toHaveLength(2);
    expect(report.counselling.flags).toEqual([
      expect.objectContaining({
        flag: "HIGH_NEUROTICISM",
        score: 100,
      }),
      expect.objectContaining({
        flag: "LOW_CONSCIENTIOUSNESS",
        score: 0,
      }),
    ]);
    expect(report.counselling.flags.every((flag) => flag.empatheticFraming.length > 0)).toBe(true);
    expect(report.counselling.flags.every((flag) => flag.supportiveNextStep.length > 0)).toBe(true);
    expect(report.disclaimer).toBe(EXACT_DISCLAIMER);
  });

  it("returns the exact no-flag sentence and stream-aware humanities rationale for a no-flag profile", () => {
    const report = buildAssessmentReport({
      id: "report-2",
      sessionId: "session-2",
      studentId: "student-2",
      generatedAt: "2026-04-02",
      answers: humanitiesNoFlagAnswers,
      student: {
        name: "Diya Shah",
        rollNo: "7",
        class: "XI",
        section: "A",
        school: "Future Canvas Public School",
      },
    });

    expect(report.snapshot.topAptitude.code).toBe("V");
    expect(report.snapshot.topInterests.map((interest) => interest.code)).toEqual(["A", "S"]);
    expect(report.snapshot.dominantPersonalityTrait.code).toBe("O");
    expect(report.snapshot.topRecommendedStream.code).toBe("Humanities");
    expect(report.snapshot.atAGlance).toHaveLength(4);
    expect(report.quickActions).toHaveLength(3);
    expect(report.quickActions[0]).toContain("elective");
    expect(report.quickActions.every((action) => action.trim().split(/\s+/).length <= 15)).toBe(true);
    expect(report.quickActions[1]).toContain("CBSE");
    expect(report.whyBestFit).toHaveLength(5);
    expect(report.whyBestFit.some((sentence) => sentence.includes("Humanities"))).toBe(true);
    expect(report.whyBestFit.some((sentence) => sentence.includes("Verbal Aptitude"))).toBe(true);
    expect(report.whyBestFit.some((sentence) => sentence.includes("Artistic") || sentence.includes("Social"))).toBe(true);
    expect(report.whyBestFit.some((sentence) => sentence.includes("Openness"))).toBe(true);
    expect(report.counselling.summary).toBe(EXACT_NO_FLAG_SENTENCE);
    expect(report.counselling.flags).toEqual([]);
    expect(report.careerClusters).toHaveLength(3);
    expect(report.careerClusters.some((cluster) => cluster.isLessConventional)).toBe(true);
  });
});
