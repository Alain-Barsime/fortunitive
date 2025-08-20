import { Button } from "@/components/ui/button";
import { UserPlus, Clock, CheckCircle } from "lucide-react";

// Mock data for network suggestions with different connection states
const networkSuggestions = [
  {
    id: "1",
    name: "Sarah Wilson",
    title: "UX Designer at Google",
    profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100",
    mutualConnections: 12,
    status: "pending"
  },
  {
    id: "2", 
    name: "David Kim",
    title: "Product Manager at Meta",
    profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100",
    mutualConnections: 8,
    status: "pending"
  },
  {
    id: "3",
    name: "Don Durkheim",
    title: "Data Scientist at Netflix", 
    profilePicture: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=100&h=100",
    mutualConnections: 15,
    status: "connect"
  },
];

export function NetworkSuggestions() {
  const getButtonContent = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "Pending",
          icon: Clock,
          className: "glass-button text-yellow-400 border-yellow-400/30 cursor-not-allowed",
          disabled: true
        };
      case "connected":
        return {
          text: "Connected",
          icon: CheckCircle,
          className: "glass-button text-green-400 border-green-400/30 cursor-not-allowed",
          disabled: true
        };
      default:
        return {
          text: "Connect",
          icon: UserPlus,
          className: "glass-button hover:scale-105 transition-all duration-300",
          disabled: false
        };
    }
  };

  return (
    <section className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">People You May Know</h2>
        <a href="/network" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          See All
        </a>
      </div>

      <div className="space-y-4">
        {networkSuggestions.map((person, index) => {
          const buttonConfig = getButtonContent(person.status);
          const ButtonIcon = buttonConfig.icon;
          
          return (
            <div 
              key={person.id} 
              className="flex items-center justify-between p-3 glass hover:glass-card rounded-xl transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={person.profilePicture}
                    alt={person.name}
                    className="w-12 h-12 rounded-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-background"></div>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {person.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {person.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {person.mutualConnections} mutual connections
                  </p>
                </div>
              </div>
              
              <Button 
                size="sm" 
                className={buttonConfig.className}
                disabled={buttonConfig.disabled}
              >
                <ButtonIcon className="h-4 w-4 mr-1" />
                {buttonConfig.text}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}