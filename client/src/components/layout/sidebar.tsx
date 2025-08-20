import { Link, useLocation } from "wouter";
import {
  Home,
  GraduationCap,
  Briefcase,
  MessageCircle,
  Wallet,
  Plus,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

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
  });

  if (!user) return null;

  return (
    <aside className="hidden lg:block w-64 bg-background border-r border-border min-h-screen relative">
      <div className="p-6">
        {/* User Profile Quick View */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img
              src={
                user.profilePicture ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
              }
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-3">
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {user.role}
              </p>
            </div>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span>Wallet Balance</span>
              <span className="font-semibold text-accent">
                ${user.walletBalance || "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-secondary"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="ml-3">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
            Quick Actions
          </h4>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.name}
                  variant="ghost"
                  onClick={() => setActiveModal(action.type)}
                  className="w-full justify-start px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {action.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-[420px] p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
              aria-label="Close"
            >
              ✕
            </button>

            {/* COURSE FORM */}


{activeModal === "course" && (
  <>
    <h2 className="text-xl font-semibold mb-4">Create Course</h2>
    <div className="space-y-3">
      <Input
        placeholder="Course Title"
        value={courseForm.title}
        onChange={(e) =>
          setCourseForm((s) => ({ ...s, title: e.target.value }))
        }
      />
      <Textarea
        placeholder="Description"
        value={courseForm.description}
        onChange={(e) =>
          setCourseForm((s) => ({ ...s, description: e.target.value }))
        }
        rows={4}
      />
      <Input
        placeholder="Category"
        value={courseForm.category}
        onChange={(e) =>
          setCourseForm((s) => ({ ...s, category: e.target.value }))
        }
      />
      <Input
        type="number"
        placeholder="Duration (hours)"
        value={courseForm.duration}
        onChange={(e) =>
          setCourseForm((s) => ({ ...s, duration: e.target.value }))
        }
      />
      <Input
        placeholder="Thumbnail URL (optional)"
        value={courseForm.thumbnail}
        onChange={(e) =>
          setCourseForm((s) => ({ ...s, thumbnail: e.target.value }))
        }
      />

      {/* Video input */}
      <div>
        <label className="block mb-1">Upload Video (MP4 only)</label>
        <input
          type="file"
          accept="video/mp4"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setCourseForm((s) => ({ ...s, videoFile: file }));
            }
          }}
        />
      </div>

      <Button
        className="w-full"
        onClick={async () => {
          try {
            if (!courseForm.videoFile) {
              throw new Error("Please select an MP4 video file");
            }

            const formData = new FormData();
            formData.append("title", courseForm.title);
            formData.append("description", courseForm.description);
            formData.append("category", courseForm.category);
            formData.append("duration", String(courseForm.duration));
            if (courseForm.thumbnail) {
              formData.append("thumbnail", courseForm.thumbnail);
            }
            formData.append("video", courseForm.videoFile);

            const res = await fetch("/api/courses", {
              method: "POST",
              body: formData, // send as FormData
            });

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.message || "Failed to create course");
            }

            setCourseForm({
              title: "",
              description: "",
              category: "",
              duration: "",
              thumbnail: "",
              videoFile: undefined,
            });
            setActiveModal(null);
          } catch (err: any) {
            alert(err.message);
          }
        }}
      >
        Save Course
      </Button>
    </div>
  </>
)}


            {/* JOB FORM */}
           {activeModal === "job" && (
  <>
    <h2 className="text-xl font-semibold mb-4">Post Job</h2>
    <div className="space-y-3">
      <Input
        placeholder="Job Title"
        value={jobForm.title}
        onChange={(e) =>
          setJobForm((s) => ({ ...s, title: e.target.value }))
        }
      />
      <Input
        placeholder="Company"
        value={jobForm.company}
        onChange={(e) =>
          setJobForm((s) => ({ ...s, company: e.target.value }))
        }
      />
      <Input
        placeholder="Location"
        value={jobForm.location}
        onChange={(e) =>
          setJobForm((s) => ({ ...s, location: e.target.value }))
        }
      />
      {/* Dropdown for job type */}
      <select
        className="w-full p-2 border rounded"
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

      <Textarea
        placeholder="Description"
        value={jobForm.description}
        onChange={(e) =>
          setJobForm((s) => ({ ...s, description: e.target.value }))
        }
        rows={4}
      />
      <Button
        className="w-full"
        onClick={async () => {
          try {
            const res = await fetch("/api/jobs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...jobForm, employerId: user.id }),
            });
            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.message || "Failed to post job");
            }
            setJobForm({
              title: "",
              company: "",
              location: "",
              type: "full-time",
              description: "",
            });
            setActiveModal(null);
          } catch (err: any) {
            alert(err.message);
          }
        }}
      >
        Save Job
      </Button>
    </div>
  </>
)}


            {/* POST FORM */}
           {activeModal === "post" && (
  <>
    <h2 className="text-xl font-semibold mb-4">Create Post</h2>
    <div className="space-y-3">
      <Input
        placeholder="Title"
        value={postForm.title}
        onChange={(e) =>
          setPostForm((s) => ({ ...s, title: e.target.value }))
        }
      />
      <Textarea
        placeholder="Content"
        value={postForm.content}
        onChange={(e) =>
          setPostForm((s) => ({ ...s, content: e.target.value }))
        }
        rows={5}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPostForm((s) => ({
              ...s,
              photo: e.target.files ? e.target.files[0] : null,
            }))
          }
        />
      </div>
      <Button
        className="w-full"
        onClick={async () => {
          try {
            const formData = new FormData();
            formData.append("title", postForm.title);
            formData.append("content", postForm.content);
            formData.append("authorId", user.id);
            if (postForm.photo) {
              formData.append("photo", postForm.photo, postForm.photo.name);
            }

            const res = await fetch("/api/posts", {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              const data = await res.json();
              throw new Error(data.message || "Failed to create post");
            }

            setPostForm({ title: "", content: "", photo: null });
            setActiveModal(null);
          } catch (err: any) {
            alert(err.message);
          }
        }}
      >
        Save Post
      </Button>
    </div>
  </>
)}







          </div>
        </div>
      )}
    </aside>
  );
}
