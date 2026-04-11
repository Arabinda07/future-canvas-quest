import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS_HEADERS, errorResponse, jsonResponse } from "../_shared/http.ts";
import { hashReportAccessToken } from "../_shared/reportAccess.ts";
import { createServiceRoleClient } from "../_shared/supabase.ts";

function getRazorpayAuthHeader() {
  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  return `Basic ${btoa(`${keyId}:${keySecret}`)}`;
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return errorResponse("Use POST.", 405);
  }

  try {
    const body = await request.json().catch(() => null);
    const reportId = typeof body?.report_id === "string" ? body.report_id.trim() : "";
    const accessToken = typeof body?.access_token === "string" ? body.access_token.trim() : "";
    const paymentId = typeof body?.razorpay_payment_id === "string" ? body.razorpay_payment_id.trim() : "";
    const paymentLinkId = typeof body?.razorpay_payment_link_id === "string" ? body.razorpay_payment_link_id.trim() : "";
    const paymentLinkStatus = typeof body?.razorpay_payment_link_status === "string" ? body.razorpay_payment_link_status.trim() : "";

    if (!reportId || !accessToken || !paymentId || !paymentLinkId) {
      return errorResponse("Payment verification details are incomplete.", 400);
    }

    const supabase = createServiceRoleClient();
    const tokenHash = await hashReportAccessToken(accessToken);

    const { data: score, error: scoreError } = await supabase
      .from("calculated_scores")
      .select("session_id, report_id")
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
      .select("id, report_access_token_hash")
      .eq("id", score.session_id)
      .maybeSingle();

    if (sessionError) {
      return errorResponse(sessionError.message, 500);
    }

    if (!session || session.report_access_token_hash !== tokenHash) {
      return errorResponse("Report not found.", 404);
    }

    const { data: payment, error: paymentError } = await supabase
      .from("report_payments")
      .select("id, session_id, report_id")
      .eq("report_id", reportId)
      .eq("razorpay_payment_link_id", paymentLinkId)
      .maybeSingle();

    if (paymentError) {
      return errorResponse(paymentError.message, 500);
    }

    if (!payment || payment.session_id !== session.id) {
      return errorResponse("Payment link not found.", 404);
    }

    const razorpayResponse = await fetch(`https://api.razorpay.com/v1/payment_links/${encodeURIComponent(paymentLinkId)}`, {
      headers: {
        Authorization: getRazorpayAuthHeader(),
      },
    });

    if (!razorpayResponse.ok) {
      console.error("Razorpay payment verification error:", await razorpayResponse.text());
      return errorResponse("Unable to verify Razorpay payment.", 502);
    }

    const paymentLink = await razorpayResponse.json();
    const verifiedStatus = typeof paymentLink?.status === "string" ? paymentLink.status : paymentLinkStatus;
    const isPaid = paymentLink.status === "paid";

    if (!isPaid) {
      return errorResponse("Payment is not complete.", 402);
    }

    const { error: updatePaymentError } = await supabase
      .from("report_payments")
      .update({
        razorpay_payment_id: paymentId,
        status: verifiedStatus,
        paid_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (updatePaymentError) {
      return errorResponse(updatePaymentError.message, 500);
    }

    const { error: unlockError } = await supabase
      .from("calculated_scores")
      .update({ report_unlocked: true })
      .eq("report_id", reportId);

    if (unlockError) {
      return errorResponse(unlockError.message, 500);
    }

    return jsonResponse({
      report_id: reportId,
      report_unlocked: true,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to verify payment.", 400);
  }
});
