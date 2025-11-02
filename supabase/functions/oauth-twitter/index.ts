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
      const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID');
      const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-twitter`;
      
      const authUrl = `https://twitter.com/i/oauth2/authorize?` +
        `response_type=code&` +
        `client_id=${TWITTER_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(callbackUrl)}&` +
        `scope=tweet.read%20tweet.write%20users.read%20offline.access&` +
        `state=${user.id}&` +
        `code_challenge=challenge&` +
        `code_challenge_method=plain`;

      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: callback - Handle OAuth callback
    if (action === 'callback' && code) {
      const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID');
      const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CLIENT_SECRET');
      const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/oauth-twitter`;

      // Exchange code for access token
      const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: TWITTER_CLIENT_ID!,
          redirect_uri: callbackUrl,
          code_verifier: 'challenge',
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || 'Failed to get access token');
      }

      // Get user info from Twitter
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();

      // Save to connected_accounts
      const { error: dbError } = await supabaseClient
        .from('connected_accounts')
        .upsert({
          user_id: state, // state contains user.id
          platform: 'twitter',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
          account_name: userData.data.username,
          is_active: true,
        }, { 
          onConflict: 'user_id,platform' 
        });

      if (dbError) throw dbError;

      return new Response(
        JSON.stringify({ success: true, account: userData.data.username }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error: any) {
    console.error('OAuth Twitter error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
