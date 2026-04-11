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

  const result = await verifyBatchAccess(batchCode, adminToken);
  if (!result.valid) {
    return jsonResponse(result, 200);
  }

  return jsonResponse({
    valid: true,
    batchCode: result.batchCode,
    schoolName: result.schoolName,
    validUntil: result.validUntil,
  });
});
