import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export function createServiceRoleClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, serviceRoleKey);
}

export async function verifyBatchAccess(batchCode: string, adminToken: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("school_batches")
    .select("code, school_name, valid_until, admin_token")
    .eq("code", batchCode.toUpperCase())
    .maybeSingle();

  if (error || !data) {
    return { valid: false as const, error: "Invalid batch code." };
  }

  if (data.admin_token !== adminToken) {
    return { valid: false as const, error: "Invalid access token." };
  }

  if (data.valid_until && new Date(data.valid_until) < new Date()) {
    return { valid: false as const, error: "This invite link has expired." };
  }

  return {
    valid: true as const,
    batchCode: data.code,
    schoolName: data.school_name,
    validUntil: data.valid_until ?? undefined,
    supabase,
  };
}
