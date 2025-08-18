import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { CourseEnrollment, Course } from "@shared/schema";

interface EnrolledCourse extends CourseEnrollment {
  course: Course;
}

export function ContinueLearning() {
  const { data: enrolledCourses, isLoading } = useQuery<EnrolledCourse[]>({
    queryKey: ["/api/my-courses"],
  });

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Continue Learning</h2>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                <div className="flex-1 ml-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!enrolledCourses || enrolledCourses.length === 0) {
    return (
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Continue Learning</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No courses enrolled yet</p>
          <Button>Browse Courses</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Continue Learning</h2>
        <a href="/courses" className="text-primary hover:text-blue-800 text-sm font-medium">
          View All
        </a>
      </div>

      <div className="space-y-4">
        {enrolledCourses.slice(0, 2).map((enrollment) => (
          <div
            key={enrollment.id}
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <img
              src={enrollment.course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&h=100"}
              alt={enrollment.course.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 ml-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {enrollment.course.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Course by Instructor
              </p>
              <div className="mt-2">
                <Progress value={enrollment.progress || 0} className="w-full h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {enrollment.progress || 0}% Complete
                </p>
              </div>
            </div>
            <Button className="ml-4">Continue</Button>
          </div>
        ))}
      </div>
    </section>
  );
}
