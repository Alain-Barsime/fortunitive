import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import type { Post, User } from "@shared/schema";

interface PostWithAuthor {
  posts: Post;
  users: User;
}

export function ActivityFeed() {
  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <section className="bg-card rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex items-start space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-4">
                  <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
                  <div className="h-16 bg-muted-foreground/20 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="bg-card rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent activity to show</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>

      <div className="space-y-6">
        {posts.slice(0, 2).map((item) => {
          // Guard against missing data
          if (!item.posts || !item.users) {
            return null;
          }
          
          return (
            <div key={item.posts.id} className="flex items-start space-x-3">
              <img
                src={item.users.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"}
                alt={`${item.users.firstName || 'User'} avatar`}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">
                      {item.users.firstName || ''} {item.users.lastName || ''}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.posts.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-foreground">{item.posts.content}</p>
                  {item.posts.mediaUrl && (
                    <img
                      src={item.posts.mediaUrl}
                      alt="Post media"
                      className="mt-3 rounded-lg max-h-64 w-full object-cover"
                    />
                  )}
                  <div className="flex items-center mt-3 space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-muted-foreground hover:text-primary"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      <span className="text-sm">{item.posts.likesCount || 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-muted-foreground hover:text-primary"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{item.posts.commentsCount || 0}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-muted-foreground hover:text-primary"
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      <span className="text-sm">Share</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        }).filter(Boolean)}
      </div>
    </section>
  );
}
