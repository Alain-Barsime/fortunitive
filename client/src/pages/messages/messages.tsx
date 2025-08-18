import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/layout/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import type { Message, User } from "@shared/schema";

interface MessageWithUsers extends Message {
  sender: User;
  recipient: User;
}

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock conversations data since we don't have a proper conversations endpoint
  const mockConversations: Conversation[] = [
    {
      user: {
        id: "1",
        firstName: "Mike",
        lastName: "Johnson",
        profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100",
        email: "mike@example.com",
        username: "mike_j",
        role: "employer" as any,
      },
      lastMessage: {
        id: "1",
        content: "Thanks for applying! I'd like to schedule an interview.",
        senderId: "1",
        recipientId: user?.id || "",
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        isRead: false,
      },
      unreadCount: 1,
    },
    {
      user: {
        id: "2",
        firstName: "Dr. Sarah",
        lastName: "Anderson",
        profilePicture: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=100&h=100",
        email: "sarah@example.com",
        username: "dr_sarah",
        role: "instructor" as any,
      },
      lastMessage: {
        id: "2",
        content: "Great work on your assignment! Your solution was very creative.",
        senderId: "2",
        recipientId: user?.id || "",
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      user: {
        id: "3",
        firstName: "Emily",
        lastName: "Rodriguez",
        profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100",
        email: "emily@example.com",
        username: "emily_r",
        role: "learner" as any,
      },
      lastMessage: {
        id: "3",
        content: "Would love to connect and discuss the React course!",
        senderId: "3",
        recipientId: user?.id || "",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        isRead: true,
      },
      unreadCount: 0,
    },
  ];

  // Mock messages for selected conversation
  const mockMessages: Message[] = selectedConversation ? [
    {
      id: "1",
      senderId: selectedConversation,
      recipientId: user?.id || "",
      content: "Hi there! I saw your profile and I'm impressed with your skills.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "2",
      senderId: user?.id || "",
      recipientId: selectedConversation,
      content: "Thank you! I'd be happy to discuss potential opportunities.",
      createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "3",
      senderId: selectedConversation,
      recipientId: user?.id || "",
      content: mockConversations.find(c => c.user.id === selectedConversation)?.lastMessage.content || "Great! Let's schedule a time to chat.",
      createdAt: mockConversations.find(c => c.user.id === selectedConversation)?.lastMessage.createdAt || new Date().toISOString(),
      isRead: false,
    },
  ] : [];

  const sendMessageMutation = useMutation({
    mutationFn: async ({ recipientId, content }: { recipientId: string; content: string }) => {
      const response = await apiRequest("POST", "/api/messages", {
        recipientId,
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      sendMessageMutation.mutate({
        recipientId: selectedConversation,
        content: messageText.trim(),
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const selectedUser = mockConversations.find(c => c.user.id === selectedConversation)?.user;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Please log in to access messages
          </h1>
          <Button asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="h-[calc(100vh-8rem)] max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Conversations List */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-16rem)]">
                    <div className="space-y-1 p-4">
                      {mockConversations
                        .filter(conversation =>
                          `${conversation.user.firstName} ${conversation.user.lastName}`
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((conversation) => (
                        <div
                          key={conversation.user.id}
                          onClick={() => setSelectedConversation(conversation.user.id)}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation === conversation.user.id
                              ? "bg-primary text-white"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.user.profilePicture || ""} />
                            <AvatarFallback>
                              {conversation.user.firstName[0]}{conversation.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`font-medium truncate ${
                                selectedConversation === conversation.user.id
                                  ? "text-white"
                                  : "text-gray-900 dark:text-gray-100"
                              }`}>
                                {conversation.user.firstName} {conversation.user.lastName}
                              </p>
                              <span className={`text-xs ${
                                selectedConversation === conversation.user.id
                                  ? "text-blue-100"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}>
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className={`text-sm truncate ${
                                selectedConversation === conversation.user.id
                                  ? "text-blue-100"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}>
                                {conversation.lastMessage.content}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="lg:col-span-2">
                {selectedConversation && selectedUser ? (
                  <>
                    {/* Chat Header */}
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedUser.profilePicture || ""} />
                            <AvatarFallback>
                              {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {selectedUser.firstName} {selectedUser.lastName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {selectedUser.role}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="p-0">
                      <ScrollArea className="h-[calc(100vh-20rem)] p-4">
                        <div className="space-y-4">
                          {mockMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.senderId === user.id ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.senderId === user.id
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    message.senderId === user.id
                                      ? "text-blue-100"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}
                                >
                                  {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageText.trim() || sendMessageMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No conversation selected
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Choose a conversation from the list to start messaging
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
