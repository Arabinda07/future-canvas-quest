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
