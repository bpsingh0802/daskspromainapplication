export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceUnit: 'hour' | 'day' | 'project';
  providerId: string;
  providerType: 'professional' | 'labour';
  providerName: string;
  providerImage: string;
  providerRating: number;
  providerReviews: number;
  location: string;
  duration: string;
  image: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFilters {
  category: string;
  location: string;
  priceRange: string;
  providerType: 'all' | 'professional' | 'labour';
  tags: string[];
}

const SUPABASE_URL = 'https://ecleshtanrtbvslhyxwi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbGVzaHRhbnJ0YnZzbGh5eHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjM1MDQsImV4cCI6MjA2MDk5OTUwNH0.KxYLxhsq0ccCkljrZ4uusZjIWrwECMflowzj-PCVZnc';

export async function searchServices(query?: string, filters?: ServiceFilters): Promise<Service[]> {
  try {
    console.log('Fetching services from API with query:', query, 'filters:', filters);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/services`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query || '',
        filters: filters || {},
      }),
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    // Check if we have services in the response
    if (!data.services || !Array.isArray(data.services)) {
      console.warn('No services array in response, using fallback data');
      return getFallbackServices();
    }
    
    // Transform the API response to match our Service interface
    return data.services.map((service: any) => ({
      id: service.id || Math.random().toString(36).substr(2, 9),
      title: service.title || 'Untitled Service',
      description: service.description || '',
      category: service.category || 'General',
      price: Number(service.price) || 0,
      priceUnit: service.price_unit || 'hour',
      providerId: service.provider_id || '',
      providerType: service.provider_type || 'professional',
      providerName: service.provider_name || 'Unknown Provider',
      providerImage: service.provider_image || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      providerRating: Number(service.provider_rating) || 0,
      providerReviews: Number(service.provider_reviews) || 0,
      location: service.location || 'Location not specified',
      duration: service.duration || 'Duration varies',
      image: service.image || 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: Array.isArray(service.tags) ? service.tags : [],
      isActive: service.is_active !== false,
      createdAt: service.created_at || new Date().toISOString(),
      updatedAt: service.updated_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching services from API:', error);
    
    // Return fallback data when API fails
    return getFallbackServices();
  }
}

function getFallbackServices(): Service[] {
  return [
    {
      id: '1',
      title: 'Professional House Cleaning',
      description: 'Complete house cleaning service with eco-friendly products. Our team provides thorough cleaning of all rooms including bathrooms, kitchen, bedrooms, and living areas.',
      category: 'Cleaning',
      price: 50,
      priceUnit: 'hour',
      providerId: 'provider-1',
      providerType: 'professional',
      providerName: 'Mary Johnson',
      providerImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      providerRating: 4.8,
      providerReviews: 120,
      location: 'New York, NY',
      duration: '3-4 hours',
      image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['cleaning', 'eco-friendly', 'residential'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Handyman Services',
      description: 'General handyman services for home repairs and maintenance. From fixing leaky faucets to installing fixtures and assembling furniture.',
      category: 'Handyman',
      price: 65,
      priceUnit: 'hour',
      providerId: 'provider-2',
      providerType: 'professional',
      providerName: 'Mike Chen',
      providerImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      providerRating: 4.7,
      providerReviews: 85,
      location: 'Brooklyn, NY',
      duration: 'Varies by project',
      image: 'https://images.pexels.com/photos/4792479/pexels-photo-4792479.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['repair', 'maintenance', 'handyman'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Construction Work',
      description: 'Professional construction and building services for residential and commercial projects.',
      category: 'Construction',
      price: 200,
      priceUnit: 'day',
      providerId: 'provider-3',
      providerType: 'labour',
      providerName: 'BuildCorp Team',
      providerImage: 'https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      providerRating: 4.5,
      providerReviews: 45,
      location: 'Queens, NY',
      duration: 'Project based',
      image: 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['construction', 'building', 'labour'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Interior Painting',
      description: 'Professional interior painting service with attention to detail and premium quality paints.',
      category: 'Painting',
      price: 45,
      priceUnit: 'hour',
      providerId: 'provider-4',
      providerType: 'professional',
      providerName: 'Jane Smith',
      providerImage: 'https://images.pexels.com/photos/762080/pexels-photo-762080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      providerRating: 4.9,
      providerReviews: 73,
      location: 'Manhattan, NY',
      duration: '1-3 days',
      image: 'https://images.pexels.com/photos/6444367/pexels-photo-6444367.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['painting', 'interior', 'professional'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Mobile Car Detailing',
      description: 'Premium mobile car detailing service that comes to your location with professional-grade products.',
      category: 'Automotive',
      price: 80,
      priceUnit: 'hour',
      providerId: 'provider-5',
      providerType: 'professional',
      providerName: 'Alex Turner',
      providerImage: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      providerRating: 4.6,
      providerReviews: 92,
      location: 'Bronx, NY',
      duration: '2-3 hours',
      image: 'https://images.pexels.com/photos/6873083/pexels-photo-6873083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['automotive', 'detailing', 'mobile'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'Electrical Work',
      description: 'Licensed electrical services for residential and commercial properties.',
      category: 'Electrical',
      price: 180,
      priceUnit: 'day',
      providerId: 'provider-6',
      providerType: 'labour',
      providerName: 'ElectricPro Services',
      providerImage: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      providerRating: 4.7,
      providerReviews: 68,
      location: 'Staten Island, NY',
      duration: 'Project based',
      image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['electrical', 'licensed', 'professional'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    console.log('Fetching service by ID:', id);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/services`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceId: id,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch service by ID:', response.status);
      // Try to find in fallback data
      const fallbackServices = getFallbackServices();
      return fallbackServices.find(service => service.id === id) || null;
    }

    const data = await response.json();
    
    if (data.service) {
      const service = data.service;
      return {
        id: service.id,
        title: service.title || 'Untitled Service',
        description: service.description || '',
        category: service.category || 'General',
        price: Number(service.price) || 0,
        priceUnit: service.price_unit || 'hour',
        providerId: service.provider_id || '',
        providerType: service.provider_type || 'professional',
        providerName: service.provider_name || 'Unknown Provider',
        providerImage: service.provider_image || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        providerRating: Number(service.provider_rating) || 0,
        providerReviews: Number(service.provider_reviews) || 0,
        location: service.location || 'Location not specified',
        duration: service.duration || 'Duration varies',
        image: service.image || 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        tags: Array.isArray(service.tags) ? service.tags : [],
        isActive: service.is_active !== false,
        createdAt: service.created_at || new Date().toISOString(),
        updatedAt: service.updated_at || new Date().toISOString(),
      };
    }

    // Try to find in fallback data
    const fallbackServices = getFallbackServices();
    return fallbackServices.find(service => service.id === id) || null;
  } catch (error) {
    console.error('Error fetching service by ID from API:', error);
    // Try to find in fallback data
    const fallbackServices = getFallbackServices();
    return fallbackServices.find(service => service.id === id) || null;
  }
}

export async function getServiceCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/services`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        getCategories: true,
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch categories:', response.status);
      return ['Cleaning', 'Handyman', 'Painting', 'Construction', 'Electrical', 'Automotive'];
    }

    const data = await response.json();
    return data.categories && data.categories.length > 0 
      ? data.categories 
      : ['Cleaning', 'Handyman', 'Painting', 'Construction', 'Electrical', 'Automotive'];
  } catch (error) {
    console.error('Error fetching service categories from API:', error);
    return ['Cleaning', 'Handyman', 'Painting', 'Construction', 'Electrical', 'Automotive'];
  }
}