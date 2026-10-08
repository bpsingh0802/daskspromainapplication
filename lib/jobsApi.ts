import { supabase } from './supabase';

export interface Job {
  id: string;
  title: string;
  company: string;
  company_logo: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  education: string;
  salary_min?: number;
  salary_max?: number;
  category: string;
  work_mode: 'remote' | 'hybrid' | 'on-site';
  description?: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  posted_date: string;
  status: 'pending' | 'approved' | 'declined';
  posted_by: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JobFilters {
  location: string;
  jobType: 'all' | 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  experienceLevel: 'all' | 'entry' | 'mid' | 'senior' | 'executive';
  education: 'all' | 'high-school' | 'associate' | 'bachelor' | 'master' | 'phd' | 'certification';
  salaryRange: 'all' | '0-30000' | '30000-50000' | '50000-75000' | '75000-100000' | '100000-150000' | '150000+';
  category: 'all' | 'technology' | 'healthcare' | 'finance' | 'education' | 'marketing' | 'sales' | 'design' | 'engineering' | 'construction' | 'hospitality';
  workMode: 'all' | 'remote' | 'hybrid' | 'on-site';
  postedWithin: 'all' | '24h' | '3d' | '7d' | '30d';
}

export async function searchJobs(query?: string, filters?: JobFilters): Promise<Job[]> {
  try {
    let queryBuilder = supabase
      .from('jobs')
      .select(`
        id,
        title,
        company_name,
        location,
        job_type,
        salary_range,
        requirements,
        posted_by,
        status,
        created_at,
        updated_at,
        approved_by,
        approved_at,
        description
      `)
      .eq('status', 'approved'); // Only show approved jobs

    // Apply search query
    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,company_name.ilike.%${query}%,requirements.ilike.%${query}%`);
    }

    // Apply filters
    if (filters) {
      if (filters.location && filters.location.trim()) {
        queryBuilder = queryBuilder.ilike('location', `%${filters.location}%`);
      }

      if (filters.jobType !== 'all') {
        queryBuilder = queryBuilder.eq('job_type', filters.jobType);
      }

      if (filters.postedWithin !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (filters.postedWithin) {
          case '24h':
            cutoffDate.setHours(now.getHours() - 24);
            break;
          case '3d':
            cutoffDate.setDate(now.getDate() - 3);
            break;
          case '7d':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case '30d':
            cutoffDate.setDate(now.getDate() - 30);
            break;
        }
        
        queryBuilder = queryBuilder.gte('created_at', cutoffDate.toISOString());
      }
    }

    // Order by created date (newest first)
    queryBuilder = queryBuilder.order('created_at', { ascending: false });

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }

    // Transform the data to match the expected Job interface
    const transformedJobs: Job[] = (data || []).map(item => ({
      id: item.id,
      title: item.title,
      company: item.company_name || '',
      company_logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      location: item.location,
      job_type: (item.job_type || 'full-time') as Job['job_type'], // Ensure it's never undefined
      experience_level: 'mid' as Job['experience_level'], // Default since not in schema
      education: 'bachelor', // Default since not in schema
      salary_min: undefined,
      salary_max: undefined,
      category: 'general', // Default since not in schema
      work_mode: 'on-site' as Job['work_mode'], // Default since not in schema
      description: item.description || '',
      requirements: Array.isArray(item.requirements) ? item.requirements : [],
      benefits: [], // Default since not in schema
      skills: [], // Default since not in schema
      posted_date: item.created_at,
      status: item.status as Job['status'],
      posted_by: item.posted_by,
      approved_by: item.approved_by,
      approved_at: item.approved_at,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return transformedJobs;
  } catch (error) {
    console.error('Error in searchJobs:', error);
    return [];
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        company_name,
        location,
        job_type,
        salary_range,
        requirements,
        posted_by,
        status,
        created_at,
        updated_at,
        approved_by,
        approved_at,
        description
      `)
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error) {
      console.error('Error fetching job:', error);
      throw error;
    }

    if (!data) return null;

    // Transform the data to match the expected Job interface
    const transformedJob: Job = {
      id: data.id,
      title: data.title,
      company: data.company_name || '',
      company_logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      location: data.location,
      job_type: (data.job_type || 'full-time') as Job['job_type'], // Ensure it's never undefined
      experience_level: 'mid' as Job['experience_level'],
      education: 'bachelor',
      salary_min: undefined,
      salary_max: undefined,
      category: 'general',
      work_mode: 'on-site' as Job['work_mode'],
      description: data.description || '',
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      benefits: [],
      skills: [],
      posted_date: data.created_at,
      status: data.status as Job['status'],
      posted_by: data.posted_by,
      approved_by: data.approved_by,
      approved_at: data.approved_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return transformedJob;
  } catch (error) {
    console.error('Error in getJobById:', error);
    return null;
  }
}

export async function getJobCategories(): Promise<string[]> {
  try {
    // Since category is not in the jobs table schema, return default categories
    return [
      'technology',
      'healthcare', 
      'finance',
      'education',
      'marketing',
      'sales',
      'design',
      'engineering',
      'construction',
      'hospitality'
    ];
  } catch (error) {
    console.error('Error in getJobCategories:', error);
    return [];
  }
}