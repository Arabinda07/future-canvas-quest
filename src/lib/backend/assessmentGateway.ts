import type { EntryPath, Report, StudentClass } from "@/domain/types";
import { invokeSupabaseFunction } from "@/lib/backend/supabase";

export interface AssessmentBackendStudentDetails {
  name: string;
  className: StudentClass;
  section?: string;
  rollNumber?: string;
  schoolName?: string;
}

export interface ProcessAssessmentPayload {
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

export interface BuildProcessAssessmentPayloadInput {
  sessionToken: string;
  answers: Record<string, string>;
  student: AssessmentBackendStudentDetails;
  entryPath: EntryPath;
  batchCode?: string;
  consentGiven: boolean;
  consentAt: string;
}

export interface RawAssessmentBackendResult {
  success: boolean;
  session_id: string;
  report_id?: string;
  report_access_token?: string;
  report_locked: boolean;
  report?: Report;
}

export interface NormalizedAssessmentBackendResult {
  sessionId: string;
  reportId: string;
  reportAccessToken?: string;
  report: Report;
}

export interface StudentReportBackendResult {
  reportId: string;
  report: Report;
}

export function buildProcessAssessmentPayload(input: BuildProcessAssessmentPayloadInput): ProcessAssessmentPayload {
  const batchCode = input.batchCode?.trim().toUpperCase();

  if (input.entryPath === "school-issued" && !batchCode) {
    throw new Error("A school-issued submission requires a batch code.");
  }

  return {
    session_token: input.sessionToken.trim(),
    name: input.student.name.trim(),
    class: input.student.className,
    section: input.student.section?.trim() ?? "",
    roll_number: input.student.rollNumber?.trim() ?? "",
    school_name: input.student.schoolName?.trim() ?? "",
    answers: input.answers,
    entry_path: input.entryPath,
    batch_code: input.entryPath === "school-issued" ? batchCode ?? null : null,
    consent_given: input.consentGiven,
    consent_at: input.consentAt,
  };
}

export function normalizeAssessmentBackendResult(result: RawAssessmentBackendResult): NormalizedAssessmentBackendResult {
  if (result.report_locked || !result.report) {
    throw new Error("The backend did not return a full report. Complete backend scoring and report delivery before enabling remote submission.");
  }

  const reportId = result.report_id?.trim() || result.report.id;
  if (!reportId) {
    throw new Error("The backend response did not include a report identifier.");
  }

  return {
    sessionId: result.session_id,
    reportId,
    reportAccessToken: result.report_access_token,
    report: result.report,
  };
}

export function buildStudentReportPath(reportId: string, reportAccessToken?: string) {
  const encodedReportId = encodeURIComponent(reportId);
  const trimmedToken = reportAccessToken?.trim();

  if (!trimmedToken) {
    return `/report/${encodedReportId}`;
  }

  return `/report/${encodedReportId}?token=${encodeURIComponent(trimmedToken)}`;
}

export async function submitAssessmentToBackend(input: BuildProcessAssessmentPayloadInput): Promise<NormalizedAssessmentBackendResult> {
  const payload = buildProcessAssessmentPayload(input);
  const result = await invokeSupabaseFunction<RawAssessmentBackendResult>("process-assessment", payload);
  return normalizeAssessmentBackendResult(result);
}

export async function fetchStudentReportFromBackend(reportId: string, reportAccessToken: string): Promise<Report | null> {
  const trimmedReportId = reportId.trim();
  const trimmedToken = reportAccessToken.trim();

  if (!trimmedReportId || !trimmedToken) {
    return null;
  }

  const result = await invokeSupabaseFunction<StudentReportBackendResult>("get-student-report", {
    report_id: trimmedReportId,
    access_token: trimmedToken,
  });

  return result.report;
}
