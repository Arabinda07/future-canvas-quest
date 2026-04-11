import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS_HEADERS, errorResponse, jsonResponse } from "../_shared/http.ts";
import { createServiceRoleClient } from "../_shared/supabase.ts";

interface CounselorRegistrationRequestRow {
  id: string;
  counselor_name: string;
  email: string;
  phone: string;
  school_name: string;
  school_city: string;
  expected_student_count: number;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  batch_code: string | null;
  created_at: string;
  reviewed_at: string | null;
}

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function assertAdminApprovalToken(providedToken: string) {
  const expectedToken = Deno.env.get("FCQ_ADMIN_APPROVAL_TOKEN");
  if (!expectedToken) {
    return "Admin approval token is not configured.";
  }

  if (!providedToken || providedToken !== expectedToken) {
    return "Invalid admin approval token.";
  }

  return null;
}

function randomToken(bytes = 24) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return btoa(String.fromCharCode(...data)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function schoolPrefix(schoolName: string) {
  const words = schoolName
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const initials = words.map((word) => word[0]).join("").slice(0, 4);
  return (initials || "FCQ").padEnd(3, "X");
}

async function createUniqueBatch(supabase: ReturnType<typeof createServiceRoleClient>, registration: CounselorRegistrationRequestRow) {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `${schoolPrefix(registration.school_name)}${year}${randomToken(3).slice(0, 4)}`.toUpperCase();
    const adminToken = `fcq_admin_${code}_${randomToken(18)}`;
    const { error } = await supabase
      .from("school_batches")
      .insert({
        code,
        school_name: registration.school_name,
        admin_token: adminToken,
        seats_purchased: registration.expected_student_count,
        seats_used: 0,
      });

    if (!error) {
      return { code, adminToken };
    }

    if (error.code !== "23505") {
      throw new Error(error.message);
    }
  }

  throw new Error("Could not generate a unique school batch code.");
}

function buildInviteUrl(siteOrigin: string, batchCode: string, adminToken: string) {
  const origin = (siteOrigin || Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:8080").replace(/\/$/, "");
  const params = new URLSearchParams({ batch: batchCode, token: adminToken });
  return `${origin}/counselor/dashboard?${params.toString()}`;
}

function toClientRequest(row: CounselorRegistrationRequestRow) {
  return {
    id: row.id,
    counselorName: row.counselor_name,
    email: row.email,
    phone: row.phone,
    schoolName: row.school_name,
    schoolCity: row.school_city,
    expectedStudentCount: row.expected_student_count,
    message: row.message ?? "",
    status: row.status,
    batchCode: row.batch_code,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
  };
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return errorResponse("Use POST.", 405);
  }

  const body = await request.json().catch(() => null);
  const action = asTrimmedString(body?.action);
  const approvalToken = asTrimmedString(body?.approval_token);
  const tokenError = assertAdminApprovalToken(approvalToken);
  if (tokenError) {
    return errorResponse(tokenError, tokenError.includes("configured") ? 500 : 403);
  }

  const supabase = createServiceRoleClient();

  if (action === "list") {
    const { data, error } = await supabase
      .from("counselor_registration_requests")
      .select("id, counselor_name, email, phone, school_name, school_city, expected_student_count, message, status, batch_code, created_at, reviewed_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      return errorResponse(error.message, 500);
    }

    return jsonResponse({ requests: (data ?? []).map((row) => toClientRequest(row as CounselorRegistrationRequestRow)) });
  }

  const requestId = asTrimmedString(body?.request_id);
  if (!requestId) {
    return errorResponse("request_id is required.");
  }

  const { data: registration, error: registrationError } = await supabase
    .from("counselor_registration_requests")
    .select("id, counselor_name, email, phone, school_name, school_city, expected_student_count, message, status, batch_code, created_at, reviewed_at")
    .eq("id", requestId)
    .single();

  if (registrationError || !registration) {
    return errorResponse(registrationError?.message ?? "Counselor registration request not found.", 404);
  }

  const row = registration as CounselorRegistrationRequestRow;

  if (action === "reject") {
    if (row.status !== "pending") {
      return errorResponse("Only pending counselor registration requests can be rejected.", 409);
    }

    const { error } = await supabase
      .from("counselor_registration_requests")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", requestId);

    if (error) {
      return errorResponse(error.message, 500);
    }

    return jsonResponse({ requestId, status: "rejected" });
  }

  if (action !== "approve") {
    return errorResponse("Use action list, approve, or reject.");
  }

  if (row.status === "approved" && row.batch_code) {
    const { data: batch, error } = await supabase
      .from("school_batches")
      .select("code, admin_token")
      .eq("code", row.batch_code)
      .single();

    if (error || !batch) {
      return errorResponse(error?.message ?? "Approved batch was not found.", 500);
    }

    return jsonResponse({
      requestId,
      status: "approved",
      batchCode: batch.code,
      adminToken: batch.admin_token,
      inviteUrl: buildInviteUrl(asTrimmedString(body?.site_origin), batch.code, batch.admin_token),
    });
  }

  if (row.status !== "pending") {
    return errorResponse("Only pending counselor registration requests can be approved.", 409);
  }

  try {
    const batch = await createUniqueBatch(supabase, row);
    const { data: updatedRequest, error } = await supabase
      .from("counselor_registration_requests")
      .update({ status: "approved", batch_code: batch.code, reviewed_at: new Date().toISOString() })
      .eq("id", requestId)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (error) {
      return errorResponse(error.message, 500);
    }

    if (!updatedRequest) {
      await supabase.from("school_batches").delete().eq("code", batch.code);
      return errorResponse("This counselor registration request was already reviewed.", 409);
    }

    return jsonResponse({
      requestId,
      status: "approved",
      batchCode: batch.code,
      adminToken: batch.adminToken,
      inviteUrl: buildInviteUrl(asTrimmedString(body?.site_origin), batch.code, batch.adminToken),
    });
  } catch (approvalError) {
    return errorResponse(approvalError instanceof Error ? approvalError.message : "Could not approve counselor registration request.", 500);
  }
});
