import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  user_type: string;
  created_at: string;
  updated_at: string;
  avatar?: string;
}

export interface ProfessionalProfile {
  id: string;
  business_name?: string;
  profession?: string;
  bio?: string;
  years_of_experience?: number;
  service_radius?: number;
  hourly_rate?: number;
  is_verified: boolean;
  is_first_login?: boolean;
  location?: string;
  name?: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
  availability?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface LabourProfile {
  id: string;
  business_name?: string;
  category?: string;
  bio?: string;
  years_of_experience?: number;
  daily_rate?: number;
  location?: string;
  is_verified: boolean;
  avatar?: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
  availability?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    console.log('Getting user profile...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User not authenticated:', userError);
      return null;
    }

    console.log('Fetching profile for user ID:', user.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    console.log('User profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

export async function getProfessionalProfile(): Promise<ProfessionalProfile | null> {
  try {
    console.log('Getting professional profile...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User not authenticated for professional profile:', userError);
      return null;
    }

    const { data, error } = await supabase
      .from('professional_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching professional profile:', error);
      return null;
    }

    console.log('Professional profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in getProfessionalProfile:', error);
    return null;
  }
}

export async function getLabourProfile(): Promise<LabourProfile | null> {
  try {
    console.log('Getting labour profile...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User not authenticated for labour profile:', userError);
      return null;
    }

    const { data, error } = await supabase
      .from('labour_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching labour profile:', error);
      return null;
    }

    console.log('Labour profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in getLabourProfile:', error);
    return null;
  }
}

export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  try {
    console.log('Getting customer profile...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User not authenticated for customer profile:', userError);
      return null;
    }

    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching customer profile:', error);
      return null;
    }

    console.log('Customer profile fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in getCustomerProfile:', error);
    return null;
  }
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateProfessionalProfile(updates: Partial<ProfessionalProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('professional_profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating professional profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateProfessionalProfile:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateLabourProfile(updates: Partial<LabourProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('labour_profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating labour profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateLabourProfile:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}