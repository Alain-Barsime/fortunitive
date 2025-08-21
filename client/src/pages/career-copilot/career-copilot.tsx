import { Navigation } from "@/components/layout/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User as UserIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

export default function CareerCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: "Hello! I'm your Career Copilot. How can I assist you today?" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: inputMessage.trim(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        sender: "bot",
        text: `You said: "${newUserMessage.text}". I'm still learning, but I can help with career advice, job search tips, or course recommendations!`,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className="text-foreground font-sans transition-colors duration-300 min-h-screen">
      <Navigation />

      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8 glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-2">
                <Bot className="h-8 w-8 text-primary mr-3" />
                <h1 className="text-4xl font-bold gradient-text">
                  Career Copilot
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Your AI assistant for career guidance and learning paths.
              </p>
            </div>
          </div>

          <Card className="glass-card rounded-2xl h-[calc(100vh-250px)] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Chat with Copilot</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg max-w-[70%] ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-muted-foreground rounded-bl-none"
                        }`}
                      >
                        {message.text}
                      </div>
                      {message.sender === "user" && (
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center ml-3 flex-shrink-0">
                          <UserIcon className="h-4 w-4 text-accent-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="flex p-4 border-t border-border">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 glass-input rounded-xl mr-2"
                />
                <Button type="submit" className="glass-button rounded-xl">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
