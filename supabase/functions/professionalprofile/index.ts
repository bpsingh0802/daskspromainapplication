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

    const body = await req.json();
    const { professionalId, getAllProfessionals } = body;

    // Handle getting all professionals
    if (getAllProfessionals) {
      const { data: professionalsData, error: professionalsError } = await supabase
        .from('professional_profiles')
        .select('id, business_name, profession')
        .limit(50);

      if (professionalsError) {
        console.error('Professionals error:', professionalsError);
        return new Response(
          JSON.stringify({ error: professionalsError.message, professionals: [] }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ professionals: professionalsData || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle getting single professional by ID
    if (professionalId) {
      // First get professional data
      const { data: professionalData, error: professionalError } = await supabase
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
        .eq('id', professionalId);

      if (professionalError) {
        console.error('Professional error:', professionalError);
        return new Response(
          JSON.stringify({ error: professionalError.message, professional: null }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!professionalData || professionalData.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Professional not found', professional: null }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const professional = professionalData[0];
      
      // Get profile data separately
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', professionalId)
        .single();
      
      // Transform the data
      const transformedProfessional = {
        id: professional.id,
        business_name: professional.business_name,
        profession: professional.profession,
        bio: professional.bio,
        years_of_experience: professional.years_of_experience,
        service_radius: professional.service_radius,
        hourly_rate: professional.hourly_rate,
        is_verified: professional.is_verified,
        is_first_login: professional.is_first_login,
        location: professional.location,
        created_at: professional.created_at,
        updated_at: professional.updated_at,
        name: professional.name,
        rating: professional.rating,
        reviews: professional.reviews,
        tags: professional.tags,
        availability: professional.availability,
        avatar: professional.avatar,
        full_name: profileData?.full_name,
        email: profileData?.email,
        phone: profileData?.phone,
        contact_number: professional.contact_number,
        portfolio_images: professional.portfolio_images || [],
      };

      return new Response(
        JSON.stringify({ professional: transformedProfessional }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default response for invalid requests
    return new Response(
      JSON.stringify({ error: 'Invalid request. Please provide professionalId or set getAllProfessionals to true.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        professional: null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});