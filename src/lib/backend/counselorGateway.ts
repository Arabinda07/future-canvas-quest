import type { Report, StudentClass } from "@/domain/types";
import type { CounselorAccessSession } from "@/features/counselor/accessSession";
import { invokeSupabaseFunction } from "@/lib/backend/supabase";

export interface ValidateCounselorAccessResult {
  valid: boolean;
  batchCode?: string;
  schoolName?: string;
  validUntil?: string;
  error?: string;
}

export interface CounselorDashboardReportSummary {
  reportId: string;
  studentName: string;
  className: StudentClass;
  section: string;
  schoolName: string;
  sessionId: string;
  generatedAt: string;
}

export interface CounselorDashboardData {
  schoolName: string;
  batchCode: string;
  validUntil?: string;
  metrics: {
    invited: number;
    started: number;
    completed: number;
    reportReady: number;
  };
  reports: CounselorDashboardReportSummary[];
}

export interface CounselorRegistrationInput {
  counselorName: string;
  email: string;
  phone: string;
  schoolName: string;
  schoolCity: string;
  expectedStudentCount: number;
  message?: string;
}

export interface CounselorRegistrationRequest extends CounselorRegistrationInput {
  id: string;
  status: "pending" | "approved" | "rejected";
  batchCode?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

export interface CounselorRegistrationResult {
  requestId: string;
  status: "pending" | "approved" | "rejected";
}

export interface CounselorRegistrationListResult {
  requests: CounselorRegistrationRequest[];
}

export interface CounselorBatchRow {
  code: string;
  school_name: string;
  seats_purchased: number;
  seats_used: number;
  valid_from: string;
  valid_until?: string | null;
  created_at: string;
}

export interface CounselorBatchListResult {
  batches: CounselorBatchRow[];
}

export interface RetireBatchResult {
  batchCode: string;
  retired: boolean;
}

export interface CounselorApprovalInput {
  requestId: string;
  approvalToken: string;
}

export interface CounselorApprovalResult {
  requestId: string;
  status: "approved";
  batchCode: string;
  adminToken: string;
  inviteUrl: string;
}

export async function validateCounselorAccess(batchCode: string, adminToken: string) {
  return invokeSupabaseFunction<ValidateCounselorAccessResult>("validate-counselor-access", {
    batch_code: batchCode,
    admin_token: adminToken,
  });
}

export async function fetchCounselorDashboardData(session: CounselorAccessSession) {
  return invokeSupabaseFunction<CounselorDashboardData>("get-counselor-dashboard", {
    batch_code: session.batchCode,
    admin_token: session.adminToken,
  });
}

export async function fetchCounselorReport(reportId: string, session: CounselorAccessSession) {
  const result = await invokeSupabaseFunction<{ report: Report | null }>("get-counselor-report", {
    report_id: reportId,
    batch_code: session.batchCode,
    admin_token: session.adminToken,
  });

  return result.report;
}

export async function submitCounselorRegistration(input: CounselorRegistrationInput) {
  return invokeSupabaseFunction<CounselorRegistrationResult>("submit-counselor-registration", {
    counselor_name: input.counselorName,
    email: input.email,
    phone: input.phone,
    school_name: input.schoolName,
    school_city: input.schoolCity,
    expected_student_count: input.expectedStudentCount,
    message: input.message ?? "",
  });
}

export async function listCounselorRegistrationRequests(approvalToken: string, statusFilter: string = "pending") {
  return invokeSupabaseFunction<CounselorRegistrationListResult>("approve-counselor-registration", {
    action: "list",
    approval_token: approvalToken,
    status: statusFilter,
  });
}

export async function listCounselorBatches(approvalToken: string) {
  return invokeSupabaseFunction<CounselorBatchListResult>("approve-counselor-registration", {
    action: "list_batches",
    approval_token: approvalToken,
  });
}

export async function retireCounselorBatch(batchCode: string, approvalToken: string) {
  return invokeSupabaseFunction<RetireBatchResult>("approve-counselor-registration", {
    action: "retire_batch",
    batch_code: batchCode,
    approval_token: approvalToken,
  });
}

export async function approveCounselorRegistration(input: CounselorApprovalInput) {
  return invokeSupabaseFunction<CounselorApprovalResult>("approve-counselor-registration", {
    action: "approve",
    request_id: input.requestId,
    approval_token: input.approvalToken,
    site_origin: window.location.origin,
  });
}

export async function rejectCounselorRegistration(input: CounselorApprovalInput) {
  return invokeSupabaseFunction<CounselorRegistrationResult>("approve-counselor-registration", {
    action: "reject",
    request_id: input.requestId,
    approval_token: input.approvalToken,
  });
}
