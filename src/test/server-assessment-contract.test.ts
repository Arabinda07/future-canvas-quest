import { describe, expect, it } from "vitest";
import { buildAssessmentReport } from "@/domain/reportBuilder";
import { buildAssessmentArtifacts, normalizeAssessmentAnswers } from "../../supabase/functions/_shared/assessmentSubmission.ts";
import { encryptAnswersForStorage } from "../../supabase/functions/_shared/answerEncryption.ts";

function buildAnswers() {
  return Object.fromEntries(Array.from({ length: 70 }, (_, index) => [`Q${index + 1}`, index % 2 === 0 ? " a " : "D"]));
}

describe("server assessment contract", () => {
  it("reuses the approved frontend report contract for persisted backend reports", () => {
    const submission = {
      session_token: "session-token",
      name: "Aarav",
      class: "XI" as const,
      section: "B",
      roll_number: "12",
      school_name: "",
      answers: buildAnswers(),
      entry_path: "school-issued" as const,
      batch_code: "kvkgp2025",
      consent_given: true,
      consent_at: "2026-04-11T00:00:00.000Z",
    };

    const artifacts = buildAssessmentArtifacts({
      sessionId: "session-1",
      reportId: "report-1",
      generatedAt: "2026-04-11T09:30:00.000Z",
      submission,
      resolvedSchoolName: "Future Canvas Public School",
    });

    const expectedReport = buildAssessmentReport({
      id: "report-1",
      sessionId: "session-1",
      studentId: "session-1",
      generatedAt: "2026-04-11",
      answers: normalizeAssessmentAnswers(submission.answers),
      student: {
        name: "Aarav",
        rollNo: "12",
        class: "XI",
        section: "B",
        school: "Future Canvas Public School",
      },
    });

    expect(artifacts.report).toEqual(expectedReport);
    expect(artifacts.sessionInsert.school_name).toBe("Future Canvas Public School");
    expect(artifacts.sessionInsert.batch_code).toBe("KVKGP2025");
    expect(artifacts.scoresInsert.top_stream).toBe(expectedReport.snapshot.topRecommendedStream.code);
  });

  it("normalizes missing answers into a stable Q1-Q70 record", () => {
    const normalized = normalizeAssessmentAnswers({
      Q1: " a ",
      Q2: "A, B",
      Q70: " d ",
    });

    expect(normalized.Q1).toBe("A");
    expect(normalized.Q2).toBe("A, B");
    expect(normalized.Q3).toBe("");
    expect(normalized.Q70).toBe("D");
    expect(Object.keys(normalized)).toHaveLength(70);
  });

  it("encrypts normalized answers into an AES-GCM envelope instead of storing plaintext Q1-Q70 JSON", async () => {
    const normalized = normalizeAssessmentAnswers(buildAnswers());
    const encrypted = await encryptAnswersForStorage(normalized, "0123456789abcdef0123456789abcdef");
    const envelope = JSON.parse(encrypted);

    expect(envelope).toMatchObject({
      v: 1,
      alg: "AES-256-GCM",
    });
    expect(envelope.iv).toEqual(expect.any(String));
    expect(envelope.ciphertext).toEqual(expect.any(String));
    expect(encrypted).not.toContain("\"Q1\"");
    expect(encrypted).not.toContain("\"A\"");
  });

  it("locks self-serve reports for payment and leaves school-issued reports unlocked", () => {
    const baseSubmission = {
      session_token: "session-token",
      name: "Aarav",
      class: "XI" as const,
      section: "B",
      roll_number: "12",
      school_name: "",
      answers: buildAnswers(),
      consent_given: true,
      consent_at: "2026-04-11T00:00:00.000Z",
    };

    const selfServeArtifacts = buildAssessmentArtifacts({
      sessionId: "session-self-serve",
      reportId: "report-self-serve",
      generatedAt: "2026-04-11T09:30:00.000Z",
      submission: {
        ...baseSubmission,
        entry_path: "self-serve" as const,
        batch_code: null,
      },
    });

    const schoolIssuedArtifacts = buildAssessmentArtifacts({
      sessionId: "session-school",
      reportId: "report-school",
      generatedAt: "2026-04-11T09:30:00.000Z",
      submission: {
        ...baseSubmission,
        entry_path: "school-issued" as const,
        batch_code: "KVKGP2025",
      },
      resolvedSchoolName: "Future Canvas Public School",
    });

    expect(selfServeArtifacts.scoresInsert.report_unlocked).toBe(false);
    expect(schoolIssuedArtifacts.scoresInsert.report_unlocked).toBe(true);
  });
});
