import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS_HEADERS, errorResponse, jsonResponse } from "../_shared/http.ts";
import { verifyBatchAccess } from "../_shared/supabase.ts";

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return errorResponse("Use POST.", 405);
  }

  const body = await request.json().catch(() => null);
  const batchCode = typeof body?.batch_code === "string" ? body.batch_code : "";
  const adminToken = typeof body?.admin_token === "string" ? body.admin_token : "";

  if (!batchCode || !adminToken) {
    return errorResponse("batch_code and admin_token are required.");
  }

  const access = await verifyBatchAccess(batchCode, adminToken);
  if (!access.valid) {
    return errorResponse(access.error, 403);
  }

  const { data: sessions, error: sessionsError } = await access.supabase
    .from("student_sessions")
    .select("id, name, class, section, school_name, entry_path, status")
    .eq("batch_code", access.batchCode)
    .eq("entry_path", "school-issued");

  if (sessionsError) {
    return errorResponse(sessionsError.message, 500);
  }

  const { data: scores, error: scoresError } = await access.supabase
    .from("calculated_scores")
    .select("session_id, report_id, scored_at, report_json")
    .in("session_id", (sessions ?? []).map((session) => session.id));

  if (scoresError) {
    return errorResponse(scoresError.message, 500);
  }

  const scoreBySession = new Map((scores ?? []).map((score) => [score.session_id, score]));
  const reports = (sessions ?? [])
    .map((session) => {
      const score = scoreBySession.get(session.id);
      if (!score || !score.report_json) return null;

      const report = score.report_json as { cover?: { studentName?: string; class?: string; section?: string; school?: string } };
      return {
        reportId: score.report_id,
        studentName: report.cover?.studentName ?? session.name,
        className: report.cover?.class ?? session.class,
        section: report.cover?.section ?? session.section ?? "N/A",
        schoolName: report.cover?.school ?? session.school_name ?? access.schoolName,
        sessionId: session.id,
        generatedAt: score.scored_at,
      };
    })
    .filter((report): report is NonNullable<typeof report> => report !== null);

  return jsonResponse({
    schoolName: access.schoolName,
    batchCode: access.batchCode,
    validUntil: access.validUntil,
    metrics: {
      invited: sessions?.length ?? 0,
      started: sessions?.length ?? 0,
      completed: (sessions ?? []).filter((session) => session.status === "completed").length,
      reportReady: reports.length,
    },
    reports,
  });
});
