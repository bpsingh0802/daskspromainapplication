import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  try {
    const { record } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {
      id,
      email,
      user_metadata,
    } = record;

    const fullName = user_metadata?.full_name || "";
    const phone = user_metadata?.phone || "";
    const userType = user_metadata?.user_type || "customer";

    const { error } = await supabase
      .from("users")
      .upsert(
        {
          id,
          email,
          full_name: fullName,
          phone,
          user_type: userType,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("Error inserting user profile:", error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, message: "User profile created" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in on-auth-user-created:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
