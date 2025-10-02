import z from "zod";

// Example schema (existing)
export const HelloPayloadSchema = z.object({
  message: z.string(),
});
export type HelloPayloadSchema = z.infer<typeof HelloPayloadSchema>;

// Core Database Schemas (Updated to follow database best practices)

// Users table
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  name: z.string(),
  created_at: z.date(),
  subscription_status: z.enum(["free", "premium"]).default("free"),
  role: z.enum(["user", "admin", "preview"]).default("user"),
});
export type User = z.infer<typeof UserSchema>;

// Books table
export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  cover_image: z.string().url(),
  price: z.number(),
  book_url: z.string().url(), // URL to the actual book project
  is_published: z.boolean().default(true),
  created_at: z.date(),
});
export type Book = z.infer<typeof BookSchema>;

// Purchases table
export const PurchaseSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  book_id: z.string(),
  stripe_payment_id: z.string(),
  purchased_at: z.date(),
  access_expires: z.date().optional(), // null for permanent access
});
export type Purchase = z.infer<typeof PurchaseSchema>;

// Reading progress table
export const ReadingProgressSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  book_id: z.string(),
  current_chapter: z.number(),
  current_spread: z.number(),
  completion_percentage: z.number().min(0).max(100),
  last_read_at: z.date(),
});
export type ReadingProgress = z.infer<typeof ReadingProgressSchema>;

// Book Access Token System Schemas (Keep existing for compatibility)
export const BookAccessTokenSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  purchaseId: z.string(),
  expiresAt: z.number(), // Unix timestamp
  permissions: z.array(z.enum(["read", "bookmark", "progress"])).default(["read", "bookmark", "progress"]),
});
export type BookAccessToken = z.infer<typeof BookAccessTokenSchema>;

// JWT Payload Schema for validation after token verification
export const JWTPayloadSchema = z.object({
  userId: z.string(),
  bookId: z.string(),
  purchaseId: z.string(),
  permissions: z.array(z.string()),
  exp: z.number().optional(),
  iat: z.number().optional(),
});
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

export const TokenValidationRequestSchema = z.object({
  token: z.string(),
  bookId: z.string(),
});
export type TokenValidationRequest = z.infer<typeof TokenValidationRequestSchema>;

export const TokenValidationResponseSchema = z.object({
  valid: z.boolean(),
  userId: z.string().optional(),
  bookId: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }).optional(),
});
export type TokenValidationResponse = z.infer<typeof TokenValidationResponseSchema>;

export const UpdateProgressRequestSchema = z.object({
  token: z.string(),
  progress: z.number().min(0).max(100),
  currentPage: z.number().optional(),
  currentChapter: z.string().optional(),
  timeSpent: z.number().optional(),
  bookmarks: z.array(z.object({
    page: z.number(),
    chapter: z.string().optional(),
    note: z.string().optional(),
  })).optional(),
});
export type UpdateProgressRequest = z.infer<typeof UpdateProgressRequestSchema>;

// API Request/Response schemas
export const GenerateTokenRequestSchema = z.object({
  bookId: z.string(),
  // userId will be extracted from JWT auth
});
export type GenerateTokenRequest = z.infer<typeof GenerateTokenRequestSchema>;

export const GenerateTokenResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  expiresAt: z.number().optional(),
  bookUrl: z.string().url().optional(),
  error: z.string().optional(),
});
export type GenerateTokenResponse = z.infer<typeof GenerateTokenResponseSchema>;

// Authentication Schemas
export const RegisterRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    subscription_status: z.enum(["free", "premium"]),
    role: z.enum(["user", "admin"]).default("user"),
  }).optional(),
  error: z.string().optional(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Auth JWT Token Schema (for user session tokens, different from book access tokens)
export const UserJWTPayloadSchema = z.object({
  userId: z.string(),
  email: z.string(),
  exp: z.number().optional(),
  iat: z.number().optional(),
});
export type UserJWTPayload = z.infer<typeof UserJWTPayloadSchema>;

// Password Reset Schemas
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

export const PasswordResetResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
});
export type PasswordResetResponse = z.infer<typeof PasswordResetResponseSchema>;

// Instant Reset Schemas
export const InstantResetRequestSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
export type InstantResetRequest = z.infer<typeof InstantResetRequestSchema>;

export const InstantResetResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
});
export type InstantResetResponse = z.infer<typeof InstantResetResponseSchema>;

// User Analytics Schemas
export const ReadingSessionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  book_id: z.string(),
  session_start: z.date(),
  session_end: z.date().optional(),
  total_duration: z.number(), // seconds
  pages_visited: z.array(z.number()),
  interactions_count: z.number(),
  device_type: z.enum(["desktop", "tablet", "mobile"]).optional(),
  browser_info: z.string().optional(),
});
export type ReadingSession = z.infer<typeof ReadingSessionSchema>;

export const PageEngagementSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  book_id: z.string(),
  session_id: z.string(),
  page_number: z.number(),
  chapter_name: z.string().optional(),
  time_on_page: z.number(), // seconds
  interactions: z.array(z.object({
    type: z.enum(["click", "scroll", "hover", "focus", "play", "pause"]),
    element: z.string(),
    timestamp: z.date(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }).optional(),
  })),
  scroll_depth: z.number().min(0).max(100), // percentage
  completion_status: z.enum(["started", "partial", "completed", "skipped"]),
  exit_reason: z.enum(["next_page", "navigation", "close", "timeout"]).optional(),
  created_at: z.date(),
});
export type PageEngagement = z.infer<typeof PageEngagementSchema>;

export const UserBehaviorAnalyticsSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  total_sessions: z.number(),
  total_reading_time: z.number(), // seconds
  average_session_duration: z.number(), // seconds
  pages_read: z.number(),
  completion_rate: z.number().min(0).max(100), // percentage
  return_frequency: z.number(), // days between sessions
  engagement_score: z.number().min(0).max(100), // calculated score
  preferred_reading_time: z.string().optional(), // "morning", "afternoon", "evening"
  most_engaged_chapters: z.array(z.string()),
  interaction_patterns: z.object({
    clicks_per_page: z.number(),
    scroll_behavior: z.enum(["fast", "moderate", "slow"]),
    pause_frequency: z.number(),
  }),
  last_calculated: z.date(),
});
export type UserBehaviorAnalytics = z.infer<typeof UserBehaviorAnalyticsSchema>;

// Enhanced Token-Based Bookmark Schemas
export const BookmarkSchema = z.object({
  id: z.string(),
  page: z.number(),
  chapter: z.string().optional(),
  note: z.string().optional(),
  created_at: z.string(), // ISO date string
  updated_at: z.string().optional(), // ISO date string
  bookmark_type: z.enum(["page_save", "note", "highlight", "interactive_cue"]).default("page_save"),
  metadata: z.object({
    cue_name: z.string().optional(), // For interactive cue bookmarks
    highlight_text: z.string().optional(), // For highlight bookmarks
    position: z.object({
      x: z.number(),
      y: z.number(),
    }).optional(),
  }).optional(),
});
export type Bookmark = z.infer<typeof BookmarkSchema>;

// Token-Based Bookmark Management Schemas
export const GetBookmarksRequestSchema = z.object({
  token: z.string(),
});
export type GetBookmarksRequest = z.infer<typeof GetBookmarksRequestSchema>;

export const GetBookmarksResponseSchema = z.object({
  success: z.boolean(),
  bookmarks: z.array(BookmarkSchema).optional(),
  error: z.string().optional(),
});
export type GetBookmarksResponse = z.infer<typeof GetBookmarksResponseSchema>;

export const AddBookmarkRequestSchema = z.object({
  token: z.string(),
  bookmark: z.object({
    page: z.number(),
    chapter: z.string().optional(),
    note: z.string().optional(),
    bookmark_type: z.enum(["page_save", "note", "highlight", "interactive_cue"]).default("page_save"),
    metadata: z.object({
      cue_name: z.string().optional(),
      highlight_text: z.string().optional(),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }).optional(),
    }).optional(),
  }),
});
export type AddBookmarkRequest = z.infer<typeof AddBookmarkRequestSchema>;

export const UpdateBookmarkRequestSchema = z.object({
  token: z.string(),
  bookmark_id: z.string(),
  updates: z.object({
    note: z.string().optional(),
    bookmark_type: z.enum(["page_save", "note", "highlight", "interactive_cue"]).optional(),
    metadata: z.object({
      cue_name: z.string().optional(),
      highlight_text: z.string().optional(),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }).optional(),
    }).optional(),
  }),
});
export type UpdateBookmarkRequest = z.infer<typeof UpdateBookmarkRequestSchema>;

export const DeleteBookmarkRequestSchema = z.object({
  token: z.string(),
  bookmark_id: z.string(),
});
export type DeleteBookmarkRequest = z.infer<typeof DeleteBookmarkRequestSchema>;

export const BookmarkResponseSchema = z.object({
  success: z.boolean(),
  bookmark: BookmarkSchema.optional(),
  error: z.string().optional(),
});
export type BookmarkResponse = z.infer<typeof BookmarkResponseSchema>;

// Enhanced Token-Based Analytics Schemas
export const TokenAnalyticsSessionSchema = z.object({
  session_id: z.string(),
  start_time: z.string(), // ISO date string
  end_time: z.string().optional(), // ISO date string
  device_info: z.object({
    type: z.enum(["desktop", "tablet", "mobile"]).optional(),
    browser: z.string().optional(),
    screen_size: z.object({
      width: z.number(),
      height: z.number(),
    }).optional(),
  }).optional(),
  reading_metrics: z.object({
    pages_visited: z.array(z.number()),
    total_interactions: z.number(),
    cues_collected: z.array(z.string()), // Names of interactive cues collected
    time_per_page: z.record(z.string(), z.number()), // Page number -> seconds
  }),
});
export type TokenAnalyticsSession = z.infer<typeof TokenAnalyticsSessionSchema>;

export const TrackAnalyticsRequestSchema = z.object({
  token: z.string(),
  session_data: TokenAnalyticsSessionSchema,
  page_interactions: z.array(z.object({
    page_number: z.number(),
    chapter_name: z.string().optional(),
    interactions: z.array(z.object({
      type: z.enum(["click", "scroll", "hover", "focus", "play", "pause", "cue_collect", "bookmark_add"]),
      element: z.string(),
      timestamp: z.string(), // ISO date string
      metadata: z.object({
        cue_name: z.string().optional(),
        scroll_position: z.number().optional(),
        click_position: z.object({
          x: z.number(),
          y: z.number(),
        }).optional(),
      }).optional(),
    })),
    engagement_score: z.number().min(0).max(100), // Calculated engagement for this page
  })),
});
export type TrackAnalyticsRequest = z.infer<typeof TrackAnalyticsRequestSchema>;

export const TrackAnalyticsResponseSchema = z.object({
  success: z.boolean(),
  analytics_stored: z.boolean(),
  session_id: z.string().optional(),
  error: z.string().optional(),
});
export type TrackAnalyticsResponse = z.infer<typeof TrackAnalyticsResponseSchema>;

// Enhanced Token Validation Response with Bookmarks and Analytics
export const EnhancedTokenValidationResponseSchema = z.object({
  valid: z.boolean(),
  userId: z.string().optional(),
  bookId: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }).optional(),
  // Enhanced data for external books
  bookmarks: z.array(BookmarkSchema).optional(),
  progress: z.object({
    current_page: z.number(),
    current_chapter: z.string().optional(),
    completion_percentage: z.number().min(0).max(100),
    time_spent: z.number(), // Total time in seconds
    last_read_at: z.string(), // ISO date string
  }).optional(),
  analytics_session_id: z.string().optional(), // For tracking this session
  // Return navigation information for external books
  return_info: z.object({
    url: z.string().url(),
    label: z.string(),
    platform: z.string(),
  }).optional(),
});
export type EnhancedTokenValidationResponse = z.infer<typeof EnhancedTokenValidationResponseSchema>;

// API Schemas for Analytics (Keep existing for compatibility)
export const TrackPageEngagementSchema = z.object({
  token: z.string(),
  page_number: z.number(),
  chapter_name: z.string().optional(),
  time_on_page: z.number(),
  interactions: z.array(z.object({
    type: z.enum(["click", "scroll", "hover", "focus", "play", "pause"]),
    element: z.string(),
    timestamp: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }).optional(),
  })),
  scroll_depth: z.number().min(0).max(100),
  completion_status: z.enum(["started", "partial", "completed", "skipped"]),
  exit_reason: z.enum(["next_page", "navigation", "close", "timeout"]).optional(),
});
export type TrackPageEngagementRequest = z.infer<typeof TrackPageEngagementSchema>;

export const UserAnalyticsResponseSchema = z.object({
  user_id: z.string(),
  overview: z.object({
    total_sessions: z.number(),
    total_reading_time: z.number(),
    last_read_at: z.string().optional(),
    completion_rate: z.number(),
    engagement_score: z.number(),
  }),
  recent_sessions: z.array(z.object({
    id: z.string(),
    date: z.string(),
    duration: z.number(),
    pages_read: z.number(),
    completion_rate: z.number(),
  })),
  page_analytics: z.array(z.object({
    page_number: z.number(),
    chapter_name: z.string().optional(),
    average_time: z.number(),
    completion_rate: z.number(),
    interaction_density: z.number(),
  })),
  behavior_insights: z.object({
    reading_patterns: z.array(z.string()),
    engagement_trends: z.array(z.object({
      date: z.string(),
      score: z.number(),
    })),
    recommendations: z.array(z.string()),
  }),
});
export type UserAnalyticsResponse = z.infer<typeof UserAnalyticsResponseSchema>;

// ========================================================================
// 🎯 ENHANCED ANALYTICS SCHEMAS (NEW) - Extension, not replacement
// ========================================================================

// Page Type Classification Schema
export const PageTypeSchema = z.enum([
  "story",       // Regular story content pages
  "cue",         // Interactive cue pages with clickable elements
  "activity",    // Activity pages with print buttons and exercises
  "navigation",  // Table of contents, introduction, conclusion
  "other"        // Fallback for unclassified pages
]);
export type PageType = z.infer<typeof PageTypeSchema>;

// Navigation Source Schema
export const NavigationSourceSchema = z.enum([
  "toc",              // Table of contents navigation
  "chapter_nav",      // Previous/next chapter navigation
  "spread_nav",       // Previous/next spread navigation
  "breadcrumb",       // Breadcrumb navigation
  "home_button",      // Home/back buttons
  "direct_url",       // Direct URL access
  "other"             // Fallback
]);
export type NavigationSource = z.infer<typeof NavigationSourceSchema>;

// Enhanced Cue Interaction Schema
export const EnhancedCueInteractionSchema = z.object({
  cue_name: z.string(),                       // "Golden Leaf", "Rainbow Tail", etc.
  cue_icon: z.string(),                       // Icon name or unicode
  chapter_id: z.number(),                     // Which chapter this cue belongs to
  spread_number: z.number(),                  // Which spread within the chapter
  time_before_click: z.number(),              // Seconds spent on page before clicking cue
  click_timestamp: z.string(),                // ISO timestamp when cue was clicked
  completion_status: z.enum(["started", "completed", "abandoned"]),
  engagement_score: z.number().min(0).max(100), // 0-100 based on time spent and completion
});
export type EnhancedCueInteraction = z.infer<typeof EnhancedCueInteractionSchema>;

// Enhanced Page Engagement Schema (extends existing)
export const EnhancedPageEngagementSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  book_id: z.string(),
  session_id: z.string(),
  page_number: z.number(),
  chapter_name: z.string().optional(),
  
  // Enhanced page classification
  page_type: PageTypeSchema,
  navigation_source: NavigationSourceSchema,
  
  // Enhanced timing data
  time_on_page: z.number(),                   // Total seconds on page
  actual_time_seconds: z.number(),            // Actual engagement time (excluding idle)
  time_before_interaction: z.number(),        // Time before first meaningful interaction
  
  // Enhanced interaction tracking
  interactions: z.array(z.object({
    type: z.enum(["click", "scroll", "hover", "focus", "play", "pause", "print", "cue_click", "nav_click"]),
    element: z.string(),
    timestamp: z.date(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }).optional(),
    metadata: z.object({
      navigation_source: NavigationSourceSchema.optional(),
      cue_name: z.string().optional(),
      print_target: z.string().optional(),
    }).optional(),
  })),
  
  // Enhanced cue tracking
  cue_interactions: z.array(EnhancedCueInteractionSchema),
  
  // Enhanced activity tracking
  print_clicks: z.number(),                   // Number of print button clicks
  print_targets: z.array(z.string()),        // What was printed
  
  // Existing fields (compatibility)
  scroll_depth: z.number().min(0).max(100),
  completion_status: z.enum(["started", "partial", "completed", "skipped"]),
  exit_reason: z.enum(["next_page", "navigation", "close", "timeout"]).optional(),
  created_at: z.date(),
});
export type EnhancedPageEngagement = z.infer<typeof EnhancedPageEngagementSchema>;

// Enhanced User Analytics Schema (extends existing)
export const EnhancedUserAnalyticsSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  
  // Existing analytics (compatibility)
  total_sessions: z.number(),
  total_reading_time: z.number(),
  average_session_duration: z.number(),
  pages_read: z.number(),
  completion_rate: z.number().min(0).max(100),
  return_frequency: z.number(),
  engagement_score: z.number().min(0).max(100),
  preferred_reading_time: z.string().optional(),
  most_engaged_chapters: z.array(z.string()),
  interaction_patterns: z.object({
    clicks_per_page: z.number(),
    scroll_behavior: z.enum(["fast", "moderate", "slow"]),
    pause_frequency: z.number(),
  }),
  
  // Enhanced page type analytics
  page_type_analytics: z.object({
    story_pages: z.number(),                  // Count of story pages visited
    cue_pages: z.number(),                    // Count of cue pages visited
    activity_pages: z.number(),               // Count of activity pages visited
    average_time_per_story_page: z.number(),
    average_time_per_cue_page: z.number(),
    average_time_per_activity_page: z.number(),
  }),
  
  // Enhanced cue engagement analytics
  cue_engagement: z.object({
    total_cues_encountered: z.number(),       // How many cue pages they visited
    total_cues_completed: z.number(),         // How many cues they actually clicked
    completion_rate: z.number(),              // Percentage of encountered cues completed
    average_time_before_click: z.number(),    // Average seconds before clicking cues
    favorite_cues: z.array(z.string()),      // Most interacted with cue names
    cue_specific_metrics: z.record(z.string(), z.object({
      encounters: z.number(),
      completions: z.number(),
      average_engagement_time: z.number(),
    })),
  }),
  
  // Enhanced navigation pattern analytics
  navigation_patterns: z.object({
    toc_usage: z.number(),                    // How often they use table of contents
    linear_reading: z.number(),               // Percentage of linear vs jump navigation
    back_button_usage: z.number(),            // How often they go back
    preferred_navigation_method: NavigationSourceSchema,
    average_session_depth: z.number(),        // Average pages per session
  }),
  
  // Enhanced print behavior analytics
  print_behavior: z.object({
    total_print_clicks: z.number(),           // Total print button clicks
    pages_printed: z.array(z.string()),      // Which pages/activities they printed
    print_engagement_rate: z.number(),        // Percentage of activity pages printed
    most_printed_activities: z.array(z.string()),
  }),
  
  last_calculated: z.date(),
});
export type EnhancedUserAnalytics = z.infer<typeof EnhancedUserAnalyticsSchema>;

// Enhanced Analytics Tracking Request Schema
export const EnhancedAnalyticsTrackingRequestSchema = z.object({
  // User authentication
  user_id: z.string(),                        // Use user auth instead of tokens
  session_id: z.string(),                     // Current reading session
  
  // Page information
  page_data: z.object({
    page_number: z.number(),
    chapter_id: z.number(),
    chapter_name: z.string(),
    page_type: PageTypeSchema,
    navigation_source: NavigationSourceSchema,
  }),
  
  // Enhanced timing data
  timing_data: z.object({
    time_on_page: z.number(),
    actual_engagement_time: z.number(),       // Excluding idle time
    time_before_first_interaction: z.number(),
    session_duration_so_far: z.number(),
  }),
  
  // Enhanced interaction data
  interactions: z.array(z.object({
    type: z.enum(["click", "scroll", "hover", "focus", "play", "pause", "print", "cue_click", "nav_click"]),
    element: z.string(),
    timestamp: z.string(),                    // ISO timestamp
    position: z.object({ x: z.number(), y: z.number() }).optional(),
    metadata: z.object({
      navigation_source: NavigationSourceSchema.optional(),
      cue_name: z.string().optional(),
      print_target: z.string().optional(),
    }).optional(),
  })),
  
  // Cue interaction data (if applicable)
  cue_interactions: z.array(EnhancedCueInteractionSchema).optional(),
  
  // Print interaction data (if applicable)
  print_data: z.object({
    print_clicks: z.number(),
    print_targets: z.array(z.string()),
    time_on_activity_page: z.number(),
  }).optional(),
});
export type EnhancedAnalyticsTrackingRequest = z.infer<typeof EnhancedAnalyticsTrackingRequestSchema>;

// Enhanced Analytics Response Schema
export const EnhancedAnalyticsResponseSchema = z.object({
  success: z.boolean(),
  analytics_processed: z.boolean(),
  session_id: z.string(),
  page_engagement_id: z.string().optional(),
  analytics_summary: z.object({
    total_pages_this_session: z.number(),
    total_interactions_this_session: z.number(),
    cues_completed_this_session: z.number(),
    print_clicks_this_session: z.number(),
    current_engagement_score: z.number(),
  }).optional(),
  error: z.string().optional(),
});
export type EnhancedAnalyticsResponse = z.infer<typeof EnhancedAnalyticsResponseSchema>;

// Enhanced Analytics Summary Schema (for admin dashboard)
export const EnhancedAnalyticsSummarySchema = z.object({
  // Overall platform metrics
  total_users: z.number(),
  active_users_last_7_days: z.number(),
  total_reading_sessions: z.number(),
  total_reading_time_hours: z.number(),
  
  // Page type engagement metrics
  page_type_metrics: z.object({
    story_pages: z.object({
      total_visits: z.number(),
      average_time: z.number(),
      completion_rate: z.number(),
    }),
    cue_pages: z.object({
      total_visits: z.number(),
      total_interactions: z.number(),
      average_time_before_click: z.number(),
      completion_rate: z.number(),
    }),
    activity_pages: z.object({
      total_visits: z.number(),
      total_print_clicks: z.number(),
      print_engagement_rate: z.number(),
    }),
  }),
  
  // Cue-specific analytics
  cue_analytics: z.array(z.object({
    cue_name: z.string(),
    chapter_id: z.number(),
    total_encounters: z.number(),
    total_completions: z.number(),
    completion_rate: z.number(),
    average_engagement_time: z.number(),
  })),
  
  // Navigation pattern insights
  navigation_insights: z.object({
    most_used_navigation_method: NavigationSourceSchema,
    linear_vs_jump_reading_ratio: z.number(),
    average_session_depth: z.number(),
    bounce_rate: z.number(),
  }),
  
  // Top performing content
  top_performing: z.object({
    most_engaging_chapters: z.array(z.string()),
    most_completed_cues: z.array(z.string()),
    most_printed_activities: z.array(z.string()),
  }),
  
  generated_at: z.string(),                   // ISO timestamp
});
export type EnhancedAnalyticsSummary = z.infer<typeof EnhancedAnalyticsSummarySchema>;