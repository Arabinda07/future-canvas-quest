import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS_HEADERS, errorResponse, jsonResponse } from "../_shared/http.ts";
import { hashReportAccessToken } from "../_shared/reportAccess.ts";
import { createServiceRoleClient } from "../_shared/supabase.ts";

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return errorResponse("Use POST.", 405);
  }

  const body = await request.json().catch(() => null);
  const reportId = typeof body?.report_id === "string" ? body.report_id.trim() : "";
  const accessToken = typeof body?.access_token === "string" ? body.access_token.trim() : "";

  if (!reportId || !accessToken) {
    return errorResponse("Report not found.", 404);
  }

  const supabase = createServiceRoleClient();
  const tokenHash = await hashReportAccessToken(accessToken);

  const { data: score, error: scoreError } = await supabase
    .from("calculated_scores")
    .select("session_id, report_id, report_json, report_unlocked")
    .eq("report_id", reportId)
    .maybeSingle();

  if (scoreError) {
    return errorResponse(scoreError.message, 500);
  }

  if (!score) {
    return errorResponse("Report not found.", 404);
  }

  const { data: session, error: sessionError } = await supabase
    .from("student_sessions")
    .select("entry_path, report_access_token_hash")
    .eq("id", score.session_id)
    .maybeSingle();

  if (sessionError) {
    return errorResponse(sessionError.message, 500);
  }

  if (!session || session.report_access_token_hash !== tokenHash) {
    return errorResponse("Report not found.", 404);
  }

  const { data: paidPayment, error: paidPaymentError } = await supabase
    .from("report_payments")
    .select("id")
    .eq("session_id", score.session_id)
    .eq("report_id", score.report_id)
    .eq("status", "paid")
    .maybeSingle();

  if (paidPaymentError) {
    return errorResponse(paidPaymentError.message, 500);
  }

  const isUnlocked =
    session.entry_path === "school-issued" || (score.report_unlocked && Boolean(paidPayment));

  if (!isUnlocked) {
    return jsonResponse({
      reportId: score.report_id,
      report_locked: true,
      payment: {
        amountInPaise: 9900,
        currency: "INR",
        displayAmount: "Rs 99",
      },
    });
  }

  return jsonResponse({
    reportId: score.report_id,
    report_locked: false,
    report: score.report_json,
  });
});
