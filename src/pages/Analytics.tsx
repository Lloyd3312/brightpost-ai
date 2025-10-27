import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Analytics = () => {
  const metrics = [
    { label: "Total Followers", value: "12.4K", change: "+15.2%", icon: Users, color: "text-primary" },
    { label: "Engagement Rate", value: "94.2%", change: "+8.1%", icon: Heart, color: "text-accent" },
    { label: "Total Likes", value: "8.9K", change: "+12.4%", icon: Heart, color: "text-secondary" },
    { label: "Comments", value: "1.2K", change: "+6.8%", icon: MessageCircle, color: "text-primary" },
  ];

  const topPosts = [
    { title: "Summer Collection Launch", platform: "Instagram", engagement: "95%", likes: "1.2K" },
    { title: "Behind the Scenes", platform: "TikTok", engagement: "89%", likes: "2.4K" },
    { title: "Product Tutorial", platform: "YouTube", engagement: "92%", likes: "856" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your social media performance</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="shadow-md border-none">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-primary`}>
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      {metric.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart Placeholder */}
        <Card className="shadow-md border-none mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Engagement Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-hero rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 text-primary" />
                <p className="text-muted-foreground">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card className="shadow-md border-none">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPosts.map((post, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold mb-1">{post.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.platform}</span>
                    <span>•</span>
                    <span>{post.likes} likes</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{post.engagement}</p>
                  <p className="text-xs text-muted-foreground">engagement</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl">
            Export PDF
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl">
            Export CSV
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Analytics;
