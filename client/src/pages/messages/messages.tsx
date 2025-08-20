import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/layout/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, MoreVertical, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { messagesData, addMessage, markAsRead, getConversationsList, getMessages } from "@/data/messages.js";

function formatTime(date: Date): string {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return "now";
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render when data changes
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get data from our JSON file
  const conversations = getConversationsList();
  const messages = selectedConversation ? getMessages(selectedConversation) : [];

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      addMessage(selectedConversation, "current_user", messageText.trim());
      setMessageText("");
      setRefreshKey(prev => prev + 1); // Force re-render

      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    markAsRead(conversationId);
    setRefreshKey(prev => prev + 1); // Force re-render to update unread counts
  };

  const selectedUser = conversations?.find(c => c.otherUserId === selectedConversation);

  const filteredConversations = conversations?.filter(conversation =>
    `${conversation.firstName} ${conversation.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, refreshKey]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
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
    <div className="bg-background min-h-screen">
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                    {filteredConversations.length > 0 ? (
                      <div className="space-y-1 p-4">
                        {filteredConversations.map((conversation) => (
                          <div
                            key={conversation.otherUserId}
                            onClick={() => handleSelectConversation(conversation.otherUserId)}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedConversation === conversation.otherUserId
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-secondary"
                              }`}
                          >
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={conversation.profilePicture || ""} />
                              <AvatarFallback>
                                {conversation.firstName[0]}{conversation.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`font-medium truncate ${selectedConversation === conversation.otherUserId
                                  ? "text-primary-foreground"
                                  : "text-foreground"
                                  }`}>
                                  {conversation.firstName} {conversation.lastName}
                                </p>
                                <span className={`text-xs ${selectedConversation === conversation.otherUserId
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                                  }`}>
                                  {formatTime(new Date(conversation.createdAt))}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className={`text-sm truncate ${selectedConversation === conversation.otherUserId
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                                  }`}>
                                  {conversation.content}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <span className="ml-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className={`text-xs capitalize ${selectedConversation === conversation.otherUserId
                                ? "text-primary-foreground/50"
                                : "text-muted-foreground"
                                }`}>
                                {conversation.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No conversations found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search terms
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="lg:col-span-2">
                {selectedConversation && selectedUser ? (
                  <>
                    {/* Chat Header */}
                    <CardHeader className="border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedUser.profilePicture || ""} />
                            <AvatarFallback>
                              {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <p className="font-medium text-foreground">
                              {selectedUser.firstName} {selectedUser.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
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
                      <ScrollArea className="h-[calc(100vh-20rem)] p-6">
                        {messages && messages.length > 0 ? (
                          <div className="space-y-6">
                            {messages.map((message, index) => {
                              const isCurrentUser = message.senderId === "current_user";
                              const prevMessage = messages[index - 1];
                              const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

                              return (
                                <div
                                  key={message.id}
                                  className={`flex items-end gap-3 animate-in slide-in-from-bottom-2 duration-300 ${isCurrentUser ? "justify-end" : "justify-start"
                                    }`}
                                >
                                  {/* Avatar for other user (left side) */}
                                  {!isCurrentUser && (
                                    <div className={`flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={selectedUser?.profilePicture || ""} />
                                        <AvatarFallback className="text-xs">
                                          {selectedUser?.firstName[0]}{selectedUser?.lastName[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>
                                  )}

                                  {/* Message Bubble */}
                                  <div className={`group relative max-w-xs lg:max-w-md ${isCurrentUser ? 'mr-12' : 'ml-12'}`}>
                                    <div
                                      className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${isCurrentUser
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm ml-auto"
                                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-sm mr-auto"
                                        }`}
                                    >
                                      {/* Message tail */}
                                      <div
                                        className={`absolute bottom-0 w-3 h-3 ${isCurrentUser
                                          ? "right-0 translate-x-1 bg-gradient-to-br from-blue-500 to-blue-600"
                                          : "left-0 -translate-x-1 bg-white dark:bg-gray-800 border-l border-b border-gray-200 dark:border-gray-700"
                                          } transform rotate-45`}
                                      />

                                      {/* Message content */}
                                      <div className="relative z-10">
                                        <p className="text-sm leading-relaxed break-words">
                                          {message.content}
                                        </p>

                                        {/* Timestamp */}
                                        <div className={`flex items-center gap-1 mt-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                          <span
                                            className={`text-xs ${isCurrentUser
                                              ? "text-blue-100"
                                              : "text-gray-500 dark:text-gray-400"
                                              }`}
                                          >
                                            {new Date(message.createdAt).toLocaleTimeString([], {
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </span>

                                          {/* Read status for sent messages */}
                                          {isCurrentUser && (
                                            <div className="flex">
                                              <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Hover timestamp */}
                                    <div className={`absolute top-0 ${isCurrentUser ? 'right-full mr-3' : 'left-full ml-3'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
                                      <div className="bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                        {new Date(message.createdAt).toLocaleDateString([], {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div ref={messagesEndRef} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="h-10 w-10 text-blue-500" />
                              </div>
                              <p className="text-muted-foreground font-medium">No messages yet</p>
                              <p className="text-sm text-muted-foreground mt-1">Start the conversation!</p>
                            </div>
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>

                    {/* Message Input */}
                    <div className="border-t border-border p-4 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/50">
                      <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="glass-input rounded-full py-3 px-4 pr-12 resize-none min-h-[44px] border-0 focus:ring-2 focus:ring-blue-500/20"
                          />
                          {/* Emoji button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <span className="text-lg">😊</span>
                          </Button>
                        </div>

                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                          className={`h-11 w-11 rounded-full p-0 transition-all duration-300 ${messageText.trim()
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl scale-100 hover:scale-105 border-0"
                            : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50"
                            }`}
                        >
                          <Send className={`h-5 w-5 transition-colors duration-300 ${messageText.trim() ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                            }`} />
                        </Button>
                      </div>

                      {/* Typing indicator placeholder */}
                      <div className="mt-2 h-4 flex items-center">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 opacity-0">
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="ml-2">Someone is typing...</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        No conversation selected
                      </h3>
                      <p className="text-muted-foreground">
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