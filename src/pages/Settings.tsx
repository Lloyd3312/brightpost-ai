import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe, Bell, Link2, Crown, HelpCircle } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoReschedule, setAutoReschedule] = useState(true);

  const connectedAccounts = [
    { name: "Instagram", connected: true },
    { name: "Facebook", connected: true },
    { name: "TikTok", connected: false },
    { name: "YouTube", connected: false },
    { name: "X (Twitter)", connected: true },
    { name: "LinkedIn", connected: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences and accounts</p>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  P
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">POST User</p>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-xl">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <div>
                    <p className="font-semibold">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Language</p>
                    <p className="text-sm text-muted-foreground">English (US)</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Change</Button>
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Connected Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {connectedAccounts.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted"
                >
                  <span className="font-semibold">{account.name}</span>
                  {account.connected ? (
                    <Button variant="outline" size="sm" className="rounded-lg">
                      Disconnect
                    </Button>
                  ) : (
                    <Button size="sm" className="rounded-lg bg-gradient-primary">
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-md border-none">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified about posts</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Auto-Reschedule</p>
                  <p className="text-sm text-muted-foreground">Retry failed uploads</p>
                </div>
                <Switch checked={autoReschedule} onCheckedChange={setAutoReschedule} />
              </div>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className="shadow-md border-none bg-gradient-hero">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-primary p-3 rounded-xl">
                  <Crown className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Remove ads, unlock priority AI, and get multi-user access
                  </p>
                  <Button className="bg-gradient-primary rounded-xl">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="shadow-md border-none">
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-start rounded-xl">
                <HelpCircle className="mr-3 h-5 w-5" />
                Help & Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
