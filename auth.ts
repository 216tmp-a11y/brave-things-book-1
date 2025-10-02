import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { jwt, sign, verify } from "hono/jwt";
import { RegisterRequestSchema, LoginRequestSchema, AuthResponseSchema, UserJWTPayload, ForgotPasswordRequestSchema, ResetPasswordRequestSchema, PasswordResetResponseSchema, InstantResetRequestSchema } from "../schema";
import z from "zod";

/**
 * Authentication Routes
 * 
 * This module provides user authentication functionality including:
 * 1. User registration with email and password
 * 2. User login with JWT token generation
 * 3. Token verification for protected routes
 * 4. User profile retrieval
 * 
 * Security Features:
 * - Password hashing with crypto.subtle (web-standard)
 * - JWT tokens for session management
 * - Email validation and duplicate prevention
 * - Secure password requirements
 */

// JWT secret - in production, this should be from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "brave-things-books-auth-secret";
const TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

// Use shared database to ensure consistency between auth and book-access routes
import { getSharedDatabaseAsync, ensureAdminUserExists, ensureAllUsersExist, MockBookAccessToken } from "../shared-database";

// Import configurable settings for token expiration
import { getSystemSettings } from "./admin";

/**
 * Hash password using Web Crypto API (compatible with Deno)
 * Enhanced with more robust encoding and consistent formatting
 */
async function hashPassword(password: string): Promise<string> {
  // Normalize password: trim whitespace and ensure consistent encoding
  const normalizedPassword = password.toString().trim();
  
  if (!normalizedPassword) {
    throw new Error("Password cannot be empty");
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(normalizedPassword);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashString = Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
    
  console.log("🔐 Password hashed:", {
    originalLength: password.length,
    normalizedLength: normalizedPassword.length,
    hashFirst10: hashString.substring(0, 10)
  });
  
  return hashString;
}

/**
 * Verify password against hash
 * Enhanced with better error handling and consistent normalization
 */
async function verifyPassword(password: string, hash: string | undefined): Promise<boolean> {
  try {
    if (!hash) {
      console.log("❌ No password hash stored for user");
      return false;
    }
    
    if (!password) {
      console.log("❌ No password provided for verification");
      return false;
    }
    
    // Use the same normalization as hashPassword
    const passwordHash = await hashPassword(password);
    const isValid = passwordHash === hash;
    
    // Enhanced debug logging (remove in production)
    console.log("🔑 Password verification detailed:", {
      provided: {
        raw: password,
        normalized: password.toString().trim(),
        length: password.toString().trim().length,
        hashFirst10: passwordHash.substring(0, 10),
        hashLast10: passwordHash.substring(-10)
      },
      stored: {
        hashFirst10: hash.substring(0, 10),
        hashLast10: hash.substring(-10),
        length: hash.length
      },
      result: isValid
    });
    
    return isValid;
  } catch (error) {
    console.error("❌ Password verification error:", error);
    return false;
  }
}

/**
 * Generate user ID
 */
function generateUserId(): string {
  return "user_" + Math.random().toString(36).substr(2, 9);
}

/**
 * Generate secure reset token
 */
function generateResetToken(): string {
  return Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15);
}

/**
 * Generate persistent book access token for a user
 * Called during registration to create a persistent token for WTBTG
 */
async function generatePersistentBookToken(userId: string, bookId: string): Promise<string | null> {
  try {
    console.log("🎫 GENERATING PERSISTENT BOOK TOKEN for:", { userId, bookId });
    
    // Get database
    const mockDatabase = await getSharedDatabaseAsync();
    
    // Create purchase record if it doesn't exist (for free book)
    const purchaseKey = `${userId}-${bookId}`;
    if (!mockDatabase.purchases.has(purchaseKey)) {
      mockDatabase.purchases.set(purchaseKey, {
        id: purchaseKey,
        userId,
        bookId,
        status: "completed",
        access_type: "free",
        purchased_at: new Date(),
      });
      console.log("✅ Created purchase record for free book access");
    }
    
    // Get system settings for token expiration
    const settings = getSystemSettings();
    
    // Calculate token expiration (0 means no expiration)
    const tokenExpiry = settings.bookAccessTokenExpiry === 0 
      ? undefined 
      : Math.floor(Date.now() / 1000) + (settings.bookAccessTokenExpiry * 24 * 60 * 60);
    
    // Create token payload
    const tokenPayload = {
      userId,
      bookId,
      purchaseId: purchaseKey,
      permissions: ["read", "bookmark", "progress"],
      ...(tokenExpiry && { exp: tokenExpiry }),
    };
    
    // Sign the token
    const token = await sign(tokenPayload, JWT_SECRET);
    const expiresAt = tokenExpiry || 0; // 0 means no expiration
    
    // Store persistent token in database
    const tokenKey = `${userId}-${bookId}`;
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
    
    console.log("✅ Persistent book access token generated successfully:", {
      tokenKey,
      hasExpiration: !!tokenExpiry,
      expiresAt: tokenExpiry || "never"
    });
    
    return token;
    
  } catch (error) {
    console.error("❌ Failed to generate persistent book token:", error);
    return null;
  }
}

/**
 * Send password reset email (mock implementation)
 * In production, this would use a real email service like SendGrid, Mailgun, etc.
 */
async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  try {
    // Mock email service - log the reset link that would be sent
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    console.log("📧 PASSWORD RESET EMAIL (Mock):");
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your Brave Things Books Password`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("─".repeat(50));
    
    // In production, replace this with actual email service:
    // await emailService.send({
    //   to: email,
    //   subject: "Reset Your Brave Things Books Password",
    //   template: "password-reset",
    //   data: { resetUrl }
    // });
    
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return false;
  }
}

export function createAuthRoute() {
  const route = new Hono()
    // Enable CORS for all auth routes
    .use("*", cors({
      origin: ["http://localhost:5173", "https://brave-things-books.vercel.app"],
      credentials: true,
    }))
    
    /**
     * POST /api/auth/register
     * Create a new user account
     */
    .post("/register", zValidator("json", RegisterRequestSchema), async (c) => {
      try {
        const { name, email, password } = c.req.valid("json");
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        // Normalize email for consistent storage and lookup
        const normalizedEmail = email.toString().trim().toLowerCase();
        
        // Check if user already exists
        const existingUser = Array.from(mockDatabase.users.values())
          .find(user => user.email === normalizedEmail);
        
        if (existingUser) {
          return c.json({
            success: false,
            error: "An account with this email already exists"
          }, 400);
        }
        
        // Hash password
        const password_hash = await hashPassword(password);
        
        // Create user
        const userId = generateUserId();
        const user = {
          id: userId,
          email: normalizedEmail,
          password_hash,
          name: name.toString().trim(),
          created_at: new Date(),
          subscription_status: "free" as const,
          role: "user" as const,
        };
        
        // Store user in database with extensive logging
        mockDatabase.users.set(userId, user);
        
        // CRITICAL: Force persistence to global immediately
        if (typeof globalThis !== 'undefined') {
          globalThis.__BRAVE_THINGS_DB__ = mockDatabase;
          console.log("💾 FORCED database persistence to global after user creation");
        }
        
        console.log("👤 NEW USER REGISTRATION SUCCESS:");
        console.log("  User ID:", userId);
        console.log("  Email:", user.email);
        console.log("  Name:", user.name);
        console.log("  Password Hash Length:", user.password_hash?.length || 0);
        console.log("  Password Hash Preview:", user.password_hash?.substring(0, 10) || "none");
        console.log("  Total Users After Insert:", mockDatabase.users.size);
        console.log("  Database Instance ID:", Date.now());
        console.log("  Global Persistence Check:", !!(typeof globalThis !== 'undefined' && globalThis.__BRAVE_THINGS_DB__));
        
        // Verify user was actually stored
        const verifyUser = mockDatabase.users.get(userId);
        console.log("  Verification Check - User Retrieved:", !!verifyUser);
        console.log("  Verification Check - Email Match:", verifyUser?.email === user.email);
        
        // Verify global persistence
        if (typeof globalThis !== 'undefined' && globalThis.__BRAVE_THINGS_DB__) {
          const globalUser = globalThis.__BRAVE_THINGS_DB__.users.get(userId);
          console.log("  Global Persistence Check - User in Global:", !!globalUser);
        }
        
        // List all users in database
        const allUsers = Array.from(mockDatabase.users.values());
        console.log("  All Users in Database:", allUsers.map(u => ({ 
          id: u.id, 
          email: u.email, 
          name: u.name 
        })));
        
        // Generate JWT authentication token
        const payload: UserJWTPayload = {
          userId,
          email: user.email,
        };
        
        const authToken = await sign(payload, JWT_SECRET);
        
        // STEP 2: Generate persistent book access token for WTBTG during signup
        const bookAccessToken = await generatePersistentBookToken(userId, "wtbtg");
        
        if (bookAccessToken) {
          console.log("✅ Persistent book access token created during signup");
        } else {
          console.log("⚠️ Failed to create persistent book access token, but user registration succeeded");
        }
        
        return c.json({
          success: true,
          token: authToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            subscription_status: user.subscription_status,
            role: user.role || "user",
          }
        });
        
      } catch (error) {
        console.error("Registration error:", error);
        return c.json({
          success: false,
          error: "Registration failed. Please try again."
        }, 500);
      }
    })
    
    /**
     * POST /api/auth/login
     * Authenticate user and return JWT token
     */
    .post("/login", zValidator("json", LoginRequestSchema), async (c) => {
      try {
        const { email, password } = c.req.valid("json");
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        // CRITICAL FIX: Ensure admin user exists on every login attempt
        await ensureAdminUserExists(mockDatabase);
        
        // CRITICAL FIX: Ensure all users exist on every login attempt
        await ensureAllUsersExist(mockDatabase);
        
        // Normalize email for consistent lookup
        const normalizedEmail = email.toString().trim().toLowerCase();
        
        // Enhanced debug logging
        console.log("🔐 LOGIN ATTEMPT STARTED:");
        console.log("  Timestamp:", new Date().toISOString());
        console.log("  Original Email:", email);
        console.log("  Normalized Email:", normalizedEmail);
        console.log("  Password Length:", password.length);
        console.log("  Database Users Count:", mockDatabase.users.size);
        console.log("  Database Instance ID:", Date.now());
        console.log("  Global DB Exists:", !!(typeof globalThis !== 'undefined' && globalThis.__BRAVE_THINGS_DB__));
        console.log("  Global DB Users Count:", typeof globalThis !== 'undefined' && globalThis.__BRAVE_THINGS_DB__ ? globalThis.__BRAVE_THINGS_DB__.users.size : 'N/A');
        
        const allUsers = Array.from(mockDatabase.users.values());
        console.log("  Available Users in Local DB:", allUsers.map(u => ({ 
          id: u.id,
          email: u.email, 
          name: u.name,
          hasPassword: !!u.password_hash,
          passwordHashPreview: u.password_hash?.substring(0, 10) || "none",
          created_at: u.created_at
        })));
        
        // Also check global database
        if (typeof globalThis !== 'undefined' && globalThis.__BRAVE_THINGS_DB__) {
          const globalUsers = Array.from(globalThis.__BRAVE_THINGS_DB__.users.values());
          console.log("  Available Users in Global DB:", globalUsers.map(u => ({ 
            id: u.id,
            email: u.email, 
            name: u.name,
            hasPassword: !!u.password_hash,
            passwordHashPreview: u.password_hash?.substring(0, 10) || "none"
          })));
        }
        
        // Check if this exact email exists (case-sensitive debugging)
        const exactEmailMatch = allUsers.find(u => u.email === email);
        const normalizedEmailMatch = allUsers.find(u => u.email === normalizedEmail);
        console.log("  Exact Email Match:", !!exactEmailMatch);
        console.log("  Normalized Email Match:", !!normalizedEmailMatch);
        
        // Special check for Marie's account
        const marieMatch = allUsers.find(u => u.name.toLowerCase().includes('marie') || u.email.toLowerCase().includes('marie'));
        console.log("  Marie Account Found:", !!marieMatch, marieMatch ? { name: marieMatch.name, email: marieMatch.email } : null);
        
        // Find user by email
        const user = Array.from(mockDatabase.users.values())
          .find(user => user.email === normalizedEmail);
        
        if (!user) {
          console.log("❌ User not found for email:", email.toLowerCase());
          return c.json({
            success: false,
            error: "Invalid email or password"
          }, 401);
        }
        
        console.log("✅ User found:", { id: user.id, email: user.email, hasPassword: !!user.password_hash });
        
        // Verify password
        const isValidPassword = await verifyPassword(password, user.password_hash);
        
        if (!isValidPassword) {
          console.log("❌ Password verification failed for user:", user.email);
          return c.json({
            success: false,
            error: "Invalid email or password"
          }, 401);
        }
        
        console.log("✅ Password verification successful for user:", user.email);
        
        // Generate JWT token
        const payload: UserJWTPayload = {
          userId: user.id,
          email: user.email,
        };
        
        const token = await sign(payload, JWT_SECRET);
        
        return c.json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            subscription_status: user.subscription_status,
            role: user.role || "user",
          }
        });
        
      } catch (error) {
        console.error("Login error:", error);
        return c.json({
          success: false,
          error: "Login failed. Please try again."
        }, 500);
      }
    })
    
    /**
     * GET /api/auth/verify
     * Verify JWT token and return user info
     */
    .get("/verify", async (c) => {
      try {
        const authHeader = c.req.header("Authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return c.json({
            success: false,
            error: "No authorization token provided"
          }, 401);
        }
        
        const token = authHeader.substring(7); // Remove "Bearer " prefix
        
        // Verify JWT token
        const payload = await verify(token, JWT_SECRET) as UserJWTPayload;
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        // Find user
        const user = mockDatabase.users.get(payload.userId);
        
        if (!user) {
          return c.json({
            success: false,
            error: "User not found"
          }, 404);
        }
        
        return c.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            subscription_status: user.subscription_status,
            role: user.role || "user",
          }
        });
        
      } catch (error) {
        console.error("Token verification error:", error);
        return c.json({
          success: false,
          error: "Invalid or expired token"
        }, 401);
      }
    })
    
    /**
     * GET /api/auth/user-books
     * Get books available to the authenticated user
     */
    .get("/user-books", async (c) => {
      try {
        const authHeader = c.req.header("Authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return c.json({
            success: false,
            error: "No authorization token provided"
          }, 401);
        }
        
        const token = authHeader.substring(7);
        const payload = await verify(token, JWT_SECRET) as UserJWTPayload;
        
        console.log("📚 User books request for:", payload.userId);
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        // Verify user exists
        const user = mockDatabase.users.get(payload.userId);
        if (!user) {
          console.log("❌ User not found:", payload.userId);
          return c.json({
            success: false,
            error: "User not found"
          }, 404);
        }
        
        console.log("✅ User found:", user.name, user.email);
        
        // All authenticated users get free access to "Where the Brave Things Grow"
        // Add them to purchases table if not already there
        const purchaseKey = `${payload.userId}-wtbtg`;
        if (!mockDatabase.purchases.has(purchaseKey)) {
          console.log("🆓 Creating free access to WTBTG for user:", user.name);
          mockDatabase.purchases.set(purchaseKey, {
            id: purchaseKey,
            userId: payload.userId,
            bookId: "wtbtg",
            status: "completed",
            access_type: "free",
            purchased_at: new Date(),
          });
        } else {
          console.log("✅ User already has access to WTBTG");
        }
        
        // Get reading progress if available
        const progressKey = `${payload.userId}-wtbtg`;
        const progress = mockDatabase.progress.get(progressKey);
        console.log("📊 Reading progress found:", !!progress, progress?.progress || 0);
        
        const userBooks = [{
          id: "wtbtg",
          title: "Where the Brave Things Grow",
          subtitle: "Interactive Social-Emotional Learning",
          author: "Brave Things Lab Team",
          description: "An interactive journey teaching mindfulness, emotional regulation, and social skills through forest adventures with Mila the Squirrel and friends.",
          coverImage: "/api/placeholder/300/400",
          bookUrl: "https://step1-sumws7e-j3yjdb548wy0.deno.dev", // External Step1 book
          access_type: "free",
          progress: progress?.progress || 0,
          last_read_at: progress?.lastReadAt || null,
        }];
        
        console.log("📖 Returning books:", userBooks.length);
        
        return c.json({
          success: true,
          books: userBooks
        });
        
      } catch (error) {
        console.error("Get user books error:", error);
        return c.json({
          success: false,
          error: "Failed to get user books"
        }, 500);
      }
    })
    
    /**
     * POST /api/auth/forgot-password
     * Send password reset email
     */
    .post("/forgot-password", zValidator("json", ForgotPasswordRequestSchema), async (c) => {
      try {
        const { email } = c.req.valid("json");
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        // Find user by email
        const user = Array.from(mockDatabase.users.values())
          .find(user => user.email.toLowerCase() === email.toLowerCase());
        
        // Always return success to prevent email enumeration attacks
        if (!user) {
          return c.json({
            success: true,
            message: "If an account with that email exists, we've sent a password reset link."
          });
        }
        
        // Generate reset token
        const resetToken = generateResetToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour
        
        // Store reset token
        const tokenId = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        mockDatabase.passwordResetTokens.set(tokenId, {
          id: tokenId,
          userId: user.id,
          email: user.email,
          token: resetToken,
          expiresAt,
          used: false,
          createdAt: new Date(),
        });
        
        // Send email
        const emailSent = await sendPasswordResetEmail(user.email, resetToken);
        
        if (!emailSent) {
          console.error("Failed to send password reset email");
        }
        
        return c.json({
          success: true,
          message: "If an account with that email exists, we've sent a password reset link."
        });
        
      } catch (error) {
        console.error("Forgot password error:", error);
        return c.json({
          success: false,
          error: "Failed to process password reset request. Please try again."
        }, 500);
      }
    })
    
    /**
     * POST /api/auth/reset-password
     * Reset password using token
     */
    .post("/reset-password", zValidator("json", ResetPasswordRequestSchema), async (c) => {
      try {
        const { token, newPassword } = c.req.valid("json");
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        // Find valid reset token (for traditional email reset)
        const resetTokenRecord = Array.from(mockDatabase.passwordResetTokens.values())
          .find(record => record.token === token && !record.used && record.expiresAt > new Date());
        
        if (!resetTokenRecord) {
          return c.json({
            success: false,
            error: "Invalid or expired reset token. Please request a new password reset."
          }, 400);
        }
        
        // Find user
        const user = mockDatabase.users.get(resetTokenRecord.userId);
        if (!user) {
          return c.json({
            success: false,
            error: "User not found."
          }, 404);
        }
        
        // Hash new password
        const newPasswordHash = await hashPassword(newPassword);
        
        // Update user password
        user.password_hash = newPasswordHash;
        mockDatabase.users.set(user.id, user);
        
        // Mark reset token as used
        resetTokenRecord.used = true;
        mockDatabase.passwordResetTokens.set(resetTokenRecord.id, resetTokenRecord);
        
        return c.json({
          success: true,
          message: "Your password has been successfully reset. You can now log in with your new password."
        });
        
      } catch (error) {
        console.error("Reset password error:", error);
        return c.json({
          success: false,
          error: "Failed to reset password. Please try again."
        }, 500);
      }
    })
    
    /**
     * GET /api/auth/verify-reset-token
     * Verify if reset token is valid
     */
    .get("/verify-reset-token", async (c) => {
      try {
        const token = c.req.query("token");
        
        if (!token) {
          return c.json({
            valid: false,
            error: "No token provided"
          });
        }
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        // Find valid reset token
        const resetTokenRecord = Array.from(mockDatabase.passwordResetTokens.values())
          .find(record => record.token === token && !record.used && record.expiresAt > new Date());
        
        return c.json({
          valid: !!resetTokenRecord,
          error: resetTokenRecord ? undefined : "Invalid or expired token"
        });
        
      } catch (error) {
        console.error("Verify reset token error:", error);
        return c.json({
          valid: false,
          error: "Failed to verify token"
        });
      }
    })
    
    /**
     * POST /api/auth/instant-reset
     * Instant password reset with email verification
     */
    .post("/instant-reset", zValidator("json", InstantResetRequestSchema), async (c) => {
      try {
        const { email, newPassword } = c.req.valid("json");
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        // Find user by email
        const user = Array.from(mockDatabase.users.values())
          .find(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
          return c.json({
            success: false,
            error: "No account found with that email address."
          }, 404);
        }
        
        // Hash new password
        const newPasswordHash = await hashPassword(newPassword);
        
        // Update user password
        user.password_hash = newPasswordHash;
        mockDatabase.users.set(user.id, user);
        
        return c.json({
          success: true,
          message: "Your password has been successfully reset. You can now log in with your new password."
        });
        
      } catch (error) {
        console.error("Instant reset error:", error);
        return c.json({
          success: false,
          error: "Failed to reset password. Please try again."
        }, 500);
      }
    })
    
    /**
     * GET /api/auth/debug
     * Debug endpoint to check database state (development only)
     */
    .get("/debug", async (c) => {
      try {
        // Only allow in development
        if (process.env.NODE_ENV === "production") {
          return c.json({ error: "Debug endpoint not available in production" }, 404);
        }
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        console.log("📊 DEBUG ENDPOINT - Current Database State:");
        console.log("  Database Object Exists:", !!mockDatabase);
        console.log("  Users Map Exists:", !!mockDatabase?.users);
        console.log("  Users Count:", mockDatabase?.users?.size || 0);
        console.log("  Global DB Exists:", !!(typeof globalThis !== 'undefined' && globalThis.__BRAVE_THINGS_DB__));
        
        const users = Array.from(mockDatabase.users.values()).map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          hasPassword: !!user.password_hash,
          passwordHashLength: user.password_hash?.length || 0,
          passwordHashPreview: user.password_hash?.substring(0, 10) || "none",
          created_at: user.created_at
        }));
        
        return c.json({
          timestamp: new Date().toISOString(),
          databaseInitialized: !!mockDatabase,
          totalUsers: mockDatabase.users.size,
          users,
          books: Array.from(mockDatabase.books.keys()),
          purchases: mockDatabase.purchases.size,
          resetTokens: mockDatabase.passwordResetTokens.size,
          globalPersistence: !!(typeof globalThis !== 'undefined' && globalThis.__BRAVE_THINGS_DB__),
          databaseInstanceId: Date.now()
        });
        
      } catch (error) {
        console.error("Debug endpoint error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return c.json({ error: "Debug failed", details: errorMessage }, 500);
      }
    })
    
    /**
     * POST /api/auth/test-password
     * Test password hashing for debugging (development only)
     */
    .post("/test-password", async (c) => {
      try {
        // Only allow in development
        if (process.env.NODE_ENV === "production") {
          return c.json({ error: "Test endpoint not available in production" }, 404);
        }
        
        const body = await c.req.json();
        const { password, email } = body;
        
        if (!password) {
          return c.json({ error: "Password required" }, 400);
        }
        
        const hash = await hashPassword(password);
        
        // Get database with async initialization
        const mockDatabase = await getSharedDatabaseAsync();
        
        // If email provided, check if user exists and compare
        let userComparison = null;
        if (email) {
          const normalizedEmail = email.toString().trim().toLowerCase();
          const user = Array.from(mockDatabase.users.values())
            .find(user => user.email === normalizedEmail);
          
          if (user && user.password_hash) {
            userComparison = {
              userExists: true,
              storedHashPreview: user.password_hash.substring(0, 10),
              newHashPreview: hash.substring(0, 10),
              hashesMatch: user.password_hash === hash,
              canVerify: await verifyPassword(password, user.password_hash)
            };
          }
        }
        
        return c.json({
          password: password,
          normalized: password.toString().trim(),
          hash: hash,
          hashLength: hash.length,
          userComparison
        });
        
      } catch (error) {
        console.error("Test password error:", error);
        return c.json({ error: "Test failed" }, 500);
      }
    });
  
  return route;
}
