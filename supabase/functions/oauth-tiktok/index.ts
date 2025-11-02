import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { action, code, state } = await req.json();

    // Action: initiate - Start OAuth flow
    if (action === 'initiate') {
      const TIKTOK_CLIENT_KEY = Deno.env.get('TIKTOK_CLIENT_KEY');
      const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-tiktok`;
      
      const authUrl = `https://www.tiktok.com/v2/auth/authorize?` +
        `client_key=${TIKTOK_CLIENT_KEY}&` +
        `scope=user.info.basic,video.upload,video.publish&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
        `state=${user.id}`;

      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: callback - Handle OAuth callback
    if (action === 'callback' && code) {
      const TIKTOK_CLIENT_KEY = Deno.env.get('TIKTOK_CLIENT_KEY');
      const TIKTOK_CLIENT_SECRET = Deno.env.get('TIKTOK_CLIENT_SECRET');
      const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-tiktok`;

      // Exchange code for access token
      const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: TIKTOK_CLIENT_KEY!,
          client_secret: TIKTOK_CLIENT_SECRET!,
          code,
          grant_type: 'authorization_code',
          redirect_uri: callbackUrl,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok || tokenData.error) {
        throw new Error(tokenData.error_description || 'Failed to get access token');
      }

      // Get user info
      const userResponse = await fetch('https://open.tiktokapis.com/v2/user/info/', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();

      // Save to connected_accounts
      const { error: dbError } = await supabaseClient
        .from('connected_accounts')
        .upsert({
          user_id: state,
          platform: 'tiktok',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          account_name: userData.data?.user?.display_name || 'TikTok User',
          is_active: true,
        }, { 
          onConflict: 'user_id,platform' 
        });

      if (dbError) throw dbError;

      return new Response(
        JSON.stringify({ success: true, account: userData.data?.user?.display_name }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error: any) {
    console.error('OAuth TikTok error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
