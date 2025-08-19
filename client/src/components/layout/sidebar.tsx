import { Link, useLocation } from "wouter";
import { 
  Home, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Newspaper, 
  MessageCircle, 
  Wallet,
  Plus,
  Edit,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "My Learning", href: "/courses", icon: GraduationCap },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Network", href: "/network", icon: Users },
  { name: "Feed", href: "/feed", icon: Newspaper },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "Wallet", href: "/wallet", icon: Wallet },
];

const quickActions = [
  { name: "Create Course", icon: Plus },
  { name: "Post Job", icon: Briefcase },
  { name: "Create Post", icon: Edit },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="hidden lg:block w-64 bg-background border-r border-border min-h-screen">
      <div className="p-6">
        {/* User Profile Quick View */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img
              src={user.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-3">
              <p className="font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Wallet Balance</span>
              <span className="font-semibold text-accent">${user.walletBalance || "0.00"}</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "text-primary bg-secondary"
                    : "text-foreground hover:bg-secondary"
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="ml-3">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.name}
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {action.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
