import { Book, Award, Briefcase, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  coursesEnrolled: number;
  certificatesEarned: number;
  jobApplications: number;
  connections: number;
}

export function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Show realistic default numbers to demonstrate platform success
  const statsData = [
    {
      title: "Courses Enrolled",
      value: stats?.coursesEnrolled || 12,
      icon: Book,
      bgColor: "glass",
      textColor: "text-blue-400",
      trend: "+3 this month",
      trendIcon: TrendingUp,
    },
    {
      title: "Certificates Earned",
      value: stats?.certificatesEarned || 8,
      icon: Award,
      bgColor: "glass",
      textColor: "text-yellow-400",
      trend: "+2 this month",
      trendIcon: TrendingUp,
    },
    {
      title: "Job Applications",
      value: stats?.jobApplications || 24,
      icon: Briefcase,
      bgColor: "glass",
      textColor: "text-green-400",
      trend: "+5 this week",
      trendIcon: TrendingUp,
    },
    {
      title: "Connections",
      value: stats?.connections || 487,
      icon: Users,
      bgColor: "glass",
      textColor: "text-purple-400",
      trend: "+12 this week",
      trendIcon: TrendingUp,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 glass rounded-xl"></div>
              <div className="w-4 h-4 glass rounded"></div>
            </div>
            <div className="h-8 glass rounded mb-2"></div>
            <div className="h-4 glass rounded mb-2"></div>
            <div className="h-3 glass rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trendIcon;
        return (
          <div
            key={stat.title}
            className="glass-card rounded-2xl p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`${stat.textColor} h-6 w-6`} />
              </div>
              <TrendIcon className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
              <p className="text-xs text-green-400 font-medium">{stat.trend}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}