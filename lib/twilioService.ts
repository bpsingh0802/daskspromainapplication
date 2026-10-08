import { supabase } from './supabase';

// Re-usable interface for function responses
export interface FunctionResult {
  success: boolean;
  error?: string;
}

// Calls your 'send-otp' Edge Function
export async function sendOTP(phoneNumber: string): Promise<FunctionResult> {
  try {
    // We expect the full number in E.164 format (e.g., +919876543210)
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
      return { success: false, error: 'Please enter a valid phone number in international format' };
    }

    // The backend function expects a 'phone' key
    const { data, error } = await supabase.functions.invoke('send-otp', {
      body: { phone: phoneNumber },
    });

    if (error) throw new Error(error.message);
    if (data.error) return { success: false, error: data.error };
    return { success: true };

  } catch (error: any) {
    console.error('Error in sendOTP service:', error);
    return { success: false, error: error.message };
  }
}

// Calls your 'verify-otp' Edge Function
export async function verifyOTP(phoneNumber: string, code: string): Promise<FunctionResult> {
  try {
    if (!phoneNumber || !code) {
      return { success: false, error: 'Phone number and code are required' };
    }

    // The backend function expects 'phone' and 'otp' keys
    const { data, error } = await supabase.functions.invoke('verify-otp', {
      body: {
        phone: phoneNumber,
        otp: code.trim(),
      },
    });

    if (error) throw new Error(error.message);
    if (data.error) return { success: false, error: data.error };
    return { success: true };

  } catch (error: any) {
    console.error('Error in verifyOTP service:', error);
    return { success: false, error: error.message };
  }
}

// SECURELY signs in the user after a successful OTP verification
export async function signInAfterVerification(phoneNumber: string): Promise<FunctionResult & { isNewUser?: boolean }> {
    try {
        console.log('Attempting to sign in with phone:', phoneNumber);

        const { data, error } = await supabase.functions.invoke('secure-signin', {
            body: { phone: phoneNumber }
        });

        console.log('secure-signin response:', { data, error });

        if (error) {
            console.error('secure-signin function error:', error);
            throw new Error(error.message);
        }

        if (data.error) {
            console.error('secure-signin data error:', data.error);
            return { success: false, error: data.error };
        }

        if (!data.success || !data.session) {
            console.error('No session in response:', data);
            return { success: false, error: 'Failed to create session' };
        }

        console.log('Setting session in client...');
        const { error: sessionError } = await supabase.auth.setSession(data.session);

        if (sessionError) {
            console.error('Error setting session:', sessionError);
            throw new Error(sessionError.message);
        }

        console.log('Session set successfully. Is new user:', data.isNewUser);
        return { success: true, isNewUser: data.isNewUser };

    } catch (error: any) {
        console.error('Error in signInAfterVerification:', error);
        return { success: false, error: error.message };
    }
}