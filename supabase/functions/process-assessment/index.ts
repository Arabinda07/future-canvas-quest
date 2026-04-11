import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { buildAssessmentArtifacts, type AssessmentSubmissionPayload } from "../_shared/assessmentSubmission.ts";
import { encryptAnswersForStorage } from "../_shared/answerEncryption.ts";
import { createServiceRoleClient } from "../_shared/supabase.ts";
import { CORS_HEADERS, errorResponse, jsonResponse } from "../_shared/http.ts";
import { generateReportAccessToken, hashReportAccessToken } from "../_shared/reportAccess.ts";

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return errorResponse("Use POST.", 405);
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return errorResponse("Request body must be valid JSON.");
  }

  try {
    const submission = body as AssessmentSubmissionPayload;
    const supabase = createServiceRoleClient();

    let resolvedSchoolName = submission.school_name?.trim() ?? "";
    let normalizedBatchCode: string | null = null;

    if (submission.entry_path === "school-issued") {
      normalizedBatchCode = submission.batch_code?.trim().toUpperCase() ?? null;

      const { data: batch, error: batchError } = await supabase
        .from("school_batches")
        .select("code, school_name, valid_until")
        .eq("code", normalizedBatchCode)
        .maybeSingle();

      if (batchError || !batch) {
        return errorResponse("Invalid batch code.", 400);
      }

      if (batch.valid_until && new Date(batch.valid_until) < new Date()) {
        return errorResponse("This school access code has expired.", 400);
      }

      resolvedSchoolName = batch.school_name;
    }

    const reportId = `report_${crypto.randomUUID()}`;
    const generatedAt = new Date().toISOString();
    const reportAccessToken = generateReportAccessToken();
    const reportAccessTokenHash = await hashReportAccessToken(reportAccessToken);

    const { data: session, error: sessionError } = await supabase
      .from("student_sessions")
      .insert({
        ...buildAssessmentArtifacts({
          sessionId: "",
          reportId,
          generatedAt,
          submission: {
            ...submission,
            batch_code: normalizedBatchCode,
            school_name: resolvedSchoolName || submission.school_name,
          },
          resolvedSchoolName,
        }).sessionInsert,
        report_access_token_hash: reportAccessTokenHash,
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      return errorResponse(sessionError?.message ?? "Unable to create student session.", 500);
    }

    const prepared = buildAssessmentArtifacts({
      sessionId: session.id,
      reportId,
      generatedAt,
      submission: {
        ...submission,
        batch_code: normalizedBatchCode,
        school_name: resolvedSchoolName || submission.school_name,
      },
      resolvedSchoolName,
    });
    const answersEnc = await encryptAnswersForStorage(prepared.normalizedAnswers);

    const { error: answersError } = await supabase.from("student_answers").insert({
      session_id: session.id,
      answers_enc: answersEnc,
    });

    if (answersError) {
      return errorResponse(answersError.message, 500);
    }

    const { error: scoresError } = await supabase.from("calculated_scores").insert({
      session_id: session.id,
      ...prepared.scoresInsert,
    });

    if (scoresError) {
      return errorResponse(scoresError.message, 500);
    }

    return jsonResponse({
      success: true,
      session_id: session.id,
      report_id: reportId,
      report_access_token: reportAccessToken,
      report_locked: false,
      report: prepared.report,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Unable to process assessment.", 400);
  }
});
