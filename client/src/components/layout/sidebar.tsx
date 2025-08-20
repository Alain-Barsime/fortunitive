import { Link, useLocation } from "wouter";
import {
  Home,
  GraduationCap,
  Briefcase,
  MessageCircle,
  Wallet,
  Plus,
  Edit,
  TrendingUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "My Learning", href: "/courses", icon: GraduationCap },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "Wallet", href: "/wallet", icon: Wallet },
];

const quickActions = [
  { name: "Create Course", type: "course", icon: Plus },
  { name: "Post Job", type: "job", icon: Briefcase },
  { name: "Create Post", type: "post", icon: Edit },
] as const;

type ModalType = typeof quickActions[number]["type"];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  // Listen for search events from navigation
  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      setActiveModal(event.detail.type);
    };

    window.addEventListener('openSidebarModal', handleOpenModal as EventListener);
    return () => window.removeEventListener('openSidebarModal', handleOpenModal as EventListener);
  }, []);

  const [courseForm, setCourseForm] = useState<{
    title: string;
    description: string;
    category: string;
    duration: string | number;
    thumbnail: string;
    videoFile?: File;
    videoPreview?: string;
  }>({
    title: "",
    description: "",
    category: "",
    duration: "",
    thumbnail: "",
    videoFile: undefined,
    videoPreview: undefined,
  });

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    description: "",
  });

  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    photo: null as File | null,
  });

  if (!user) return null;

  return (
    <aside className="hidden lg:block w-64 glass-sidebar min-h-screen relative">
      <div className="p-6">
        {/* User Profile Quick View */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="relative">
              <img
                src={
                  user.profilePicture ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                }
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 border-primary/30 hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-background flex items-center justify-center">
                <Star className="h-2 w-2 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {user.role} • Pro Member
              </p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Wallet Balance</span>
              <span className="font-bold text-primary flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                ${user.walletBalance || "2,847.50"}
              </span>
            </div>
            <div className="text-xs text-green-400">+$127 this week</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 mb-8">
          {navigation.map((item, index) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 group ${
                    isActive
                      ? "glass-card text-primary shadow-lg"
                      : "text-foreground hover:glass-card hover:scale-105"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-primary'} transition-colors`} />
                  <span className="ml-3">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8">
          <h4 className="font-semibold text-foreground mb-4 flex items-center">
            <Plus className="h-4 w-4 mr-2 text-primary" />
            Quick Actions
          </h4>
          <div className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.name}
                  variant="ghost"
                  onClick={() => setActiveModal(action.type)}
                  className="w-full justify-start px-4 py-3 text-sm glass-button rounded-xl hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${(index + navigation.length) * 50}ms` }}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {action.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-Screen Glassmorphic Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px)',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-2xl mx-6 animate-in slide-in-from-bottom-4 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glassmorphic Container */}
            <div
              className="relative rounded-3xl shadow-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content Container */}
              <div className="p-8 pt-16 max-h-[80vh] overflow-y-auto"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(0, 0, 0, 0.2) transparent'
                }}
              >

                {/* COURSE FORM */}
                {activeModal === "course" && (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-black mb-2">Create Course</h2>
                      <p className="text-gray-600">Share your knowledge with the world</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Course Title</label>
                        <Input
                          placeholder="Enter course title..."
                          value={courseForm.title}
                          onChange={(e) =>
                            setCourseForm((s) => ({ ...s, title: e.target.value }))
                          }
                          className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Description</label>
                        <Textarea
                          placeholder="Describe what students will learn..."
                          value={courseForm.description}
                          onChange={(e) =>
                            setCourseForm((s) => ({ ...s, description: e.target.value }))
                          }
                          rows={4}
                          className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0 resize-none"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Category</label>
                          <Input
                            placeholder="e.g. Programming"
                            value={courseForm.category}
                            onChange={(e) =>
                              setCourseForm((s) => ({ ...s, category: e.target.value }))
                            }
                            className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Duration (hours)</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={courseForm.duration}
                            onChange={(e) =>
                              setCourseForm((s) => ({ ...s, duration: e.target.value }))
                            }
                            className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Thumbnail URL (optional)</label>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={courseForm.thumbnail}
                          onChange={(e) =>
                            setCourseForm((s) => ({ ...s, thumbnail: e.target.value }))
                          }
                          className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Course Video (MP4)</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="video/mp4"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setCourseForm((s) => ({ ...s, videoFile: file }));
                              }
                            }}
                            className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-black file:text-white file:cursor-pointer hover:file:bg-black/80"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={() => setActiveModal(null)}
                          className="flex-1 py-4 rounded-2xl bg-black/5 hover:bg-black/10 text-black border-2 border-black/10 hover:border-black/20 transition-all duration-200"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1 py-4 rounded-2xl bg-black hover:bg-black/80 text-white border-0 hover:scale-105 transition-all duration-200"
                          onClick={async () => {
                            try {
                              if (!courseForm.videoFile) {
                                alert("Please select an MP4 video file");
                                return;
                              }

                              // Simulate API call
                              console.log("Creating course:", courseForm);
                              
                              setCourseForm({
                                title: "",
                                description: "",
                                category: "",
                                duration: "",
                                thumbnail: "",
                                videoFile: undefined,
                              });
                              setActiveModal(null);
                              alert("Course created successfully!");
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                        >
                          Create Course
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* JOB FORM */}
                {activeModal === "job" && (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-black mb-2">Post Job</h2>
                      <p className="text-gray-600">Find the perfect candidate for your team</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Job Title</label>
                        <Input
                          placeholder="e.g. Senior React Developer"
                          value={jobForm.title}
                          onChange={(e) =>
                            setJobForm((s) => ({ ...s, title: e.target.value }))
                          }
                          className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Company</label>
                          <Input
                            placeholder="Company name"
                            value={jobForm.company}
                            onChange={(e) =>
                              setJobForm((s) => ({ ...s, company: e.target.value }))
                            }
                            className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-black mb-2">Location</label>
                          <Input
                            placeholder="e.g. San Francisco, CA"
                            value={jobForm.location}
                            onChange={(e) =>
                              setJobForm((s) => ({ ...s, location: e.target.value }))
                            }
                            className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Job Type</label>
                        <select
                          className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black focus:border-black/30 focus:ring-0"
                          value={jobForm.type}
                          onChange={(e) =>
                            setJobForm((s) => ({ ...s, type: e.target.value }))
                          }
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Job Description</label>
                        <Textarea
                          placeholder="Describe the role, requirements, and what you're looking for..."
                          value={jobForm.description}
                          onChange={(e) =>
                            setJobForm((s) => ({ ...s, description: e.target.value }))
                          }
                          rows={5}
                          className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0 resize-none"
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={() => setActiveModal(null)}
                          className="flex-1 py-4 rounded-2xl bg-black/5 hover:bg-black/10 text-black border-2 border-black/10 hover:border-black/20 transition-all duration-200"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1 py-4 rounded-2xl bg-black hover:bg-black/80 text-white border-0 hover:scale-105 transition-all duration-200"
                          onClick={async () => {
                            try {
                              // Simulate API call
                              console.log("Creating job:", jobForm);
                              
                              setJobForm({
                                title: "",
                                company: "",
                                location: "",
                                type: "full-time",
                                description: "",
                              });
                              setActiveModal(null);
                              alert("Job posted successfully!");
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                        >
                          Post Job
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* POST FORM */}
                {activeModal === "post" && (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Edit className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-black mb-2">Create Post</h2>
                      <p className="text-gray-600">Share your thoughts with the community</p>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Post Title</label>
                        <Input
                          placeholder="What's on your mind?"
                          value={postForm.title}
                          onChange={(e) =>
                            setPostForm((s) => ({ ...s, title: e.target.value }))
                          }
                          className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Content</label>
                        <Textarea
                          placeholder="Share your thoughts, insights, or experiences..."
                          value={postForm.content}
                          onChange={(e) =>
                            setPostForm((s) => ({ ...s, content: e.target.value }))
                          }
                          rows={6}
                          className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black placeholder:text-gray-500 focus:border-black/30 focus:ring-0 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">Add Image (optional)</label>
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setPostForm((s) => ({
                                ...s,
                                photo: e.target.files ? e.target.files[0] : null,
                              }))
                            }
                            className="w-full p-4 rounded-2xl border-2 border-black/10 bg-white/50 text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-black file:text-white file:cursor-pointer hover:file:bg-black/80"
                          />
                        </div>
                        {postForm.photo && (
                          <p className="text-sm text-gray-600 mt-2">Selected: {postForm.photo.name}</p>
                        )}
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={() => setActiveModal(null)}
                          className="flex-1 py-4 rounded-2xl bg-black/5 hover:bg-black/10 text-black border-2 border-black/10 hover:border-black/20 transition-all duration-200"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1 py-4 rounded-2xl bg-black hover:bg-black/80 text-white border-0 hover:scale-105 transition-all duration-200"
                          onClick={async () => {
                            try {
                              // Simulate API call
                              console.log("Creating post:", postForm);
                              
                              setPostForm({ title: "", content: "", photo: null });
                              setActiveModal(null);
                              alert("Post created successfully!");
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                        >
                          Create Post
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}