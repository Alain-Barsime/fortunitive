import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import session from "express-session";
import { storage } from "./storage";
import { insertUserSchema, insertCourseSchema, insertJobSchema, insertPostSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

// Session middleware
declare module "express-session" {
  interface SessionData {
    userId?: string;
    userRole?: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "skillconnect_secret_key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
    })
  );

  // Auth middleware
  const requireAuth = (req: Request, res: Response, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username, 
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid data", error });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username, 
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profilePicture: user.profilePicture,
          walletBalance: user.walletBalance
        } 
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

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

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
          skills: user.skills
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error });
    }
  });

  // Course routes
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

  app.post("/api/courses", requireAuth, async (req: Request, res: Response) => {
    try {
      const courseData = insertCourseSchema.parse({
        ...req.body,
        instructorId: req.session.userId
      });
      
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      res.status(400).json({ message: "Failed to create course", error });
    }
  });

  app.get("/api/courses/:id", async (req: Request, res: Response) => {
    try {
      const course = await storage.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course", error });
    }
  });

  app.post("/api/courses/:id/enroll", requireAuth, async (req: Request, res: Response) => {
    try {
      const enrollment = await storage.enrollInCourse(req.params.id, req.session.userId!);
      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Failed to enroll in course", error });
    }
  });

  app.get("/api/my-courses", requireAuth, async (req: Request, res: Response) => {
    try {
      const enrolledCourses = await storage.getEnrolledCourses(req.session.userId!);
      res.json(enrolledCourses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrolled courses", error });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req: Request, res: Response) => {
    try {
      const { limit, type } = req.query;
      const jobs = await storage.getJobs(
        limit ? parseInt(limit as string) : undefined,
        type as string
      );
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch jobs", error });
    }
  });

  app.post("/api/jobs", requireAuth, async (req: Request, res: Response) => {
    try {
      const jobData = insertJobSchema.parse({
        ...req.body,
        employerId: req.session.userId
      });
      
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      res.status(400).json({ message: "Failed to create job", error });
    }
  });

  app.post("/api/jobs/:id/apply", requireAuth, async (req: Request, res: Response) => {
    try {
      const { coverLetter } = req.body;
      const application = await storage.applyToJob(req.params.id, req.session.userId!, coverLetter);
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: "Failed to apply for job", error });
    }
  });

  app.get("/api/my-applications", requireAuth, async (req: Request, res: Response) => {
    try {
      const applications = await storage.getUserJobApplications(req.session.userId!);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications", error });
    }
  });

  // Post routes
  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const { limit } = req.query;
      const posts = await storage.getPosts(limit ? parseInt(limit as string) : undefined);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts", error });
    }
  });

  app.post("/api/posts", requireAuth, async (req: Request, res: Response) => {
    try {
      const postData = insertPostSchema.parse({
        ...req.body,
        authorId: req.session.userId
      });
      
      const post = await storage.createPost(postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Failed to create post", error });
    }
  });

  app.post("/api/posts/:id/like", requireAuth, async (req: Request, res: Response) => {
    try {
      await storage.likePost(req.params.id, req.session.userId!);
      res.json({ message: "Post liked successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to like post", error });
    }
  });

  // Message routes
  app.get("/api/messages/:userId", requireAuth, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getMessages(req.session.userId!, req.params.userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages", error });
    }
  });

  app.post("/api/messages", requireAuth, async (req: Request, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId: req.session.userId
      });
      
      const message = await storage.sendMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to send message", error });
    }
  });

  app.get("/api/conversations", requireAuth, async (req: Request, res: Response) => {
    try {
      const conversations = await storage.getRecentConversations(req.session.userId!);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations", error });
    }
  });

  // Search routes
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const results = await storage.searchAll(q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed", error });
    }
  });

  // User profile routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't return sensitive information
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user", error });
    }
  });

  app.patch("/api/users/me", requireAuth, async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      // Don't allow updating sensitive fields
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

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.session.userId!;
      
      const [enrolledCourses, jobApplications, userPosts, transactions] = await Promise.all([
        storage.getEnrolledCourses(userId),
        storage.getUserJobApplications(userId),
        storage.getUserPosts(userId),
        storage.getUserTransactions(userId)
      ]);

      const completedCourses = enrolledCourses.filter(e => e.progress === 100);

      res.json({
        coursesEnrolled: enrolledCourses.length,
        certificatesEarned: completedCourses.length,
        jobApplications: jobApplications.length,
        connections: 0, // TODO: Implement connections count
        postsCreated: userPosts.length,
        totalTransactions: transactions.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
