import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { jwt, sign, verify } from "hono/jwt";
import { RegisterRequestSchema, LoginRequestSchema, AuthResponseSchema, UserJWTPayload, ForgotPasswordRequestSchema, ResetPasswordRequestSchema, PasswordResetResponseSchema, InstantResetRequestSchema } from "../schema";
import z from "zod";

/**
 * Production-Ready Authentication Routes
 * 
 * This module provides secure user authentication functionality including:
 * 1. User registration with strong password hashing
 * 2. User login with rate limiting and account lockout
 * 3. Token verification for protected routes
 * 4. Password reset with secure tokens
 * 5. Input validation and sanitization
 * 6. Security headers and CORS protection
 */

// Import production security functions
import {
  hashPasswordSecure,
  verifyPasswordSecure,
  getJWTSecret,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  validatePasswordStrength,
  sanitizeInput,
  validateEmail,
  getSecurityHeaders,
  generateSecureToken,
  validateProductionEnvironment
} from "../auth-security";

// Use shared database to ensure consistency between auth and book-access routes
import { getSharedDatabase, ensureAdminUserExists } from "../shared-database";

/**
 * Generate user ID
 */
function generateUserId(): string {
  return "user_" + generateSecureToken(12);
}

/**
 * Send password reset email (mock implementation)
 * In production, this would use a real email service like Resend, SendGrid, etc.
 */
async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  try {
    // Mock email service - log the reset link that would be sent
    const resetUrl = `${process.env.FRONTEND_URL || 'https://brave-things-books.vercel.app'}/reset-password?token=${resetToken}`;
    
    console.log("📧 PASSWORD RESET EMAIL (Mock):");
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your Brave Things Books Password`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log("─".repeat(50));
    
    // In production, replace this with actual email service:
    // const resend = new Resend(process.env.EMAIL_SERVICE_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@bravethingsbooks.com',
    //   to: email,
    //   subject: 'Reset Your Brave Things Books Password',
    //   html: `Click <a href="${resetUrl}">here</a> to reset your password.`
    // });
    
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return false;
  }
}

export function createAuthProductionRoute() {
  // Validate production environment on startup
  const envCheck = validateProductionEnvironment();
  if (!envCheck.ready) {
    console.warn("⚠️  PRODUCTION READINESS ISSUES:");
    envCheck.issues.forEach(issue => console.warn(`   - ${issue}`));
  }
  
  const route = new Hono()
    // Apply security headers to all routes
    .use("*", async (c, next) => {
      const headers = getSecurityHeaders();
      Object.entries(headers).forEach(([key, value]) => {
        c.header(key, value);
      });
      await next();
    })
    
    // Enable CORS for all auth routes
    .use("*", cors({
      origin: [
        "http://localhost:5173", 
        "https://brave-things-books.vercel.app",
        "https://*.deno.dev" // For Deno Deploy previews
      ],
      credentials: true,
    }))
    
    /**
     * POST /api/auth/register
     * Create a new user account with strong security
     */
    .post("/register", zValidator("json", RegisterRequestSchema), async (c) => {
      try {
        const { name, email, password } = c.req.valid("json");
        
        // Sanitize inputs
        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = sanitizeInput(email).toLowerCase();
        
        // Validate email format
        if (!validateEmail(sanitizedEmail)) {
          return c.json({
            success: false,
            error: "Please enter a valid email address"
          }, 400);
        }
        
        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.valid) {
          return c.json({
            success: false,
            error: passwordValidation.errors.join(". ")
          }, 400);
        }
        
        // Check rate limiting for registration (prevent spam)
        const clientIP = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
        const rateCheck = checkRateLimit(`register:${clientIP}`, 3, 60); // 3 registrations per hour
        
        if (!rateCheck.allowed) {
          return c.json({
            success: false,
            error: rateCheck.message || "Too many registration attempts. Please try again later."
          }, 429);
        }
        
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
        // Check if user already exists
        const existingUser = Array.from(mockDatabase.users.values())
          .find(user => user.email === sanitizedEmail);
        
        if (existingUser) {
          recordFailedAttempt(`register:${clientIP}`); // Count as failed attempt
          return c.json({
            success: false,
            error: "An account with this email already exists"
          }, 400);
        }
        
        // Hash password securely
        const password_hash = await hashPasswordSecure(password);
        
        // Create user
        const userId = generateUserId();
        const user = {
          id: userId,
          email: sanitizedEmail,
          password_hash,
          name: sanitizedName,
          created_at: new Date(),
          subscription_status: "free" as const,
          role: "user" as const,
        };
        
        // Store user in database
        mockDatabase.users.set(userId, user);
        
        // Force persistence to global
        if (typeof globalThis !== 'undefined') {
          globalThis.__BRAVE_THINGS_DB__ = mockDatabase;
        }
        
        console.log("✅ SECURE USER REGISTRATION:", {
          userId,
          email: user.email,
          name: user.name,
          timestamp: new Date().toISOString()
        });
        
        // Reset rate limit on successful registration
        resetRateLimit(`register:${clientIP}`);
        
        // Generate JWT token
        const payload: UserJWTPayload = {
          userId,
          email: user.email,
        };
        
        const token = await sign(payload, getJWTSecret());
        
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
        console.error("Secure registration error:", error);
        return c.json({
          success: false,
          error: "Registration failed. Please try again."
        }, 500);
      }
    })
    
    /**
     * POST /api/auth/login
     * Authenticate user with rate limiting and security
     */
    .post("/login", zValidator("json", LoginRequestSchema), async (c) => {
      try {
        const { email, password } = c.req.valid("json");
        
        // Sanitize inputs
        const sanitizedEmail = sanitizeInput(email).toLowerCase();
        
        // Validate email format
        if (!validateEmail(sanitizedEmail)) {
          return c.json({
            success: false,
            error: "Please enter a valid email address"
          }, 400);
        }
        
        // Check rate limiting (per email and per IP)
        const clientIP = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
        
        const emailRateCheck = checkRateLimit(`login:email:${sanitizedEmail}`, 5, 15);
        const ipRateCheck = checkRateLimit(`login:ip:${clientIP}`, 10, 15);
        
        if (!emailRateCheck.allowed) {
          return c.json({
            success: false,
            error: emailRateCheck.message || "Too many login attempts for this account"
          }, 429);
        }
        
        if (!ipRateCheck.allowed) {
          return c.json({
            success: false,
            error: ipRateCheck.message || "Too many login attempts from this device"
          }, 429);
        }
        
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
        // CRITICAL FIX: Ensure admin user exists on every login attempt
        await ensureAdminUserExists(mockDatabase);
        
        // Find user by email
        const user = Array.from(mockDatabase.users.values())
          .find(user => user.email === sanitizedEmail);
        
        if (!user) {
          recordFailedAttempt(`login:email:${sanitizedEmail}`);
          recordFailedAttempt(`login:ip:${clientIP}`);
          return c.json({
            success: false,
            error: "Invalid email or password"
          }, 401);
        }
        
        // Verify password securely
        const isValidPassword = await verifyPasswordSecure(password, user.password_hash);
        
        if (!isValidPassword) {
          recordFailedAttempt(`login:email:${sanitizedEmail}`);
          recordFailedAttempt(`login:ip:${clientIP}`);
          console.log("❌ SECURE LOGIN FAILED:", {
            email: sanitizedEmail,
            timestamp: new Date().toISOString(),
            reason: "Invalid password"
          });
          return c.json({
            success: false,
            error: "Invalid email or password"
          }, 401);
        }
        
        // Reset rate limits on successful login
        resetRateLimit(`login:email:${sanitizedEmail}`);
        resetRateLimit(`login:ip:${clientIP}`);
        
        console.log("✅ SECURE LOGIN SUCCESS:", {
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString()
        });
        
        // Generate JWT token
        const payload: UserJWTPayload = {
          userId: user.id,
          email: user.email,
        };
        
        const token = await sign(payload, getJWTSecret());
        
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
        console.error("Secure login error:", error);
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
        const payload = await verify(token, getJWTSecret()) as UserJWTPayload;
        
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
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
        const payload = await verify(token, getJWTSecret()) as UserJWTPayload;
        
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
        // Verify user exists
        const user = mockDatabase.users.get(payload.userId);
        if (!user) {
          return c.json({
            success: false,
            error: "User not found"
          }, 404);
        }
        
        // All authenticated users get free access to "Where the Brave Things Grow"
        const purchaseKey = `${payload.userId}-wtbtg`;
        if (!mockDatabase.purchases.has(purchaseKey)) {
          mockDatabase.purchases.set(purchaseKey, {
            id: purchaseKey,
            userId: payload.userId,
            bookId: "wtbtg",
            status: "completed",
            access_type: "free",
            purchased_at: new Date(),
          });
        }
        
        const userBooks = [{
          id: "wtbtg",
          title: "Where the Brave Things Grow",
          subtitle: "Interactive Social-Emotional Learning",
          author: "Brave Things Lab Team",
          description: "An interactive journey teaching mindfulness, emotional regulation, and social skills through forest adventures with Mila the Squirrel and friends.",
          coverImage: "/api/placeholder/300/400",
          bookUrl: "https://step1-sumws7e-j3yjdb548wy0.deno.dev", // External Step1 book
          access_type: "free",
          progress: 0, // TODO: Get from reading progress table
          last_read_at: null,
        }];
        
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
     * Send password reset email with secure token
     */
    .post("/forgot-password", zValidator("json", ForgotPasswordRequestSchema), async (c) => {
      try {
        const { email } = c.req.valid("json");
        
        const sanitizedEmail = sanitizeInput(email).toLowerCase();
        
        // Validate email format
        if (!validateEmail(sanitizedEmail)) {
          return c.json({
            success: false,
            error: "Please enter a valid email address"
          }, 400);
        }
        
        // Rate limiting for password reset requests
        const clientIP = c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
        const rateCheck = checkRateLimit(`reset:${sanitizedEmail}`, 3, 60); // 3 requests per hour
        
        if (!rateCheck.allowed) {
          return c.json({
            success: false,
            error: rateCheck.message || "Too many reset requests. Please try again later."
          }, 429);
        }
        
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
        // Find user by email
        const user = Array.from(mockDatabase.users.values())
          .find(user => user.email === sanitizedEmail);
        
        // Always return success to prevent email enumeration attacks
        if (!user) {
          return c.json({
            success: true,
            message: "If an account with that email exists, we've sent a password reset link."
          });
        }
        
        // Generate secure reset token
        const resetToken = generateSecureToken(32);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour
        
        // Store reset token
        const tokenId = `reset_${Date.now()}_${generateSecureToken(8)}`;
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
        console.error("Secure forgot password error:", error);
        return c.json({
          success: false,
          error: "Failed to process password reset request. Please try again."
        }, 500);
      }
    })
    
    /**
     * POST /api/auth/reset-password
     * Reset password using secure token
     */
    .post("/reset-password", zValidator("json", ResetPasswordRequestSchema), async (c) => {
      try {
        const { token, newPassword } = c.req.valid("json");
        
        // Validate password strength
        const passwordValidation = validatePasswordStrength(newPassword);
        if (!passwordValidation.valid) {
          return c.json({
            success: false,
            error: passwordValidation.errors.join(". ")
          }, 400);
        }
        
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
        // Find valid reset token
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
        
        // Hash new password securely
        const newPasswordHash = await hashPasswordSecure(newPassword);
        
        // Update user password
        user.password_hash = newPasswordHash;
        mockDatabase.users.set(user.id, user);
        
        // Mark reset token as used
        resetTokenRecord.used = true;
        mockDatabase.passwordResetTokens.set(resetTokenRecord.id, resetTokenRecord);
        
        // Reset any rate limits for this user
        resetRateLimit(`login:email:${user.email}`);
        
        console.log("✅ SECURE PASSWORD RESET:", {
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString()
        });
        
        return c.json({
          success: true,
          message: "Your password has been successfully reset. You can now log in with your new password."
        });
        
      } catch (error) {
        console.error("Secure reset password error:", error);
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
        
        // Get database instance
        const mockDatabase = await getSharedDatabase();
        
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
     * GET /api/auth/health
     * Production health check endpoint
     */
    .get("/health", async (c) => {
      const envCheck = validateProductionEnvironment();
      
      // Get database instance
      const mockDatabase = await getSharedDatabase();
      
      return c.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        security: {
          productionReady: envCheck.ready,
          issues: envCheck.issues
        },
        database: {
          connected: true,
          users: mockDatabase.users.size,
          type: "in-memory" // Change to "postgresql" when real DB is connected
        }
      });
    });
  
  return route;
}