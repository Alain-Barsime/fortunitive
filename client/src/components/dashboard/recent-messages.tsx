import { useQuery } from "@tanstack/react-query";
import type { Message, User } from "@shared/schema";

interface MessageWithUsers extends Message {
  sender: User;
  recipient: User;
}

// Mock data for recent messages
const recentMessages = [
  {
    id: "1",
    sender: {
      id: "1",
      firstName: "Mike",
      lastName: "Johnson",
      profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100",
    },
    content: "Thanks for applying! I'd like to sche...",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    id: "2",
    sender: {
      id: "2",
      firstName: "Dr.",
      lastName: "Anderson",
      profilePicture: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=100&h=100",
    },
    content: "Great work on your assignment! You...",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
];

export function RecentMessages() {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  return (
    <section className="bg-card glass-card rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Messages</h2>
        <a href="/messages" className="text-primary hover:text-blue-800 text-sm">
          View All
        </a>
      </div>

      <div className="space-y-3">
        {recentMessages.map((message) => (
          <div
            key={message.id}
            className="flex items-center p-3 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
          >
            <img
              src={message.sender.profilePicture || ""}
              alt="Message sender"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground text-sm">
                  {message.sender.firstName} {message.sender.lastName}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatTime(message.createdAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {message.content}
              </p>
            </div>
            <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
