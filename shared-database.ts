/**
 * Shared Mock Database
 * 
 * Provides a centralized mock database that can be shared between
 * auth routes and book-access routes to ensure data consistency.
 * In production, this would be replaced with a real database.
 */

// Global type declaration for persistence
declare global {
  var __BRAVE_THINGS_DB__: MockDatabase | null | undefined;
}

// TypeScript interfaces for mock database objects
export interface MockUser {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  created_at?: Date;
  subscription_status?: "free" | "premium";
  role?: "user" | "admin" | "preview";
}

export interface MockBook {
  id: string;
  title: string;
  author: string;
  externalUrl: string;
  price: number;
  isActive: boolean;
}

export interface MockPurchase {
  id: string;
  userId: string;
  bookId: string;
  status: "completed" | "pending";
  access_type: "free" | "purchased";
  purchased_at?: Date;
}

export interface MockProgress {
  userId: string;
  bookId: string;
  progress: number;
  currentPage?: number;
  currentChapter?: string;
  timeSpent: number;
  lastReadAt: string;
  bookmarks: Array<{
    page: number;
    chapter?: string;
    note?: string;
  }>;
}

// Enhanced Bookmark Interface for Token System
export interface MockBookmark {
  id: string;
  userId: string;
  bookId: string;
  page: number;
  chapter?: string;
  note?: string;
  created_at: string; // ISO date string
  updated_at?: string; // ISO date string
  bookmark_type: "page_save" | "note" | "highlight" | "interactive_cue";
  metadata?: {
    cue_name?: string;
    highlight_text?: string;
    position?: {
      x?: number;
      y?: number;
    };
  };
}

// Analytics Session Tracking for Token System
export interface MockAnalyticsSession {
  id: string;
  userId: string;
  bookId: string;
  session_start: string; // ISO date string
  session_end?: string; // ISO date string
  device_info?: {
    type?: "desktop" | "tablet" | "mobile";
    browser?: string;
    screen_size?: {
      width?: number;
      height?: number;
    };
  };
  reading_metrics: {
    pages_visited: number[]; // Required for analytics
    total_interactions: number;
    cues_collected: string[]; // Required for analytics
    time_per_page: Record<string, number>; // Required for analytics
  };
  page_interactions?: Array<{
    page_number?: number; // Optional to match schema
    chapter_name?: string;
    interactions?: Array<{
      type?: "click" | "scroll" | "hover" | "focus" | "play" | "pause" | "cue_collect" | "bookmark_add";
      element?: string;
      timestamp?: string; // ISO date string
      metadata?: {
        cue_name?: string;
        scroll_position?: number;
        click_position?: {
          x?: number;
          y?: number;
        };
      };
    }>; // Optional to match schema
    engagement_score?: number; // Optional to match schema
  }>;
}

export interface MockPasswordResetToken {
  id: string;
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface MockReadingSession {
  id: string;
  user_id: string;
  book_id: string;
  session_start: Date;
  session_end?: Date;
  total_duration: number; // seconds
  pages_visited: number[];
  interactions_count: number;
  device_type?: "desktop" | "tablet" | "mobile";
  browser_info?: string;
}

// ENHANCED: Page Engagement Interface with enhanced analytics support
export interface MockPageEngagement {
  id: string;
  user_id: string;
  book_id: string;
  session_id: string;
  page_number: number;
  chapter_name?: string;
  time_on_page: number; // seconds
  interactions: Array<{
    type: "click" | "scroll" | "hover" | "focus" | "play" | "pause" | "print" | "cue_click" | "nav_click";
    element: string;
    timestamp: Date;
    position?: { x: number; y: number };
    metadata?: {
      navigation_source?: "toc" | "chapter_nav" | "spread_nav" | "breadcrumb" | "home_button" | "direct_url" | "other";
      cue_name?: string;
      print_target?: string;
    };
  }>;
  scroll_depth: number; // percentage
  completion_status: "started" | "partial" | "completed" | "skipped";
  exit_reason?: "next_page" | "navigation" | "close" | "timeout";
  created_at: Date;
  
  // ENHANCED ANALYTICS PROPERTIES (NEW - Extensions to existing interface)
  page_type: "story" | "cue" | "activity" | "navigation" | "other"; // Enhanced page classification
  navigation_source: "toc" | "chapter_nav" | "spread_nav" | "breadcrumb" | "home_button" | "direct_url" | "other"; // How user arrived at page
  actual_time_seconds: number; // Actual engagement time excluding idle
  time_before_interaction: number; // Time before first meaningful interaction
  
  // Enhanced cue interaction tracking
  cue_interactions: Array<{
    cue_name: string;
    cue_icon: string;
    chapter_id: number;
    spread_number: number;
    time_before_click: number; // Seconds spent on page before clicking cue
    click_timestamp: Date;
    completion_status: "started" | "completed" | "abandoned";
    engagement_score: number; // 0-100 based on time spent and completion
  }>;
  
  // Enhanced print behavior tracking
  print_clicks: number; // Number of print button clicks
  print_targets: string[]; // What specific content was printed
  time_on_activity_page: number; // For activity pages, time spent before printing
}

// ENHANCED: User Behavior Analytics Interface with comprehensive analytics
export interface MockUserAnalytics {
  id: string;
  user_id: string;
  
  // Existing analytics (compatibility)
  total_sessions: number;
  total_reading_time: number; // seconds
  average_session_duration: number; // seconds
  pages_read: number;
  completion_rate: number; // percentage
  return_frequency: number; // days between sessions
  engagement_score: number; // 0-100
  preferred_reading_time?: "morning" | "afternoon" | "evening";
  most_engaged_chapters: string[];
  interaction_patterns: {
    clicks_per_page: number;
    scroll_behavior: "fast" | "moderate" | "slow";
    pause_frequency: number;
  };
  last_calculated: Date;
  
  // ENHANCED ANALYTICS PROPERTIES (NEW - Extensions to existing interface)
  // Page type engagement analytics
  page_type_analytics: {
    story_pages: number; // Count of story pages visited
    cue_pages: number; // Count of cue pages visited
    activity_pages: number; // Count of activity pages visited
    average_time_per_story_page: number;
    average_time_per_cue_page: number;
    average_time_per_activity_page: number;
  };
  
  // Enhanced cue engagement analytics
  cue_engagement: {
    total_cues_encountered: number; // How many cue pages they visited
    total_cues_completed: number; // How many cues they actually clicked
    completion_rate: number; // Percentage of encountered cues completed
    average_time_before_click: number; // Average seconds before clicking cues
    favorite_cues: string[]; // Most interacted with cue names
    cue_specific_metrics: Record<string, {
      encounters: number;
      completions: number;
      average_engagement_time: number;
    }>;
  };
  
  // Enhanced navigation pattern analytics
  navigation_patterns: {
    toc_usage: number; // How often they use table of contents
    linear_reading: number; // Percentage of linear vs jump navigation
    back_button_usage: number; // How often they go back
    preferred_navigation_method: "toc" | "chapter_nav" | "spread_nav" | "breadcrumb" | "home_button" | "direct_url" | "other";
    average_session_depth: number; // Average pages per session
  };
  
  // Enhanced print behavior analytics
  print_behavior: {
    total_print_clicks: number; // Total print button clicks
    pages_printed: string[]; // Which pages/activities they printed
    print_engagement_rate: number; // Percentage of activity pages printed
    most_printed_activities: string[];
  };
}

// Persistent Book Access Token Interface
export interface MockBookAccessToken {
  id: string; // user+book combination key
  userId: string;
  bookId: string;
  token: string; // The actual JWT token
  expiresAt?: number; // Unix timestamp, undefined = no expiration
  createdAt: number; // Unix timestamp
  lastUsedAt?: number; // Unix timestamp
}

// ENHANCED: Enhanced Analytics Session Interface (NEW)
export interface MockEnhancedAnalyticsSession {
  id: string;
  user_id: string;
  session_id: string;
  
  // Page information
  page_data: {
    page_number: number;
    chapter_id: number;
    chapter_name: string;
    page_type: "story" | "cue" | "activity" | "navigation" | "other";
    navigation_source: "toc" | "chapter_nav" | "spread_nav" | "breadcrumb" | "home_button" | "direct_url" | "other";
  };
  
  // Enhanced timing data
  timing_data: {
    time_on_page: number;
    actual_engagement_time: number; // Excluding idle time
    time_before_first_interaction: number;
    session_duration_so_far: number;
  };
  
  // Enhanced interaction data
  interactions: Array<{
    type: "click" | "scroll" | "hover" | "focus" | "play" | "pause" | "print" | "cue_click" | "nav_click";
    element: string;
    timestamp: string; // ISO timestamp
    position?: { x: number; y: number };
    metadata?: {
      navigation_source?: "toc" | "chapter_nav" | "spread_nav" | "breadcrumb" | "home_button" | "direct_url" | "other";
      cue_name?: string;
      print_target?: string;
    };
  }>;
  
  // Cue interaction data (if applicable)
  cue_interactions?: Array<{
    cue_name: string;
    cue_icon: string;
    chapter_id: number;
    spread_number: number;
    time_before_click: number;
    click_timestamp: string;
    completion_status: "started" | "completed" | "abandoned";
    engagement_score: number;
  }>;
  
  // Print interaction data (if applicable)
  print_data?: {
    print_clicks: number;
    print_targets: string[];
    time_on_activity_page: number;
  };
  
  created_at: Date;
}

export interface MockDatabase {
  users: Map<string, MockUser>;
  books: Map<string, MockBook>;
  purchases: Map<string, MockPurchase>;
  progress: Map<string, MockProgress>;
  passwordResetTokens: Map<string, MockPasswordResetToken>;
  readingSessions: Map<string, MockReadingSession>;
  pageEngagements: Map<string, MockPageEngagement>;
  userAnalytics: Map<string, MockUserAnalytics>;
  // Enhanced Token-Based Storage
  tokenBookmarks: Map<string, MockBookmark>; // bookmark_id -> bookmark
  analyticsessions: Map<string, MockAnalyticsSession>; // session_id -> session
  // Persistent Token Storage - FIXES the "new token every time" issue
  bookAccessTokens: Map<string, MockBookAccessToken>; // user+book combination -> persistent token
  
  // ENHANCED ANALYTICS STORAGE (NEW - Extensions to existing database)
  enhancedAnalyticsSessions: Map<string, MockEnhancedAnalyticsSession>; // Enhanced analytics sessions
}

// Single shared database instance - CRITICAL: This must persist across all requests
let sharedDatabase: MockDatabase | null = null;

// Global database state tracking with enhanced persistence
if (typeof globalThis !== 'undefined') {
  // Ensure database persistence across hot reloads in development
  if (!globalThis.__BRAVE_THINGS_DB__) {
    console.log("🔧 Creating global database persistence layer...");
    globalThis.__BRAVE_THINGS_DB__ = null;
  }
  
  // Immediately try to restore from global if available
  if (globalThis.__BRAVE_THINGS_DB__) {
    sharedDatabase = globalThis.__BRAVE_THINGS_DB__;
    console.log("🔄 Restored database from global on module load:", {
      users: sharedDatabase.users.size,
      timestamp: new Date().toISOString()
    });
  }
}



/**
 * Initialize database with users - FIXED to wait for async user creation
 */
async function initializeDatabase(): Promise<MockDatabase> {
  if (sharedDatabase) {
    return sharedDatabase;
  }
  
  console.log("🔄 Initializing fresh shared database...");
  console.log("🔄 Server restart detected - this will cause user data loss in development");
  
  sharedDatabase = {
    users: new Map<string, MockUser>(),
    books: new Map<string, MockBook>([
      [
        "wtbtg",
        {
          id: "wtbtg",
          title: "Where the Brave Things Grow",
          author: "Brave Things Lab Team",
          externalUrl: "/book/wtbtg", // Internal book route - book is built into platform
          price: 0, // Free book
          isActive: true,
        },
      ],
    ]),
    purchases: new Map<string, MockPurchase>(),
    progress: new Map<string, MockProgress>(),
    passwordResetTokens: new Map<string, MockPasswordResetToken>(),
    readingSessions: new Map<string, MockReadingSession>(),
    pageEngagements: new Map<string, MockPageEngagement>(),
    userAnalytics: new Map<string, MockUserAnalytics>(),
    // Enhanced Token-Based Storage
    tokenBookmarks: new Map<string, MockBookmark>(),
    analyticsessions: new Map<string, MockAnalyticsSession>(),
    // Persistent Token Storage - FIXES the "new token every time" issue
    bookAccessTokens: new Map<string, MockBookAccessToken>(),
    // ENHANCED ANALYTICS STORAGE (NEW)
    enhancedAnalyticsSessions: new Map<string, MockEnhancedAnalyticsSession>(),
  };
  
  // RESTORED: Create essential users that were working before
  await createEssentialUsersSync();
  
  // Store in global persistence layer
  if (typeof globalThis !== 'undefined') {
    globalThis.__BRAVE_THINGS_DB__ = sharedDatabase;
    console.log("💾 Stored database in global persistence");
  }
  
  // Log database initialization
  console.log("📚 Database initialized with maps:", {
    users: sharedDatabase.users.size,
    books: sharedDatabase.books.size,
    purchases: sharedDatabase.purchases.size,
    enhancedAnalyticsSessions: sharedDatabase.enhancedAnalyticsSessions.size,
    timestamp: new Date().toISOString(),
    databaseId: Date.now() // Unique identifier for this database instance
  });
  
  return sharedDatabase;
}

/**
 * Hash password using Web Crypto API - EXACT COPY from auth.ts
 * This MUST be identical to the hashPassword function in auth.ts
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
 * Simple synchronous password hashing for initial user creation
 * Uses a basic hash for demo users - real auth still uses proper async hashing
 */
function hashPasswordSync(password: string): string {
  const normalizedPassword = password.toString().trim();
  
  if (!normalizedPassword) {
    throw new Error("Password cannot be empty");
  }
  
  // Simple deterministic hash for demo purposes
  let hash = 0;
  for (let i = 0; i < normalizedPassword.length; i++) {
    const char = normalizedPassword.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and pad to 64 characters to match expected format
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  const fullHash = hexHash.repeat(8); // Make it 64 chars like SHA-256
  
  console.log("🔐 Password hashed (sync):", {
    originalLength: password.length,
    normalizedLength: normalizedPassword.length,
    hashFirst10: fullHash.substring(0, 10)
  });
  
  return fullHash;
}

/**
 * Create essential users with proper async password hashing
 * FIXED: Now properly async to use the same SHA-256 hashing as auth
 * NO FAKE ANALYTICS - Users are created clean, ready for real usage tracking
 */
async function createEssentialUsersSync(): Promise<void> {
  if (!sharedDatabase) {
    throw new Error("Database not initialized");
  }
  
  console.log("👥 Creating essential users WITHOUT fake analytics...");
  
  try {
    // 1. Admin user - Marie
    const adminPasswordHash = await hashPassword("admin123");
    const adminUser: MockUser = {
      id: "admin-001",
      name: "Marie Johnson",
      email: "marie@bravethingsbooks.com",
      password_hash: adminPasswordHash,
      created_at: new Date(),
      subscription_status: "premium",
      role: "admin"
    };
    sharedDatabase.users.set("admin-001", adminUser);
    console.log("👑 Created admin user: marie@bravethingsbooks.com / admin123");
    
    // 2. Demo user - NO FAKE ANALYTICS
    const demoPasswordHash = await hashPassword("demo123");
    const demoUser: MockUser = {
      id: "demo-001",
      name: "Demo User",
      email: "demo@example.com",
      password_hash: demoPasswordHash,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      subscription_status: "free",
      role: "user"
    };
    sharedDatabase.users.set("demo-001", demoUser);
    console.log("🎭 Created demo user: demo@example.com / demo123");
    
    // Grant free access to "Where the Brave Things Grow" for both users
    const adminPurchase: MockPurchase = {
      id: "purchase-admin-wtbtg",
      userId: "admin-001",
      bookId: "wtbtg",
      status: "completed",
      access_type: "free",
      purchased_at: new Date()
    };
    sharedDatabase.purchases.set("purchase-admin-wtbtg", adminPurchase);
    
    const demoPurchase: MockPurchase = {
      id: "purchase-demo-wtbtg", 
      userId: "demo-001",
      bookId: "wtbtg",
      status: "completed",
      access_type: "free",
      purchased_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) // 25 days ago
    };
    sharedDatabase.purchases.set("purchase-demo-wtbtg", demoPurchase);
    
    // NO FAKE ANALYTICS - Users start with clean analytics ready for real data
    console.log("🧹 Users created WITHOUT fake analytics - ready for real data collection");
    
    // 3. Create Users 1-10 (Users 1-4 are preview users, Users 5-10 are full users)
    console.log("👥 Creating users 1-10...");
    for (let i = 1; i <= 10; i++) {
      const userPasswordHash = await hashPassword(`user${i}123`);
      const userId = `user-${i.toString().padStart(3, '0')}`;
      const role = i <= 4 ? "preview" : "user"; // Users 1-4 get preview role
      const user: MockUser = {
        id: userId,
        name: `User ${i}`,
        email: `user${i}@bravethingslab.com`,
        password_hash: userPasswordHash,
        created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Staggered creation dates
        subscription_status: i % 3 === 0 ? "premium" : "free", // Every 3rd user is premium
        role: role
      };
      sharedDatabase.users.set(userId, user);
      
      // Grant free access to "Where the Brave Things Grow" for all users
      const userPurchase: MockPurchase = {
        id: `purchase-user${i}-wtbtg`,
        userId: userId,
        bookId: "wtbtg",
        status: "completed",
        access_type: "free",
        purchased_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
      };
      sharedDatabase.purchases.set(`purchase-user${i}-wtbtg`, userPurchase);
      
      // NO FAKE ANALYTICS CREATED - All users start clean
      
      console.log(`✅ Created user${i}@bravethingslab.com / user${i}123 (${user.subscription_status})`);
    }
    
    console.log("✅ Essential users created successfully WITHOUT fake analytics");
    console.log("📊 Available accounts:");
    console.log("  - Admin: marie@bravethingsbooks.com / admin123");
    console.log("  - Demo: demo@example.com / demo123");
    console.log("  - Users 1-10: user1@bravethingslab.com / user1123, user2@bravethingslab.com / user2123, etc.");
    console.log("🧹 Clean analytics system ready for REAL user data");
    
  } catch (error) {
    console.error("❌ Failed to create essential users:", error);
    throw error;
  }
}

/**
 * Get the shared database instance - FIXED for immediate user creation
 * Creates it if it doesn't exist yet and ensures users are immediately available
 */
export async function getSharedDatabase(): Promise<MockDatabase> {
  // CRITICAL FIX: Try to restore from global first
  if (typeof globalThis !== 'undefined' && globalThis.__BRAVE_THINGS_DB__ && !sharedDatabase) {
    console.log("🔄 Restoring database from global persistence...");
    sharedDatabase = globalThis.__BRAVE_THINGS_DB__;
    
    // ENHANCED ANALYTICS: Check and initialize enhanced analytics storage if missing
    if (!sharedDatabase.enhancedAnalyticsSessions) {
      console.log("🔧 Adding enhanced analytics storage to restored database...");
      sharedDatabase.enhancedAnalyticsSessions = new Map<string, MockEnhancedAnalyticsSession>();
      globalThis.__BRAVE_THINGS_DB__ = sharedDatabase; // Update global storage
    }
    
    // Check if we have analytics data, if not, create test data
    const analyticsCount = sharedDatabase.userAnalytics.size;
    console.log(`📊 Found ${analyticsCount} analytics profiles in restored database`);
    
    console.log("🧹 Clean analytics system - no fake data, ready for real user activity");
    
    // Verify users exist after restoration
    const userCount = sharedDatabase.users.size;
    console.log("📊 Restored database has", userCount, "users");
    
    if (userCount === 0) {
      console.log("⚠️ Restored database has no users, recreating...");
      sharedDatabase = null; // Force recreation
    } else {
      // Check if critical users exist
      const marieExists = Array.from(sharedDatabase.users.values()).some(u => u.email === "marie@bravethingsbooks.com");
      const user3Exists = Array.from(sharedDatabase.users.values()).some(u => u.email === "user3@bravethingslab.com");
      console.log("👑 Marie exists:", marieExists);
      console.log("👤 User3 exists:", user3Exists);
      
      if (marieExists && user3Exists) {
        return sharedDatabase;
      } else {
        console.log("⚠️ Critical users missing, forcing recreation...");
        sharedDatabase = null; // Force recreation
      }
    }
  }
  
  if (!sharedDatabase) {
    console.log("🔄 Creating fresh database with immediate user creation...");
    sharedDatabase = {
      users: new Map<string, MockUser>(),
      books: new Map<string, MockBook>([
        [
          "wtbtg",
          {
            id: "wtbtg",
            title: "Where the Brave Things Grow",
            author: "Brave Things Lab Team",
            externalUrl: "/book/wtbtg", // Internal book route - book is built into platform
            price: 0,
            isActive: true,
          },
        ],
      ]),
      purchases: new Map<string, MockPurchase>(),
      progress: new Map<string, MockProgress>(),
      passwordResetTokens: new Map<string, MockPasswordResetToken>(),
      readingSessions: new Map<string, MockReadingSession>(),
      pageEngagements: new Map<string, MockPageEngagement>(),
      userAnalytics: new Map<string, MockUserAnalytics>(),
      // Enhanced Token-Based Storage
      tokenBookmarks: new Map<string, MockBookmark>(),
      analyticsessions: new Map<string, MockAnalyticsSession>(),
      // Persistent Token Storage - FIXES the "new token every time" issue
      bookAccessTokens: new Map<string, MockBookAccessToken>(),
      // ENHANCED ANALYTICS STORAGE (NEW)
      enhancedAnalyticsSessions: new Map<string, MockEnhancedAnalyticsSession>(),
    };
    
    // IMMEDIATE user creation - now properly async WITHOUT FAKE ANALYTICS
    console.log("👥 Creating users immediately...");
    try {
      await createEssentialUsersSync();
    } catch (error) {
      console.error("❌ Failed to create users:", error);
      // Fall back to empty database rather than crash
    }
    
    // Store in global persistence immediately
    if (typeof globalThis !== 'undefined') {
      globalThis.__BRAVE_THINGS_DB__ = sharedDatabase;
      console.log("💾 Stored database in global persistence with", sharedDatabase.users.size, "users");
    }
  } else {
    console.log("📚 Reusing existing shared database with", {
      users: sharedDatabase.users.size,
      books: sharedDatabase.books.size,
      purchases: sharedDatabase.purchases.size,
      enhancedAnalyticsSessions: sharedDatabase.enhancedAnalyticsSessions?.size || 0,
      userEmails: Array.from(sharedDatabase.users.values()).map(u => u.email),
      timestamp: new Date().toISOString()
    });
  }
  
  return sharedDatabase;
}

/**
 * Get the shared database instance with async initialization
 * Use this for auth routes to ensure users are loaded
 */
export async function getSharedDatabaseAsync(): Promise<MockDatabase> {
  // CRITICAL FIX: Try to restore from global first
  if (typeof globalThis !== 'undefined' && globalThis.__BRAVE_THINGS_DB__ && !sharedDatabase) {
    console.log("🔄 Restoring database from global persistence (async)...");
    sharedDatabase = globalThis.__BRAVE_THINGS_DB__;
    
    // ENHANCED ANALYTICS: Check and initialize enhanced analytics storage if missing
    if (!sharedDatabase.enhancedAnalyticsSessions) {
      console.log("🔧 Adding enhanced analytics storage to restored database (async)...");
      sharedDatabase.enhancedAnalyticsSessions = new Map<string, MockEnhancedAnalyticsSession>();
      globalThis.__BRAVE_THINGS_DB__ = sharedDatabase; // Update global storage
    }
    
    // Check if we have analytics data, if not, create test data
    const analyticsCount = sharedDatabase.userAnalytics.size;
    console.log(`📊 Found ${analyticsCount} analytics profiles in restored database (async)`);
    
    console.log("🧹 Clean analytics system ready for real data collection");
    
    return sharedDatabase;
  }
  
  if (!sharedDatabase) {
    // FIXED: Actually wait for proper initialization
    console.log("🔄 Database not ready, initializing with full async support...");
    sharedDatabase = await initializeDatabase();
  }
  
  return sharedDatabase;
}

/**
 * Clear fake analytics data while preserving all users and their connections
 * This removes ONLY the generated demo data, not the users or analytics system
 */
function clearFakeAnalyticsData(): void {
  if (!sharedDatabase) {
    console.log("⚠️ No database to clean");
    return;
  }
  
  console.log("🧹 STARTING SURGICAL CLEANUP - Removing ONLY fake analytics data...");
  
  // Count before cleanup
  const beforeCounts = {
    readingSessions: sharedDatabase.readingSessions.size,
    pageEngagements: sharedDatabase.pageEngagements.size,
    userAnalytics: sharedDatabase.userAnalytics.size,
    progress: sharedDatabase.progress.size,
    users: sharedDatabase.users.size,
    purchases: sharedDatabase.purchases.size,
    enhancedAnalyticsSessions: sharedDatabase.enhancedAnalyticsSessions?.size || 0
  };
  
  // CLEAR FAKE ANALYTICS DATA ONLY - Preserve all users and their connections
  sharedDatabase.readingSessions.clear();
  sharedDatabase.pageEngagements.clear();
  sharedDatabase.userAnalytics.clear();
  // Note: We keep progress map structure but clear any fake reading progress
  sharedDatabase.progress.clear();
  // Clear enhanced analytics sessions too
  if (sharedDatabase.enhancedAnalyticsSessions) {
    sharedDatabase.enhancedAnalyticsSessions.clear();
  }
  
  // Count after cleanup
  const afterCounts = {
    readingSessions: sharedDatabase.readingSessions.size,
    pageEngagements: sharedDatabase.pageEngagements.size,
    userAnalytics: sharedDatabase.userAnalytics.size,
    progress: sharedDatabase.progress.size,
    users: sharedDatabase.users.size,
    purchases: sharedDatabase.purchases.size,
    enhancedAnalyticsSessions: sharedDatabase.enhancedAnalyticsSessions?.size || 0
  };
  
  console.log("🧹 CLEANUP COMPLETE - Fake analytics data removed:");
  console.log("  📊 Before cleanup:", beforeCounts);
  console.log("  📊 After cleanup:", afterCounts);
  console.log("✅ PRESERVED: All users, login credentials, purchases, and system connections");
  console.log("🗑️ REMOVED: All fake analytics data (reading sessions, page engagements, user behavior analytics, fake progress)");
  console.log("🎯 RESULT: Clean analytics system ready for REAL user data");
}

/**
 * Function removed - No more fake analytics data generation
 * All analytics will be generated from real user activity
 */

/**
 * CRITICAL FUNCTION: Ensure admin user exists
 * This function was working in your code last night and needs to be called on every login
 * to prevent Marie from disappearing due to database resets.
 */
export async function ensureAdminUserExists(database: MockDatabase): Promise<void> {
  console.log("🔧 ENSURING ADMIN USER EXISTS...");
  
  try {
    // Check if Marie already exists
    const existingMarie = Array.from(database.users.values())
      .find(user => user.email === "marie@bravethingsbooks.com");
    
    if (existingMarie) {
      console.log("✅ Admin user Marie already exists:", {
        id: existingMarie.id,
        email: existingMarie.email,
        name: existingMarie.name,
        role: existingMarie.role,
        hasPassword: !!existingMarie.password_hash
      });
      return;
    }
    
    console.log("⚠️ Admin user Marie not found - recreating...");
    
    // Recreate Marie's admin account
    const adminPasswordHash = await hashPassword("admin123");
    const adminUser: MockUser = {
      id: "admin-001",
      name: "Marie Johnson",
      email: "marie@bravethingsbooks.com",
      password_hash: adminPasswordHash,
      created_at: new Date(),
      subscription_status: "premium",
      role: "admin"
    };
    
    // Store admin user
    database.users.set("admin-001", adminUser);
    
    // Ensure admin has free access to the book
    const adminPurchase: MockPurchase = {
      id: "purchase-admin-wtbtg",
      userId: "admin-001",
      bookId: "wtbtg",
      status: "completed",
      access_type: "free",
      purchased_at: new Date()
    };
    database.purchases.set("purchase-admin-wtbtg", adminPurchase);
    
    // CRITICAL: Force persistence to global immediately
    if (typeof globalThis !== 'undefined') {
      globalThis.__BRAVE_THINGS_DB__ = database;
      console.log("💾 FORCED global persistence after admin user recreation");
    }
    
    console.log("👑 ADMIN USER MARIE RECREATED SUCCESSFULLY:");
    console.log("  ID:", adminUser.id);
    console.log("  Email:", adminUser.email);
    console.log("  Password Hash Length:", adminUser.password_hash?.length);
    console.log("  Role:", adminUser.role);
    console.log("  Total Users Now:", database.users.size);
    
  } catch (error) {
    console.error("❌ CRITICAL ERROR: Failed to ensure admin user exists:", error);
    throw error;
  }
}

/**
 * CRITICAL FUNCTION: Ensure all users exist
 * This function ensures that all regular users (demo user + users 1-10) get recreated
 * when they disappear due to database resets, just like ensureAdminUserExists does for Marie.
 */
export async function ensureAllUsersExist(database: MockDatabase): Promise<void> {
  console.log("🔧 ENSURING ALL USERS EXIST...");
  
  try {
    // List of expected users
    const expectedUsers = [
      { email: "demo@example.com", password: "demo123", name: "Demo User", id: "demo-001" },
      ...Array.from({ length: 10 }, (_, i) => ({
        email: `user${i + 1}@bravethingslab.com`,
        password: `user${i + 1}123`,
        name: `User ${i + 1}`,
        id: `user-${(i + 1).toString().padStart(3, '0')}`
      }))
    ];
    
    let recreatedCount = 0;
    
    for (const expectedUser of expectedUsers) {
      // Check if user already exists
      const existingUser = Array.from(database.users.values())
        .find(user => user.email === expectedUser.email);
      
      if (existingUser) {
        continue; // User already exists, skip
      }
      
      console.log(`⚠️ User ${expectedUser.email} not found - recreating...`);
      
      // Recreate the user
      const userPasswordHash = await hashPassword(expectedUser.password);
      const userNumber = expectedUser.id.includes('user') ? parseInt(expectedUser.id.split('-')[1]) : 0;
      const role = userNumber >= 1 && userNumber <= 4 ? "preview" : "user"; // Users 1-4 get preview role
      const user: MockUser = {
        id: expectedUser.id,
        name: expectedUser.name,
        email: expectedUser.email,
        password_hash: userPasswordHash,
        created_at: new Date(),
        subscription_status: expectedUser.id.includes('user') && parseInt(expectedUser.id.split('-')[1]) % 3 === 0 ? "premium" : "free",
        role: role
      };
      
      // Store user
      database.users.set(expectedUser.id, user);
      
      // Grant free access to "Where the Brave Things Grow"
      const userPurchase: MockPurchase = {
        id: `purchase-${expectedUser.id}-wtbtg`,
        userId: expectedUser.id,
        bookId: "wtbtg",
        status: "completed",
        access_type: "free",
        purchased_at: new Date()
      };
      database.purchases.set(`purchase-${expectedUser.id}-wtbtg`, userPurchase);
      
      // NO FAKE ANALYTICS CREATED - All recreated users start clean
      
      recreatedCount++;
      console.log(`✅ Recreated user: ${expectedUser.email} / ${expectedUser.password}`);
    }
    
    if (recreatedCount > 0) {
      // CRITICAL: Force persistence to global immediately
      if (typeof globalThis !== 'undefined') {
        globalThis.__BRAVE_THINGS_DB__ = database;
        console.log("💾 FORCED global persistence after user recreation");
      }
      
      console.log(`👥 USERS RECREATED SUCCESSFULLY: ${recreatedCount} users`);
      console.log("📊 Available accounts:");
      console.log("  - Demo: demo@example.com / demo123");
      console.log("  - Users 1-10: user1@bravethingslab.com / user1123, user2@bravethingslab.com / user2123, etc.");
      console.log("  Total Users Now:", database.users.size);
    } else {
      console.log("✅ All users already exist, no recreation needed");
    }
    
  } catch (error) {
    console.error("❌ CRITICAL ERROR: Failed to ensure all users exist:", error);
    throw error;
  }
}

/**
 * Reset the database (useful for testing)
 */
export function resetDatabase(): void {
  sharedDatabase = null;
}