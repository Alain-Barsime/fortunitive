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
import { Plus, Home, GraduationCap, Briefcase, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Please log in to access the dashboard
          </h1>
          <Button asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 min-h-screen">
      <Navigation />

      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your learning journey and explore new opportunities.
            </p>
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
        <Button className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex justify-around py-2">
          <a href="/" className="flex flex-col items-center py-2 px-3 text-primary">
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </a>
          <a href="/courses" className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400">
            <GraduationCap className="h-6 w-6" />
            <span className="text-xs mt-1">Learn</span>
          </a>
          <a href="/jobs" className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400">
            <Briefcase className="h-6 w-6" />
            <span className="text-xs mt-1">Jobs</span>
          </a>
          <a href="/network" className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400">
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Network</span>
          </a>
          <a href="/profile" className="flex flex-col items-center py-2 px-3 text-gray-600 dark:text-gray-400">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
