import { 
  users, 
  courses, 
  jobs, 
  posts, 
  messages, 
  courseEnrollments, 
  jobApplications, 
  transactions,
  type User, 
  type InsertUser,
  type Course,
  type InsertCourse,
  type Job,
  type InsertJob,
  type Post,
  type InsertPost,
  type Message,
  type InsertMessage,
  type CourseEnrollment,
  type JobApplication,
  type Transaction
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Course operations
  getCourses(limit?: number, category?: string): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  getUserCourses(userId: string): Promise<Course[]>;
  getEnrolledCourses(userId: string): Promise<(CourseEnrollment & { course: Course })[]>;
  enrollInCourse(courseId: string, studentId: string): Promise<CourseEnrollment>;

  // Job operations
  getJobs(limit?: number, type?: string): Promise<Job[]>;
  getJobById(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  applyToJob(jobId: string, applicantId: string, coverLetter?: string): Promise<JobApplication>;
  getUserJobApplications(userId: string): Promise<(JobApplication & { job: Job })[]>;

  // Post operations
  getPosts(limit?: number): Promise<(Post & { author: User })[]>;
  createPost(post: InsertPost): Promise<Post>;
  likePost(postId: string, userId: string): Promise<void>;
  getUserPosts(userId: string): Promise<Post[]>;

  // Message operations
  getMessages(userId: string, otherUserId: string): Promise<Message[]>;
  sendMessage(message: InsertMessage): Promise<Message>;
  getRecentConversations(userId: string): Promise<(Message & { sender: User, recipient: User })[]>;

  // Transaction operations
  createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction>;
  getUserTransactions(userId: string): Promise<Transaction[]>;

  // Search operations
  searchAll(query: string): Promise<{
    courses: Course[];
    jobs: Job[];
    users: User[];
    posts: (Post & { author: User })[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: sql`now()` })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getCourses(limit = 10, category?: string): Promise<Course[]> {
    const query = db.select().from(courses).orderBy(desc(courses.createdAt)).limit(limit);
    
    if (category) {
      return await query.where(eq(courses.category, category));
    }
    
    return await query;
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values(insertCourse)
      .returning();
    return course;
  }

  async getUserCourses(userId: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.instructorId, userId));
  }

  async getEnrolledCourses(userId: string): Promise<(CourseEnrollment & { course: Course })[]> {
    return await db
      .select()
      .from(courseEnrollments)
      .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
      .where(eq(courseEnrollments.studentId, userId));
  }

  async enrollInCourse(courseId: string, studentId: string): Promise<CourseEnrollment> {
    const [enrollment] = await db
      .insert(courseEnrollments)
      .values({ courseId, studentId })
      .returning();
    return enrollment;
  }

  async getJobs(limit = 10, type?: string): Promise<Job[]> {
    const query = db.select().from(jobs).where(eq(jobs.isActive, true)).orderBy(desc(jobs.createdAt)).limit(limit);
    
    if (type) {
      return await query.where(and(eq(jobs.isActive, true), eq(jobs.type, type as any)));
    }
    
    return await query;
  }

  async getJobById(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  async applyToJob(jobId: string, applicantId: string, coverLetter?: string): Promise<JobApplication> {
    const [application] = await db
      .insert(jobApplications)
      .values({ jobId, applicantId, coverLetter })
      .returning();
    return application;
  }

  async getUserJobApplications(userId: string): Promise<(JobApplication & { job: Job })[]> {
    return await db
      .select()
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(eq(jobApplications.applicantId, userId));
  }

  async getPosts(limit = 20): Promise<(Post & { author: User })[]> {
    return await db
      .select()
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(limit);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }

  async likePost(postId: string, userId: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Check if already liked
      const existing = await tx
        .select()
        .from(sql`post_likes`)
        .where(and(sql`post_id = ${postId}`, sql`user_id = ${userId}`));

      if (existing.length === 0) {
        // Add like
        await tx.insert(sql`post_likes`).values({ postId, userId });
        // Update post likes count
        await tx
          .update(posts)
          .set({ likesCount: sql`likes_count + 1` })
          .where(eq(posts.id, postId));
      }
    });
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.authorId, userId)).orderBy(desc(posts.createdAt));
  }

  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.recipientId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.recipientId, userId))
        )
      )
      .orderBy(messages.createdAt); // Oldest first for chat display
  }

  async sendMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getRecentConversations(userId: string): Promise<any[]> {
    // Get the most recent message for each unique conversation partner
    const conversations = await db.execute(sql`
      WITH ranked_messages AS (
        SELECT 
          m.*,
          CASE 
            WHEN m.sender_id = ${userId} THEN m.recipient_id 
            ELSE m.sender_id 
          END as other_user_id,
          ROW_NUMBER() OVER (
            PARTITION BY CASE 
              WHEN m.sender_id = ${userId} THEN m.recipient_id 
              ELSE m.sender_id 
            END 
            ORDER BY m.created_at DESC
          ) as rn
        FROM messages m
        WHERE m.sender_id = ${userId} OR m.recipient_id = ${userId}
      )
      SELECT 
        rm.*,
        u.id as user_id,
        u.first_name,
        u.last_name,
        u.username,
        u.profile_picture,
        u.role,
        (
          SELECT COUNT(*)
          FROM messages m2 
          WHERE m2.sender_id = rm.other_user_id 
            AND m2.recipient_id = ${userId} 
            AND m2.is_read = false
        ) as unread_count
      FROM ranked_messages rm
      JOIN users u ON u.id = rm.other_user_id
      WHERE rm.rn = 1
      ORDER BY rm.created_at DESC
      LIMIT 10
    `);
    
    return conversations.rows;
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async searchAll(query: string): Promise<{
    courses: Course[];
    jobs: Job[];
    users: User[];
    posts: (Post & { author: User })[];
  }> {
    const searchTerm = `%${query}%`;

    const [searchedCourses, searchedJobs, searchedUsers, searchedPosts] = await Promise.all([
      db.select().from(courses).where(or(ilike(courses.title, searchTerm), ilike(courses.description, searchTerm))).limit(5),
      db.select().from(jobs).where(or(ilike(jobs.title, searchTerm), ilike(jobs.description, searchTerm))).limit(5),
      db.select().from(users).where(or(ilike(users.username, searchTerm), ilike(users.firstName, searchTerm), ilike(users.lastName, searchTerm))).limit(5),
      db.select().from(posts).innerJoin(users, eq(posts.authorId, users.id)).where(ilike(posts.content, searchTerm)).limit(5)
    ]);

    return {
      courses: searchedCourses,
      jobs: searchedJobs,
      users: searchedUsers,
      posts: searchedPosts
    };
  }
}

export const storage = new DatabaseStorage();
