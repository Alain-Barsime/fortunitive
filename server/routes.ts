import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import session from "express-session";
import multer from "multer";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertCourseSchema,
  insertJobSchema,
  insertPostSchema,
  insertMessageSchema
} from "@shared/schema";

// ---------------- MULTER SETUP ----------------

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // your uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + ".mp4"); // force .mp4 extension
  }
});

// ---------------- SESSION EXTENSIONS ----------------
declare module "express-session" {
  interface SessionData {
    userId?: string;
    userRole?: string;
  }
}

// ---------------- EXTENDED REQUEST TYPES ----------------
interface AuthenticatedRequest extends Request {
  session: session.Session & Partial<session.SessionData>;
  file?: Express.Multer.File; // For multer uploads
}

// ---------------- AUTH MIDDLEWARE ----------------
const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

// ---------------- REGISTER ROUTES ----------------
export async function registerRoutes(app: Express): Promise<Server> {
  // ---------------- SESSION ----------------
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "skillconnect_secret_key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24h
    })
  );

  // ---------------- AUTH ROUTES ----------------
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await storage.createUser({ ...userData, password: hashedPassword });

      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

      (req.session as any).userId = user.id;
      (req.session as any).userRole = user.role;

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profilePicture: user.profilePicture,
          walletBalance: user.walletBalance,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: AuthenticatedRequest, res: Response) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not authenticated" });

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profilePicture: user.profilePicture,
          walletBalance: user.walletBalance,
          bio: user.bio,
          skills: user.skills,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  // ---------------- COURSES ----------------
  app.get("/api/courses", async (req: Request, res: Response) => {
    try {
      const { limit, category } = req.query;
      const courses = await storage.getCourses(
        limit ? parseInt(limit as string) : undefined,
        category as string
      );
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses", error });
    }
  });

  app.post(
    "/api/courses",
    requireAuth,
    upload.single("video"),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        if (!req.file) return res.status(400).json({ message: "No video uploaded" });

        const courseData = insertCourseSchema.parse({
          ...req.body,
          duration: Number(req.body.duration),
          instructorId: String(req.session.userId),
          course_link: `/uploads/${req.file.filename}`,
        });

        const course = await storage.createCourse(courseData);
        res.json(course);
      } catch (error) {
        res.status(400).json({ message: "Failed to create course", error });
      }
    }
  );

  app.get("/api/courses/:id", async (req: Request, res: Response) => {
    try {
      const course = await storage.getCourseById(req.params.id);
      if (!course) return res.status(404).json({ message: "Course not found" });
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course", error });
    }
  });

  app.post("/api/courses/:id/enroll", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const enrollment = await storage.enrollInCourse(req.params.id, req.session.userId!);
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Failed to enroll in course", error });
    }
  });

  app.get("/api/my-courses", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const courses = await storage.getEnrolledCourses(req.session.userId!);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrolled courses", error });
    }
  });

  // ---------------- JOBS ----------------
  app.get("/api/jobs", async (req: Request, res: Response) => {
    try {
      const { limit, type } = req.query;
      const jobs = await storage.getJobs(limit ? parseInt(limit as string) : undefined, type as string);
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs", error });
    }
  });

  app.post("/api/jobs", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const jobData = insertJobSchema.parse({ ...req.body, employerId: req.session.userId });
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Failed to create job", error });
    }
  });

  app.post("/api/jobs/:id/apply", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { coverLetter } = req.body;
      const application = await storage.applyToJob(req.params.id, req.session.userId!, coverLetter);
      res.json(application);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Failed to apply for job", error });
    }
  });

  app.get("/api/my-applications", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const applications = await storage.getUserJobApplications(req.session.userId!);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications", error });
    }
  });

  // ---------------- POSTS ----------------
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const { limit } = req.query;
      const posts = await storage.getPosts(limit ? parseInt(limit as string) : undefined);
      res.json(posts);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Failed to fetch posts", error });
    }
  });

  app.post(
  "/api/posts",
  upload.single("photo"),
  async (req: MulterRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No photo uploaded" });
      }

      // Path where multer saved the file
      const photoPath = req.file.path;

      // Save to DB with other post data
      const newPost = await storage.createPost({
        ...req.body, // extra post fields from form
        photo: photoPath,
      });

      res.json({ message: "Post created successfully", post: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create post", error });
    }
  }
);

  app.post("/api/posts/:id/like", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      await storage.likePost(req.params.id, req.session.userId!);
      res.json({ message: "Post liked successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to like post", error });
    }
  });

  // ---------------- MESSAGES ----------------
  app.get("/api/messages/:userId", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const messages = await storage.getMessages(req.session.userId!, req.params.userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages", error });
    }
  });

  app.post("/api/messages", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse({ ...req.body, senderId: req.session.userId });
      const message = await storage.sendMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to send message", error });
    }
  });

  app.get("/api/conversations", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const conversations = await storage.getRecentConversations(req.session.userId!);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations", error });
    }
  });

  // ---------------- SEARCH ----------------
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") return res.status(400).json({ message: "Search query required" });
      const results = await storage.searchAll(q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed", error });
    }
  });

  // ---------------- USER PROFILE ----------------
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  app.patch("/api/users/me", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const updates = { ...req.body };
      delete updates.id;
      delete updates.password;
      delete updates.email;
      delete updates.walletBalance;

      const updatedUser = await storage.updateUser(req.session.userId!, updates);
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user", error });
    }
  });

  // ---------------- DASHBOARD STATS ----------------
  app.get("/api/dashboard/stats", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.session.userId!;
      const [enrolledCourses, jobApplications, userPosts, transactions] = await Promise.all([
        storage.getEnrolledCourses(userId),
        storage.getUserJobApplications(userId),
        storage.getUserPosts(userId),
        storage.getUserTransactions(userId),
      ]);

      const completedCourses = enrolledCourses.filter(c => c.progress === 100);

      res.json({
        coursesEnrolled: enrolledCourses.length,
        certificatesEarned: completedCourses.length,
        jobApplications: jobApplications.length,
        connections: 0, // TODO
        postsCreated: userPosts.length,
        totalTransactions: transactions.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats", error });
    }
  });

  // ---------------- HTTP SERVER ----------------
  return createServer(app);
}
export const upload = multer({ storage:videoStorage });