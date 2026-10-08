import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust path if needed
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the initial session to quickly set the user state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Set up a listener for any future auth changes (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event);
        setUser(session?.user ?? null);
        
        // Ensure loading is false after the first check is complete
        setLoading(false);
      }
    );

    // 3. Cleanup the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to sign the user out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); // Instantly update the user state for a faster UI response
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
}