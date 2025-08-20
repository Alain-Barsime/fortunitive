import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin } from "lucide-react";
import type { Job } from "@shared/schema";

export function RecommendedJobs() {
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  if (isLoading) {
    return (
      <section className="bg-card glass-card rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recommended Jobs</h2>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <section className="bg-card glass-card rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recommended Jobs</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No job recommendations available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card glass-card rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Recommended Jobs</h2>
        <a href="/jobs" className="text-primary hover:text-blue-800 text-sm font-medium">
          View All
        </a>
      </div>

      <div className="space-y-4">
        {jobs.slice(0, 2).map((job) => (
          <div
            key={job.id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                  <Building className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-sm font-medium text-accent">{job.salary || "Salary not disclosed"}</span>
                    <Badge
                      variant="secondary"
                      className={
                        job.type === "full-time"
                          ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                          : "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                      }
                    >
                      {job.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button>Apply</Button>
            </div>
            {job.skills && job.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
