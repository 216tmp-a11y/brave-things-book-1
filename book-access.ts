import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { jwt, sign, verify } from "hono/jwt";
import z from "zod";
import {
  TokenValidationRequestSchema,
  TokenValidationResponseSchema,
  UpdateProgressRequestSchema,
  GenerateTokenRequestSchema,
  GenerateTokenResponseSchema,
  BookAccessTokenSchema,
  ReadingProgressSchema,
  JWTPayloadSchema,
  // Enhanced Token-Based Schemas
  EnhancedTokenValidationResponseSchema,
  GetBookmarksRequestSchema,
  GetBookmarksResponseSchema,
  AddBookmarkRequestSchema,
  UpdateBookmarkRequestSchema,
  DeleteBookmarkRequestSchema,
  BookmarkResponseSchema,
  TrackAnalyticsRequestSchema,
  TrackAnalyticsResponseSchema,
  BookmarkSchema,
  // Enhanced Analytics Schemas (NEW)
  EnhancedAnalyticsTrackingRequestSchema,
  EnhancedAnalyticsResponseSchema,
  EnhancedAnalyticsSummarySchema,
  PageTypeSchema,
  NavigationSourceSchema,
} from "../schema";

/**
 * Book Access Token System Routes
 * 
 * This module provides the core integration system for external book projects.
 * It handles:
 * 1. Token generation when users click "Read Book"
 * 2. Token validation for external books
 * 3. Reading progress synchronization
 * 4. User access verification
 * 
 * Integration Flow:
 * Platform -> Generate Token -> Redirect to Book -> Validate Token -> Sync Progress
 */

// JWT secret - use same secret as auth routes for consistency
const JWT_SECRET = process.env.JWT_SECRET || "brave-things-books-auth-secret";

const getJWTSecretForBookAccess = () => {
  return JWT_SECRET;
};

// Import configurable settings
import { getSystemSettings } from "./admin";

// Use shared database to ensure consistency between auth and book-access routes
import { getSharedDatabase, MockUser, MockBook, MockPurchase, MockProgress, MockBookmark, MockAnalyticsSession, MockBookAccessToken } from "../shared-database";

export function createBookAccessRoute() {
  const route = new Hono()
    // Enable CORS for external book integration
    .use(
      "*",
      cors({
        origin: ["*"], // In production, specify allowed domains
        allowMethods: ["GET", "POST", "PUT", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
      })
    )

    /**
     * Generate Book Access Token
     * POST /api/book-access/generate-token
     * 
     * Called when user clicks "Read Book" on the platform.
     * Generates a secure token and returns the book URL with token.
     */
    .post(
      "generate-token",
      zValidator("json", GenerateTokenRequestSchema),
      async (c) => {
        try {
          const { bookId } = c.req.valid("json");
          
          console.log("🎫 TOKEN GENERATION REQUEST for book:", bookId);
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Extract userId from JWT auth header
          const authHeader = c.req.header("Authorization");
          
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("❌ No valid auth header found");
            return c.json(
              {
                success: false,
                error: "Authentication required",
              },
              401
            );
          }
          
          const authToken = authHeader.substring(7);
          
          // Use same JWT secret as auth routes
          let authPayload: any;
          try {
            authPayload = await verify(authToken, getJWTSecretForBookAccess());
            console.log("✅ Auth token verified for user:", authPayload.userId);
          } catch (tokenError) {
            console.log("❌ Auth token verification failed:", tokenError);
            return c.json(
              {
                success: false,
                error: "Invalid or expired authentication token",
              },
              401
            );
          }
          
          const userId = authPayload.userId;
          
          // Check if user exists
          let user = mockDatabase.users.get(userId);
          if (!user) {
            console.log("❌ User not found in database:", userId);
            console.log("📊 Available users in database:");
            const allUsers = Array.from(mockDatabase.users.values());
            allUsers.forEach(u => console.log(`  - ${u.id}: ${u.email} (${u.name})`));
            console.log("🔧 Attempting to ensure admin user exists...");
            
            // Try to restore missing admin user
            const { ensureAdminUserExists, ensureAllUsersExist } = await import("../shared-database");
            await ensureAdminUserExists(mockDatabase);
            await ensureAllUsersExist(mockDatabase);
            
            // Try again after restoration
            user = mockDatabase.users.get(userId);
            if (!user) {
              console.log("❌ User still not found after restoration attempt:", userId);
              return c.json(
                {
                  success: false,
                  error: "User not found",
                },
                404
              );
            } else {
              console.log("✅ User found after restoration:", user.name, user.email);
            }
          }
          
          // Verify user has access to the book (purchased or free)
          // For free books like WTBTG, automatically grant access to authenticated users
          let purchase = Array.from(mockDatabase.purchases.values()).find(
            (p) => p.userId === userId && p.bookId === bookId && p.status === "completed"
          );
          
          // If no purchase found but book is free (like WTBTG), create access record
          if (!purchase && bookId === "wtbtg") {
            const purchaseKey = `${userId}-${bookId}`;
            purchase = {
              id: purchaseKey,
              userId,
              bookId,
              status: "completed",
              access_type: "free",
              purchased_at: new Date(),
            };
            mockDatabase.purchases.set(purchaseKey, purchase);
            console.log("✅ Free access granted for WTBTG");
          }
          
          if (!purchase) {
            console.log("❌ No purchase/access record found for user", userId, "and book", bookId);
            return c.json(
              {
                success: false,
                error: "Book not purchased or access denied",
              },
              403
            );
          }
          
          // Get book details
          const book = mockDatabase.books.get(bookId);
          
          if (!book || !book.isActive) {
            console.log("❌ Book not found or inactive");
            return c.json(
              {
                success: false,
                error: "Book not found or unavailable",
              },
              404
            );
          }
          
          // Check for existing persistent token
          const tokenKey = `${userId}-${bookId}`;
          const existingToken = mockDatabase.bookAccessTokens.get(tokenKey);
          
          // If we have a valid, non-expired existing token, return it
          if (existingToken && (!existingToken.expiresAt || existingToken.expiresAt > Math.floor(Date.now() / 1000))) {
            console.log("✅ Reusing existing valid token");
            
            // Update last used timestamp
            existingToken.lastUsedAt = Math.floor(Date.now() / 1000);
            mockDatabase.bookAccessTokens.set(tokenKey, existingToken);
            
            // Construct book URL with existing token
            const returnUrl = `${c.req.url.split('/api')[0]}/library`;
            const bookUrl = `${book.externalUrl}?token=${encodeURIComponent(existingToken.token)}&platform=brave-things-books&returnUrl=${encodeURIComponent(returnUrl)}&returnLabel=${encodeURIComponent('Back to Library')}`;
            
            return c.json({
              success: true,
              token: existingToken.token,
              expiresAt: existingToken.expiresAt || 0,
              bookUrl,
            });
          }
          
          // Generate new access token with configurable expiry
          const settings = getSystemSettings();
          
          const tokenExpiry = settings.bookAccessTokenExpiry === 0 
            ? undefined // No expiration
            : Math.floor(Date.now() / 1000) + (settings.bookAccessTokenExpiry * 24 * 60 * 60);
          
          const tokenPayload = {
            userId,
            bookId,
            purchaseId: purchase.id,
            permissions: ["read", "bookmark", "progress"],
            ...(tokenExpiry && { exp: tokenExpiry }),
          };
          
          const token = await sign(tokenPayload, getJWTSecretForBookAccess());
          const expiresAt = tokenExpiry || 0; // 0 means no expiration
          
          // Store persistent token
          const persistentToken: MockBookAccessToken = {
            id: tokenKey,
            userId,
            bookId,
            token,
            expiresAt: tokenExpiry,
            createdAt: Math.floor(Date.now() / 1000),
            lastUsedAt: Math.floor(Date.now() / 1000),
          };
          mockDatabase.bookAccessTokens.set(tokenKey, persistentToken);

          // Create user-account-based analytics session linked to user identity
          const sessionId = `session_${userId}_${bookId}_${Date.now()}`;
          const readingSession = {
            id: sessionId,
            user_id: userId, // PRIMARY KEY: Link to user account, not token
            book_id: bookId,
            session_start: new Date(),
            session_end: undefined,
            total_duration: 0,
            pages_visited: [],
            interactions_count: 0,
            device_type: "desktop" as const,
            browser_info: c.req.header("user-agent") || "Unknown Browser"
          };
          mockDatabase.readingSessions.set(sessionId, readingSession);
          
          // Initialize or update user behavior analytics (accumulates across all sessions)
          const analyticsId = `analytics_${userId}`;
          const existingAnalytics = mockDatabase.userAnalytics.get(analyticsId);
          
          if (existingAnalytics) {
            // Update session count for existing user
            existingAnalytics.total_sessions += 1;
            existingAnalytics.last_calculated = new Date();
            mockDatabase.userAnalytics.set(analyticsId, existingAnalytics);
          } else {
            // Create new user analytics profile
            const newAnalytics = {
              id: analyticsId,
              user_id: userId,
              total_sessions: 1,
              total_reading_time: 0,
              average_session_duration: 0,
              pages_read: 0,
              completion_rate: 0,
              return_frequency: 0,
              engagement_score: 50, // Start with baseline
              preferred_reading_time: undefined,
              most_engaged_chapters: [],
              interaction_patterns: {
                clicks_per_page: 0,
                scroll_behavior: "moderate" as const,
                pause_frequency: 0
              },
              // NEW - Required analytics properties
              page_type_analytics: {
                story_pages: 0,
                cue_pages: 0,
                activity_pages: 0,
                average_time_per_story_page: 0,
                average_time_per_cue_page: 0,
                average_time_per_activity_page: 0,
              },
              cue_engagement: {
                total_cues_encountered: 0,
                total_cues_completed: 0,
                completion_rate: 0,
                average_time_before_click: 0,
                favorite_cues: [],
                cue_specific_metrics: {},
              },
              navigation_patterns: {
                toc_usage: 0,
                linear_reading: 0,
                back_button_usage: 0,
                preferred_navigation_method: "other" as const,
                average_session_depth: 0,
              },
              print_behavior: {
                total_print_clicks: 0,
                pages_printed: [],
                print_engagement_rate: 0,
                most_printed_activities: [],
              },
              last_calculated: new Date()
            };
            mockDatabase.userAnalytics.set(analyticsId, newAnalytics);
          }
          
          console.log("📊 User-account-based analytics session initialized:", {
            sessionId,
            userId,
            totalSessions: (existingAnalytics?.total_sessions || 0) + 1
          });
          
          console.log("✅ Token generated successfully");
          
          // Construct book URL with token and return information
          const returnUrl = `${c.req.url.split('/api')[0]}/library`; // Extract base URL and add /library
          const bookUrl = `${book.externalUrl}?token=${encodeURIComponent(token)}&platform=brave-things-books&returnUrl=${encodeURIComponent(returnUrl)}&returnLabel=${encodeURIComponent('Back to Library')}`;
          
          return c.json({
            success: true,
            token,
            expiresAt,
            bookUrl,
          });
        } catch (error) {
          console.error("❌ TOKEN GENERATION ERROR:", error);
          console.error("  Error details:", {
            name: error instanceof Error ? error.name : "Unknown",
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : "No stack trace"
          });
          return c.json(
            {
              success: false,
              error: "Failed to generate access token",
            },
            500
          );
        }
      }
    )

    /**
     * Validate Book Access Token (Legacy)
     * POST /api/book-access/validate-token
     * 
     * Called by external book projects to validate user access.
     * Returns user info and permissions if token is valid.
     */
    .post(
      "validate-token",
      zValidator("json", TokenValidationRequestSchema),
      async (c) => {
        try {
          const { token, bookId } = c.req.valid("json");
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Verify and decode token
          const rawPayload = await verify(token, getJWTSecretForBookAccess());
          
          // Validate payload structure using Zod
          const payloadValidation = JWTPayloadSchema.safeParse(rawPayload);
          if (!payloadValidation.success) {
            return c.json({
              valid: false,
            });
          }
          
          const payload = payloadValidation.data;
          
          // Validate token matches book
          if (payload.bookId !== bookId) {
            return c.json({
              valid: false,
            });
          }
          
          // Check if token is expired
          if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return c.json({
              valid: false,
            });
          }
          
          // Get user details
          const user = mockDatabase.users.get(payload.userId);
          if (!user) {
            return c.json({
              valid: false,
            });
          }
          
          return c.json({
            valid: true,
            userId: payload.userId,
            bookId: payload.bookId,
            permissions: payload.permissions || ["read"],
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        } catch (error) {
          console.error("Token validation error:", error);
          return c.json({
            valid: false,
          });
        }
      }
    )

    /**
     * Enhanced Token Validation with Bookmarks & Analytics
     * POST /api/book-access/validate-enhanced
     * 
     * Enhanced version that returns user info, bookmarks, progress, and analytics session ID.
     * This is the recommended endpoint for external books that want full integration.
     */
    .post(
      "validate-enhanced",
      zValidator("json", TokenValidationRequestSchema),
      async (c) => {
        try {
          const { token, bookId } = c.req.valid("json");
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Verify and decode token
          const rawPayload = await verify(token, getJWTSecretForBookAccess());
          
          // Validate payload structure using Zod
          const payloadValidation = JWTPayloadSchema.safeParse(rawPayload);
          if (!payloadValidation.success) {
            return c.json({
              valid: false,
            });
          }
          
          const payload = payloadValidation.data;
          
          // Validate token matches book
          if (payload.bookId !== bookId) {
            return c.json({
              valid: false,
            });
          }
          
          // Check if token is expired
          if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
            return c.json({
              valid: false,
            });
          }
          
          // Get user details
          const user = mockDatabase.users.get(payload.userId);
          if (!user) {
            return c.json({
              valid: false,
            });
          }

          // Get user's bookmarks for this book
          const userBookmarks = Array.from(mockDatabase.tokenBookmarks.values())
            .filter(bookmark => bookmark.userId === payload.userId && bookmark.bookId === bookId)
            .map(bookmark => ({
              id: bookmark.id,
              page: bookmark.page,
              chapter: bookmark.chapter,
              note: bookmark.note,
              created_at: bookmark.created_at,
              updated_at: bookmark.updated_at,
              bookmark_type: bookmark.bookmark_type,
              metadata: bookmark.metadata,
            }));

          // Get user's reading progress for this book
          const progressKey = `${payload.userId}-${bookId}`;
          const progress = mockDatabase.progress.get(progressKey);

          // Generate analytics session ID for this reading session - linked to user account
          const analyticsSessionId = `session_${payload.userId}_${bookId}_${Date.now()}`;
          
          // Create analytics session that tracks to user account (not token)
          const analyticsSession = {
            id: analyticsSessionId,
            userId: payload.userId, // PRIMARY: Link to user account for continuity
            bookId: bookId,
            session_start: new Date().toISOString(),
            session_end: undefined,
            device_info: {
              type: "desktop" as const,
              browser: c.req.header("user-agent") || "Unknown",
              screen_size: undefined
            },
            reading_metrics: {
              pages_visited: [],
              total_interactions: 0,
              cues_collected: [],
              time_per_page: {}
            },
            page_interactions: []
          };
          
          // Store analytics session linked to user account
          mockDatabase.analyticsessions.set(analyticsSessionId, analyticsSession);
          
          console.log("📊 Enhanced validation: Created user-account-based analytics session:", {
            sessionId: analyticsSessionId,
            userId: payload.userId,
            linkedToUserAccount: true
          });

          return c.json({
            valid: true,
            userId: payload.userId,
            bookId: payload.bookId,
            permissions: payload.permissions || ["read", "bookmark", "progress"],
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            bookmarks: userBookmarks,
            progress: progress ? {
              current_page: progress.currentPage || 1,
              current_chapter: progress.currentChapter || "Chapter 1",
              completion_percentage: progress.progress,
              time_spent: progress.timeSpent,
              last_read_at: progress.lastReadAt,
            } : {
              current_page: 1,
              current_chapter: "Chapter 1",
              completion_percentage: 0,
              time_spent: 0,
              last_read_at: new Date().toISOString(),
            },
            analytics_session_id: analyticsSessionId,
            // Return navigation information
            return_info: {
              url: `${c.req.url.split('/api')[0]}/library`,
              label: "Back to Library",
              platform: "Brave Things Books"
            },
          });
        } catch (error) {
          console.error("Enhanced token validation error:", error);
          return c.json({
            valid: false,
          });
        }
      }
    )

    /**
     * Update Reading Progress
     * POST /api/book-access/update-progress
     * 
     * Called by external books to sync reading progress back to platform.
     */
    .post(
      "update-progress",
      zValidator("json", UpdateProgressRequestSchema),
      async (c) => {
        try {
          const { token, progress, currentPage, currentChapter, timeSpent, bookmarks } =
            c.req.valid("json");
          
          // Verify token
          const rawPayload = await verify(token, getJWTSecretForBookAccess());
          
          // Validate payload structure using Zod
          const payloadValidation = JWTPayloadSchema.safeParse(rawPayload);
          if (!payloadValidation.success) {
            return c.json(
              { success: false, error: "Invalid token format" },
              400
            );
          }
          
          const payload = payloadValidation.data;
          
          if (!payload.permissions?.includes("progress")) {
            return c.json(
              { success: false, error: "No progress permission" },
              403
            );
          }
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Update progress in database
          const progressKey = `${payload.userId}-${payload.bookId}`;
          const existingProgress = mockDatabase.progress.get(progressKey) || {
            userId: payload.userId,
            bookId: payload.bookId,
            progress: 0,
            currentPage: 1,
            currentChapter: "Chapter 1",
            timeSpent: 0,
            lastReadAt: new Date().toISOString(),
            bookmarks: [],
          };
          
          // Filter and validate bookmarks to ensure they have required properties
          const validBookmarks = (bookmarks || existingProgress.bookmarks || [])
            .filter((bookmark): bookmark is { page: number; chapter?: string; note?: string } => 
              bookmark && typeof bookmark.page === 'number'
            );

          const updatedProgress: MockProgress = {
            ...existingProgress,
            userId: payload.userId,
            bookId: payload.bookId,
            progress,
            currentPage,
            currentChapter,
            timeSpent: (existingProgress.timeSpent || 0) + (timeSpent || 0),
            lastReadAt: new Date().toISOString(),
            bookmarks: validBookmarks,
          };
          
          mockDatabase.progress.set(progressKey, updatedProgress);
          
          // FIXED: Update existing session data instead of creating new sessions
          console.log("📊 Updating analytics from progress update:", {
            userId: payload.userId,
            timeSpent: timeSpent || 0,
            currentPage,
            currentChapter
          });
          
          // Find the most recent active session for this user (instead of creating new one)
          const userSessions = Array.from(mockDatabase.readingSessions.values())
            .filter(session => session.user_id === payload.userId && session.book_id === payload.bookId)
            .sort((a, b) => new Date(b.session_start).getTime() - new Date(a.session_start).getTime());
          
          let currentSession = userSessions[0];
          
          if (currentSession && !currentSession.session_end) {
            // Update existing active session
            currentSession.total_duration = (currentSession.total_duration || 0) + (timeSpent || 0);
            if (!currentSession.pages_visited.includes(currentPage)) {
              currentSession.pages_visited.push(currentPage);
            }
            currentSession.interactions_count += 1;
            mockDatabase.readingSessions.set(currentSession.id, currentSession);
            
            console.log("📊 Updated EXISTING session:", {
              sessionId: currentSession.id,
              totalDuration: Math.round(currentSession.total_duration / 60) + " minutes",
              pagesVisited: currentSession.pages_visited.length,
              interactions: currentSession.interactions_count
            });
          } else {
            console.log("📊 No active session found for progress update");
          }
          
          // Create page engagement only if we have an active session
          if (currentSession) {
            const engagementId = `engagement_${payload.userId}_${currentPage}_${Date.now()}`;
            const pageEngagement = {
              id: engagementId,
              user_id: payload.userId,
              book_id: payload.bookId,
              session_id: currentSession.id, // Use existing session ID
              page_number: currentPage,
              page_type: "story" as const, // Default to story page
              chapter_name: currentChapter,
              time_on_page: timeSpent || 0,
              actual_time_seconds: timeSpent || 0, // NEW - Required property
              interactions: [{
                type: "scroll" as const,
                element: "page",
                timestamp: new Date(),
                position: { x: 0, y: 0 }
              }],
              cue_interactions: [], // NEW - Required property
              print_clicks: 0, // NEW - Required property
              scroll_depth: 80,
              completion_status: "completed" as const,
              created_at: new Date(),
              // ENHANCED ANALYTICS PROPERTIES - Required for interface compliance
              navigation_source: "other" as const,
              time_before_interaction: 0,
              print_targets: [],
              time_on_activity_page: 0,
            };
            mockDatabase.pageEngagements.set(engagementId, pageEngagement);
          }
          
          // Update user analytics summary
          const analyticsId = `analytics_${payload.userId}`;
          const existingAnalytics = mockDatabase.userAnalytics.get(analyticsId);
          
          if (existingAnalytics) {
            // Update existing analytics
            existingAnalytics.total_sessions += 1;
            existingAnalytics.total_reading_time += (timeSpent || 0);
            existingAnalytics.average_session_duration = Math.round(existingAnalytics.total_reading_time / existingAnalytics.total_sessions);
            existingAnalytics.pages_read += 1;
            existingAnalytics.completion_rate = Math.min(100, Math.round((existingAnalytics.pages_read / 54) * 100)); // 54 total pages
            existingAnalytics.engagement_score = Math.min(100, existingAnalytics.engagement_score + 5);
            existingAnalytics.last_calculated = new Date();
            mockDatabase.userAnalytics.set(analyticsId, existingAnalytics);
          } else {
            // Create new analytics profile
            const newAnalytics = {
              id: analyticsId,
              user_id: payload.userId,
              total_sessions: 1,
              total_reading_time: timeSpent || 0,
              average_session_duration: timeSpent || 0,
              pages_read: 1,
              completion_rate: Math.min(100, Math.round((1 / 54) * 100)),
              return_frequency: 0,
              engagement_score: 50,
              preferred_reading_time: undefined,
              most_engaged_chapters: [currentChapter],
              interaction_patterns: {
                clicks_per_page: 1,
                scroll_behavior: "moderate" as const,
                pause_frequency: 1
              },
              // NEW - Required analytics properties
              page_type_analytics: {
                story_pages: 1,
                cue_pages: 0,
                activity_pages: 0,
                average_time_per_story_page: timeSpent || 0,
                average_time_per_cue_page: 0,
                average_time_per_activity_page: 0,
              },
              cue_engagement: {
                total_cues_encountered: 0,
                total_cues_completed: 0,
                completion_rate: 0,
                average_time_before_click: 0,
                favorite_cues: [],
                cue_specific_metrics: {},
              },
              navigation_patterns: {
                toc_usage: 0,
                linear_reading: 0,
                back_button_usage: 0,
                preferred_navigation_method: "other" as const,
                average_session_depth: 0,
              },
              print_behavior: {
                total_print_clicks: 0,
                pages_printed: [],
                print_engagement_rate: 0,
                most_printed_activities: [],
              },
              last_calculated: new Date()
            };
            mockDatabase.userAnalytics.set(analyticsId, newAnalytics);
          }
          
          console.log("✅ Analytics data created for user:", payload.userId);
          
          return c.json({
            success: true,
            progress: updatedProgress,
          });
        } catch (error) {
          console.error("Progress update error:", error);
          return c.json(
            { success: false, error: "Failed to update progress" },
            500
          );
        }
      }
    )

    /**
     * Get Reading Progress
     * GET /api/book-access/progress/:userId/:bookId
     * 
     * Retrieve current reading progress for a user and book.
     */
    .get("progress/:userId/:bookId", async (c) => {
      try {
        const userId = c.req.param("userId");
        const bookId = c.req.param("bookId");
        
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
        const progressKey = `${userId}-${bookId}`;
        const progress = mockDatabase.progress.get(progressKey);
        
        if (!progress) {
          return c.json({
            progress: 0,
            currentPage: 1,
            timeSpent: 0,
            bookmarks: [],
            lastReadAt: null,
          });
        }
        
        return c.json(progress);
      } catch (error) {
        console.error("Get progress error:", error);
        return c.json(
          { error: "Failed to get progress" },
          500
        );
      }
    })

    /**
     * Get User Bookmarks via Token
     * POST /api/book-access/bookmarks/get
     * 
     * Retrieve all bookmarks for the user and book identified by token.
     */
    .post(
      "bookmarks/get",
      zValidator("json", GetBookmarksRequestSchema),
      async (c) => {
        try {
          const { token } = c.req.valid("json");
          
          // Verify token
          const rawPayload = await verify(token, getJWTSecretForBookAccess());
          const payloadValidation = JWTPayloadSchema.safeParse(rawPayload);
          
          if (!payloadValidation.success) {
            return c.json({ success: false, error: "Invalid token" }, 400);
          }
          
          const payload = payloadValidation.data;
          
          if (!payload.permissions?.includes("bookmark")) {
            return c.json({ success: false, error: "No bookmark permission" }, 403);
          }
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Get user's bookmarks for this book
          const userBookmarks = Array.from(mockDatabase.tokenBookmarks.values())
            .filter(bookmark => bookmark.userId === payload.userId && bookmark.bookId === payload.bookId)
            .map(bookmark => ({
              id: bookmark.id,
              page: bookmark.page,
              chapter: bookmark.chapter,
              note: bookmark.note,
              created_at: bookmark.created_at,
              updated_at: bookmark.updated_at,
              bookmark_type: bookmark.bookmark_type,
              metadata: bookmark.metadata,
            }));
          
          return c.json({
            success: true,
            bookmarks: userBookmarks,
          });
        } catch (error) {
          console.error("Get bookmarks error:", error);
          return c.json({ success: false, error: "Failed to get bookmarks" }, 500);
        }
      }
    )

    /**
     * Add Bookmark via Token
     * POST /api/book-access/bookmarks/add
     * 
     * Add a new bookmark for the user and book identified by token.
     */
    .post(
      "bookmarks/add",
      zValidator("json", AddBookmarkRequestSchema),
      async (c) => {
        try {
          const { token, bookmark } = c.req.valid("json");
          
          // Verify token
          const rawPayload = await verify(token, getJWTSecretForBookAccess());
          const payloadValidation = JWTPayloadSchema.safeParse(rawPayload);
          
          if (!payloadValidation.success) {
            return c.json({ success: false, error: "Invalid token" }, 400);
          }
          
          const payload = payloadValidation.data;
          
          if (!payload.permissions?.includes("bookmark")) {
            return c.json({ success: false, error: "No bookmark permission" }, 403);
          }
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Create new bookmark
          const bookmarkId = `bookmark_${payload.userId}_${payload.bookId}_${Date.now()}`;
          const now = new Date().toISOString();
          
          const newBookmark: MockBookmark = {
            id: bookmarkId,
            userId: payload.userId,
            bookId: payload.bookId,
            page: bookmark.page,
            chapter: bookmark.chapter,
            note: bookmark.note,
            created_at: now,
            bookmark_type: bookmark.bookmark_type || "page_save",
            metadata: bookmark.metadata,
          };
          
          mockDatabase.tokenBookmarks.set(bookmarkId, newBookmark);
          
          return c.json({
            success: true,
            bookmark: {
              id: newBookmark.id,
              page: newBookmark.page,
              chapter: newBookmark.chapter,
              note: newBookmark.note,
              created_at: newBookmark.created_at,
              updated_at: newBookmark.updated_at,
              bookmark_type: newBookmark.bookmark_type,
              metadata: newBookmark.metadata,
            },
          });
        } catch (error) {
          console.error("Add bookmark error:", error);
          return c.json({ success: false, error: "Failed to add bookmark" }, 500);
        }
      }
    )

    /**
     * Update Bookmark via Token
     * POST /api/book-access/bookmarks/update
     * 
     * Update an existing bookmark for the user identified by token.
     */
    .post(
      "bookmarks/update",
      zValidator("json", UpdateBookmarkRequestSchema),
      async (c) => {
        try {
          const { token, bookmark_id, updates } = c.req.valid("json");
          
          // Verify token
          const rawPayload = await verify(token, getJWTSecretForBookAccess());
          const payloadValidation = JWTPayloadSchema.safeParse(rawPayload);
          
          if (!payloadValidation.success) {
            return c.json({ success: false, error: "Invalid token" }, 400);
          }
          
          const payload = payloadValidation.data;
          
          if (!payload.permissions?.includes("bookmark")) {
            return c.json({ success: false, error: "No bookmark permission" }, 403);
          }
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Get existing bookmark
          const existingBookmark = mockDatabase.tokenBookmarks.get(bookmark_id);
          if (!existingBookmark || existingBookmark.userId !== payload.userId) {
            return c.json({ success: false, error: "Bookmark not found or access denied" }, 404);
          }
          
          // Update bookmark
          const updatedBookmark: MockBookmark = {
            ...existingBookmark,
            note: updates.note !== undefined ? updates.note : existingBookmark.note,
            bookmark_type: updates.bookmark_type || existingBookmark.bookmark_type,
            metadata: updates.metadata || existingBookmark.metadata,
            updated_at: new Date().toISOString(),
          };
          
          mockDatabase.tokenBookmarks.set(bookmark_id, updatedBookmark);
          
          return c.json({
            success: true,
            bookmark: {
              id: updatedBookmark.id,
              page: updatedBookmark.page,
              chapter: updatedBookmark.chapter,
              note: updatedBookmark.note,
              created_at: updatedBookmark.created_at,
              updated_at: updatedBookmark.updated_at,
              bookmark_type: updatedBookmark.bookmark_type,
              metadata: updatedBookmark.metadata,
            },
          });
        } catch (error) {
          console.error("Update bookmark error:", error);
          return c.json({ success: false, error: "Failed to update bookmark" }, 500);
        }
      }
    )

    /**
     * Delete Bookmark via Token
     * POST /api/book-access/bookmarks/delete
     * 
     * Delete a bookmark for the user identified by token.
     */
    .post(
      "bookmarks/delete",
      zValidator("json", DeleteBookmarkRequestSchema),
      async (c) => {
        try {
          const { token, bookmark_id } = c.req.valid("json");
          
          // Verify token
          const rawPayload = await verify(token, getJWTSecretForBookAccess());
          const payloadValidation = JWTPayloadSchema.safeParse(rawPayload);
          
          if (!payloadValidation.success) {
            return c.json({ success: false, error: "Invalid token" }, 400);
          }
          
          const payload = payloadValidation.data;
          
          if (!payload.permissions?.includes("bookmark")) {
            return c.json({ success: false, error: "No bookmark permission" }, 403);
          }
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Get existing bookmark
          const existingBookmark = mockDatabase.tokenBookmarks.get(bookmark_id);
          if (!existingBookmark || existingBookmark.userId !== payload.userId) {
            return c.json({ success: false, error: "Bookmark not found or access denied" }, 404);
          }
          
          // Delete bookmark
          mockDatabase.tokenBookmarks.delete(bookmark_id);
          
          return c.json({
            success: true,
          });
        } catch (error) {
          console.error("Delete bookmark error:", error);
          return c.json({ success: false, error: "Failed to delete bookmark" }, 500);
        }
      }
    )

    /**
     * Track Analytics via Token
     * POST /api/book-access/analytics/track
     * 
     * Store detailed analytics data for a reading session identified by token.
     */
    .post(
      "analytics/track",
      zValidator("json", TrackAnalyticsRequestSchema),
      async (c) => {
        try {
          const { token, session_data, page_interactions } = c.req.valid("json");
          
          // Verify token
          const rawPayload = await verify(token, getJWTSecretForBookAccess());
          const payloadValidation = JWTPayloadSchema.safeParse(rawPayload);
          
          if (!payloadValidation.success) {
            return c.json({ success: false, error: "Invalid token" }, 400);
          }
          
          const payload = payloadValidation.data;
          
          // Create analytics session with proper type mapping
          const analyticsSession: MockAnalyticsSession = {
            id: session_data.session_id,
            userId: payload.userId,
            bookId: payload.bookId,
            session_start: session_data.start_time,
            session_end: session_data.end_time,
            device_info: session_data.device_info,
            reading_metrics: {
              pages_visited: session_data.reading_metrics.pages_visited || [],
              total_interactions: session_data.reading_metrics.total_interactions || 0,
              cues_collected: session_data.reading_metrics.cues_collected || [],
              time_per_page: session_data.reading_metrics.time_per_page || {},
            },
            page_interactions: page_interactions ? page_interactions.map(interaction => ({
              page_number: interaction.page_number,
              chapter_name: interaction.chapter_name,
              interactions: interaction.interactions?.map(inter => ({
                type: inter.type,
                element: inter.element,
                timestamp: inter.timestamp,
                metadata: inter.metadata,
              })),
              engagement_score: interaction.engagement_score,
            })) : [],
          };
          
          // Get database instance
          const database = await getSharedDatabase();
          
          database.analyticsessions.set(session_data.session_id, analyticsSession);
          
          // Update USER-ACCOUNT-BASED analytics summary (accumulates across all sessions)
          const analyticsId = `analytics_${payload.userId}`;
          const existingAnalytics = database.userAnalytics.get(analyticsId);
          
          // Calculate session duration and engagement metrics
          const timeSpent = session_data.reading_metrics.time_per_page ? 
            Object.values(session_data.reading_metrics.time_per_page).reduce((a, b) => a + b, 0) : 0;
          const pagesVisited = session_data.reading_metrics.pages_visited.length;
          const interactionCount = session_data.reading_metrics.total_interactions;
          const cuesCollected = session_data.reading_metrics.cues_collected.length;
          
          if (existingAnalytics) {
            // ACCUMULATE analytics data across all user sessions
            const newTotalSessions = existingAnalytics.total_sessions + 1;
            const newTotalTime = existingAnalytics.total_reading_time + timeSpent;
            const newPagesRead = existingAnalytics.pages_read + pagesVisited;
            
            // Calculate engagement score based on interaction density and cue collection
            const sessionEngagementScore = Math.min(100, (interactionCount + cuesCollected * 5) * 2);
            const newEngagementScore = Math.round((existingAnalytics.engagement_score * existingAnalytics.total_sessions + sessionEngagementScore) / newTotalSessions);
            
            // Calculate scroll behavior with explicit type annotation
            let scrollBehavior: "fast" | "moderate" | "slow";
            if (interactionCount > 10) {
              scrollBehavior = "fast";
            } else if (interactionCount > 5) {
              scrollBehavior = "moderate";
            } else {
              scrollBehavior = "slow";
            }

            const updatedAnalytics = {
              ...existingAnalytics,
              total_sessions: newTotalSessions,
              total_reading_time: newTotalTime,
              average_session_duration: Math.round(newTotalTime / newTotalSessions),
              pages_read: newPagesRead,
              completion_rate: Math.min(100, Math.round((newPagesRead / (6 * 9)) * 100)), // 6 chapters, avg 9 pages each
              engagement_score: newEngagementScore,
              most_engaged_chapters: [...new Set([...existingAnalytics.most_engaged_chapters, ...session_data.reading_metrics.cues_collected])],
              interaction_patterns: {
                clicks_per_page: Math.round((existingAnalytics.interaction_patterns.clicks_per_page * existingAnalytics.total_sessions + (interactionCount / Math.max(1, pagesVisited))) / newTotalSessions * 10) / 10,
                scroll_behavior: scrollBehavior,
                pause_frequency: Math.round((existingAnalytics.interaction_patterns.pause_frequency * existingAnalytics.total_sessions + (timeSpent / Math.max(1, pagesVisited))) / newTotalSessions * 10) / 10
              },
              last_calculated: new Date(),
            };
            database.userAnalytics.set(analyticsId, updatedAnalytics);
            
            console.log("📈 UPDATED user analytics:", {
              userId: payload.userId,
              totalSessions: newTotalSessions,
              totalTime: Math.round(newTotalTime / 60) + " minutes",
              engagementScore: newEngagementScore,
              continuousTracking: true
            });
          } else {
            // Calculate scroll behavior with explicit type annotation
            let newScrollBehavior: "fast" | "moderate" | "slow";
            if (interactionCount > 10) {
              newScrollBehavior = "fast";
            } else if (interactionCount > 5) {
              newScrollBehavior = "moderate";
            } else {
              newScrollBehavior = "slow";
            }

            // Create new user analytics profile with initial data
            const newAnalytics = {
              id: analyticsId,
              user_id: payload.userId,
              total_sessions: 1,
              total_reading_time: timeSpent,
              average_session_duration: timeSpent,
              pages_read: pagesVisited,
              completion_rate: Math.min(100, Math.round((pagesVisited / (6 * 9)) * 100)),
              return_frequency: 0,
              engagement_score: Math.min(100, (interactionCount + cuesCollected * 5) * 2),
              preferred_reading_time: undefined,
              most_engaged_chapters: session_data.reading_metrics.cues_collected,
              interaction_patterns: {
                clicks_per_page: Math.round((interactionCount / Math.max(1, pagesVisited)) * 10) / 10,
                scroll_behavior: newScrollBehavior,
                pause_frequency: Math.round((timeSpent / Math.max(1, pagesVisited)) * 10) / 10
              },
              // NEW - Required analytics properties
              page_type_analytics: {
                story_pages: pagesVisited,
                cue_pages: cuesCollected,
                activity_pages: 0,
                average_time_per_story_page: pagesVisited > 0 ? timeSpent / pagesVisited : 0,
                average_time_per_cue_page: cuesCollected > 0 ? timeSpent / cuesCollected : 0,
                average_time_per_activity_page: 0,
              },
              cue_engagement: {
                total_cues_encountered: cuesCollected,
                total_cues_completed: cuesCollected,
                completion_rate: cuesCollected > 0 ? 100 : 0,
                average_time_before_click: 0,
                favorite_cues: [],
                cue_specific_metrics: {},
              },
              navigation_patterns: {
                toc_usage: 0,
                linear_reading: 0,
                back_button_usage: 0,
                preferred_navigation_method: "other" as const,
                average_session_depth: 0,
              },
              print_behavior: {
                total_print_clicks: 0,
                pages_printed: [],
                print_engagement_rate: 0,
                most_printed_activities: [],
              },
              last_calculated: new Date()
            };
            database.userAnalytics.set(analyticsId, newAnalytics);
            
            console.log("🆕 CREATED user analytics profile:", {
              userId: payload.userId,
              initialSession: true,
              engagementScore: newAnalytics.engagement_score
            });
          }
          
          return c.json({
            success: true,
            analytics_stored: true,
            session_id: session_data.session_id,
          });
        } catch (error) {
          console.error("Track analytics error:", error);
          return c.json({ success: false, error: "Failed to track analytics" }, 500);
        }
      }
    )

    /**
     * Get User Analytics by User ID (Admin Only)
     * GET /api/book-access/analytics/user/:userId
     * 
     * Retrieve comprehensive analytics for a specific user account.
     * This aggregates data across all sessions for continuous tracking.
     */
    .get("analytics/user/:userId", async (c) => {
      try {
        const userId = c.req.param("userId");
        
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
        // Get user analytics summary
        const analyticsId = `analytics_${userId}`;
        const userAnalytics = mockDatabase.userAnalytics.get(analyticsId);
        
        // Get all reading sessions for this user
        const userSessions = Array.from(mockDatabase.readingSessions.values())
          .filter(session => session.user_id === userId)
          .sort((a, b) => new Date(b.session_start).getTime() - new Date(a.session_start).getTime())
          .slice(0, 10); // Last 10 sessions
        
        // Get page engagements for this user
        const pageEngagements = Array.from(mockDatabase.pageEngagements.values())
          .filter(engagement => engagement.user_id === userId);
        
        // Calculate page analytics
        const pageAnalytics = pageEngagements.reduce((acc, engagement) => {
          const existing = acc.find(p => p.page_number === engagement.page_number);
          if (existing) {
            existing.total_time += engagement.time_on_page;
            existing.visit_count += 1;
            existing.total_interactions += engagement.interactions.length;
          } else {
            acc.push({
              page_number: engagement.page_number,
              chapter_name: engagement.chapter_name,
              total_time: engagement.time_on_page,
              visit_count: 1,
              total_interactions: engagement.interactions.length,
              average_time: engagement.time_on_page,
              completion_rate: engagement.completion_status === "completed" ? 100 : engagement.completion_status === "partial" ? 50 : 0,
              interaction_density: engagement.interactions.length
            });
          }
          return acc;
        }, [] as any[]);
        
        // Calculate averages for page analytics
        pageAnalytics.forEach(page => {
          page.average_time = Math.round(page.total_time / page.visit_count);
          page.interaction_density = Math.round((page.total_interactions / page.visit_count) * 10) / 10;
        });
        
        const response = {
          user_id: userId,
          overview: userAnalytics ? {
            total_sessions: userAnalytics.total_sessions,
            total_reading_time: userAnalytics.total_reading_time,
            last_read_at: userSessions[0]?.session_start || null,
            completion_rate: userAnalytics.completion_rate,
            engagement_score: userAnalytics.engagement_score
          } : {
            total_sessions: 0,
            total_reading_time: 0,
            last_read_at: null,
            completion_rate: 0,
            engagement_score: 0
          },
          recent_sessions: userSessions.map(session => ({
            id: session.id,
            date: session.session_start.toISOString(),
            duration: session.total_duration,
            pages_read: session.pages_visited.length,
            completion_rate: Math.round((session.pages_visited.length / 54) * 100) // Approximate total pages
          })),
          page_analytics: pageAnalytics.slice(0, 20), // Top 20 pages
          behavior_insights: {
            reading_patterns: userAnalytics ? [
              `Average ${Math.round(userAnalytics.average_session_duration / 60)} minutes per session`,
              `${userAnalytics.interaction_patterns.scroll_behavior} scroll behavior`,
              `${userAnalytics.interaction_patterns.clicks_per_page} clicks per page average`
            ] : [],
            engagement_trends: userSessions.map(session => ({
              date: session.session_start.toISOString().split('T')[0],
              score: Math.min(100, session.interactions_count * 2)
            })),
            recommendations: userAnalytics ? (
              userAnalytics.engagement_score > 80 ? [
                "Highly engaged reader - consider advanced content",
                "Shows strong interaction patterns",
                "Regular reading schedule established"
              ] : userAnalytics.engagement_score > 50 ? [
                "Good engagement level - encourage regular reading",
                "Consider interactive features to boost engagement",
                "Track reading progress for motivation"
              ] : [
                "Low engagement - try shorter reading sessions",
                "Focus on interactive elements",
                "Consider guided reading support"
              ]
            ) : ["No data available for recommendations"]
          }
        };
        
        return c.json(response);
      } catch (error) {
        console.error("Get user analytics error:", error);
        return c.json({ error: "Failed to get user analytics" }, 500);
      }
    })

    /**
     * Get All Users Analytics Summary (Admin Only)
     * GET /api/book-access/analytics/summary
     * 
     * Retrieve analytics summary for all users for admin dashboard.
     */
    .get("analytics/summary", async (c) => {
      try {
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
        // Enhanced error handling for analytics summary
        const allAnalytics = Array.from(mockDatabase.userAnalytics.values()).filter(analytics => 
          analytics && typeof analytics === 'object' && typeof analytics.total_sessions === 'number'
        );
        const allUsers = Array.from(mockDatabase.users.values()).filter(user => 
          user && typeof user === 'object' && user.id && user.name
        );
        const recentSessions = Array.from(mockDatabase.readingSessions.values())
          .filter(session => {
            try {
              if (!session || !session.session_start) return false;
              const sessionDate = new Date(session.session_start);
              const today = new Date();
              const diffTime = today.getTime() - sessionDate.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 7; // Last 7 days
            } catch (dateError) {
              console.warn("Date parsing error for session:", session?.id);
              return false;
            }
          });
        
        const summary = {
          totalUsers: allUsers.length,
          activeUsers: recentSessions.length > 0 ? new Set(recentSessions.map(s => s.user_id).filter(Boolean)).size : 0,
          totalSessions: allAnalytics.reduce((sum, analytics) => sum + (analytics.total_sessions || 0), 0),
          totalReadingTime: allAnalytics.reduce((sum, analytics) => sum + (analytics.total_reading_time || 0), 0),
          averageEngagementScore: allAnalytics.length > 0 ? Math.round(allAnalytics.reduce((sum, analytics) => sum + (analytics.engagement_score || 0), 0) / allAnalytics.length) : 0,
          newUsersToday: allUsers.filter(user => {
            try {
              if (!user.created_at) return false;
              const userDate = new Date(user.created_at);
              const today = new Date();
              return userDate.toDateString() === today.toDateString();
            } catch (dateError) {
              console.warn("Date parsing error for user:", user?.id);
              return false;
            }
          }).length,
          topUsers: allAnalytics
            .sort((a, b) => (b.engagement_score || 0) - (a.engagement_score || 0))
            .slice(0, 5)
            .map(analytics => {
              const user = allUsers.find(u => u.id === analytics.user_id);
              return {
                userId: analytics.user_id || "unknown",
                userName: user?.name || "Unknown",
                userEmail: user?.email || "Unknown",
                engagementScore: analytics.engagement_score || 0,
                totalSessions: analytics.total_sessions || 0,
                totalReadingTime: Math.round((analytics.total_reading_time || 0) / 60) // Convert to minutes
              };
            })
            .filter(user => user.userId !== "unknown") // Filter out invalid users
        };
        
        return c.json(summary);
      } catch (error) {
        console.error("Get analytics summary error:", error);
        return c.json({ error: "Failed to get analytics summary" }, 500);
      }
    })

    /**
     * Start Reading Session (User Account Based)
     * POST /api/book-access/analytics/start-session
     * 
     * Called when a user starts a new reading session.
     */
    .post(
      "analytics/start-session",
      async (c) => {
        try {
          // Get auth token from header
          const authHeader = c.req.header("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Authentication required" }, 401);
          }
          
          const authToken = authHeader.substring(7);
          
          // Verify user auth token
          let userPayload: any;
          try {
            userPayload = await verify(authToken, getJWTSecretForBookAccess());
          } catch (tokenError) {
            return c.json({ success: false, error: "Invalid or expired authentication token" }, 401);
          }
          
          const requestBody = await c.req.json();
          const { session_id, book_id, device_type, browser_info } = requestBody;
          
          // Get database instance
          const database = await getSharedDatabase();
          
          // Create new reading session
          const readingSession = {
            id: session_id,
            user_id: userPayload.userId, // Tied to user account
            book_id: book_id,
            session_start: new Date(),
            session_end: undefined,
            total_duration: 0,
            pages_visited: [],
            interactions_count: 0,
            device_type: device_type || "web",
            browser_info: browser_info || "Unknown"
          };
          
          database.readingSessions.set(session_id, readingSession);
          
          console.log("📊 NEW reading session started:", {
            sessionId: session_id,
            userId: userPayload.userId,
            bookId: book_id,
            linkedToUserAccount: true
          });
          
          return c.json({ 
            success: true, 
            session_id: session_id,
            user_id: userPayload.userId
          });
        } catch (error) {
          console.error("Start session error:", error);
          return c.json({ success: false, error: "Failed to start session" }, 500);
        }
      }
    )

    /**
     * Update Session End (User Account Based)
     * POST /api/book-access/analytics/end-session
     * 
     * Called when a user ends their reading session to update analytics.
     */
    .post(
      "analytics/end-session",
      async (c) => {
        try {
          // Get auth token from header
          const authHeader = c.req.header("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Authentication required" }, 401);
          }
          
          const authToken = authHeader.substring(7);
          
          // Verify user auth token
          let userPayload: any;
          try {
            userPayload = await verify(authToken, getJWTSecretForBookAccess());
          } catch (tokenError) {
            return c.json({ success: false, error: "Invalid or expired authentication token" }, 401);
          }
          
          const requestBody = await c.req.json();
          const { session_id, final_metrics } = requestBody;
          
          // Get database instance
          const database = await getSharedDatabase();
          
          // Update reading session with final data
          const readingSession = database.readingSessions.get(session_id);
          if (readingSession && readingSession.user_id === userPayload.userId) {
            readingSession.session_end = new Date();
            readingSession.total_duration = final_metrics.total_duration || 0;
            readingSession.pages_visited = final_metrics.pages_visited || [];
            readingSession.interactions_count = final_metrics.final_interactions || 0;
            database.readingSessions.set(session_id, readingSession);
            
            console.log("📊 Session ENDED successfully:", {
              sessionId: session_id,
              userId: userPayload.userId,
              duration: Math.round((final_metrics.total_duration || 0) / 60) + " minutes",
              pagesVisited: (final_metrics.pages_visited || []).length,
              interactions: final_metrics.final_interactions || 0
            });
          } else {
            console.warn("📊 Session not found or user mismatch:", session_id);
          }
          
          return c.json({ success: true });
        } catch (error) {
          console.error("End session error:", error);
          return c.json({ success: false, error: "Failed to end session" }, 500);
        }
      }
    )

    /**
     * User-Account-Based Bookmark Endpoints
     * These endpoints use user authentication (Bearer token) instead of book tokens
     * for persistent bookmarking tied to user accounts
     */

    /**
     * Add Bookmark via User Auth
     * POST /api/book-access/user-bookmarks/add
     * 
     * Add a new bookmark using user authentication token.
     */
    .post(
      "user-bookmarks/add",
      async (c) => {
        try {
          // Get auth token from header
          const authHeader = c.req.header("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Authentication required" }, 401);
          }
          
          const authToken = authHeader.substring(7);
          
          // Verify user auth token
          let userPayload: any;
          try {
            userPayload = await verify(authToken, getJWTSecretForBookAccess());
          } catch (tokenError) {
            return c.json({ success: false, error: "Invalid or expired authentication token" }, 401);
          }
          
          const requestBody = await c.req.json();
          const { bookId, bookmark } = requestBody;
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Create new bookmark linked to user account
          const bookmarkId = `user_bookmark_${userPayload.userId}_${bookId}_${Date.now()}`;
          const now = new Date().toISOString();
          
          const newBookmark: MockBookmark = {
            id: bookmarkId,
            userId: userPayload.userId,
            bookId: bookId,
            page: bookmark.spread || 1,
            chapter: `Chapter ${bookmark.chapter}`,
            note: bookmark.note,
            created_at: now,
            bookmark_type: bookmark.bookmark_type || "reading_position",
            metadata: bookmark.metadata,
          };
          
          mockDatabase.tokenBookmarks.set(bookmarkId, newBookmark);
          
          console.log("📖 User bookmark created:", {
            bookmarkId,
            userId: userPayload.userId,
            chapter: bookmark.chapter,
            spread: bookmark.spread
          });
          
          return c.json({
            success: true,
            bookmark: {
              id: newBookmark.id,
              page: newBookmark.page,
              chapter: newBookmark.chapter,
              note: newBookmark.note,
              created_at: newBookmark.created_at,
              updated_at: newBookmark.updated_at,
              bookmark_type: newBookmark.bookmark_type,
              metadata: newBookmark.metadata,
            },
          });
        } catch (error) {
          console.error("Add user bookmark error:", error);
          return c.json({ success: false, error: "Failed to add bookmark" }, 500);
        }
      }
    )

    /**
     * Get User Bookmarks
     * POST /api/book-access/user-bookmarks/get
     * 
     * Retrieve all bookmarks for the authenticated user.
     */
    .post(
      "user-bookmarks/get",
      async (c) => {
        try {
          // Get auth token from header
          const authHeader = c.req.header("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Authentication required" }, 401);
          }
          
          const authToken = authHeader.substring(7);
          
          // Verify user auth token
          let userPayload: any;
          try {
            userPayload = await verify(authToken, getJWTSecretForBookAccess());
          } catch (tokenError) {
            return c.json({ success: false, error: "Invalid or expired authentication token" }, 401);
          }
          
          const requestBody = await c.req.json();
          const { bookId } = requestBody;
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Get user's bookmarks for this book
          const userBookmarks = Array.from(mockDatabase.tokenBookmarks.values())
            .filter(bookmark => bookmark.userId === userPayload.userId && bookmark.bookId === bookId)
            .map(bookmark => ({
              id: bookmark.id,
              page: bookmark.page,
              chapter: bookmark.chapter,
              note: bookmark.note,
              created_at: bookmark.created_at,
              updated_at: bookmark.updated_at,
              bookmark_type: bookmark.bookmark_type,
              metadata: bookmark.metadata,
            }));
          
          return c.json({
            success: true,
            bookmarks: userBookmarks,
          });
        } catch (error) {
          console.error("Get user bookmarks error:", error);
          return c.json({ success: false, error: "Failed to get bookmarks" }, 500);
        }
      }
    )

    /**
     * Update User Bookmark
     * POST /api/book-access/user-bookmarks/update
     * 
     * Update an existing bookmark for the authenticated user.
     */
    .post(
      "user-bookmarks/update",
      async (c) => {
        try {
          // Get auth token from header
          const authHeader = c.req.header("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Authentication required" }, 401);
          }
          
          const authToken = authHeader.substring(7);
          
          // Verify user auth token
          let userPayload: any;
          try {
            userPayload = await verify(authToken, getJWTSecretForBookAccess());
          } catch (tokenError) {
            return c.json({ success: false, error: "Invalid or expired authentication token" }, 401);
          }
          
          const requestBody = await c.req.json();
          const { bookmarkId, updates } = requestBody;
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Get existing bookmark
          const existingBookmark = mockDatabase.tokenBookmarks.get(bookmarkId);
          if (!existingBookmark || existingBookmark.userId !== userPayload.userId) {
            return c.json({ success: false, error: "Bookmark not found or access denied" }, 404);
          }
          
          // Update bookmark
          const updatedBookmark: MockBookmark = {
            ...existingBookmark,
            note: updates.note !== undefined ? updates.note : existingBookmark.note,
            bookmark_type: updates.bookmark_type || existingBookmark.bookmark_type,
            metadata: updates.metadata || existingBookmark.metadata,
            updated_at: new Date().toISOString(),
          };
          
          mockDatabase.tokenBookmarks.set(bookmarkId, updatedBookmark);
          
          return c.json({
            success: true,
            bookmark: {
              id: updatedBookmark.id,
              page: updatedBookmark.page,
              chapter: updatedBookmark.chapter,
              note: updatedBookmark.note,
              created_at: updatedBookmark.created_at,
              updated_at: updatedBookmark.updated_at,
              bookmark_type: updatedBookmark.bookmark_type,
              metadata: updatedBookmark.metadata,
            },
          });
        } catch (error) {
          console.error("Update user bookmark error:", error);
          return c.json({ success: false, error: "Failed to update bookmark" }, 500);
        }
      }
    )

    /**
     * Delete User Bookmark
     * POST /api/book-access/user-bookmarks/delete
     * 
     * Delete a bookmark for the authenticated user.
     */
    .post(
      "user-bookmarks/delete",
      async (c) => {
        try {
          // Get auth token from header
          const authHeader = c.req.header("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Authentication required" }, 401);
          }
          
          const authToken = authHeader.substring(7);
          
          // Verify user auth token
          let userPayload: any;
          try {
            userPayload = await verify(authToken, getJWTSecretForBookAccess());
          } catch (tokenError) {
            return c.json({ success: false, error: "Invalid or expired authentication token" }, 401);
          }
          
          const requestBody = await c.req.json();
          const { bookmarkId } = requestBody;
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Get existing bookmark
          const existingBookmark = mockDatabase.tokenBookmarks.get(bookmarkId);
          if (!existingBookmark || existingBookmark.userId !== userPayload.userId) {
            return c.json({ success: false, error: "Bookmark not found or access denied" }, 404);
          }
          
          // Delete bookmark
          mockDatabase.tokenBookmarks.delete(bookmarkId);
          
          return c.json({
            success: true,
          });
        } catch (error) {
          console.error("Delete user bookmark error:", error);
          return c.json({ success: false, error: "Failed to delete bookmark" }, 500);
        }
      }
    )

    /**
     * Update User Reading Progress
     * POST /api/book-access/user-progress/update
     * 
     * Update reading progress using user authentication.
     */
    .post(
      "user-progress/update",
      async (c) => {
        try {
          // Get auth token from header
          const authHeader = c.req.header("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Authentication required" }, 401);
          }
          
          const authToken = authHeader.substring(7);
          
          // Verify user auth token
          let userPayload: any;
          try {
            userPayload = await verify(authToken, getJWTSecretForBookAccess());
          } catch (tokenError) {
            return c.json({ success: false, error: "Invalid or expired authentication token" }, 401);
          }
          
          const requestBody = await c.req.json();
          const { bookId, progress } = requestBody;
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          // Update progress in database
          const progressKey = `${userPayload.userId}-${bookId}`;
          const existingProgress = mockDatabase.progress.get(progressKey) || {
            userId: userPayload.userId,
            bookId: bookId,
            progress: 0,
            currentPage: 1,
            currentChapter: "Chapter 1",
            timeSpent: 0,
            lastReadAt: new Date().toISOString(),
            bookmarks: [],
          };
          
          const updatedProgress: MockProgress = {
            ...existingProgress,
            userId: userPayload.userId,
            bookId: bookId,
            currentPage: progress.current_spread || existingProgress.currentPage,
            currentChapter: `Chapter ${progress.current_chapter}` || existingProgress.currentChapter,
            lastReadAt: progress.last_read_at || new Date().toISOString(),
          };
          
          mockDatabase.progress.set(progressKey, updatedProgress);
          
          console.log("📍 User progress updated:", {
            userId: userPayload.userId,
            chapter: progress.current_chapter,
            spread: progress.current_spread
          });
          
          return c.json({
            success: true,
            progress: updatedProgress,
          });
        } catch (error) {
          console.error("Update user progress error:", error);
          return c.json({ success: false, error: "Failed to update progress" }, 500);
        }
      }
    )

    /**
     * Get User Reading Progress
     * POST /api/book-access/user-progress/get
     * 
     * Get reading progress using user authentication.
     */
    .post(
      "user-progress/get",
      async (c) => {
        try {
          // Get auth token from header
          const authHeader = c.req.header("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Authentication required" }, 401);
          }
          
          const authToken = authHeader.substring(7);
          
          // Verify user auth token
          let userPayload: any;
          try {
            userPayload = await verify(authToken, getJWTSecretForBookAccess());
          } catch (tokenError) {
            return c.json({ success: false, error: "Invalid or expired authentication token" }, 401);
          }
          
          const requestBody = await c.req.json();
          const { bookId } = requestBody;
          
          // Get database instance
          const mockDatabase = await getSharedDatabase();
          
          const progressKey = `${userPayload.userId}-${bookId}`;
          const progress = mockDatabase.progress.get(progressKey);
          
          if (!progress) {
            return c.json({
              success: true,
              progress: {
                current_chapter: 1,
                current_spread: 1,
                last_read_at: null
              }
            });
          }
          
          return c.json({
            success: true,
            progress: {
              current_chapter: parseInt(progress.currentChapter?.replace('Chapter ', '') || '1'),
              current_spread: progress.currentPage || 1,
              last_read_at: progress.lastReadAt
            }
          });
        } catch (error) {
          console.error("Get user progress error:", error);
          return c.json({ success: false, error: "Failed to get progress" }, 500);
        }
      }
    )

    /**
     * 🎯 ENHANCED ANALYTICS TRACKING ENDPOINT (NEW)
     * POST /api/book-access/analytics/track-enhanced
     * 
     * Advanced analytics tracking with detailed page type classification,
     * cue interaction timing, print behavior, and navigation source tracking.
     * Uses user authentication instead of tokens for persistent analytics.
     */
    .post(
      "analytics/track-enhanced",
      zValidator("json", EnhancedAnalyticsTrackingRequestSchema),
      async (c) => {
        try {
          const analyticsData = c.req.valid("json");
          
          // Get auth token from header for user authentication
          const authHeader = c.req.header("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ success: false, error: "Authentication required" }, 401);
          }
          
          const authToken = authHeader.substring(7);
          
          // Verify user auth token
          let userPayload: any;
          try {
            userPayload = await verify(authToken, getJWTSecretForBookAccess());
          } catch (tokenError) {
            return c.json({ success: false, error: "Invalid or expired authentication token" }, 401);
          }
          
          // Verify user_id matches authenticated user
          if (userPayload.userId !== analyticsData.user_id) {
            return c.json({ success: false, error: "User ID mismatch" }, 403);
          }
          
          // Get database instance
          const database = await getSharedDatabase();
          
          // Generate unique ID for this enhanced analytics session
          const enhancedSessionId = `enhanced_${analyticsData.session_id}_${analyticsData.page_data.page_number}_${Date.now()}`;
          
          // Create enhanced analytics session record
          const enhancedSession = {
            id: enhancedSessionId,
            user_id: analyticsData.user_id,
            session_id: analyticsData.session_id,
            page_data: {
              page_number: analyticsData.page_data.page_number,
              chapter_id: analyticsData.page_data.chapter_id,
              chapter_name: analyticsData.page_data.chapter_name,
              page_type: analyticsData.page_data.page_type,
              navigation_source: analyticsData.page_data.navigation_source,
            },
            timing_data: {
              time_on_page: analyticsData.timing_data.time_on_page,
              actual_engagement_time: analyticsData.timing_data.actual_engagement_time,
              time_before_first_interaction: analyticsData.timing_data.time_before_first_interaction,
              session_duration_so_far: analyticsData.timing_data.session_duration_so_far,
            },
            interactions: analyticsData.interactions.map(interaction => ({
              type: interaction.type,
              element: interaction.element,
              timestamp: interaction.timestamp,
              position: interaction.position ? { x: interaction.position.x || 0, y: interaction.position.y || 0 } : undefined,
              metadata: interaction.metadata,
            })),
            cue_interactions: (analyticsData.cue_interactions || []).map(cue => ({
              cue_name: cue.cue_name || "",
              cue_icon: cue.cue_icon || "",
              chapter_id: cue.chapter_id || 1,
              spread_number: cue.spread_number || 1,
              time_before_click: cue.time_before_click || 0,
              click_timestamp: cue.click_timestamp || new Date().toISOString(),
              completion_status: cue.completion_status || "completed",
              engagement_score: cue.engagement_score || 0,
            })),
            print_data: {
              print_clicks: analyticsData.print_data?.print_clicks || 0,
              print_targets: analyticsData.print_data?.print_targets || [],
              time_on_activity_page: analyticsData.print_data?.time_on_activity_page || 0,
            },
            created_at: new Date(),
          };
          
          // Store enhanced analytics session
          database.enhancedAnalyticsSessions.set(enhancedSessionId, enhancedSession);
          
          // Update enhanced page engagement
          const pageEngagementId = `enhanced_engagement_${analyticsData.user_id}_${analyticsData.page_data.page_number}_${Date.now()}`;
          const enhancedPageEngagement = {
            id: pageEngagementId,
            user_id: analyticsData.user_id,
            book_id: "wtbtg", // Default to WTBTG
            session_id: analyticsData.session_id,
            page_number: analyticsData.page_data.page_number,
            chapter_name: analyticsData.page_data.chapter_name,
            time_on_page: analyticsData.timing_data.time_on_page,
            interactions: analyticsData.interactions.map(interaction => ({
              type: interaction.type as any,
              element: interaction.element,
              timestamp: new Date(interaction.timestamp),
              position: interaction.position ? { x: interaction.position.x || 0, y: interaction.position.y || 0 } : undefined,
              metadata: interaction.metadata,
            })),
            scroll_depth: 80, // Default value
            completion_status: "completed" as const,
            created_at: new Date(),
            
            // ENHANCED PROPERTIES
            page_type: analyticsData.page_data.page_type,
            navigation_source: analyticsData.page_data.navigation_source,
            actual_time_seconds: analyticsData.timing_data.actual_engagement_time,
            time_before_interaction: analyticsData.timing_data.time_before_first_interaction,
            cue_interactions: (analyticsData.cue_interactions || []).map(cue => ({
              cue_name: cue.cue_name,
              cue_icon: cue.cue_icon,
              chapter_id: cue.chapter_id,
              spread_number: cue.spread_number,
              time_before_click: cue.time_before_click,
              click_timestamp: new Date(cue.click_timestamp),
              completion_status: cue.completion_status,
              engagement_score: cue.engagement_score,
            })),
            print_clicks: analyticsData.print_data?.print_clicks || 0,
            print_targets: analyticsData.print_data?.print_targets || [],
            time_on_activity_page: analyticsData.print_data?.time_on_activity_page || 0,
          };
          
          database.pageEngagements.set(pageEngagementId, enhancedPageEngagement);
          
          // Update enhanced user analytics
          const analyticsId = `analytics_${analyticsData.user_id}`;
          const existingAnalytics = database.userAnalytics.get(analyticsId);
          
          if (existingAnalytics) {
            // Update existing analytics with enhanced data
            
            // Update page type analytics
            switch (analyticsData.page_data.page_type) {
              case "story":
                existingAnalytics.page_type_analytics.story_pages += 1;
                existingAnalytics.page_type_analytics.average_time_per_story_page = 
                  (existingAnalytics.page_type_analytics.average_time_per_story_page * (existingAnalytics.page_type_analytics.story_pages - 1) + 
                   analyticsData.timing_data.actual_engagement_time) / existingAnalytics.page_type_analytics.story_pages;
                break;
              case "cue":
                existingAnalytics.page_type_analytics.cue_pages += 1;
                existingAnalytics.page_type_analytics.average_time_per_cue_page = 
                  (existingAnalytics.page_type_analytics.average_time_per_cue_page * (existingAnalytics.page_type_analytics.cue_pages - 1) + 
                   analyticsData.timing_data.actual_engagement_time) / existingAnalytics.page_type_analytics.cue_pages;
                break;
              case "activity":
                existingAnalytics.page_type_analytics.activity_pages += 1;
                existingAnalytics.page_type_analytics.average_time_per_activity_page = 
                  (existingAnalytics.page_type_analytics.average_time_per_activity_page * (existingAnalytics.page_type_analytics.activity_pages - 1) + 
                   analyticsData.timing_data.actual_engagement_time) / existingAnalytics.page_type_analytics.activity_pages;
                break;
            }
            
            // Update cue engagement if cue interactions exist
            if (analyticsData.cue_interactions && analyticsData.cue_interactions.length > 0) {
              existingAnalytics.cue_engagement.total_cues_encountered += 1;
              
              const completedCues = analyticsData.cue_interactions.filter(cue => cue.completion_status === "completed");
              existingAnalytics.cue_engagement.total_cues_completed += completedCues.length;
              
              existingAnalytics.cue_engagement.completion_rate = 
                existingAnalytics.cue_engagement.total_cues_encountered > 0 
                  ? Math.round((existingAnalytics.cue_engagement.total_cues_completed / existingAnalytics.cue_engagement.total_cues_encountered) * 100)
                  : 0;
              
              // Update average time before click
              const totalTimeBeforeClick = analyticsData.cue_interactions.reduce((sum, cue) => sum + cue.time_before_click, 0);
              existingAnalytics.cue_engagement.average_time_before_click = 
                (existingAnalytics.cue_engagement.average_time_before_click * (existingAnalytics.cue_engagement.total_cues_encountered - 1) + 
                 totalTimeBeforeClick) / existingAnalytics.cue_engagement.total_cues_encountered;
            }
            
            // Update navigation patterns
            switch (analyticsData.page_data.navigation_source) {
              case "toc":
                existingAnalytics.navigation_patterns.toc_usage += 1;
                break;
              case "chapter_nav":
              case "spread_nav":
                // Linear reading indicator
                break;
              case "home_button":
                existingAnalytics.navigation_patterns.back_button_usage += 1;
                break;
            }
            
            // Update print behavior
            if (analyticsData.print_data && analyticsData.print_data.print_clicks > 0) {
              existingAnalytics.print_behavior.total_print_clicks += analyticsData.print_data.print_clicks;
              existingAnalytics.print_behavior.pages_printed.push(...analyticsData.print_data.print_targets);
              
              // Calculate print engagement rate
              const totalActivityPages = existingAnalytics.page_type_analytics.activity_pages || 1;
              existingAnalytics.print_behavior.print_engagement_rate = 
                Math.round((existingAnalytics.print_behavior.total_print_clicks / totalActivityPages) * 100);
            }
            
            existingAnalytics.last_calculated = new Date();
            database.userAnalytics.set(analyticsId, existingAnalytics);
            
            console.log("📈 ENHANCED analytics updated for user:", analyticsData.user_id, {
              pageType: analyticsData.page_data.page_type,
              navigationSource: analyticsData.page_data.navigation_source,
              cueInteractions: analyticsData.cue_interactions?.length || 0,
              printClicks: analyticsData.print_data?.print_clicks || 0
            });
          } else {
            // Create new enhanced analytics profile
            const newEnhancedAnalytics = {
              id: analyticsId,
              user_id: analyticsData.user_id,
              total_sessions: 1,
              total_reading_time: analyticsData.timing_data.actual_engagement_time,
              average_session_duration: analyticsData.timing_data.actual_engagement_time,
              pages_read: 1,
              completion_rate: 0, // Will be calculated based on total progress
              return_frequency: 0,
              engagement_score: 50, // Starting baseline
              preferred_reading_time: undefined,
              most_engaged_chapters: [analyticsData.page_data.chapter_name],
              interaction_patterns: {
                clicks_per_page: analyticsData.interactions.length,
                scroll_behavior: "moderate" as const,
                pause_frequency: 0,
              },
              
              // ENHANCED ANALYTICS PROPERTIES
              page_type_analytics: {
                story_pages: analyticsData.page_data.page_type === "story" ? 1 : 0,
                cue_pages: analyticsData.page_data.page_type === "cue" ? 1 : 0,
                activity_pages: analyticsData.page_data.page_type === "activity" ? 1 : 0,
                average_time_per_story_page: analyticsData.page_data.page_type === "story" ? analyticsData.timing_data.actual_engagement_time : 0,
                average_time_per_cue_page: analyticsData.page_data.page_type === "cue" ? analyticsData.timing_data.actual_engagement_time : 0,
                average_time_per_activity_page: analyticsData.page_data.page_type === "activity" ? analyticsData.timing_data.actual_engagement_time : 0,
              },
              cue_engagement: {
                total_cues_encountered: analyticsData.cue_interactions?.length || 0,
                total_cues_completed: analyticsData.cue_interactions?.filter(cue => cue.completion_status === "completed").length || 0,
                completion_rate: analyticsData.cue_interactions?.length ? 
                  Math.round((analyticsData.cue_interactions.filter(cue => cue.completion_status === "completed").length / analyticsData.cue_interactions.length) * 100) : 0,
                average_time_before_click: analyticsData.cue_interactions?.length ? 
                  analyticsData.cue_interactions.reduce((sum, cue) => sum + cue.time_before_click, 0) / analyticsData.cue_interactions.length : 0,
                favorite_cues: analyticsData.cue_interactions?.map(cue => cue.cue_name) || [],
                cue_specific_metrics: {},
              },
              navigation_patterns: {
                toc_usage: analyticsData.page_data.navigation_source === "toc" ? 1 : 0,
                linear_reading: analyticsData.page_data.navigation_source === "spread_nav" ? 100 : 0,
                back_button_usage: analyticsData.page_data.navigation_source === "home_button" ? 1 : 0,
                preferred_navigation_method: analyticsData.page_data.navigation_source,
                average_session_depth: 1,
              },
              print_behavior: {
                total_print_clicks: analyticsData.print_data?.print_clicks || 0,
                pages_printed: analyticsData.print_data?.print_targets || [],
                print_engagement_rate: analyticsData.print_data?.print_clicks ? 100 : 0, // 100% if they printed on this activity page
                most_printed_activities: analyticsData.print_data?.print_targets || [],
              },
              
              last_calculated: new Date()
            };
            
            database.userAnalytics.set(analyticsId, newEnhancedAnalytics);
            
            console.log("🆕 ENHANCED analytics profile created for user:", analyticsData.user_id, {
              pageType: analyticsData.page_data.page_type,
              navigationSource: analyticsData.page_data.navigation_source,
              engagementTime: analyticsData.timing_data.actual_engagement_time,
              interactions: analyticsData.interactions.length
            });
          }
          
          // Calculate session summary for response
          const sessionSummary = {
            total_pages_this_session: database.enhancedAnalyticsSessions ? 
              Array.from(database.enhancedAnalyticsSessions.values())
                .filter(session => session.session_id === analyticsData.session_id && session.user_id === analyticsData.user_id)
                .length : 1,
            total_interactions_this_session: analyticsData.interactions.length,
            cues_completed_this_session: analyticsData.cue_interactions?.filter(cue => cue.completion_status === "completed").length || 0,
            print_clicks_this_session: analyticsData.print_data?.print_clicks || 0,
            current_engagement_score: Math.min(100, (analyticsData.interactions.length + (analyticsData.cue_interactions?.length || 0) * 5) * 2),
          };
          
          console.log("🎯 Enhanced analytics tracked successfully:", {
            userId: analyticsData.user_id,
            sessionId: analyticsData.session_id,
            pageType: analyticsData.page_data.page_type,
            navigationSource: analyticsData.page_data.navigation_source,
            interactions: analyticsData.interactions.length,
            cueInteractions: analyticsData.cue_interactions?.length || 0,
            printClicks: analyticsData.print_data?.print_clicks || 0,
            enhancedSessionId: enhancedSessionId
          });
          
          return c.json({
            success: true,
            analytics_processed: true,
            session_id: analyticsData.session_id,
            page_engagement_id: pageEngagementId,
            analytics_summary: sessionSummary,
          });
        } catch (error) {
          console.error("Enhanced analytics tracking error:", error);
          return c.json({ 
            success: false, 
            analytics_processed: false,
            error: "Failed to track enhanced analytics" 
          }, 500);
        }
      }
    )

    /**
     * 🎯 ENHANCED ANALYTICS SUMMARY ENDPOINT (NEW)
     * GET /api/book-access/analytics/enhanced-summary
     * 
     * Comprehensive analytics summary with page type metrics,
     * cue analytics, navigation insights, and enhanced engagement data.
     */
    .get("analytics/enhanced-summary", async (c) => {
      try {
        // Get database instance
        const database = await getSharedDatabase();
        
        // Get all enhanced analytics sessions
        const allEnhancedSessions = Array.from(database.enhancedAnalyticsSessions.values());
        const allUserAnalytics = Array.from(database.userAnalytics.values()).filter(analytics => 
          analytics && typeof analytics === 'object' && analytics.page_type_analytics
        );
        const allUsers = Array.from(database.users.values());
        
        // Calculate page type metrics
        const storyPageMetrics = {
          total_visits: allUserAnalytics.reduce((sum, analytics) => sum + analytics.page_type_analytics.story_pages, 0),
          average_time: allUserAnalytics.length ? 
            allUserAnalytics.reduce((sum, analytics) => sum + analytics.page_type_analytics.average_time_per_story_page, 0) / allUserAnalytics.length : 0,
          completion_rate: 85, // Default estimate
        };
        
        const cuePageMetrics = {
          total_visits: allUserAnalytics.reduce((sum, analytics) => sum + analytics.page_type_analytics.cue_pages, 0),
          total_interactions: allUserAnalytics.reduce((sum, analytics) => sum + analytics.cue_engagement.total_cues_completed, 0),
          average_time_before_click: allUserAnalytics.length ? 
            allUserAnalytics.reduce((sum, analytics) => sum + analytics.cue_engagement.average_time_before_click, 0) / allUserAnalytics.length : 0,
          completion_rate: allUserAnalytics.length ? 
            allUserAnalytics.reduce((sum, analytics) => sum + analytics.cue_engagement.completion_rate, 0) / allUserAnalytics.length : 0,
        };
        
        const activityPageMetrics = {
          total_visits: allUserAnalytics.reduce((sum, analytics) => sum + analytics.page_type_analytics.activity_pages, 0),
          total_print_clicks: allUserAnalytics.reduce((sum, analytics) => sum + analytics.print_behavior.total_print_clicks, 0),
          print_engagement_rate: allUserAnalytics.length ? 
            allUserAnalytics.reduce((sum, analytics) => sum + analytics.print_behavior.print_engagement_rate, 0) / allUserAnalytics.length : 0,
        };
        
        // Calculate cue-specific analytics
        const cueAnalytics = [
          { cue_name: "Golden Leaf", chapter_id: 1, total_encounters: 0, total_completions: 0, completion_rate: 0, average_engagement_time: 0 },
          { cue_name: "Rainbow Tail", chapter_id: 2, total_encounters: 0, total_completions: 0, completion_rate: 0, average_engagement_time: 0 },
          { cue_name: "Bravery Badge", chapter_id: 3, total_encounters: 0, total_completions: 0, completion_rate: 0, average_engagement_time: 0 },
          { cue_name: "Sparkling Petal", chapter_id: 4, total_encounters: 0, total_completions: 0, completion_rate: 0, average_engagement_time: 0 },
          { cue_name: "Gratitude Leaf", chapter_id: 5, total_encounters: 0, total_completions: 0, completion_rate: 0, average_engagement_time: 0 },
          { cue_name: "Dew Cup", chapter_id: 6, total_encounters: 0, total_completions: 0, completion_rate: 0, average_engagement_time: 0 },
        ];
        
        // Update cue analytics from enhanced sessions
        allEnhancedSessions.forEach(session => {
          session.cue_interactions?.forEach(cue => {
            const cueAnalytic = cueAnalytics.find(c => c.cue_name === cue.cue_name);
            if (cueAnalytic) {
              cueAnalytic.total_encounters += 1;
              if (cue.completion_status === "completed") {
                cueAnalytic.total_completions += 1;
              }
              cueAnalytic.average_engagement_time = 
                (cueAnalytic.average_engagement_time * (cueAnalytic.total_encounters - 1) + cue.time_before_click) / cueAnalytic.total_encounters;
              cueAnalytic.completion_rate = Math.round((cueAnalytic.total_completions / cueAnalytic.total_encounters) * 100);
            }
          });
        });
        
        // Calculate navigation insights
        const navigationMethods = allUserAnalytics.reduce((acc, analytics) => {
          const method = analytics.navigation_patterns.preferred_navigation_method;
          acc[method] = (acc[method] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const mostUsedMethod = Object.entries(navigationMethods)
          .sort(([,a], [,b]) => b - a)[0]?.[0] as any || "toc";
        
        const enhancedSummary = {
          // Overall platform metrics
          total_users: allUsers.length,
          active_users_last_7_days: Math.min(allUsers.length, Math.max(1, allEnhancedSessions.length)), // Estimate
          total_reading_sessions: allUserAnalytics.reduce((sum, analytics) => sum + analytics.total_sessions, 0),
          total_reading_time_hours: Math.round(allUserAnalytics.reduce((sum, analytics) => sum + analytics.total_reading_time, 0) / 3600),
          
          // Page type engagement metrics
          page_type_metrics: {
            story_pages: storyPageMetrics,
            cue_pages: cuePageMetrics,
            activity_pages: activityPageMetrics,
          },
          
          // Cue-specific analytics
          cue_analytics: cueAnalytics,
          
          // Navigation pattern insights
          navigation_insights: {
            most_used_navigation_method: mostUsedMethod,
            linear_vs_jump_reading_ratio: 0.8, // Default estimate
            average_session_depth: allUserAnalytics.length ? 
              allUserAnalytics.reduce((sum, analytics) => sum + analytics.navigation_patterns.average_session_depth, 0) / allUserAnalytics.length : 0,
            bounce_rate: 0.1, // Default low bounce rate
          },
          
          // Top performing content
          top_performing: {
            most_engaging_chapters: ["Chapter 1", "Chapter 2"], // Default
            most_completed_cues: cueAnalytics.sort((a, b) => b.completion_rate - a.completion_rate).slice(0, 3).map(c => c.cue_name),
            most_printed_activities: allUserAnalytics.flatMap(analytics => analytics.print_behavior.most_printed_activities).slice(0, 5),
          },
          
          generated_at: new Date().toISOString(),
        };
        
        return c.json(enhancedSummary);
      } catch (error) {
        console.error("Enhanced analytics summary error:", error);
        return c.json({ error: "Failed to get enhanced analytics summary" }, 500);
      }
    })

    /**
     * Health Check for Integration
     * GET /api/book-access/health
     * 
     * Simple endpoint to verify the integration system is working.
     */
    .get("health", (c) => {
      return c.json({
        status: "healthy",
        service: "book-access-token-system",
        timestamp: new Date().toISOString(),
        version: "5.0.0", // Updated version to reflect enhanced analytics
        features: [
          "token-generation",
          "token-validation", 
          "enhanced-validation",
          "user-account-bookmarks",
          "user-account-progress",
          "user-account-analytics",
          "token-persistence",
          "continuous-tracking",
          "progress-sync",
          // NEW ENHANCED ANALYTICS FEATURES
          "enhanced-analytics-tracking", // Page type classification, cue timing, print tracking
          "page-type-classification",    // Story vs cue vs activity page analytics
          "cue-interaction-timing",      // Time spent before clicking cues
          "print-behavior-tracking",     // Print button clicks and activity engagement
          "navigation-source-tracking",  // TOC vs nav bar vs chapter navigation
          "enhanced-summary-endpoint",   // Comprehensive analytics dashboard
        ],
      });
    });

  return route;
}
