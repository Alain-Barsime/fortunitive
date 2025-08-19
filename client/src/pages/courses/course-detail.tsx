import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/layout/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Course } from "@shared/schema";

export default function CourseDetail() {
  const params = useParams();
  const courseId = params.id as string;
  const { toast } = useToast();

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: ["/api/courses", courseId],
    enabled: !!courseId,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/courses/${courseId}/enroll`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Enrollment successful!",
        description: "You have successfully enrolled in the course.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-courses"] });
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Course not found
              </h1>
              <Button asChild>
                <a href="/courses">Back to Courses</a>
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Course Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  {course.rating || "4.8"}
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {course.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {course.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {Math.floor((course.duration || 0) / 60)}h {(course.duration || 0) % 60}m
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {course.totalStudents || 0} students enrolled
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Content */}
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Course Preview</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Get a taste of what you'll learn in this comprehensive course.
                    </p>
                  </CardContent>
                </Card>

                {/* What You'll Learn */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Master the fundamentals and advanced concepts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Build real-world projects from scratch</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Get hands-on experience with industry tools</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Prepare for professional certification</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Course Content */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Course Content</h3>
                    <div className="space-y-3">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">1. Introduction</h4>
                          <span className="text-sm text-gray-500">3 lessons • 45 min</span>
                        </div>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">2. Getting Started</h4>
                          <span className="text-sm text-gray-500">5 lessons • 1h 20min</span>
                        </div>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">3. Advanced Topics</h4>
                          <span className="text-sm text-gray-500">8 lessons • 2h 15min</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enrollment Card */}
              <div>
                <Card className="sticky top-6">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <p className="text-3xl font-bold text-primary mb-2">
                        ${course.price}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        One-time payment • Lifetime access
                      </p>
                    </div>

                    <Button
                      className="w-full mb-4"
                      size="lg"
                      onClick={() => enrollMutation.mutate()}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                    </Button>

                    <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                      30-day money-back guarantee
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">This course includes:</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <PlayCircle className="h-4 w-4 mr-2 text-gray-400" />
                          {Math.floor((course.duration || 0) / 60)} hours of video content
                        </li>
                        <li className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          Community access
                        </li>
                        <li className="flex items-center">
                          <Star className="h-4 w-4 mr-2 text-gray-400" />
                          Certificate of completion
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
