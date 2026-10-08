import { supabase } from './supabase';

export interface Professional {
  id: string;
  name: string;
  business_name: string;
  profession: string;
  location: string;
  rating: number;
  hourly_rate: number;
  avatar: string;
  years_of_experience: number;
  tags: string[];
  availability: string;
  is_verified: boolean;
}

export interface Labour {
  id: string;
  name: string;
  business_name: string;
  category: string;
  location: string;
  rating: number;
  daily_rate: number;
  avatar: string;
  years_of_experience: number;
  tags: string[];
  availability: string;
  is_verified: boolean;
}

export type ServiceProvider = Professional | Labour;

export async function searchProfessionals(query?: string, location?: string): Promise<Professional[]> {
  try {
    console.log('searchProfessionals called with:', { query, location });
    let queryBuilder = supabase
      .from('professional_profiles')
      .select(`
        id,
        business_name,
        profession,
        location,
        rating,
        hourly_rate,
        avatar,
        years_of_experience,
        tags,
        availability,
        is_verified,
        name
      `);

    if (query) {
      queryBuilder = queryBuilder.or(`business_name.ilike.%${query}%,profession.ilike.%${query}%,name.ilike.%${query}%`);
    }

    if (location) {
      console.log('Applying location filter:', location);
      queryBuilder = queryBuilder.ilike('location', `%${location}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching professionals:', error);
      throw error;
    }

    return data?.map(item => ({
      id: item.id,
      name: item.name || item.business_name || '',
      business_name: item.business_name || '',
      profession: item.profession || '',
      location: item.location || '',
      rating: item.rating || 0,
      hourly_rate: item.hourly_rate || 0,
      avatar: item.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      years_of_experience: item.years_of_experience || 0,
      tags: item.tags || [],
      availability: item.availability || 'Available',
      is_verified: item.is_verified || false,
    })) || [];
  } catch (error) {
    console.error('Error fetching professionals:', error);
    return [];
  }
}

export async function searchLabour(query?: string, location?: string): Promise<Labour[]> {
  try {
    console.log('searchLabour called with:', { query, location });
    let queryBuilder = supabase
      .from('labour_profiles')
      .select(`
        id,
        business_name,
        category,
        location,
        rating,
        daily_rate,
        avatar,
        years_of_experience,
        tags,
        availability,
        is_verified
      `);

    if (query) {
      queryBuilder = queryBuilder.or(`business_name.ilike.%${query}%,category.ilike.%${query}%`);
    }

    if (location) {
      console.log('Applying location filter:', location);
      queryBuilder = queryBuilder.ilike('location', `%${location}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching labour:', error);
      throw error;
    }

    return data?.map(item => ({
      id: item.id,
      name: item.business_name || '',
      business_name: item.business_name || '',
      category: item.category || '',
      location: item.location || '',
      rating: item.rating || 0,
      daily_rate: item.daily_rate || 0,
      avatar: item.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      years_of_experience: item.years_of_experience || 0,
      tags: item.tags || [],
      availability: item.availability || 'Available',
      is_verified: item.is_verified || false,
    })) || [];
  } catch (error) {
    console.error('Error fetching labour:', error);
    return [];
  }
}

export async function searchServiceProviders(
  type: 'professional' | 'labour' | 'all' = 'all',
  query?: string,
  location?: string
): Promise<ServiceProvider[]> {
  try {
    if (type === 'professional') {
      return await searchProfessionals(query, location);
    } else if (type === 'labour') {
      return await searchLabour(query, location);
    } else {
      const [professionals, labour] = await Promise.all([
        searchProfessionals(query, location),
        searchLabour(query, location)
      ]);
      return [...professionals, ...labour];
    }
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return [];
  }
}