import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Globe, PlusCircle, TrendingUp, Calendar, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aiIllustration from "@/assets/ai-illustration.png";

const Dashboard = () => {
  const navigate = useNavigate();

  const upcomingPosts = [
    { platform: "Instagram", time: "Today, 3:00 PM", title: "Summer Collection Launch" },
    { platform: "TikTok", time: "Today, 6:00 PM", title: "Behind the Scenes" },
    { platform: "Facebook", time: "Tomorrow, 10:00 AM", title: "Weekly Tips" },
  ];

  const stats = [
    { label: "Total Posts", value: "127", trend: "+12%" },
    { label: "Engagement", value: "94.2%", trend: "+8%" },
    { label: "Followers", value: "12.4K", trend: "+15%" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground px-6 py-8 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                P
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
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
                <Globe className="h-5 w-5" />
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
            {upcomingPosts.map((post, index) => (
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
            ))}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
