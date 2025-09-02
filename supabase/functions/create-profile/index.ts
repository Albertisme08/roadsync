import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateProfilePayload {
  user: { id: string; email: string };
  profile: {
    name?: string;
    role?: string;
    business_name?: string;
    dot_number?: string;
    mc_number?: string;
    phone?: string;
    description?: string;
    city?: string;
    address?: string;
    equipment_type?: string;
    max_weight?: string;
    verification_status?: 'verified' | 'unverified';
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: CreateProfilePayload = await req.json();
    const { user, profile } = payload;

    if (!user?.id || !user?.email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing user information' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabase = createClient(
      'https://hbyimtzjvwqcsnuwjzhz.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if profile already exists
    const { data: existing, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing profile:', checkError);
      throw checkError;
    }

    if (existing) {
      console.log(`Profile already exists for user_id ${user.id}`);
      return new Response(
        JSON.stringify({ success: true, skipped: true, message: 'Profile already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const role = (profile.role === 'admin' || profile.role === 'carrier' || profile.role === 'shipper')
      ? profile.role
      : 'user';

    const approval_status = role === 'admin' ? 'approved' : 'pending';
    const approval_date = role === 'admin' ? new Date().toISOString() : null;

    const insertPayload: any = {
      user_id: user.id,
      email: user.email,
      name: profile.name ?? null,
      role,
      verification_status: profile.verification_status ?? 'unverified',
      business_name: profile.business_name ?? null,
      dot_number: profile.dot_number ?? null,
      mc_number: profile.mc_number ?? null,
      phone: profile.phone ?? null,
      description: profile.description ?? null,
      city: profile.city ?? null,
      address: profile.address ?? null,
      equipment_type: profile.equipment_type ?? null,
      max_weight: profile.max_weight ?? null,
      approval_status,
      approval_date,
    };

    const { data: created, error: insertError } = await supabase
      .from('profiles')
      .insert(insertPayload)
      .select('*')
      .maybeSingle();

    if (insertError) {
      console.error('Error inserting profile:', insertError);
      throw insertError;
    }

    console.log('Profile created for', user.email, created?.id);

    return new Response(
      JSON.stringify({ success: true, profile_id: created?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('create-profile error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});