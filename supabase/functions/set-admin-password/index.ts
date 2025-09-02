import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
  password: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabase = createClient(
      'https://hbyimtzjvwqcsnuwjzhz.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { email, password }: RequestBody = await req.json();

    console.log(`Setting password for admin email: ${email}`);

    // Update user password in auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.updateUserById(
      '8ce9eaba-54c6-4e13-bcbb-afb69768fa64', // The user_id for fwdfwdit@gmail.com
      { password }
    );

    if (userError) {
      console.error('Error updating user password:', userError);
      throw userError;
    }

    console.log('Successfully updated password for admin user');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin password updated successfully',
        user: userData.user?.email 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});