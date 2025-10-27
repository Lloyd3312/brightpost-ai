import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Upload, Sparkles, Calendar, Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

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

  const generateCaption = () => {
    toast.success("AI caption generated!");
    setCaption("🌟 Discover the future of social media management! With AI-powered insights and seamless scheduling, your content strategy just got smarter. #SocialMedia #AI #ContentCreation #DigitalMarketing");
  };

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
              <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Drag & drop or click to upload</p>
                <p className="text-xs text-muted-foreground">Supports images, videos up to 20MB</p>
              </div>
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
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Caption
                </Button>
                <Button variant="outline" className="rounded-xl">
                  Add Hashtags
                </Button>
              </div>

              {caption && (
                <div className="p-4 bg-muted rounded-xl">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <p className="text-sm">{caption}</p>
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
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl h-12">
                  Pick Date & Time
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Best Time
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-primary rounded-xl h-12 text-base font-semibold">
                  Schedule Post
                </Button>
                <Button variant="outline" className="rounded-xl">
                  Post Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default CreatePost;
