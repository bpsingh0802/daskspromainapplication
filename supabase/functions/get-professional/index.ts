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
      const { data: professionalData, error: professionalError } = await supabase
        .from('professional_profiles')
        .select(`
          id,
          business_name,
          profession,
          bio,
          years_of_experience,
          hourly_rate,
          location,
          is_verified,
          avatar,
          rating,
          reviews,
          tags,
          availability,
          created_at,
          updated_at,
          profiles!inner(full_name, email, phone)
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
      
      // Transform the data to include profile information
      const transformedProfessional = {
        id: professional.id,
        business_name: professional.business_name,
        profession: professional.profession,
        bio: professional.bio,
        years_of_experience: professional.years_of_experience,
        hourly_rate: professional.hourly_rate,
        location: professional.location,
        is_verified: professional.is_verified,
        avatar: professional.avatar,
        rating: professional.rating,
        reviews: professional.reviews,
        tags: professional.tags,
        availability: professional.availability,
        created_at: professional.created_at,
        updated_at: professional.updated_at,
        full_name: professional.profiles?.full_name,
        email: professional.profiles?.email,
        phone: professional.profiles?.phone,
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