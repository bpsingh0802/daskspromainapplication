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
    const body = await req.json();
    const phoneNumber = body.phoneNumber || body.phone;
    const code = body.code || body.otp;

    if (!phoneNumber || !code) {
      return new Response(
        JSON.stringify({ error: 'Phone number and code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Twilio credentials from environment variables
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const serviceSid = Deno.env.get("TWILIO_VERIFY_SID");

    // If Twilio credentials are not configured, use development mode
    if (!accountSid || !authToken || !serviceSid) {
      console.log('Twilio credentials not found, using development mode');
      
      // In development mode, accept the fixed OTP 123456
      const isValidDevelopmentOTP = code === '123456';
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          valid: isValidDevelopmentOTP,
          status: isValidDevelopmentOTP ? 'approved' : 'pending',
          developmentMode: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Production mode with Twilio
    const twilioUrl = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`;
    const auth = btoa(`${accountSid}:${authToken}`);

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phoneNumber,
        Code: code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio verification error:', data);
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to verify OTP' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        valid: data.status === 'approved',
        status: data.status 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});