import { supabase } from './supabase';

export interface JobApplicationData {
  job_id: string;
  cover_letter: string;
  resume_url?: string | null;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  cover_letter: string;
  resume_url?: string | null;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export async function createJobApplication(
  applicationData: JobApplicationData
): Promise<{ success: boolean; error?: string; applicationId?: string }> {
  try {
    console.log('Creating job application:', applicationData);

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Validate required fields
    if (!applicationData.job_id || !applicationData.cover_letter) {
      return { success: false, error: 'Missing required application information' };
    }

    // Check if user has already applied for this job
    const { data: existingApplication, error: checkError } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', applicationData.job_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing application:', checkError);
      return { success: false, error: 'Failed to check existing applications' };
    }

    if (existingApplication) {
      return { success: false, error: 'You have already applied for this job' };
    }

    // Create the job application
    const { data, error } = await supabase
      .from('job_applications')
      .insert({
        job_id: applicationData.job_id,
        user_id: user.id,
        cover_letter: applicationData.cover_letter,
        resume_url: applicationData.resume_url,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job application:', error);
      return { success: false, error: error.message };
    }

    console.log('Job application created successfully:', data);
    return { success: true, applicationId: data.id };
  } catch (error) {
    console.error('Error in createJobApplication:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getUserJobApplications(): Promise<JobApplication[]> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('User not authenticated for job applications');
      return [];
    }

    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user job applications:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserJobApplications:', error);
    return [];
  }
}

export async function updateJobApplicationStatus(
  applicationId: string,
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) {
      console.error('Error updating job application status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateJobApplicationStatus:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}