import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Globe, PlusCircle, TrendingUp, Calendar, Sparkles, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import aiIllustration from "@/assets/ai-illustration.png";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching posts:', error);
      toast.error("Failed to load posts");
    } else {
      setPosts(data || []);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const upcomingPosts = posts.filter(p => p.status === 'scheduled').map(post => ({
    platform: post.platforms?.[0] || "Instagram",
    time: new Date(post.scheduled_at).toLocaleString(),
    title: post.caption?.substring(0, 30) + "..." || "Untitled Post",
    id: post.id
  }));

  const stats = [
    { label: "Total Posts", value: posts.length.toString(), trend: "+12%" },
    { label: "Scheduled", value: upcomingPosts.length.toString(), trend: "+8%" },
    { label: "Draft", value: posts.filter(p => p.status === 'draft').length.toString(), trend: "+15%" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-primary-foreground/80">Welcome back!</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary-foreground hover:bg-white/20"
                onClick={signOut}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-xs text-primary-foreground/70 mb-1">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-accent-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Quick Actions */}
        <Card className="shadow-md border-none">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate("/create")}
              className="bg-gradient-primary h-24 rounded-xl font-semibold text-base"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              New Post
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/analytics")}
              className="h-24 rounded-xl font-semibold text-base border-2"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="shadow-md border-none bg-gradient-hero">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <img src={aiIllustration} alt="AI" className="h-20 w-20 rounded-xl" />
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  AI Insights
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Best time to post today: 3:00 PM - 6:00 PM. Your audience is most active during these hours!
                </p>
                <Button size="sm" variant="outline" className="rounded-lg">
                  View More Tips
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Posts */}
        <Card className="shadow-md border-none">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No scheduled posts yet</p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate("/create")}
                >
                  Create Your First Post
                </Button>
              </div>
            ) : (
              upcomingPosts.map((post, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.platform} • {post.time}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
