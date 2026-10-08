import { supabase } from './supabase';

export interface ServiceInquiry {
  id: string;
  service_id: string;
  name: string;
  email: string;
  phone?: string;
  query: string;
  status: 'pending' | 'responded' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CreateServiceInquiryData {
  service_id: string;
  name: string;
  email: string;
  phone?: string;
  query: string;
}

export async function createServiceInquiry(
  inquiryData: CreateServiceInquiryData
): Promise<{ success: boolean; error?: string; inquiryId?: string }> {
  try {
    console.log('Creating service inquiry:', inquiryData);

    const { data, error } = await supabase
      .from('service_inquiries')
      .insert({
        service_id: inquiryData.service_id,
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        query: inquiryData.query,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service inquiry:', error);
      return { success: false, error: error.message };
    }

    console.log('Service inquiry created successfully:', data);
    return { success: true, inquiryId: data.id };
  } catch (error) {
    console.error('Error in createServiceInquiry:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getUserInquiries(): Promise<ServiceInquiry[]> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('User not authenticated, cannot fetch inquiries');
      return [];
    }

    const { data, error } = await supabase
      .from('service_inquiries')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user inquiries:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserInquiries:', error);
    return [];
  }
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: 'pending' | 'responded' | 'closed'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('service_inquiries')
      .update({ status })
      .eq('id', inquiryId);

    if (error) {
      console.error('Error updating inquiry status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateInquiryStatus:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getInquiriesByServiceId(serviceId: string): Promise<ServiceInquiry[]> {
  try {
    const { data, error } = await supabase
      .from('service_inquiries')
      .select('*')
      .eq('service_id', serviceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inquiries by service ID:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getInquiriesByServiceId:', error);
    return [];
  }
}