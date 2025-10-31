import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import SocialActions from "@/components/SocialActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Sparkles, Calendar, Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["tiktok"]);
  const [mediaFile, setMediaFile] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "twitter", name: "X (Twitter)", icon: Twitter, color: "bg-black" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-700" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-600" },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 20MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only images and videos are allowed');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('validate-upload', {
        body: formData,
      });

      if (error) throw error;

      setMediaFile(data.url);
      toast.success('Media uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error?.message || 'Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const generateCaption = async () => {
    if (!caption.trim()) {
      toast.error("Please describe your post idea first");
      return;
    }

    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-caption', {
        body: { prompt: caption, tone: 'professional' }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
      } else {
        const fullCaption = `${data.caption}\n\n${data.hashtags.map((h: string) => `#${h}`).join(' ')} ${data.emojis || ''}`;
        setCaption(fullCaption);
        toast.success("AI caption generated!");
      }
    } catch (error) {
      console.error('Error generating caption:', error);
      toast.error("Failed to generate caption");
    } finally {
      setGenerating(false);
    }
  };

  const postNow = async () => {
    if (!user) return;
    
    if (!caption.trim()) {
      toast.error("Please add a caption");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    setSaving(true);

    try {
      // Post to Twitter if selected
      if (selectedPlatforms.includes('twitter')) {
        const { data, error } = await supabase.functions.invoke('post-to-twitter', {
          body: { caption }
        });

        if (error) throw error;

        if (data.success) {
          toast.success("Posted to Twitter successfully!");
        } else {
          throw new Error(data.error || "Failed to post to Twitter");
        }
      }

      // Save to database
      const { data, error } = await supabase.functions.invoke('save-post', {
        body: {
          caption,
          mediaUrl: mediaFile,
          platforms: selectedPlatforms,
          scheduledAt: null,
        }
      });

      if (error) throw error;

      navigate('/');
    } catch (error: any) {
      console.error('Error posting:', error);
      toast.error(error.message || "Failed to post");
    } finally {
      setSaving(false);
    }
  };

  const savePost = async (status: 'draft' | 'scheduled') => {
    if (!user) return;
    
    if (!caption.trim()) {
      toast.error("Please add a caption");
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase.functions.invoke('save-post', {
        body: {
          caption,
          mediaUrl: mediaFile,
          platforms: selectedPlatforms,
          scheduledAt: status === 'scheduled' ? new Date(Date.now() + 3600000).toISOString() : null,
        }
      });

      if (error) throw error;

      toast.success(status === 'draft' ? "Post saved as draft!" : "Post scheduled successfully!");
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Create Post</h1>
          <p className="text-muted-foreground">Upload, generate, and schedule your content</p>
        </div>

        <div className="space-y-6">
          {/* Upload Section */}
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Upload Media</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    {isUploading ? "Uploading..." : mediaFile ? "File uploaded" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-xs text-muted-foreground">Supports images, videos up to 20MB</p>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Caption Generator */}
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Caption Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your post idea or let AI generate a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-32 rounded-xl resize-none"
              />
              
              <div className="flex gap-3">
                <Button 
                  onClick={generateCaption}
                  className="bg-gradient-primary rounded-xl"
                  disabled={generating || !caption.trim()}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {generating ? "Generating..." : "Generate Caption"}
                </Button>
                <Button variant="outline" className="rounded-xl">
                  Add Hashtags
                </Button>
              </div>

              {caption && (
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <p className="text-sm whitespace-pre-wrap">{caption}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Select Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  
                  return (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-md" 
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className={`${platform.color} text-white p-3 rounded-lg w-fit mb-2`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold">{platform.name}</p>
                    </button>
                  );
                })}
              </div>
              
              {selectedPlatforms.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedPlatforms.map(id => (
                    <Badge key={id} variant="secondary" className="rounded-lg">
                      {platforms.find(p => p.id === id)?.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button 
                  onClick={() => savePost('draft')}
                  variant="outline" 
                  className="flex-1 rounded-xl h-12"
                  disabled={saving}
                >
                  Save as Draft
                </Button>
                <Button 
                  onClick={() => savePost('scheduled')}
                  variant="outline"
                  className="flex-1 rounded-xl h-12"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Schedule Post"}
                </Button>
              </div>
              <Button 
                onClick={postNow}
                className="w-full bg-gradient-primary rounded-xl h-12 text-base font-semibold"
                disabled={saving}
              >
                <Twitter className="mr-2 h-4 w-4" />
                {saving ? "Posting..." : "Post Now to Twitter"}
              </Button>
            </CardContent>
          </Card>

          {/* Social Actions */}
          <SocialActions />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CreatePost;
