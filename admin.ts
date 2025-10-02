import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { jwt, verify } from "hono/jwt";
import z from "zod";

/**
 * Admin Routes - Properly Typed and Memory Efficient
 * 
 * Provides administrative functionality including:
 * 1. Dashboard analytics and user stats
 * 2. User management and export
 * 3. System settings configuration
 * 4. Token expiration management
 */

// JWT secret - must match auth routes
const JWT_SECRET = process.env.JWT_SECRET || "brave-things-books-auth-secret";

// Use shared database with proper types
import { 
  getSharedDatabase, 
  ensureAdminUserExists, 
  ensureAllUsersExist,
  MockUser,
  MockDatabase,
  MockPurchase,
  MockProgress,
  MockBookmark,
  MockAnalyticsSession,
  MockBookAccessToken,
  MockReadingSession,
  MockPageEngagement,
  MockUserAnalytics,
  MockPasswordResetToken
} from "../shared-database";

// Admin schemas
const SettingsSchema = z.object({
  authTokenExpiry: z.number().min(1).max(30),
  bookAccessTokenExpiry: z.number().min(0).max(365),
  maxLoginAttempts: z.number().min(3).max(10),
  passwordResetExpiry: z.number().min(1).max(24),
  enableEmailNotifications: z.boolean()
});

// Type for system settings
interface SystemSettings {
  authTokenExpiry: number;
  bookAccessTokenExpiry: number;
  maxLoginAttempts: number;
  passwordResetExpiry: number;
  enableEmailNotifications: boolean;
}

// In-memory settings storage (in production, use database)
let systemSettings: SystemSettings = {
  authTokenExpiry: 7,
  bookAccessTokenExpiry: 0,
  maxLoginAttempts: 5,
  passwordResetExpiry: 1,
  enableEmailNotifications: true
};

// Type definitions for API responses
interface UserStats {
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
  totalReadingTime: number;
  totalSessions: number;
  averageEngagementScore: number;
}

interface TopUser {
  userId: string;
  userName: string;
  userEmail: string;
  engagementScore: number;
  totalSessions: number;
  totalReadingTime: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  subscription_status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  subscription_status: "free" | "premium";
  role: "user" | "admin" | "preview";
  last_active?: string;
  total_reading_time: number;
  books_read: number;
  current_streak: number;
}

interface UserAnalytics {
  user_id: string;
  overview: {
    total_sessions: number;
    total_reading_time: number;
    last_read_at?: string;
    completion_rate: number;
    engagement_score: number;
  };
  recent_sessions: Array<{
    id: string;
    date: string;
    duration: number;
    pages_read: number;
    completion_rate: number;
  }>;
  page_analytics: Array<{
    page_number: number;
    chapter_name?: string;
    average_time: number;
    completion_rate: number;
    interaction_density: number;
  }>;
  behavior_insights: {
    reading_patterns: string[];
    engagement_trends: Array<{
      date: string;
      score: number;
    }>;
    recommendations: string[];
  };
}

/**
 * Verify admin access - checks JWT token and admin role
 */
async function verifyAdminAccess(c: any): Promise<MockUser | null> {
  try {
    const authHeader = c.req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const payload = await verify(token, JWT_SECRET) as any;
    
    // Get database instance
    const mockDatabase = await getSharedDatabase();
    await ensureAdminUserExists(mockDatabase);
    
    // Find user in database
    const user = mockDatabase.users.get(payload.userId);
    
    if (!user || user.role !== "admin") {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error("❌ Admin access verification failed:", error);
    return null;
  }
}

export function createAdminRoute() {
  const route = new Hono()
    .use("*", cors({
      origin: "*",
      credentials: true,
    }))
    
    /**
     * GET /api/admin/test
     * Simple test endpoint
     */
    .get("/test", async (c) => {
      return c.json({ 
        message: "Admin routes are working!",
        timestamp: new Date().toISOString()
      });
    })
    
    /**
     * GET /api/admin/dashboard
     * Get dashboard analytics
     */
    .get("/dashboard", async (c) => {
      const user = await verifyAdminAccess(c);
      if (!user) {
        return c.json({ error: "Admin access required" }, 401);
      }
      
      try {
        const mockDatabase = await getSharedDatabase();
        const users = Array.from(mockDatabase.users.values());
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calculate basic stats with proper type safety
        const stats: UserStats = {
          totalUsers: users.length,
          newUsersToday: users.filter((u: MockUser) => 
            new Date(u.created_at || new Date()) >= today
          ).length,
          activeUsers: users.filter((u: MockUser) => 
            u.subscription_status === "premium" ||
            (u.created_at && new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
          ).length,
          totalReadingTime: Array.from(mockDatabase.progress.values())
            .reduce((total, p: MockProgress) => total + (p.timeSpent || 0), 0),
          totalSessions: mockDatabase.readingSessions.size,
          averageEngagementScore: 85
        };
        
        const recentUsers: RecentUser[] = users
          .sort((a: MockUser, b: MockUser) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 5)
          .map((user: MockUser) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at?.toISOString() || new Date().toISOString(),
            subscription_status: user.subscription_status || "free"
          }));
        
        return c.json({ stats, recentUsers });
      } catch (error) {
        console.error("Dashboard error:", error);
        return c.json({ error: "Failed to load dashboard" }, 500);
      }
    })
    
    /**
     * GET /api/admin/users
     * Get all users with basic analytics
     */
    .get("/users", async (c) => {
      const user = await verifyAdminAccess(c);
      if (!user) {
        return c.json({ error: "Admin access required" }, 401);
      }
      
      try {
        const mockDatabase = await getSharedDatabase();
        await ensureAllUsersExist(mockDatabase);
        
        const users: User[] = Array.from(mockDatabase.users.values()).map((user: MockUser) => {
          // Get user progress with type safety
          const userProgress = Array.from(mockDatabase.progress.values())
            .filter((p: MockProgress) => p.userId === user.id);
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at?.toISOString() || new Date().toISOString(),
            subscription_status: user.subscription_status || "free",
            role: user.role || "user",
            last_active: userProgress.length > 0 
              ? userProgress.sort((a: MockProgress, b: MockProgress) => new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime())[0].lastReadAt
              : undefined,
            total_reading_time: userProgress.reduce((total, p: MockProgress) => total + (p.timeSpent || 0), 0),
            books_read: userProgress.filter((p: MockProgress) => p.progress >= 100).length,
            current_streak: 0
          };
        });
        
        return c.json({ users });
      } catch (error) {
        console.error("Users load error:", error);
        return c.json({ error: "Failed to load users" }, 500);
      }
    })
    
    /**
     * GET /api/admin/settings
     * Get system settings
     */
    .get("/settings", async (c) => {
      const user = await verifyAdminAccess(c);
      if (!user) {
        return c.json({ error: "Admin access required" }, 401);
      }
      
      return c.json({ settings: systemSettings });
    })
    
    /**
     * POST /api/admin/settings
     * Update system settings
     */
    .post("/settings", zValidator("json", z.object({ settings: SettingsSchema })), async (c) => {
      const user = await verifyAdminAccess(c);
      if (!user) {
        return c.json({ error: "Admin access required" }, 401);
      }
      
      try {
        const { settings } = c.req.valid("json");
        systemSettings = { ...systemSettings, ...settings };
        
        return c.json({ 
          success: true, 
          settings: systemSettings,
          message: "Settings updated successfully"
        });
      } catch (error) {
        console.error("Settings update error:", error);
        return c.json({ error: "Failed to update settings" }, 500);
      }
    })
    
    /**
     * GET /api/admin/user-analytics/:userId
     * Get analytics for a specific user
     */
    .get("/user-analytics/:userId", async (c) => {
      const user = await verifyAdminAccess(c);
      if (!user) {
        return c.json({ error: "Admin access required" }, 401);
      }
      
      try {
        const userId = c.req.param("userId");
        const mockDatabase = await getSharedDatabase();
        
        // Get user sessions with type safety
        const sessions = Array.from(mockDatabase.readingSessions.values())
          .filter((s: MockReadingSession) => s.user_id === userId)
          .sort((a: MockReadingSession, b: MockReadingSession) => b.session_start.getTime() - a.session_start.getTime());
        
        // Get user engagements
        const engagements = Array.from(mockDatabase.pageEngagements.values())
          .filter((e: MockPageEngagement) => e.user_id === userId);
        
        // Get user behavior analytics
        const behaviorAnalytics = Array.from(mockDatabase.userAnalytics.values())
          .find((a: MockUserAnalytics) => a.user_id === userId);
        
        // Calculate simple metrics
        const totalReadingTime = sessions.reduce((total, s: MockReadingSession) => total + s.total_duration, 0);
        const averageSessionDuration = sessions.length > 0 ? totalReadingTime / sessions.length : 0;
        const pagesRead = [...new Set(engagements.map((e: MockPageEngagement) => e.page_number))].length;
        
        // Create simplified analytics response
        const analytics: UserAnalytics = {
          user_id: userId,
          overview: {
            total_sessions: sessions.length,
            total_reading_time: Math.round(totalReadingTime / 60), // Convert to minutes
            last_read_at: sessions[0]?.session_start.toISOString(),
            completion_rate: behaviorAnalytics?.completion_rate || 0,
            engagement_score: behaviorAnalytics?.engagement_score || 0
          },
          recent_sessions: sessions.slice(0, 10).map((session: MockReadingSession) => ({
            id: session.id,
            date: session.session_start.toISOString(),
            duration: session.total_duration,
            pages_read: session.pages_visited.length,
            completion_rate: session.pages_visited.length > 0
              ? Math.round((session.pages_visited.length / 54) * 100) // Approximate total pages
              : 0
          })),
          page_analytics: [], // Simplified for memory efficiency
          behavior_insights: {
            reading_patterns: behaviorAnalytics ? [
              `${behaviorAnalytics.preferred_reading_time || 'evening'} reader`,
              `${behaviorAnalytics.interaction_patterns?.scroll_behavior} scroll behavior`,
              `${behaviorAnalytics.interaction_patterns?.clicks_per_page.toFixed(1)} clicks per page`
            ] : [],
            engagement_trends: sessions.slice(0, 7).map((session: MockReadingSession) => ({
              date: session.session_start.toISOString().split('T')[0],
              score: Math.round((session.total_duration / 3600) * 20 + (session.interactions_count / 10))
            })),
            recommendations: ["Encourage regular reading sessions", "Explore interactive features"]
          }
        };
        
        return c.json(analytics);
      } catch (error) {
        console.error("User analytics error:", error);
        return c.json({ error: "Failed to load user analytics" }, 500);
      }
    });
  
  return route;
}

// Export settings for use in other routes
export function getSystemSettings(): SystemSettings {
  return systemSettings;
}

export function updateTokenExpiry(bookAccessExpiry: number): void {
  systemSettings.bookAccessTokenExpiry = bookAccessExpiry;
}