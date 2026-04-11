import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS_HEADERS, errorResponse, jsonResponse } from "../_shared/http.ts";
import { hashReportAccessToken } from "../_shared/reportAccess.ts";
import { createServiceRoleClient } from "../_shared/supabase.ts";

const REPORT_PRICE_PAISE = 9900;

function getRazorpayAuthHeader() {
  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  return `Basic ${btoa(`${keyId}:${keySecret}`)}`;
}

function normalizeCallbackOrigin(value: unknown, fallback: string | null) {
  const origin = typeof value === "string" && value.trim() ? value.trim() : fallback ?? "";
  if (!origin.startsWith("http://") && !origin.startsWith("https://")) {
    throw new Error("A valid callback origin is required.");
  }
  return origin.replace(/\/$/, "");
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

    if (!reportId || !accessToken) {
      return errorResponse("Report not found.", 404);
    }

    const supabase = createServiceRoleClient();
    const tokenHash = await hashReportAccessToken(accessToken);

    const { data: score, error: scoreError } = await supabase
      .from("calculated_scores")
      .select("session_id, report_id, report_unlocked")
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
      .select("id, name, entry_path, report_access_token_hash")
      .eq("id", score.session_id)
      .maybeSingle();

    if (sessionError) {
      return errorResponse(sessionError.message, 500);
    }

    if (!session || session.report_access_token_hash !== tokenHash) {
      return errorResponse("Report not found.", 404);
    }

    if (session.entry_path === "school-issued") {
      return errorResponse("This report is already available through the school dashboard.", 409);
    }

    const { data: paidPayment, error: paidPaymentError } = await supabase
      .from("report_payments")
      .select("id")
      .eq("session_id", session.id)
      .eq("report_id", reportId)
      .eq("status", "paid")
      .maybeSingle();

    if (paidPaymentError) {
      return errorResponse(paidPaymentError.message, 500);
    }

    if (score.report_unlocked && paidPayment) {
      return errorResponse("This report is already unlocked.", 409);
    }

    const callbackOrigin = normalizeCallbackOrigin(body?.callback_origin, request.headers.get("origin"));
    const callbackUrl = `${callbackOrigin}/payment-success?reportId=${encodeURIComponent(reportId)}&token=${encodeURIComponent(accessToken)}`;

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        Authorization: getRazorpayAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: REPORT_PRICE_PAISE,
        currency: "INR",
        description: "Future Canvas Career Clarity Report",
        customer: {
          name: session.name,
        },
        notify: {
          sms: false,
          email: false,
        },
        callback_url: callbackUrl,
        callback_method: "get",
        expire_by: Math.floor(Date.now() / 1000) + 30 * 60,
        notes: {
          product: "future_canvas_report",
          report_id: reportId,
          session_id: session.id,
        },
      }),
    });

    if (!razorpayResponse.ok) {
      console.error("Razorpay payment link error:", await razorpayResponse.text());
      return errorResponse("Unable to create Razorpay payment link.", 502);
    }

    const paymentLink = await razorpayResponse.json();

    const { error: paymentError } = await supabase.from("report_payments").insert({
      session_id: session.id,
      report_id: reportId,
      razorpay_payment_link_id: paymentLink.id,
      amount_paise: REPORT_PRICE_PAISE,
      currency: "INR",
      status: paymentLink.status ?? "created",
    });

    if (paymentError) {
      return errorResponse(paymentError.message, 500);
    }

    return jsonResponse({
      payment_url: paymentLink.short_url,
      payment_link_id: paymentLink.id,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to create payment link.", 400);
  }
});
