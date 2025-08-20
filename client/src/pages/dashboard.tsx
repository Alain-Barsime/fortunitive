import { Navigation } from "@/components/layout/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ContinueLearning } from "@/components/dashboard/continue-learning";
import { RecommendedJobs } from "@/components/dashboard/recommended-jobs";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { FeaturedCourses } from "@/components/dashboard/featured-courses";
import { NetworkSuggestions } from "@/components/dashboard/network-suggestions";
import { RecentMessages } from "@/components/dashboard/recent-messages";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Home, GraduationCap, Briefcase, Users, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card rounded-2xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-6 floating-element">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4 gradient-text">
            Please log in to access the dashboard
          </h1>
          <Button asChild className="glass-button rounded-xl">
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-foreground font-sans transition-colors duration-300 min-h-screen">
      <Navigation />

      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8 glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-blue-500/20 rounded-full translate-y-12 -translate-x-12"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-2">
                <h1 className="text-4xl font-bold gradient-text">
                  Welcome back, {user.firstName}!
                </h1>
                <Sparkles className="h-8 w-8 text-yellow-400 ml-3 floating-element" />
              </div>
              <p className="text-muted-foreground text-lg">
                Continue your learning journey and explore new opportunities. You're making great progress! 🚀
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <ContinueLearning />
              <RecommendedJobs />
              <ActivityFeed />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <FeaturedCourses />
              <NetworkSuggestions />
              <RecentMessages />
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button className="w-16 h-16 glass-button rounded-full shadow-2xl hover:scale-110 transition-all duration-300 floating-element group">
          <Plus className="h-7 w-7 text-white group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-nav z-50">
        <div className="flex justify-around py-3">
          <a href="/" className="flex flex-col items-center py-2 px-3 text-primary">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </a>
          <a href="/courses" className="flex flex-col items-center py-2 px-3 text-muted-foreground hover:text-primary transition-colors">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Learn</span>
          </a>
          <a href="/jobs" className="flex flex-col items-center py-2 px-3 text-muted-foreground hover:text-primary transition-colors">
            <Briefcase className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Jobs</span>
          </a>
          <a href="/network" className="flex flex-col items-center py-2 px-3 text-muted-foreground hover:text-primary transition-colors">
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Network</span>
          </a>
          <a href="/profile" className="flex flex-col items-center py-2 px-3 text-muted-foreground hover:text-primary transition-colors">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1 font-medium">Profile</span>
          </a>
        </div>
      </nav>
    </div>
  );
}