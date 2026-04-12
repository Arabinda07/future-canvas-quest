import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS_HEADERS, errorResponse, jsonResponse } from "../_shared/http.ts";
import { createServiceRoleClient } from "../_shared/supabase.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return errorResponse("Use POST.", 405);
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return errorResponse("Missing Authorization header.", 401);
  }

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anonKey) {
    return errorResponse("Server configuration error.", 500);
  }

  const supabaseAuth = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    return errorResponse("Unauthorized.", 401);
  }

  const supabase = createServiceRoleClient();

  // Fetch all batches owned by this counselor
  const { data: batches, error: batchesError } = await supabase
    .from("school_batches")
    .select("code, school_name, valid_until")
    .eq("counselor_id", user.id);

  if (batchesError) {
    return errorResponse(batchesError.message, 500);
  }

  if (!batches || batches.length === 0) {
    return jsonResponse({ batches: [] });
  }

  const batchCodes = batches.map(b => b.code);

  const { data: sessions, error: sessionsError } = await supabase
    .from("student_sessions")
    .select("id, name, class, section, school_name, entry_path, status, batch_code")
    .in("batch_code", batchCodes)
    .eq("entry_path", "school-issued");

  if (sessionsError) {
    return errorResponse(sessionsError.message, 500);
  }

  const { data: scores, error: scoresError } = await supabase
    .from("calculated_scores")
    .select("session_id, report_id, scored_at, report_json")
    .in("session_id", (sessions ?? []).map((session) => session.id));

  if (scoresError) {
    return errorResponse(scoresError.message, 500);
  }

  const scoreBySession = new Map((scores ?? []).map((score) => [score.session_id, score]));
  
  // Group results by batch
  const batchData = batches.map(batch => {
    const batchSessions = (sessions ?? []).filter(s => s.batch_code === batch.code);
    const reports = batchSessions
      .map((session) => {
        const score = scoreBySession.get(session.id);
        if (!score || !score.report_json) return null;

        const report = score.report_json as { cover?: { studentName?: string; class?: string; section?: string; school?: string } };
        return {
          reportId: score.report_id,
          studentName: report.cover?.studentName ?? session.name,
          className: report.cover?.class ?? session.class,
          section: report.cover?.section ?? session.section ?? "N/A",
          schoolName: report.cover?.school ?? session.school_name ?? batch.school_name,
          sessionId: session.id,
          generatedAt: score.scored_at,
        };
      })
      .filter((report): report is NonNullable<typeof report> => report !== null);

    return {
      schoolName: batch.school_name,
      batchCode: batch.code,
      validUntil: batch.valid_until,
      metrics: {
        invited: batchSessions.length,
        started: batchSessions.length,
        completed: batchSessions.filter((session) => session.status === "completed").length,
        reportReady: reports.length,
      },
      reports,
    };
  });

  return jsonResponse({ batches: batchData });
});
