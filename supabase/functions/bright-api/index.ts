import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { type = 'all', query, location } = await req.json();

    let professionals = [];
    let labour = [];

    // Fetch professionals if requested
    if (type === 'professional' || type === 'all') {
      let professionalQuery = supabase
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
          profiles!inner(full_name)
        `);

      if (query) {
        professionalQuery = professionalQuery.or(`business_name.ilike.%${query}%,profession.ilike.%${query}%,tags.cs.{${query}}`);
      }

      if (location) {
        professionalQuery = professionalQuery.ilike('location', `%${location}%`);
      }

      const { data: professionalData, error: professionalError } = await professionalQuery;
      
      if (professionalError) {
        console.error('Professional query error:', professionalError);
      } else {
        professionals = professionalData?.map(item => ({
          id: item.id,
          name: item.profiles?.full_name || item.business_name || '',
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
          type: 'professional'
        })) || [];
      }
    }

    // Fetch labour if requested
    if (type === 'labour' || type === 'all') {
      let labourQuery = supabase
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
          is_verified,
          profiles!inner(full_name)
        `);

      if (query) {
        labourQuery = labourQuery.or(`business_name.ilike.%${query}%,category.ilike.%${query}%,tags.cs.{${query}}`);
      }

      if (location) {
        labourQuery = labourQuery.ilike('location', `%${location}%`);
      }

      const { data: labourData, error: labourError } = await labourQuery;
      
      if (labourError) {
        console.error('Labour query error:', labourError);
      } else {
        labour = labourData?.map(item => ({
          id: item.id,
          name: item.profiles?.full_name || item.business_name || '',
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
          type: 'labour'
        })) || [];
      }
    }

    const allProviders = [...professionals, ...labour];

    return new Response(
      JSON.stringify({ 
        professionals,
        labour,
        all: allProviders,
        total: allProviders.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        professionals: [],
        labour: [],
        all: [],
        total: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});