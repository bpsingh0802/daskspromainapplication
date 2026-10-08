import { supabase } from './supabase';

export interface ProfessionalDetail {
  id: string;
  business_name: string;
  profession: string;
  bio: string;
  years_of_experience: number;
  service_radius: number;
  hourly_rate: number;
  is_verified: boolean;
  is_first_login: boolean;
  location: string;
  created_at: string;
  updated_at: string;
  name: string;
  rating: number;
  reviews: number;
  tags: string[];
  availability: string;
  avatar: string;
  full_name?: string;
  email?: string;
  phone?: string;
  portfolio_images?: string[];
}

export interface BookingData {
  professional_id: string;
  service: string;
  booking_date: string;
  time_slot: string;
  full_name: string;
  notes?: string;
}

const SUPABASE_URL = 'https://ecleshtanrtbvslhyxwi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbGVzaHRhbnJ0YnZzbGh5eHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjM1MDQsImV4cCI6MjA2MDk5OTUwNH0.KxYLxhsq0ccCkljrZ4uusZjIWrwECMflowzj-PCVZnc';

export async function getProfessionalById(id: string): Promise<ProfessionalDetail | null> {
  try {
    console.log('Fetching professional by ID:', id);
    
    // Try the API endpoint first
    try {
      console.log('Trying API endpoint...');
      const response = await fetch(`${SUPABASE_URL}/functions/v1/professionalprofile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professionalId: id,
        }),
      });

      console.log('API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.professional) {
          const professional = data.professional;
          
          return {
            id: professional.id,
            business_name: professional.business_name || '',
            profession: professional.profession || '',
            bio: professional.bio || '',
            years_of_experience: professional.years_of_experience || 0,
            hourly_rate: professional.hourly_rate || 0,
            location: professional.location || '',
            is_verified: professional.is_verified || false,
            avatar: professional.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            rating: professional.rating || 0,
            reviews: professional.reviews || 0,
            tags: professional.tags || [],
            availability: professional.availability || 'Available',
            created_at: professional.created_at,
            updated_at: professional.updated_at,
            full_name: professional.full_name,
            email: professional.email,
            phone: professional.phone,
            portfolio_images: professional.portfolio_images || [],
          };
        }
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
      }
    } catch (apiError) {
      console.error('API request failed:', apiError);
    }

    // Fallback to direct Supabase query
    console.log('Falling back to direct Supabase query...');
    
    // Get professional data first
    const { data, error } = await supabase
      .from('professional_profiles')
      .select(`
        id,
        business_name,
        profession,
        bio,
        years_of_experience,
        service_radius,
        hourly_rate,
        is_verified,
        is_first_login,
        location,
        created_at,
        updated_at,
        name,
        rating,
        reviews,
        tags,
        availability,
        avatar,
        contact_number,
        portfolio_images
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fallback error:', error);
      return null;
    }

    if (!data) {
      console.log('No professional found with ID in fallback:', id);
      return null;
    }

    console.log('Supabase fallback data:', data);
    console.log('Portfolio images from database:', data.portfolio_images);

    // Get profile data separately
    let profileData = null;
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', id)
        .single();
      
      if (!profileError) {
      profileData = profile;
      }
    } catch (profileError) {
      console.log('Could not fetch profile data:', profileError);
    }

    return {
      id: data.id,
      business_name: data.business_name || '',
      profession: data.profession || '',
      bio: data.bio || '',
      years_of_experience: data.years_of_experience || 0,
      service_radius: data.service_radius || 25,
      hourly_rate: data.hourly_rate || 0,
      is_verified: data.is_verified || false,
      is_first_login: data.is_first_login || true,
      location: data.location || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
      name: data.name || '',
      rating: data.rating || 0,
      reviews: data.reviews || 0,
      tags: data.tags || [],
      availability: data.availability || 'Available',
      avatar: data.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      full_name: profileData?.full_name,
      email: profileData?.email,
      phone: profileData?.phone,
      contact_number: data.contact_number,
      portfolio_images: data.portfolio_images || [],
    };
  } catch (error) {
    console.error('Error in getProfessionalById:', error);
    return null;
  }
}

export async function createBooking(bookingData: BookingData): Promise<{ success: boolean; error?: string; bookingId?: string }> {
  try {
    console.log('Creating booking:', bookingData);
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Validate required fields
    if (!bookingData.professional_id || !bookingData.service || !bookingData.booking_date || !bookingData.time_slot || !bookingData.full_name) {
      return { success: false, error: 'Missing required booking information' };
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        professional_id: bookingData.professional_id,
        service: bookingData.service,
        booking_date: bookingData.booking_date,
        time_slot: bookingData.time_slot,
        full_name: bookingData.full_name,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }

    console.log('Booking created successfully:', data);
    return { success: true, bookingId: data.Booking_id };
  } catch (error) {
    console.error('Error in createBooking:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getUserBookings(): Promise<any[]> {
  try {
    console.log('Getting user bookings...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('User not authenticated for bookings');
      return [];
    }

    console.log('Fetching bookings for user:', user.id);

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        Booking_id,
        user_id,
        professional_id,
        service,
        status,
        created_at,
        booking_date,
        time_slot,
        full_name
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }

    console.log('Raw bookings data:', data);

    // Fetch professional details separately for each booking
    const bookingsWithProfessionals = await Promise.all(
      (data || []).map(async (booking) => {
        try {
          const { data: professionalData } = await supabase
            .from('professional_profiles')
            .select('business_name, profession, avatar, location')
            .eq('id', booking.professional_id)
            .maybeSingle();

          return {
            ...booking,
            professional_profiles: professionalData || {
              business_name: 'Unknown Professional',
              profession: 'Unknown',
              avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
              location: 'Unknown Location'
            }
          };
        } catch (error) {
          console.error('Error fetching professional for booking:', booking.Booking_id, error);
          return {
            ...booking,
            professional_profiles: {
              business_name: 'Unknown Professional',
              profession: 'Unknown',
              avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
              location: 'Unknown Location'
            }
          };
        }
      })
    );
    console.log('Bookings with professional data:', bookingsWithProfessionals);
    return bookingsWithProfessionals;
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    return [];
  }
}

export async function getAllProfessionals(): Promise<{ id: string; business_name: string; profession: string }[]> {
  try {
    console.log('Fetching all professionals...');
    
    // Try API first
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/professionalprofile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          getAllProfessionals: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('All professionals from API:', data);
        return data.professionals || [];
      }
    } catch (apiError) {
      console.error('API request failed for all professionals:', apiError);
    }

    // Fallback to direct query
    const { data, error } = await supabase
      .from('professional_profiles')
      .select('id, business_name, profession')
      .limit(20);

    if (error) {
      console.error('Error fetching professional IDs:', error);
      return [];
    }

    console.log('All professionals from fallback:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getAllProfessionals:', error);
    return [];
  }
}