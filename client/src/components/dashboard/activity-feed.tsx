import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import type { Post, User } from "@shared/schema";

interface PostWithAuthor extends Post {
  author: User;
}

export function ActivityFeed() {
  const { data: posts, isLoading } = useQuery<PostWithAuthor[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Recent Activity</h2>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
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
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No recent activity to show</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Recent Activity</h2>

      <div className="space-y-6">
        {posts.slice(0, 2).map((post) => (
          <div key={post.id} className="flex items-start space-x-3">
            <img
              src={post.author.profilePicture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100"}
              alt="User avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {post.author.firstName} {post.author.lastName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                {post.mediaUrl && (
                  <img
                    src={post.mediaUrl}
                    alt="Post media"
                    className="mt-3 rounded-lg max-h-64 w-full object-cover"
                  />
                )}
                <div className="flex items-center mt-3 space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">{post.likesCount || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">{post.commentsCount || 0}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    <span className="text-sm">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
