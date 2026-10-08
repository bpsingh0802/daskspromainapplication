import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { phone } = body;

    // 1. Validate the incoming phone number
    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // This regex ensures the number is in the correct E.164 format for India
    if (!/^\+91\d{10}$/.test(phone)) {
        return new Response(
            JSON.stringify({ error: 'Invalid phone number format. Expected +91XXXXXXXXXX.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // 2. SECURELY get Twilio credentials from environment variables
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const serviceSid = Deno.env.get("TWILIO_VERIFY_SID");

    // 3. If credentials are NOT set, run in development mode (no SMS sent)
    if (!accountSid || !authToken || !serviceSid) {
      console.warn(`Twilio credentials not found. Running in DEV mode for ${phone}.`);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'DEV MODE: OTP sent successfully (not really)',
          sid: `dev_${crypto.randomUUID()}`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Send the OTP using the Twilio Verify API
    const twilioUrl = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: phone, Channel: 'sms' }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Twilio API Error:', responseData);
      return new Response(
        JSON.stringify({ error: responseData.message || 'Failed to send OTP via Twilio' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Return a success response
    return new Response(
      JSON.stringify({ success: true, sid: responseData.sid }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Internal Server Error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});