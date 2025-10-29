import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const VALID_PLATFORMS = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
  'video/mp4', 'video/quicktime', 'video/webm'
];

const savePostSchema = z.object({
  postId: z.string().uuid().optional(),
  caption: z.string().max(2000, "Caption must be less than 2000 characters").optional(),
  mediaUrl: z.string().url("Invalid media URL").optional(),
  platforms: z.array(z.enum(['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'] as const))
    .min(0).max(10, "Too many platforms selected"),
  scheduledAt: z.string().datetime().optional().refine((val) => {
    if (!val) return true;
    return new Date(val) > new Date();
  }, "Scheduled time must be in the future")
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    
    // Validate input
    const validationResult = savePostSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: "Invalid input", 
        details: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ")
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { postId, caption, mediaUrl, platforms, scheduledAt } = validationResult.data;

    // Additional validation for media URL if provided
    if (mediaUrl) {
      try {
        const urlPath = new URL(mediaUrl).pathname;
        const bucketPath = '/storage/v1/object/public/post-media/';
        
        if (!mediaUrl.includes(bucketPath)) {
          return new Response(JSON.stringify({ 
            error: "Invalid media URL - must be from post-media bucket" 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } catch {
        return new Response(JSON.stringify({ 
          error: "Invalid media URL format" 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (postId) {
      // Update existing post
      const { data, error } = await supabase
        .from('posts')
        .update({
          caption,
          media_url: mediaUrl,
          platforms,
          scheduled_at: scheduledAt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Create new post
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          caption,
          media_url: mediaUrl,
          platforms,
          scheduled_at: scheduledAt,
          status: scheduledAt ? 'scheduled' : 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in save-post function:', error);
    
    // Return generic error message to avoid information leakage
    if (error instanceof Error && error.message === 'Unauthorized') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: "Failed to save post. Please try again." }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
