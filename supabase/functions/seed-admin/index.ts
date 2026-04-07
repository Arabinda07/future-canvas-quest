import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const email = "admin@futurecanvas.in";
    const password = "Admin123!";

    // Create user
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // User may already exist
      if (createError.message.includes("already been registered")) {
        // Get existing user
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const existing = users?.find(u => u.email === email);
        if (existing) {
          // Ensure role exists
          await supabaseAdmin.from("user_roles").upsert(
            { user_id: existing.id, role: "admin" },
            { onConflict: "user_id,role" }
          );
          return new Response(JSON.stringify({ message: "Admin already exists, role ensured" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      throw createError;
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id: user.user!.id,
      role: "admin",
    });

    if (roleError) throw roleError;

    return new Response(JSON.stringify({ message: "Admin created", email }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
