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
  reportLocked: boolean;
  report: Report | null;
}

export interface ReportPaymentSummary {
  amountInPaise: number;
  currency: "INR";
  displayAmount: string;
}

export interface StudentReportBackendResult {
  reportId: string;
  report_locked?: boolean;
  report?: Report;
  payment?: ReportPaymentSummary;
}

export type StudentReportAccessResult =
  | {
      reportId: string;
      reportLocked: false;
      report: Report;
      payment?: never;
    }
  | {
      reportId: string;
      reportLocked: true;
      report?: never;
      payment: ReportPaymentSummary;
    };

export interface CreateReportPaymentLinkResult {
  paymentUrl: string;
  paymentLinkId: string;
}

export interface VerifyReportPaymentResult {
  reportId: string;
  reportUnlocked: boolean;
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
  const reportId = result.report_id?.trim() || result.report?.id;
  if (!reportId) {
    throw new Error("The backend response did not include a report identifier.");
  }

  if (result.report_locked) {
    return {
      sessionId: result.session_id,
      reportId,
      reportAccessToken: result.report_access_token,
      reportLocked: true,
      report: null,
    };
  }

  if (!result.report) {
    throw new Error("The backend did not return a full report. Complete backend scoring and report delivery before enabling remote submission.");
  }

  return {
    sessionId: result.session_id,
    reportId,
    reportAccessToken: result.report_access_token,
    reportLocked: false,
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

export function normalizeStudentReportBackendResult(result: StudentReportBackendResult): StudentReportAccessResult | null {
  if (result.report_locked) {
    return {
      reportId: result.reportId,
      reportLocked: true,
      payment: result.payment ?? {
        amountInPaise: 9900,
        currency: "INR",
        displayAmount: "Rs 99",
      },
    };
  }

  if (!result.report) {
    return null;
  }

  return {
    reportId: result.reportId,
    reportLocked: false,
    report: result.report,
  };
}

export async function fetchStudentReportFromBackend(reportId: string, reportAccessToken: string): Promise<StudentReportAccessResult | null> {
  const trimmedReportId = reportId.trim();
  const trimmedToken = reportAccessToken.trim();

  if (!trimmedReportId || !trimmedToken) {
    return null;
  }

  const result = await invokeSupabaseFunction<StudentReportBackendResult>("get-student-report", {
    report_id: trimmedReportId,
    access_token: trimmedToken,
  });

  return normalizeStudentReportBackendResult(result);
}

export async function createReportPaymentLink(reportId: string, reportAccessToken: string, origin: string): Promise<CreateReportPaymentLinkResult> {
  const result = await invokeSupabaseFunction<{ payment_url: string; payment_link_id: string }>("create-payment-link", {
    report_id: reportId.trim(),
    access_token: reportAccessToken.trim(),
    callback_origin: origin,
  });

  return {
    paymentUrl: result.payment_url,
    paymentLinkId: result.payment_link_id,
  };
}

export async function verifyReportPaymentUnlock(input: {
  reportId: string;
  reportAccessToken: string;
  razorpayPaymentId: string;
  razorpayPaymentLinkId: string;
  razorpayPaymentLinkStatus: string;
}): Promise<VerifyReportPaymentResult> {
  const result = await invokeSupabaseFunction<{ report_id: string; report_unlocked: boolean }>("verify-report-payment", {
    report_id: input.reportId.trim(),
    access_token: input.reportAccessToken.trim(),
    razorpay_payment_id: input.razorpayPaymentId.trim(),
    razorpay_payment_link_id: input.razorpayPaymentLinkId.trim(),
    razorpay_payment_link_status: input.razorpayPaymentLinkStatus.trim(),
  });

  return {
    reportId: result.report_id,
    reportUnlocked: result.report_unlocked,
  };
}

export function redirectToPaymentUrl(paymentUrl: string) {
  window.location.assign(paymentUrl);
}
