/**
 * User-Account-Based Platform Tracking Library
 * 
 * Handles reading position tracking, analytics, and user engagement
 * tied to user accounts instead of temporary tokens. This ensures
 * continuous tracking across sessions and devices.
 * 
 * ENHANCED: Now includes detailed page type classification, cue interaction
 * timing, print behavior tracking, and navigation source analytics.
 */

import { client } from "@/lib/api";
import { loadBookmark } from "@/lib/bookmark";

// Enhanced tracking state interface
interface EnhancedTrackingState {
  isTracking: boolean;
  token: string | null;
  startTime: number;
  pausedTime: number;
  lastSyncTime: number;
  currentChapter: number;
  currentSpread: number;
  lastKnownPage: number;
  isVisible: boolean;
  // Session management
  currentSessionId: string | null;
  sessionStartTime: number;
  pagesVisitedInSession: Set<number>;
  interactionsInSession: string[];
  
  // ENHANCED: Page type and navigation tracking
  currentPageType: "story" | "cue" | "activity" | "navigation" | "other";
  navigationSource: "toc" | "chapter_nav" | "spread_nav" | "breadcrumb" | "home_button" | "direct_url" | "other";
  pageStartTime: number; // When current page was loaded
  firstInteractionTime: number; // When first meaningful interaction occurred
  cuePageStartTime: number; // When cue page was loaded (for timing before click)
  
  // ENHANCED: Interaction tracking for current page
  currentPageInteractions: Array<{
    type: "click" | "scroll" | "hover" | "focus" | "play" | "pause" | "print" | "cue_click" | "nav_click";
    element: string;
    timestamp: string;
    position?: { x: number; y: number };
    metadata?: {
      navigation_source?: "toc" | "chapter_nav" | "spread_nav" | "breadcrumb" | "home_button" | "direct_url" | "other";
      cue_name?: string;
      print_target?: string;
    };
  }>;
}

// Enhanced global tracking state
let trackingState: EnhancedTrackingState = {
  isTracking: false,
  token: null,
  startTime: 0,
  pausedTime: 0,
  lastSyncTime: 0,
  currentChapter: 1,
  currentSpread: 0,
  lastKnownPage: 1,
  isVisible: true,
  // Session management
  currentSessionId: null,
  sessionStartTime: 0,
  pagesVisitedInSession: new Set(),
  interactionsInSession: [],
  
  // ENHANCED: Page type and navigation tracking
  currentPageType: "story",
  navigationSource: "direct_url",
  pageStartTime: 0,
  firstInteractionTime: 0,
  cuePageStartTime: 0,
  currentPageInteractions: [],
};

// Background sync interval
let syncInterval: NodeJS.Timeout | null = null;

// Platform tracking data interface
interface PlatformTrackingData {
  token: string;
  progress: number;
  currentPage: number;
  currentChapter: string;
  timeSpent: number;
  bookmarks?: any;
}

/**
 * 🎯 ENHANCED: Page Type Detection Utility
 * Determines the type of page based on content and URL patterns
 */
export function detectPageType(chapter: number, spread: number, url?: string): "story" | "cue" | "activity" | "navigation" | "other" {
  // Check URL patterns first
  if (url) {
    if (url.includes('/activity')) return "activity";
    if (url.includes('/introduction') || url.includes('/conclusion') || url.includes('/wtbtg')) return "navigation";
  }
  
  // Chapter-specific cue page detection
  const cuePages = {
    1: 7, // Chapter 1 cue on spread 7
    2: 7, // Chapter 2 cue on spread 7  
    3: 6, // Chapter 3 cue on spread 6
    4: 6, // Chapter 4 cue on spread 6
    5: 8, // Chapter 5 cue on spread 8
    6: 7, // Chapter 6 cue on spread 7
  };
  
  if (cuePages[chapter as keyof typeof cuePages] === spread) {
    return "cue";
  }
  
  // Default to story page
  return "story";
}

/**
 * 🎯 ENHANCED: Navigation Source Detection Utility
 * Determines how the user arrived at the current page
 */
export function detectNavigationSource(referrerInfo?: string): "toc" | "chapter_nav" | "spread_nav" | "breadcrumb" | "home_button" | "direct_url" | "other" {
  if (!referrerInfo) return "direct_url";
  
  if (referrerInfo.includes('toc') || referrerInfo.includes('contents')) return "toc";
  if (referrerInfo.includes('chapter-nav')) return "chapter_nav";
  if (referrerInfo.includes('spread-nav') || referrerInfo.includes('arrow')) return "spread_nav";
  if (referrerInfo.includes('breadcrumb')) return "breadcrumb";
  if (referrerInfo.includes('home') || referrerInfo.includes('back')) return "home_button";
  
  return "other";
}

/**
 * 🎯 ENHANCED: Start Page Timing
 * Called when a new page loads to start timing measurements
 */
export function startPageTiming(chapter: number, spread: number, navigationSource?: string): void {
  const now = Date.now();
  
  trackingState.pageStartTime = now;
  trackingState.firstInteractionTime = 0; // Reset for new page
  trackingState.currentPageInteractions = []; // Reset for new page
  
  // Detect page type and navigation source
  trackingState.currentPageType = detectPageType(chapter, spread, window.location.href);
  trackingState.navigationSource = detectNavigationSource(navigationSource);
  
  // Special handling for cue pages
  if (trackingState.currentPageType === "cue") {
    trackingState.cuePageStartTime = now;
    console.log('[Enhanced Tracking] Cue page timing started:', {
      chapter,
      spread,
      pageType: trackingState.currentPageType,
      startTime: new Date(now).toISOString()
    });
  }
  
  console.log('[Enhanced Tracking] Page timing started:', {
    chapter,
    spread,
    pageType: trackingState.currentPageType,
    navigationSource: trackingState.navigationSource,
    timestamp: new Date(now).toISOString()
  });
}

/**
 * 🎯 ENHANCED: Track Page Interaction
 * Records detailed interactions on the current page
 */
export function trackPageInteraction(
  type: "click" | "scroll" | "hover" | "focus" | "play" | "pause" | "print" | "cue_click" | "nav_click",
  element: string,
  metadata?: {
    navigation_source?: "toc" | "chapter_nav" | "spread_nav" | "breadcrumb" | "home_button" | "direct_url" | "other";
    cue_name?: string;
    print_target?: string;
    position?: { x: number; y: number };
  }
): void {
  const now = Date.now();
  
  // Record first interaction time
  if (trackingState.firstInteractionTime === 0) {
    trackingState.firstInteractionTime = now;
    console.log('[Enhanced Tracking] First interaction recorded:', {
      element,
      type,
      timeFromPageStart: Math.round((now - trackingState.pageStartTime) / 1000) + 's'
    });
  }
  
  // Add interaction to current page
  const interaction = {
    type,
    element,
    timestamp: new Date(now).toISOString(),
    position: metadata?.position,
    metadata: {
      navigation_source: metadata?.navigation_source,
      cue_name: metadata?.cue_name,
      print_target: metadata?.print_target,
    }
  };
  
  trackingState.currentPageInteractions.push(interaction);
  
  console.log('[Enhanced Tracking] Interaction tracked:', {
    type,
    element,
    pageType: trackingState.currentPageType,
    totalInteractionsOnPage: trackingState.currentPageInteractions.length
  });
}

/**
 * 🎯 ENHANCED: Track Cue Interaction with Timing
 * Special tracking for cue clicks with time-before-click measurement
 */
export function trackCueInteraction(cueName: string, cueIcon: string, chapter: number, spread: number): {
  cue_name: string;
  cue_icon: string;
  chapter_id: number;
  spread_number: number;
  time_before_click: number;
  click_timestamp: string;
  completion_status: "started" | "completed" | "abandoned";
  engagement_score: number;
} {
  const now = Date.now();
  const timeBeforeClick = Math.round((now - trackingState.cuePageStartTime) / 1000);
  
  // Calculate engagement score based on time spent before clicking
  let engagementScore = 50; // Base score
  if (timeBeforeClick >= 10) engagementScore += 30; // Good engagement if 10+ seconds
  if (timeBeforeClick >= 20) engagementScore += 20; // Excellent engagement if 20+ seconds
  engagementScore = Math.min(100, engagementScore);
  
  const cueInteraction = {
    cue_name: cueName,
    cue_icon: cueIcon,
    chapter_id: chapter,
    spread_number: spread,
    time_before_click: timeBeforeClick,
    click_timestamp: new Date(now).toISOString(),
    completion_status: "completed" as const, // Assume completed when clicked
    engagement_score: engagementScore,
  };
  
  console.log('[Enhanced Tracking] Cue interaction tracked:', {
    cueName,
    chapter,
    spread,
    timeBeforeClick: timeBeforeClick + 's',
    engagementScore
  });
  
  // Also track as regular interaction
  trackPageInteraction("cue_click", `cue-${cueName}`, {
    cue_name: cueName,
    position: { x: 0, y: 0 } // Default position
  });
  
  return cueInteraction;
}

/**
 * 🎯 ENHANCED: Track Print Button Click
 * Special tracking for print button interactions on activity pages
 */
export function trackPrintInteraction(printTarget: string): {
  print_clicks: number;
  print_targets: string[];
  time_on_activity_page: number;
} {
  const now = Date.now();
  const timeOnActivityPage = Math.round((now - trackingState.pageStartTime) / 1000);
  
  const printData = {
    print_clicks: 1,
    print_targets: [printTarget],
    time_on_activity_page: timeOnActivityPage,
  };
  
  console.log('[Enhanced Tracking] Print interaction tracked:', {
    printTarget,
    timeOnPage: timeOnActivityPage + 's',
    pageType: trackingState.currentPageType
  });
  
  // Also track as regular interaction
  trackPageInteraction("print", `print-${printTarget}`, {
    print_target: printTarget
  });
  
  return printData;
}

/**
 * 🎯 ENHANCED: Send Enhanced Analytics Data
 * Sends comprehensive analytics to the new enhanced endpoint
 * CONTEXT-AWARE: Handles both full reading sessions and TOC/preview mode
 */
export async function sendEnhancedAnalytics(
  chapter: number, 
  spread: number, 
  cueInteractions?: any[], 
  printData?: any
): Promise<boolean> {
  try {
    const authToken = getAuthToken();
    
    // ENHANCED: Context-aware handling for TOC/preview mode
    if (!authToken || !trackingState.currentSessionId) {
      console.log('[Enhanced Analytics] TOC/Preview mode - tracking interaction locally:', {
        pageType: trackingState.currentPageType,
        navigationSource: trackingState.navigationSource,
        interactions: trackingState.currentPageInteractions.length,
        context: !authToken ? 'no_auth' : 'no_session'
      });
      return true; // Don't fail - just skip server tracking for preview mode
    }
    
    const now = Date.now();
    const timeOnPage = Math.round((now - trackingState.pageStartTime) / 1000);
    const actualEngagementTime = trackingState.firstInteractionTime > 0 
      ? Math.round((now - trackingState.firstInteractionTime) / 1000)
      : timeOnPage;
    const timeBeforeFirstInteraction = trackingState.firstInteractionTime > 0 
      ? Math.round((trackingState.firstInteractionTime - trackingState.pageStartTime) / 1000)
      : 0;
    const sessionDurationSoFar = Math.round((now - trackingState.sessionStartTime) / 1000);
    
    // Get user ID from auth token (decode without verification for userId)
    let userId: string;
    try {
      const tokenParts = authToken.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      userId = payload.userId;
    } catch (error) {
      console.warn('[Enhanced Analytics] Failed to decode user ID from token');
      return false;
    }
    
    const enhancedAnalyticsData = {
      user_id: userId,
      session_id: trackingState.currentSessionId,
      
      page_data: {
        page_number: ((chapter - 1) * 9) + spread,
        chapter_id: chapter,
        chapter_name: getCurrentChapterName(),
        page_type: trackingState.currentPageType,
        navigation_source: trackingState.navigationSource,
      },
      
      timing_data: {
        time_on_page: timeOnPage,
        actual_engagement_time: actualEngagementTime,
        time_before_first_interaction: timeBeforeFirstInteraction,
        session_duration_so_far: sessionDurationSoFar,
      },
      
      interactions: trackingState.currentPageInteractions,
      
      cue_interactions: cueInteractions || [],
      
      print_data: printData,
    };
    
    console.log('[Enhanced Analytics] Sending enhanced analytics:', {
      userId,
      sessionId: trackingState.currentSessionId,
      pageType: trackingState.currentPageType,
      navigationSource: trackingState.navigationSource,
      timeOnPage: timeOnPage + 's',
      interactions: trackingState.currentPageInteractions.length,
      cueInteractions: cueInteractions?.length || 0
    });
    
    const response = await fetch('/api/book-access/analytics/track-enhanced', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(enhancedAnalyticsData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('[Enhanced Analytics] Successfully sent enhanced analytics:', {
        processed: result.analytics_processed,
        sessionSummary: result.analytics_summary
      });
      return true;
    } else {
      const errorText = await response.text();
      console.error('[Enhanced Analytics] Failed to send enhanced analytics:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('[Enhanced Analytics] Error sending enhanced analytics:', error);
    return false;
  }
}

// Legacy tracking state interface (for compatibility)
interface TrackingState {
  isTracking: boolean;
  token: string | null;
  startTime: number;
  pausedTime: number;
  lastSyncTime: number;
  currentChapter: number;
  currentSpread: number;
  lastKnownPage: number;
  isVisible: boolean;
  // Session management
  currentSessionId: string | null;
  sessionStartTime: number;
  pagesVisitedInSession: Set<number>;
  interactionsInSession: string[];
}

// Platform tracking data interface
interface PlatformTrackingData {
  token: string;
  progress: number;
  currentPage: number;
  currentChapter: string;
  timeSpent: number;
  bookmarks?: any;
}

/**
 * Get the appropriate token for book tracking
 * This correctly handles the two-token system you described
 */
function getBookAccessToken(): string | null {
  // Method 1: If you pass book access token from your auth system
  // after user logs in and gains book access
  const bookAccessToken = localStorage.getItem('book_access_token') || 
                          sessionStorage.getItem('book_access_token');
  
  if (bookAccessToken) {
    return bookAccessToken;
  }
  
  // Method 2: If you store it in a global variable after auth
  // return window.bookAccessToken;
  
  // Method 3: If you get it from URL (your current system)
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');
  
  if (tokenFromUrl) {
    // Optionally store it for future use in this session
    sessionStorage.setItem('book_access_token', tokenFromUrl);
    return tokenFromUrl;
  }
  
  console.log('[Platform Tracking] No book access token found');
  return null;
}

/**
 * Initialize tracking with correct token type
 */
export function initializePlatformTracking(): boolean {
  try {
    // Use book access token, not auth token
    const bookAccessToken = getBookAccessToken();
    
    if (!bookAccessToken) {
      console.log('[Platform Tracking] No book access token found');
      return false;
    }
    
    const now = Date.now();
    trackingState = {
      isTracking: true,
      token: bookAccessToken, // This is the book access token
      startTime: now,
      pausedTime: 0,
      lastSyncTime: now,
      currentChapter: 1,
      currentSpread: 0,
      lastKnownPage: 1,
      isVisible: true,
      // Session management properties
      currentSessionId: null,
      sessionStartTime: 0,
      pagesVisitedInSession: new Set(),
      interactionsInSession: [],
      
      // ENHANCED: Initialize enhanced tracking properties
      currentPageType: "story",
      navigationSource: "direct_url",
      pageStartTime: now,
      firstInteractionTime: 0,
      cuePageStartTime: 0,
      currentPageInteractions: [],
    };
    
    console.log('[Platform Tracking] Initialized with enhanced analytics support');
    
    setupVisibilityTracking();
    startBackgroundSync();
    
    // Send initial update
    setTimeout(() => {
      sendProgressUpdate();
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('[Platform Tracking] Initialization failed:', error);
    return false;
  }
}

/**
 * Function to be called from your React components after login
 * This bridges your auth system with the tracking utility
 */
export function initializeTrackingWithAuth(authToken: string, bookAccessToken?: string): boolean {
  try {
    // Store the book access token for use by tracking system
    if (bookAccessToken) {
      sessionStorage.setItem('book_access_token', bookAccessToken);
    }
    
    // Optional: Store auth token for other API calls if needed
    sessionStorage.setItem('auth_token', authToken);
    
    // Now initialize tracking (it will find the book access token)
    return initializePlatformTracking();
  } catch (error) {
    console.error('[Platform Tracking] Auth integration failed:', error);
    return false;
  }
}

/**
 * Get auth token when needed for other API calls
 * (Separate from book access token)
 */
export function getAuthToken(): string | null {
  // First check localStorage (where auth context stores it)
  return localStorage.getItem('auth_token') || 
         sessionStorage.getItem('auth_token');
}

/**
 * Setup visibility tracking for pause/resume functionality
 */
function setupVisibilityTracking(): void {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      trackingState.isVisible = false;
      trackingState.pausedTime = Date.now();
    } else {
      trackingState.isVisible = true;
      if (trackingState.pausedTime > 0) {
        const pauseDuration = Date.now() - trackingState.pausedTime;
        trackingState.startTime += pauseDuration; // Adjust start time to exclude pause
        trackingState.pausedTime = 0;
      }
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Start background sync timer
 */
function startBackgroundSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  // Sync every 30 seconds
  syncInterval = setInterval(() => {
    if (trackingState.isTracking && trackingState.isVisible) {
      sendProgressUpdate();
    }
  }, 30000);
}

/**
 * Stop background sync
 */
export function stopPlatformTracking(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  
  // Send final update
  if (trackingState.isTracking) {
    sendProgressUpdate();
  }
  
  trackingState.isTracking = false;
}

/**
 * Calculate current reading progress percentage
 */
function calculateProgress(): number {
  // Simple calculation based on chapter and spread
  const totalSpreads = 55; // Approximate total spreads across all chapters
  const currentSpread = ((trackingState.currentChapter - 1) * 9) + trackingState.currentSpread;
  return Math.min(100, Math.round((currentSpread / totalSpreads) * 100));
}

/**
 * Calculate total reading time in minutes
 */
function calculateReadingTime(): number {
  if (!trackingState.startTime) return 0;
  
  const currentTime = trackingState.isVisible ? Date.now() : trackingState.pausedTime;
  const totalTime = currentTime - trackingState.startTime;
  return Math.round(totalTime / (1000 * 60)); // Convert to minutes
}

/**
 * Get current chapter name
 */
function getCurrentChapterName(): string {
  const chapterNames = [
    "Introduction",
    "The Still Pond",
    "The Colorful Chameleon", 
    "The Brave Bridge",
    "The Kindness Meadow",
    "The Gratitude Garden",
    "The Sharing Tree",
    "Conclusion"
  ];
  
  return chapterNames[trackingState.currentChapter] || `Chapter ${trackingState.currentChapter}`;
}

/**
 * Send progress update to your EXISTING endpoint
 * Only uses endpoints that actually exist in your server
 */
export async function sendProgressUpdate(): Promise<boolean> {
  if (!trackingState.isTracking || !trackingState.token) {
    return false;
  }
  
  try {
    // Use your existing bookmark system (localStorage)
    const bookmarkData = loadBookmark(); // Your existing function
    
    // Format bookmarks to match UpdateProgressRequestSchema
    let formattedBookmarks: Array<{ page: number; chapter?: string; note?: string }> | undefined;
    if (bookmarkData) {
      formattedBookmarks = [{
        page: bookmarkData.spreadIndex || 1,
        chapter: bookmarkData.chapterTitle || getCurrentChapterName(),
        note: `Reading position: Chapter ${bookmarkData.chapterId}, Spread ${bookmarkData.spreadIndex}`
      }];
    }
    
    // FIXED: Match the exact UpdateProgressRequestSchema format
    const trackingData = {
      token: trackingState.token, // Book access token
      progress: Math.max(0, Math.min(100, calculateProgress())), // Ensure 0-100 range
      currentPage: Math.max(1, trackingState.lastKnownPage), // Ensure positive number
      currentChapter: getCurrentChapterName(),
      timeSpent: Math.max(0, calculateReadingTime()), // Ensure positive number
      bookmarks: formattedBookmarks
    };
    
    console.log('[Platform Tracking] Sending to existing endpoint');
    console.log('[Platform Tracking] Data format:', {
      token: '***' + trackingData.token.slice(-8),
      progress: trackingData.progress,
      currentPage: trackingData.currentPage,
      currentChapter: trackingData.currentChapter,
      timeSpent: trackingData.timeSpent,
      bookmarksCount: trackingData.bookmarks?.length || 0
    });
    
    // Use ONLY your existing endpoint - no new ones
    const response = await fetch('/api/book-access/update-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header - your system uses token in body
      },
      body: JSON.stringify(trackingData)
    });
    
    if (response.ok) {
      trackingState.lastSyncTime = Date.now();
      console.log('[Platform Tracking] Successfully updated progress');
      return true;
    } else {
      const errorText = await response.text();
      console.error('[Platform Tracking] Progress update failed:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('[Platform Tracking] Failed to send progress update:', error);
    return false;
  }
}

/**
 * 🎯 ENHANCED: Update Current Position with Enhanced Analytics
 * Updates position and sends enhanced analytics data
 */
export async function updateCurrentPositionEnhanced(
  chapter: number, 
  spread: number, 
  navigationSource?: string,
  cueInteractions?: any[], 
  printData?: any
): Promise<void> {
  // Start page timing for new page
  startPageTiming(chapter, spread, navigationSource);
  
  // Update legacy position tracking
  trackingState.currentChapter = chapter;
  trackingState.currentSpread = spread;
  trackingState.lastKnownPage = ((chapter - 1) * 9) + spread;
  
  // Track page visit in current session
  if (trackingState.currentSessionId) {
    trackingState.pagesVisitedInSession.add(trackingState.lastKnownPage);
    trackingState.interactionsInSession.push(`page_visit_${chapter}_${spread}`);
    
    console.log('[Enhanced Session Tracking] Page visit tracked:', {
      sessionId: trackingState.currentSessionId,
      chapter,
      spread,
      pageType: trackingState.currentPageType,
      navigationSource: trackingState.navigationSource,
      totalPagesInSession: trackingState.pagesVisitedInSession.size
    });
  }

  // Send enhanced analytics data
  await sendEnhancedAnalytics(chapter, spread, cueInteractions, printData);
  
  // Also send legacy progress update for compatibility
  await sendProgressUpdate();
}

/**
 * Update the current reading position for platform tracking
 * Now uses user account authentication instead of book tokens
 * This ONLY updates position - does NOT create new sessions
 */
export async function updateCurrentPosition(chapter: number, spread: number): Promise<void> {
  // Update position tracking
  trackingState.currentChapter = chapter;
  trackingState.currentSpread = spread;
  trackingState.lastKnownPage = ((chapter - 1) * 9) + spread;
  
  // Track page visit in current session
  if (trackingState.currentSessionId) {
    trackingState.pagesVisitedInSession.add(trackingState.lastKnownPage);
    trackingState.interactionsInSession.push(`page_visit_${chapter}_${spread}`);
    
    console.log('[Session Tracking] Page visit tracked:', {
      sessionId: trackingState.currentSessionId,
      chapter,
      spread,
      totalPagesInSession: trackingState.pagesVisitedInSession.size
    });
  }

  // Send position update (NOT session creation)
  await sendProgressUpdate();
}

/**
 * Get the current reading position
 * Uses user account authentication for accurate tracking
 */
export async function getCurrentPosition(): Promise<{
  chapter: number;
  spread: number;
} | null> {
  return {
    chapter: trackingState.currentChapter,
    spread: trackingState.currentSpread
  };
}

/**
 * Track reading analytics
 * Now uses user account for persistent analytics tracking
 * Tracks interactions within the current session
 */
export async function trackReadingAnalytics(data: {
  chapter: number;
  spread: number;
  timeSpent: number;
  interactions: string[];
}): Promise<void> {
  // Add interactions to current session
  if (trackingState.currentSessionId) {
    trackingState.interactionsInSession.push(...data.interactions);
    
    console.log('[Session Tracking] Analytics tracked in session:', {
      sessionId: trackingState.currentSessionId,
      chapter: data.chapter,
      spread: data.spread,
      timeSpent: data.timeSpent,
      newInteractions: data.interactions.length,
      totalInteractionsInSession: trackingState.interactionsInSession.length
    });
  }

  // Update current position (this will also track the page visit)
  await updateCurrentPosition(data.chapter, data.spread);
}

/**
 * Start a reading session and return session ID for tracking
 * Now tied to user account for persistent session tracking
 * This creates ONE session per reading session (not per page)
 */
export async function startReadingSession(): Promise<string | null> {
  try {
    // If already tracking a session, return existing session
    if (trackingState.currentSessionId && trackingState.isTracking) {
      console.log('[Session Tracking] Using existing session:', trackingState.currentSessionId);
      return trackingState.currentSessionId;
    }

    // Initialize platform tracking if not already done
    if (!trackingState.isTracking) {
      if (!initializePlatformTracking()) {
        console.warn('[Session Tracking] Failed to initialize platform tracking');
        return null;
      }
    }

    // Generate new session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update tracking state with session info
    trackingState.currentSessionId = sessionId;
    trackingState.sessionStartTime = Date.now();
    trackingState.pagesVisitedInSession = new Set();
    trackingState.interactionsInSession = [];

    console.log('[Session Tracking] NEW session started:', sessionId);

    // Create session in database via API
    const authToken = getAuthToken();
    if (authToken) {
      try {
        const response = await fetch('/api/book-access/analytics/start-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            session_id: sessionId,
            book_id: 'wtbtg',
            device_type: 'web',
            browser_info: navigator.userAgent
          })
        });

        if (response.ok) {
          console.log('[Session Tracking] Session created in database');
        } else {
          console.warn('[Session Tracking] Failed to create session in database');
        }
      } catch (error) {
        console.warn('[Session Tracking] Session API call failed:', error);
      }
    }

    return sessionId;
  } catch (error) {
    console.error('[Session Tracking] Failed to start session:', error);
    return null;
  }
}

/**
 * End a reading session with final metrics
 * Now tied to user account for complete session tracking
 */
export async function endReadingSession(sessionId: string, finalMetrics: {
  totalDuration: number;
  pagesVisited: number[];
  finalInteractions: number;
  cuesCollected: string[];
}): Promise<void> {
  try {
    console.log('[Session Tracking] Ending session:', sessionId, finalMetrics);
    
    // Only end if this is the current session
    if (trackingState.currentSessionId !== sessionId) {
      console.warn('[Session Tracking] Session ID mismatch, not ending');
      return;
    }

    // Calculate final session metrics
    const sessionDuration = Math.floor((Date.now() - trackingState.sessionStartTime) / 1000);
    const totalPages = trackingState.pagesVisitedInSession.size;
    const totalInteractions = trackingState.interactionsInSession.length;

    // Send final session update to API
    const authToken = getAuthToken();
    if (authToken) {
      try {
        const response = await fetch('/api/book-access/analytics/end-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            session_id: sessionId,
            final_metrics: {
              total_duration: sessionDuration,
              pages_visited: Array.from(trackingState.pagesVisitedInSession),
              final_interactions: totalInteractions,
              cues_collected: finalMetrics.cuesCollected || []
            }
          })
        });

        if (response.ok) {
          console.log('[Session Tracking] Session ended in database');
        } else {
          console.warn('[Session Tracking] Failed to end session in database');
        }
      } catch (error) {
        console.warn('[Session Tracking] End session API call failed:', error);
      }
    }

    // Clear session tracking state
    trackingState.currentSessionId = null;
    trackingState.sessionStartTime = 0;
    trackingState.pagesVisitedInSession.clear();
    trackingState.interactionsInSession = [];

    console.log('[Session Tracking] Session ended successfully:', {
      sessionId,
      duration: Math.round(sessionDuration / 60) + ' minutes',
      pagesVisited: totalPages,
      interactions: totalInteractions
    });
  } catch (error) {
    console.error('[Session Tracking] Failed to end session:', error);
  }
}

/**
 * Get reading analytics summary
 * For user dashboard or admin panel
 */
export async function getAnalyticsSummary(userId?: string): Promise<any> {
  // This would typically fetch from your existing API
  return {
    totalReadingTime: calculateReadingTime(),
    currentProgress: calculateProgress(),
    lastPosition: {
      chapter: trackingState.currentChapter,
      spread: trackingState.currentSpread
    }
  };
}