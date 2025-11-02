import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface ConnectPlatformProps {
  platform: {
    id: string;
    name: string;
  };
  isConnected: boolean;
  onStatusChange: () => void;
}

export const ConnectPlatform = ({ platform, isConnected, onStatusChange }: ConnectPlatformProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please log in first');
        return;
      }

      // Call OAuth edge function to initiate flow
      const functionName = `oauth-${platform.id === 'instagram' ? 'facebook' : platform.id}`;
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { action: 'initiate' },
      });

      if (error) throw error;

      // Open OAuth popup
      const width = 600;
      const height = 700;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      
      const popup = window.open(
        data.authUrl,
        'OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Poll for popup close
      const pollTimer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollTimer);
          onStatusChange();
          toast.success(`${platform.name} connected!`);
        }
      }, 1000);

    } catch (error: any) {
      console.error('Connect error:', error);
      toast.error(error.message || `Failed to connect ${platform.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('connected_accounts')
        .delete()
        .eq('user_id', session.user.id)
        .eq('platform', platform.id);

      if (error) throw error;

      toast.success(`${platform.name} disconnected`);
      onStatusChange();
    } catch (error: any) {
      console.error('Disconnect error:', error);
      toast.error(`Failed to disconnect ${platform.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  return isConnected ? (
    <Button 
      variant="outline" 
      size="sm" 
      className="rounded-lg"
      onClick={handleDisconnect}
      disabled={isLoading}
    >
      {isLoading ? 'Disconnecting...' : 'Disconnect'}
    </Button>
  ) : (
    <Button 
      size="sm" 
      className="rounded-lg bg-gradient-primary"
      onClick={handleConnect}
      disabled={isLoading}
    >
      {isLoading ? 'Connecting...' : 'Connect'}
    </Button>
  );
};
