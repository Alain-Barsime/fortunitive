import { Book, Award, Briefcase, Users } from "lucide-react";
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

  const statsData = [
    {
      title: "Courses Enrolled",
      value: stats?.coursesEnrolled || 0,
      icon: Book,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-primary",
    },
    {
      title: "Certificates Earned",
      value: stats?.certificatesEarned || 0,
      icon: Award,
      bgColor: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-accent",
    },
    {
      title: "Job Applications",
      value: stats?.jobApplications || 0,
      icon: Briefcase,
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      textColor: "text-warning",
    },
    {
      title: "Connections",
      value: stats?.connections || 342,
      icon: Users,
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      textColor: "text-purple-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`${stat.textColor} text-xl h-6 w-6`} />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
