import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS_HEADERS, errorResponse, jsonResponse } from "../_shared/http.ts";
import { createServiceRoleClient, verifyBatchAccess } from "../_shared/supabase.ts";
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

  // Verify the JWT by using standard createClient with auth options
  const supabaseAuth = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    return errorResponse("Unauthorized.", 401);
  }

  const body = await request.json().catch(() => null);
  const batchCode = typeof body?.batch_code === "string" ? body.batch_code : "";
  const adminToken = typeof body?.admin_token === "string" ? body.admin_token : "";

  if (!batchCode || !adminToken) {
    return errorResponse("batch_code and admin_token are required.");
  }

  // Verify that the batch and token are valid using the shared verifyBatchAccess helper
  const access = await verifyBatchAccess(batchCode, adminToken);
  if (!access.valid) {
    return errorResponse(access.error, 403);
  }

  const supabase = createServiceRoleClient();
  
  // Actually claim the batch: update counselor_id to the authenticated user ID
  const { error } = await supabase
    .from("school_batches")
    .update({ counselor_id: user.id })
    .eq("code", access.batchCode)
    .is("counselor_id", null); // Prevent claiming a batch that is already claimed if needed

  if (error) {
    return errorResponse(error.message, 500);
  }

  return jsonResponse({ success: true, batchCode: access.batchCode });
});
