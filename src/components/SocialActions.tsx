import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SocialActions = () => {
  const [liked, setLiked] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Unliked" : "Liked!");
  };

  const handleConnect = () => {
    setConnected(!connected);
    toast.success(connected ? "Disconnected" : "Connected!");
  };

  const handleComment = () => {
    toast.success("Comment section opened!");
  };

  const handleShare = () => {
    toast.success("Sharing options opened!");
  };

  return (
    <Card className="shadow-md border-none">
      <CardContent className="p-6">
        <h3 className="font-heading font-semibold mb-4">Social Engagement</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleConnect}
            variant={connected ? "default" : "outline"}
            className="rounded-xl h-14 font-semibold"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            {connected ? "Connected" : "Connect"}
          </Button>

          <Button
            onClick={handleLike}
            variant={liked ? "default" : "outline"}
            className="rounded-xl h-14 font-semibold"
          >
            <Heart className={`mr-2 h-5 w-5 ${liked ? "fill-current" : ""}`} />
            {liked ? "Liked" : "Like"}
          </Button>

          <Button
            onClick={handleComment}
            variant="outline"
            className="rounded-xl h-14 font-semibold"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Comment
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="rounded-xl h-14 font-semibold"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialActions;
