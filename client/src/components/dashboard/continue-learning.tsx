import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Clock, Award } from "lucide-react";
import type { CourseEnrollment, Course } from "@shared/schema";

interface EnrolledCourse extends CourseEnrollment {
  course: Course;
}

export function ContinueLearning() {
  const { data: enrolledCourses, isLoading } = useQuery<EnrolledCourse[]>({
    queryKey: ["/api/my-courses"],
  });

  // Mock AI courses to show learning progress
  const mockAICourses = [
    {
      id: "ai-course-1",
      course: {
        id: "ai-1",
        title: "Machine Learning Fundamentals with Python",
        description: "Master the basics of ML algorithms, data preprocessing, and model evaluation",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=400&h=240",
        category: "Artificial Intelligence",
        duration: 480, // 8 hours
        instructor: "Dr. Sarah Chen",
        rating: 4.9,
        totalStudents: 12847
      },
      progress: 75,
      lastAccessed: "2 days ago",
      nextLesson: "Neural Networks Introduction",
      timeRemaining: "2h 15m left"
    },
    {
      id: "ai-course-2", 
      course: {
        id: "ai-2",
        title: "Deep Learning with TensorFlow",
        description: "Build and deploy neural networks for computer vision and NLP tasks",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=240",
        category: "Deep Learning",
        duration: 600, // 10 hours
        instructor: "Prof. Michael Rodriguez",
        rating: 4.8,
        totalStudents: 8934
      },
      progress: 45,
      lastAccessed: "1 week ago",
      nextLesson: "Convolutional Neural Networks",
      timeRemaining: "5h 30m left"
    }
  ];

  const coursesToShow = enrolledCourses && enrolledCourses.length > 0 ? enrolledCourses : mockAICourses;

  if (isLoading) {
    return (
      <section className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Continue Learning</h2>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center p-4 glass rounded-xl">
                <div className="w-20 h-20 glass rounded-xl"></div>
                <div className="flex-1 ml-4">
                  <div className="h-4 glass rounded mb-2"></div>
                  <div className="h-3 glass rounded mb-2 w-3/4"></div>
                  <div className="h-2 glass rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!coursesToShow || coursesToShow.length === 0) {
    return (
      <section className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Continue Learning</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 glass rounded-full flex items-center justify-center mx-auto mb-4 floating-element">
            <Play className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground mb-4">No courses enrolled yet</p>
          <Button className="glass-button rounded-xl">Browse Courses</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Continue Learning</h2>
        <a href="/courses" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          View All
        </a>
      </div>

      <div className="space-y-4">
        {coursesToShow.slice(0, 2).map((enrollment, index) => (
          <div
            key={enrollment.id}
            className="flex items-center p-4 glass hover:glass-card rounded-xl transition-all duration-300 group cursor-pointer"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative">
              <img
                src={enrollment.course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&h=100"}
                alt={enrollment.course.title}
                className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Play className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 ml-4">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {enrollment.course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {enrollment.course.instructor || "Expert Instructor"} • {enrollment.lastAccessed || "Recently accessed"}
              </p>
              
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{enrollment.progress || 0}% Complete</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {enrollment.timeRemaining || "Time remaining"}
                  </span>
                </div>
                <Progress 
                  value={enrollment.progress || 0} 
                  className="w-full h-2 bg-glass"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-primary font-medium">
                  Next: {enrollment.nextLesson || "Continue where you left off"}
                </p>
                {(enrollment.progress || 0) > 80 && (
                  <div className="flex items-center text-xs text-yellow-400">
                    <Award className="h-3 w-3 mr-1" />
                    <span>Almost done!</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button className="ml-4 glass-button rounded-xl hover:scale-105 transition-all duration-300">
              Continue
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}