import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/layout/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Building, MapPin, Search, DollarSign, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Job } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function Jobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const applyMutation = useMutation({
    mutationFn: async ({ jobId, coverLetter }: { jobId: string; coverLetter: string }) => {
      const response = await apiRequest("POST", `/api/jobs/${jobId}/apply`, { coverLetter });
      return response.json();
    },
    
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Your job application has been submitted successfully.",
      });
      setCoverLetter("");
      setSelectedJobId("");
      queryClient.invalidateQueries({ queryKey: ["/api/my-applications"] });
    },
    onError: (error: any) => {
      toast({
        title: "Application failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || selectedType === "all" || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleApply = (jobId: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to apply for jobs.",
        variant: "destructive",
      });
      return;
    }
    setSelectedJobId(jobId);
  };

  const submitApplication = () => {
    if (selectedJobId && coverLetter.trim()) {
      applyMutation.mutate({ jobId: selectedJobId, coverLetter: coverLetter.trim() });
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Job Opportunities
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find your next career opportunity
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs && filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                          <Building className="text-primary h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100 mb-2">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                            {job.company}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                            {job.description}
                          </p>

                          <div className="flex items-center gap-4 mb-4">
                            {job.salary && (
                              <div className="flex items-center text-sm font-medium text-accent">
                                <DollarSign className="h-4 w-4 mr-1" />
                                {job.salary}
                              </div>
                            )}
                            <Badge
                              variant="secondary"
                              className={
                                job.type === "full-time"
                                  ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                                  : job.type === "contract"
                                  ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                                  : "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400"
                              }
                            >
                              {job.type}
                            </Badge>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              Posted {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {job.skills.slice(0, 5).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="outline"
                                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {job.skills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{job.skills.length - 5} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => handleApply(job.id)}>
                            Apply Now
                          </Button>

                        </DialogTrigger>
                       <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                        <DialogHeader>
                          <DialogTitle>Apply for {job.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Company: {job.company}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Location: {job.location}
                            </p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Cover Letter
                            </label>
                            <Textarea
                              placeholder="Tell the employer why you're the right fit for this position..."
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              className="mt-1"
                              rows={4}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={submitApplication}
                              disabled={!coverLetter.trim() || applyMutation.isPending}
                              className="flex-1"
                            >
                              {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>

                      </Dialog>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                No jobs found matching your criteria
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
