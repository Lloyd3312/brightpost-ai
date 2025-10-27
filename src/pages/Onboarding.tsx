import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Calendar, BarChart, Zap } from "lucide-react";
import heroGradient from "@/assets/hero-gradient.jpg";

const Onboarding = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Captions",
      description: "Generate engaging captions and hashtags instantly",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Post at the perfect time across all platforms",
    },
    {
      icon: BarChart,
      title: "Unified Analytics",
      description: "Track performance from one beautiful dashboard",
    },
    {
      icon: Zap,
      title: "Auto-Reschedule",
      description: "Never miss a post with intelligent retry logic",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-6 py-12 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-8 rounded-3xl overflow-hidden shadow-lg">
            <img 
              src={heroGradient} 
              alt="POST App Hero" 
              className="w-full h-64 object-cover"
            />
          </div>
          
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Welcome to POST
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your AI-powered social media command center. Schedule, create, and analyze—all in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-2xl shadow-md hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-gradient-primary p-3 rounded-xl w-fit mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="w-full bg-gradient-primary hover:opacity-90 text-lg h-14 rounded-xl font-semibold shadow-lg"
          >
            Get Started
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/")}
              className="text-primary font-semibold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
