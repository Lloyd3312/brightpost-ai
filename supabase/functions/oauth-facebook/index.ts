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
      const FB_APP_ID = Deno.env.get('FACEBOOK_APP_ID');
      const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-facebook`;
      
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${FB_APP_ID}&` +
        `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
        `state=${user.id}&` +
        `scope=instagram_basic,instagram_content_publish,pages_read_engagement,pages_manage_posts`;

      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: callback - Handle OAuth callback
    if (action === 'callback' && code) {
      const FB_APP_ID = Deno.env.get('FACEBOOK_APP_ID');
      const FB_APP_SECRET = Deno.env.get('FACEBOOK_APP_SECRET');
      const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-facebook`;

      // Exchange code for access token
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `client_id=${FB_APP_ID}&` +
        `client_secret=${FB_APP_SECRET}&` +
        `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
        `code=${code}`
      );

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error?.message || 'Failed to get access token');
      }

      // Get long-lived token
      const longLivedResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `grant_type=fb_exchange_token&` +
        `client_id=${FB_APP_ID}&` +
        `client_secret=${FB_APP_SECRET}&` +
        `fb_exchange_token=${tokenData.access_token}`
      );

      const longLivedData = await longLivedResponse.json();

      // Get user's Facebook pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedData.access_token}`
      );

      const pagesData = await pagesResponse.json();
      const page = pagesData.data?.[0]; // Use first page

      if (!page) {
        throw new Error('No Facebook page found. Please create a Facebook page first.');
      }

      // Get Instagram business account
      const igResponse = await fetch(
        `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
      );

      const igData = await igResponse.json();

      // Save to connected_accounts
      const { error: dbError } = await supabaseClient
        .from('connected_accounts')
        .upsert({
          user_id: state,
          platform: 'instagram',
          access_token: page.access_token,
          refresh_token: null,
          token_expires_at: null, // Facebook page tokens don't expire
          account_name: page.name,
          is_active: true,
        }, { 
          onConflict: 'user_id,platform' 
        });

      if (dbError) throw dbError;

      return new Response(
        JSON.stringify({ success: true, account: page.name }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error: any) {
    console.error('OAuth Facebook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
