import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS_HEADERS, errorResponse, jsonResponse } from "../_shared/http.ts";
import { createServiceRoleClient } from "../_shared/supabase.ts";

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return errorResponse("Use POST.", 405);
  }

  const body = await request.json().catch(() => null);
  const counselorName = asTrimmedString(body?.counselor_name);
  const email = asTrimmedString(body?.email).toLowerCase();
  const phone = asTrimmedString(body?.phone);
  const schoolName = asTrimmedString(body?.school_name);
  const schoolCity = asTrimmedString(body?.school_city);
  const expectedStudentCount = Number(body?.expected_student_count);
  const message = asTrimmedString(body?.message);

  if (!counselorName || !email || !phone || !schoolName || !schoolCity) {
    return errorResponse("Counselor name, email, phone, school name, and school city are required.");
  }

  if (!email.includes("@")) {
    return errorResponse("Enter a valid email address.");
  }

  if (!Number.isInteger(expectedStudentCount) || expectedStudentCount <= 0) {
    return errorResponse("Expected student count must be a positive integer.");
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("counselor_registration_requests")
    .insert({
      counselor_name: counselorName,
      email,
      phone,
      school_name: schoolName,
      school_city: schoolCity,
      expected_student_count: expectedStudentCount,
      message: message || null,
      status: "pending",
    })
    .select("id, status")
    .single();

  if (error || !data) {
    return errorResponse(error?.message ?? "Could not store counselor registration request.", 500);
  }

  return jsonResponse({
    requestId: data.id,
    status: data.status,
  });
});
