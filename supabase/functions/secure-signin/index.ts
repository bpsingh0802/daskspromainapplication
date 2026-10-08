import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const email = `${phone.replace(/\+/g, '')}@phone.temp`;
    const password = crypto.randomUUID();

    let authData;
    let isNewUser = false;

    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const foundUser = existingUsers?.users?.find(u => u.phone === phone || u.email === email);

    if (foundUser) {
      console.log('User exists, updating password for login');
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        foundUser.id,
        { password: password }
      );

      if (updateError) {
        console.error('Error updating user password:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      authData = updateData;
    } else {
      console.log('Creating new user');
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        phone: phone,
        phone_confirm: true,
        email_confirm: true,
        user_metadata: { phone: phone, profile_completed: false }
      });

      if (createError || !newUser.user) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user account', details: createError?.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      authData = newUser;
      isNewUser = true;
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (signInError || !signInData.session) {
      console.error('Error signing in:', signInError);
      return new Response(
        JSON.stringify({ error: 'Failed to create session', details: signInError?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        session: signInData.session,
        isNewUser: isNewUser
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in secure-signin:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
