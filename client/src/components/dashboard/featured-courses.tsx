import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import type { Course } from "@shared/schema";

export function FeaturedCourses() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses", { limit: 2 }],
  });

  if (isLoading) {
    return (
      <section className="bg-card glass-card rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Featured Courses</h2>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-600"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-6 w-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 w-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <section className="bg-card glass-card rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Featured Courses</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No featured courses available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card glass-card rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Featured Courses</h2>
        <a href="/courses" className="text-primary hover:text-blue-800 text-sm">
          View All
        </a>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <img
              src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&h=160"}
              alt={course.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                by Instructor
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  ${course.price}
                </span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {course.rating || "4.8"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
