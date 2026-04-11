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
  const reportId = typeof body?.report_id === "string" ? body.report_id : "";

  if (!batchCode || !adminToken || !reportId) {
    return errorResponse("batch_code, admin_token, and report_id are required.");
  }

  const access = await verifyBatchAccess(batchCode, adminToken);
  if (!access.valid) {
    return errorResponse(access.error, 403);
  }

  const { data: score, error: scoreError } = await access.supabase
    .from("calculated_scores")
    .select("session_id, report_json")
    .eq("report_id", reportId)
    .maybeSingle();

  if (scoreError || !score) {
    return jsonResponse({ report: null });
  }

  const { data: session, error: sessionError } = await access.supabase
    .from("student_sessions")
    .select("batch_code, entry_path")
    .eq("id", score.session_id)
    .maybeSingle();

  if (
    sessionError ||
    !session ||
    session.batch_code !== access.batchCode ||
    session.entry_path !== "school-issued"
  ) {
    return jsonResponse({ report: null });
  }

  return jsonResponse({ report: score.report_json });
});
