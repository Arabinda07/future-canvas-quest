import { describe, expect, it } from "vitest";
import { buildProcessAssessmentPayload, buildStudentReportPath, normalizeAssessmentBackendResult } from "@/lib/backend/assessmentGateway";
import { buildAssessmentReport } from "@/domain/reportBuilder";

function buildAnswers() {
  return Object.fromEntries(Array.from({ length: 70 }, (_, index) => [`Q${index + 1}`, "A"]));
}

describe("assessment backend gateway", () => {
  it("builds a school-issued payload with batch code and current class format", () => {
    const payload = buildProcessAssessmentPayload({
      sessionToken: "session-token",
      answers: buildAnswers(),
      student: {
        name: "Aarav",
        className: "XI",
        section: "B",
        rollNumber: "12",
        schoolName: "Future Canvas Public School",
      },
      entryPath: "school-issued",
      batchCode: " kvkgp2025 ",
      consentGiven: true,
      consentAt: "2026-04-11T00:00:00.000Z",
    });

    expect(payload).toMatchObject({
      session_token: "session-token",
      class: "XI",
      batch_code: "KVKGP2025",
      entry_path: "school-issued",
      consent_given: true,
    });
  });

  it("omits batch code for self-serve payloads", () => {
    const payload = buildProcessAssessmentPayload({
      sessionToken: "session-token",
      answers: buildAnswers(),
      student: {
        name: "Aarav",
        className: "X",
      },
      entryPath: "self-serve",
      consentGiven: true,
      consentAt: "2026-04-11T00:00:00.000Z",
    });

    expect(payload.batch_code).toBeNull();
    expect(payload.entry_path).toBe("self-serve");
  });

  it("normalizes a locked backend response without exposing a report", () => {
    expect(
      normalizeAssessmentBackendResult({
        success: true,
        session_id: "session-1",
        report_locked: true,
        report_id: "report-1",
        report_access_token: "student-report-token",
      }),
    ).toEqual({
      sessionId: "session-1",
      reportId: "report-1",
      reportAccessToken: "student-report-token",
      reportLocked: true,
      report: null,
    });
  });

  it("normalizes a completed backend response into the current frontend report contract", () => {
    const report = buildAssessmentReport({
      id: "report-1",
      sessionId: "session-1",
      studentId: "student-1",
      generatedAt: "2026-04-11",
      answers: buildAnswers(),
      student: {
        name: "Aarav",
        rollNo: "12",
        class: "XI",
        section: "B",
        school: "Future Canvas Public School",
      },
    });

    const result = normalizeAssessmentBackendResult({
      success: true,
      session_id: "session-1",
      report_locked: false,
      report_id: "report-1",
      report_access_token: "student-report-token",
      report,
    });

    expect(result).toEqual({
      sessionId: "session-1",
      reportId: "report-1",
      reportAccessToken: "student-report-token",
      reportLocked: false,
      report,
    });
  });

  it("builds a private student report path when the backend returns a report access token", () => {
    expect(buildStudentReportPath("report-1", "student-report-token")).toBe("/report/report-1?token=student-report-token");
    expect(buildStudentReportPath("report-1")).toBe("/report/report-1");
  });
});
