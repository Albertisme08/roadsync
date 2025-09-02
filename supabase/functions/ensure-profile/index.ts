import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.1";

interface EnsureProfileRequest {
  email: string;
  name?: string;
  role?: string; // 'shipper' | 'carrier' | 'admin' | 'user'
  business_name?: string;
  dot_number?: string;
  mc_number?: string;
  phone?: string;
  description?: string;
  city?: string;
  address?: string;
  equipment_type?: string;
  max_weight?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EnsureProfileRequest = await req.json();
    const {
      email,
      name,
      role = 'user',
      business_name,
      dot_number,
      mc_number,
      phone,
      description,
      city,
      address,
      equipment_type,
      max_weight,
    } = body;

    console.log('ensure-profile invoked for:', { email, role, hasName: !!name });

    if (!email) {
      return new Response(JSON.stringify({ error: 'email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Find auth user by email
    const { data: users, error: userErr } = await supabaseAdmin.auth.admin.listUsers({ email });
    if (userErr) throw userErr;
    const user = users.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      return new Response(JSON.stringify({ error: 'auth user not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Check for existing profile by user_id
    const { data: existingProfiles, error: profileErr } = await supabaseAdmin
      .from('profiles')
      .select('id, approval_status')
      .eq('user_id', user.id)
      .limit(1);

    if (profileErr) throw profileErr;

    if (existingProfiles && existingProfiles.length > 0) {
      // Update existing profile to pending
      const { error: updateErr } = await supabaseAdmin
        .from('profiles')
        .update({
          approval_status: role === 'admin' ? 'approved' : 'pending',
          rejection_date: null,
          approval_date: role === 'admin' ? new Date().toISOString() : null,
          name: name ?? user.user_metadata?.name ?? user.user_metadata?.full_name ?? null,
          role,
          business_name: business_name ?? user.user_metadata?.business_name ?? null,
          dot_number: dot_number ?? user.user_metadata?.dot_number ?? null,
          mc_number: mc_number ?? user.user_metadata?.mc_number ?? null,
          phone: phone ?? user.user_metadata?.phone ?? null,
          description: description ?? user.user_metadata?.description ?? null,
          city: city ?? user.user_metadata?.city ?? null,
          address: address ?? user.user_metadata?.address ?? null,
          equipment_type: equipment_type ?? user.user_metadata?.equipment_type ?? null,
          max_weight: max_weight ?? user.user_metadata?.max_weight ?? null,
          verification_status: user.email_confirmed_at ? 'verified' : 'unverified',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateErr) throw updateErr;
      console.log('ensure-profile updated existing profile for:', email);
    
    } else {
      // Insert new profile
      const { error: insertErr } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: user.id,
          email: user.email,
          name: name ?? user.user_metadata?.name ?? user.user_metadata?.full_name ?? null,
          role,
          verification_status: user.email_confirmed_at ? 'verified' : 'unverified',
          business_name: business_name ?? user.user_metadata?.business_name ?? null,
          dot_number: dot_number ?? user.user_metadata?.dot_number ?? null,
          mc_number: mc_number ?? user.user_metadata?.mc_number ?? null,
          phone: phone ?? user.user_metadata?.phone ?? null,
          description: description ?? user.user_metadata?.description ?? null,
          city: city ?? user.user_metadata?.city ?? null,
          address: address ?? user.user_metadata?.address ?? null,
          equipment_type: equipment_type ?? user.user_metadata?.equipment_type ?? null,
          max_weight: max_weight ?? user.user_metadata?.max_weight ?? null,
          approval_status: role === 'admin' ? 'approved' : 'pending',
        });

      if (insertErr) throw insertErr;
      console.log('ensure-profile inserted new profile for:', email);
    
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('ensure-profile error:', error);
    return new Response(JSON.stringify({ error: error.message || String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});