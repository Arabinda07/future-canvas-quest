import { buildAssessmentReport } from "../../../src/domain/reportBuilder.ts";
import type { AssessmentAnswers, EntryPath, Report, StudentClass } from "../../../src/domain/types.ts";

export interface AssessmentSubmissionPayload {
  session_token: string;
  name: string;
  class: StudentClass;
  section: string;
  roll_number: string;
  school_name: string;
  answers: Record<string, string>;
  entry_path: EntryPath;
  batch_code: string | null;
  consent_given: boolean;
  consent_at: string;
}

export interface BuildAssessmentArtifactsInput {
  sessionId: string;
  reportId: string;
  generatedAt: string;
  submission: AssessmentSubmissionPayload;
  resolvedSchoolName?: string;
}

export interface PreparedAssessmentArtifacts {
  normalizedAnswers: AssessmentAnswers;
  report: Report;
  sessionInsert: {
    session_token: string;
    name: string;
    class: StudentClass;
    section: string;
    roll_number: string;
    school_name: string;
    entry_path: EntryPath;
    batch_code: string | null;
    status: "completed";
    consent_at: string;
    completed_at: string;
  };
  answersInsert: {
    answers_enc: string;
  };
  scoresInsert: {
    report_id: string;
    top_stream: string;
    confidence: string;
    flags: string;
    report_json: Report;
    report_unlocked: boolean;
  };
}

const QUESTION_COUNT = 70;
const VALID_CLASS_VALUES = new Set(["IX", "X", "XI", "XII"]);
const VALID_ENTRY_PATHS = new Set(["self-serve", "school-issued"]);

function normalizeFreeText(value: string | null | undefined) {
  return (value ?? "").trim();
}

export function normalizeAssessmentAnswers(rawAnswers: Record<string, string>) {
  return Object.fromEntries(
    Array.from({ length: QUESTION_COUNT }, (_, index) => {
      const questionId = `Q${index + 1}`;
      return [questionId, normalizeFreeText(rawAnswers[questionId]).toUpperCase()];
    }),
  ) as AssessmentAnswers;
}

export function validateAssessmentSubmission(payload: AssessmentSubmissionPayload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Request body must be valid JSON.");
  }

  if (!normalizeFreeText(payload.session_token)) {
    throw new Error("session_token is required.");
  }

  if (!normalizeFreeText(payload.name)) {
    throw new Error("name is required.");
  }

  if (!VALID_CLASS_VALUES.has(payload.class)) {
    throw new Error("class must be one of IX, X, XI, or XII.");
  }

  if (!VALID_ENTRY_PATHS.has(payload.entry_path)) {
    throw new Error("entry_path must be self-serve or school-issued.");
  }

  if (payload.entry_path === "school-issued" && !normalizeFreeText(payload.batch_code)) {
    throw new Error("batch_code is required for school-issued submissions.");
  }

  if (!payload.answers || typeof payload.answers !== "object") {
    throw new Error("answers must be an object keyed by Q1 to Q70.");
  }

  if (!payload.consent_given) {
    throw new Error("consent_given must be true before submission.");
  }

  if (!normalizeFreeText(payload.consent_at) || Number.isNaN(Date.parse(payload.consent_at))) {
    throw new Error("consent_at must be a valid ISO timestamp.");
  }
}

export function buildAssessmentArtifacts(input: BuildAssessmentArtifactsInput): PreparedAssessmentArtifacts {
  validateAssessmentSubmission(input.submission);

  const normalizedAnswers = normalizeAssessmentAnswers(input.submission.answers);
  const generatedDate = input.generatedAt.slice(0, 10);
  const schoolName =
    normalizeFreeText(input.resolvedSchoolName) ||
    normalizeFreeText(input.submission.school_name) ||
    (input.submission.entry_path === "school-issued" ? "Partner School" : "Independent Student");
  const section = normalizeFreeText(input.submission.section) || "N/A";
  const rollNo = normalizeFreeText(input.submission.roll_number) || "N/A";
  const batchCode =
    input.submission.entry_path === "school-issued" ? normalizeFreeText(input.submission.batch_code).toUpperCase() : null;

  const report = buildAssessmentReport({
    id: input.reportId,
    sessionId: input.sessionId,
    studentId: input.sessionId,
    generatedAt: generatedDate,
    answers: normalizedAnswers,
    student: {
      name: normalizeFreeText(input.submission.name),
      rollNo,
      class: input.submission.class,
      section,
      school: schoolName,
    },
  });

  return {
    normalizedAnswers,
    report,
    sessionInsert: {
      session_token: normalizeFreeText(input.submission.session_token),
      name: normalizeFreeText(input.submission.name),
      class: input.submission.class,
      section: normalizeFreeText(input.submission.section),
      roll_number: normalizeFreeText(input.submission.roll_number),
      school_name: schoolName,
      entry_path: input.submission.entry_path,
      batch_code: batchCode,
      status: "completed",
      consent_at: input.submission.consent_at,
      completed_at: input.submission.consent_at,
    },
    answersInsert: {
      answers_enc: JSON.stringify(normalizedAnswers),
    },
    scoresInsert: {
      report_id: input.reportId,
      top_stream: report.snapshot.topRecommendedStream.code,
      confidence: report.snapshot.topRecommendedStream.confidence,
      flags: report.counselling.flags.map((flag) => flag.flag).join(","),
      report_json: report,
      report_unlocked: input.submission.entry_path === "school-issued",
    },
  };
}
