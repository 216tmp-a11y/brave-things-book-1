import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { loadBookmark, hasBookmark, getBookmarkDescription, calculateProgress, formatTimestamp, getChapterTitle, saveReadingPosition, clearBookmark } from "@/lib/bookmark";
import { GetFullAccessModal } from "@/components/get-full-access-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowLeft, Home, BookOpen, Shield, AlertTriangle, Star, Lock, CheckCircle, Play, FileText, Users, Sparkles, Target, Clock, Award, Leaf, Rainbow, Heart, Coffee, Microscope, ChevronDown, ChevronUp, MessageCircle, Sun, BookOpenCheck, Circle, Bookmark } from "lucide-react";
import { toast } from "sonner";

/**
 * Where the Brave Things Grow - Book Reading Page
 * 
 * This page provides the reading experience for WTBTG with:
 * - Token-based access validation
 * - Redirect to login if no valid token
 * - Sophisticated Table of Contents with progress tracking
 * - "Back to Library" navigation
 * - Progress tracking and bookmark sync
 * 
 * User Flow:
 * 1. User arrives with ?token=xyz from library "Read Now" button
 * 2. Token validated against book-access API
 * 3. If valid: Show Table of Contents interface
 * 4. If invalid: Redirect to login
 * 5. Direct access without token: Redirect to login
 */

interface TokenValidationResponse {
  valid: boolean;
  userId?: string;
  bookId?: string;
  permissions?: string[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
  bookmarks?: Array<{
    id: string;
    page: number;
    chapter?: string;
    note?: string;
    created_at: string;
  }>;
  progress?: {
    current_page: number;
    current_chapter: string;
    completion_percentage: number;
    time_spent: number;
    last_read_at: string;
  };
  analytics_session_id?: string;
  return_info?: {
    url: string;
    label: string;
    platform: string;
  };
}

// Chapter data with cue information from external TOC
const chapters = [
  {
    id: 1,
    title: "The Still Pond",
    description: "Mila learns to take deep breaths and be present in the moment",
    cue: "Golden Leaf",
    cueIcon: Leaf,
    cueColor: "text-golden-600",
    bgColor: "bg-golden-50",
    borderColor: "border-golden-200",
    completed: false,
    pages: 9
  },
  {
    id: 2,
    title: "The Colorful Chameleon",
    description: "Max helps everyone learn to name and understand their emotions",
    cue: "Rainbow Tail",
    cueIcon: Rainbow,
    cueColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    completed: false,
    pages: 9
  },
  {
    id: 3,
    title: "The Brave Bridge",
    description: "Bella discovers her inner bravery when facing something new",
    cue: "Bravery Badge",
    cueIcon: Shield,
    cueColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    completed: false,
    pages: 12
  },
  {
    id: 4,
    title: "The Kindness Meadow",
    description: "The friends learn about being kind to others and themselves",
    cue: "Sparkling Petal",
    cueIcon: Sparkles,
    cueColor: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    completed: false,
    pages: 8
  },
  {
    id: 5,
    title: "The Gratitude Garden",
    description: "Grandpa Tortoise teaches about appreciating what we have",
    cue: "Gratitude Leaf",
    cueIcon: Heart,
    cueColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    completed: false,
    pages: 8
  },
  {
    id: 6,
    title: "The Sharing Tree",
    description: "Everyone learns the joy of sharing with friends",
    cue: "Dew Cup",
    cueIcon: Coffee,
    cueColor: "text-cyan-600",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    completed: false,
    pages: 9
  }
];

export default function WTBTGBook() {
  const { user, isPreview } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [tokenData, setTokenData] = useState<TokenValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State for collapsible sections - collapsed by default to save space
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [isEditorNoteExpanded, setIsEditorNoteExpanded] = useState(false);
  
  // Modal state for "Get Full Access"
  const [showAccessModal, setShowAccessModal] = useState(false);
  
  // Reading position state using simple localStorage
  const [currentBookmark, setCurrentBookmark] = useState<any>(null);

  useEffect(() => {
    validateAccess();
  }, []);

  // 🎯 NEW: Enhanced page load tracking for TOC
  useEffect(() => {
    const setupTOCEnhancedTracking = async () => {
      try {
        const { startPageTiming } = await import('@/lib/platform-tracking');
        
        // Start enhanced page timing for TOC (chapter 0, spread 0)
        // TOC is classified as "navigation" page type
        startPageTiming(0, 0, 'direct_url');
        
        console.log('📊 Enhanced TOC page load tracking initialized:', {
          pageType: 'navigation',
          navigationSource: 'direct_url',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Failed to initialize enhanced TOC tracking:', error);
      }
    };

    // Initialize TOC enhanced tracking after a brief delay to ensure page is loaded
    setTimeout(setupTOCEnhancedTracking, 100);
  }, []);

  // Token persistence in localStorage for development convenience
  useEffect(() => {
    const token = searchParams.get('token');
    if (token && isValidToken && tokenData && tokenData.userId) {
      // Store token in localStorage for development convenience
      const persistentTokenData = {
        token,
        bookId: 'wtbtg',
        userId: tokenData.userId,
        timestamp: Date.now(),
        persistent: true
      };
      try {
        localStorage.setItem('wtbtg_token_persistence', JSON.stringify(persistentTokenData));
        console.log("💾 Token persisted to localStorage for development convenience");
      } catch (error) {
        console.warn("⚠️ Could not persist token to localStorage:", error);
      }
    }
  }, [isValidToken, tokenData, searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const validateAccess = async () => {
    try {
      console.log("🔐 BOOK ACCESS VALIDATION STARTED");
      
      // Get token from URL parameters OR localStorage (development persistence)
      let token = searchParams.get('token');
      
      if (!token) {
        console.log("🔍 No token in URL, checking localStorage for persistence...");
        try {
          const persistedData = localStorage.getItem('wtbtg_token_persistence');
          if (persistedData) {
            const parsed = JSON.parse(persistedData);
            const ageHours = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);
            
            if (ageHours < 24) { // Token valid for 24 hours in localStorage
              token = parsed.token;
              console.log("✅ Using persisted token from localStorage (age: " + Math.round(ageHours) + " hours)");
            } else {
              console.log("⏰ Persisted token too old, removing...");
              localStorage.removeItem('wtbtg_token_persistence');
            }
          }
        } catch (error) {
          console.log("⚠️ Error reading persisted token:", error);
          localStorage.removeItem('wtbtg_token_persistence');
        }
      }
      
      if (!token) {
        console.log("❌ No valid token found in URL or localStorage");
        toast.error("Access token required. Redirecting to login...");
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      console.log("📝 Token found, validating...", { tokenPrefix: token.substring(0, 20) });
      
      // Validate token with enhanced endpoint
      const response = await fetch('/api/book-access/validate-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          bookId: 'wtbtg'
        })
      });
      
      const data: TokenValidationResponse = await response.json();
      
      console.log("📡 Token validation response:", {
        status: response.status,
        valid: data.valid,
        userId: data.userId,
        hasUser: !!data.user,
        hasBookmarks: !!data.bookmarks,
        hasProgress: !!data.progress
      });
      
      if (data.valid && data.user) {
        console.log("✅ Token validation successful");
        setIsValidToken(true);
        setTokenData(data);
        toast.success(`Welcome back, ${data.user.name}!`);
        
        // Load bookmark using simple localStorage
        loadCurrentBookmark();
      } else {
        console.log("❌ Token validation failed");
        setError("Invalid or expired access token");
        toast.error("Invalid access token. Redirecting to login...");
        setTimeout(() => navigate('/login'), 3000);
      }
      
    } catch (error) {
      console.error("❌ Token validation error:", error);
      setError("Failed to validate access");
      toast.error("Failed to validate access. Redirecting to login...");
      setTimeout(() => navigate('/login'), 3000);
    } finally {
      setIsValidating(false);
    }
  };

  const handleBackToLibrary = () => {
    if (tokenData?.return_info?.url) {
      window.location.href = tokenData.return_info.url;
    } else {
      navigate('/library');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleChapterClick = (chapterId: number) => {
    navigate(`/book/chapter/${chapterId}/story`);
  };

  const handleIntroClick = () => {
    navigate("/book/introduction");
  };

  const loadCurrentBookmark = () => {
    try {
      const bookmark = loadBookmark();
      setCurrentBookmark(bookmark);
      console.log("📖 Current bookmark loaded:", bookmark);
      
      // Debug: If no bookmark found for testing, create one for Marie
      if (!bookmark && tokenData?.user?.name === "Marie") {
        console.log("🧪 Creating test bookmark for Marie...");
        // Simulate that Marie was reading Chapter 1, Spread 4
        saveReadingPosition(1, 4);
        const testBookmark = loadBookmark();
        setCurrentBookmark(testBookmark);
        console.log("✅ Test bookmark created for Marie:", testBookmark);
      }
    } catch (error) {
      console.warn("Could not load bookmark:", error);
    }
  };

  // Preview user restrictions - only allow Chapter 1
  const isChapterLocked = (chapterId: number) => {
    return isPreview && chapterId > 1;
  };

  const handleContinueReading = (chapter: number, spread: number) => {
    navigate(`/book/chapter/${chapter}/story?spread=${spread - 1}`); // Convert to 0-based for URL
  };

  // Loading state during token validation
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-forest-50 to-golden-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <Shield className="w-16 h-16 text-forest-600" />
          </motion.div>
          <h2 className="text-xl font-bold text-forest-900 mb-2">Validating Access</h2>
          <p className="text-forest-600 mb-4">Checking your reading permissions...</p>
          <div className="flex items-center justify-center gap-2 text-forest-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>This may take a moment</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state - invalid token or access denied
  if (!isValidToken || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-coral-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-coral-200 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-coral-500" />
            <h2 className="text-xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              {error || "You don't have permission to access this book. Please sign in to your account."}
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-forest-600 bg-forest-700 text-white"
              >
                Sign In to Continue
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGoHome}
                className="border-forest-200 text-forest-600 bg-forest-50"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state - valid token, show Table of Contents
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-golden-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-forest-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-forest-600 to-golden-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-forest-800">Brave Things Books</div>
              </div>
            </div>
            <div className="text-forest-400">•</div>
            <h1 className="text-xl font-bold text-forest-800">Table of Contents</h1>
          </div>
          <div className="flex items-center gap-3">
            {tokenData?.user && (
              <Badge className="bg-golden-100 text-golden-700 border-golden-200">
                👋 {tokenData.user.name}
              </Badge>
            )}
            {/* Bookmark Button */}
            <Button 
              variant="outline" 
              onClick={async () => {
                // 🎯 NEW: Enhanced bookmark tracking for TOC bookmark button
                try {
                  const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                  
                  if (currentBookmark) {
                    // Clear existing bookmark
                    clearBookmark();
                    setCurrentBookmark(null);
                    toast.success("Bookmark cleared!");
                    
                    // Track clear bookmark action
                    trackPageInteraction('click', 'toc_bookmark_clear_button', {
                      navigation_source: 'toc'
                    });
                    
                    console.log(`📊 Enhanced TOC bookmark tracking:`, {
                      action: 'clear_bookmark',
                      buttonType: 'toc_bookmark_clear_button',
                      previousBookmark: currentBookmark
                    });
                  } else {
                    // Save new bookmark (Chapter 1, Spread 1 as default starting point)
                    saveReadingPosition(1, 1);
                    const newBookmark = loadBookmark();
                    setCurrentBookmark(newBookmark);
                    toast.success("Bookmark saved! Starting at Chapter 1.");
                    
                    // Track save bookmark action
                    trackPageInteraction('click', 'toc_bookmark_save_button', {
                      navigation_source: 'toc'
                    });
                    
                    console.log(`📊 Enhanced TOC bookmark tracking:`, {
                      action: 'save_bookmark',
                      buttonType: 'toc_bookmark_save_button',
                      newBookmark: newBookmark
                    });
                  }
                  
                  // Send enhanced analytics immediately
                  await sendEnhancedAnalytics(0, 0, [], undefined); // TOC is chapter 0, spread 0
                  
                } catch (error) {
                  console.warn('Failed to track bookmark interaction:', error);
                  
                  // Fallback functionality without tracking
                  if (currentBookmark) {
                    clearBookmark();
                    setCurrentBookmark(null);
                    toast.success("Bookmark cleared!");
                  } else {
                    saveReadingPosition(1, 1);
                    const newBookmark = loadBookmark();
                    setCurrentBookmark(newBookmark);
                    toast.success("Bookmark saved! Starting at Chapter 1.");
                  }
                }
              }}
              className="border-forest-300 text-forest-700 bg-forest-50"
            >
              <Bookmark className={`w-4 h-4 mr-2 ${currentBookmark ? 'fill-current text-forest-700' : ''}`} />
              {currentBookmark ? 'Clear Bookmark' : 'Save Bookmark'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBackToLibrary}
              className="border-forest-300 text-forest-700 bg-forest-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {tokenData?.return_info?.label || 'My Library'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-forest-800 mb-4">
            Welcome to the Forest of Wonder
          </h2>
        </motion.div>

        {/* Continue Reading Section - Moved to top */}
        {currentBookmark && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="w-full max-w-2xl">
              <Card 
                className="h-full bg-green-50 border-green-200 border-2 cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => handleContinueReading(currentBookmark.chapterId, currentBookmark.spreadIndex + 1)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-green-600" />
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-lg font-semibold text-green-800">Continue Reading</span>
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs px-2 py-1">
                            {calculateProgress(currentBookmark.chapterId, currentBookmark.spreadIndex)}% complete
                          </Badge>
                        </div>
                        <div className="text-green-700 font-medium">
                          Chapter {currentBookmark.chapterId}: {getChapterTitle(currentBookmark.chapterId)}, Page {currentBookmark.spreadIndex + 1}
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(currentBookmark.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Table of Contents Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h3 className="text-3xl font-bold text-forest-800 mb-2">
            📚 Table of Contents
          </h3>
          <p className="text-forest-600">
            Follow Mila and friends through the Forest of Wonder
          </p>
        </motion.div>

        {/* First Row: Informational Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* How to Read This Book Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur-sm border-forest-200 border-2">
              <CardHeader 
                className="cursor-pointer select-none"
                onClick={async () => {
                  const newState = !isGuideExpanded;
                  setIsGuideExpanded(newState);
                  
                  // 🎯 NEW: Enhanced tracking for Guide collapsible card
                  try {
                    const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                    
                    // Track the collapsible interaction
                    trackPageInteraction('click', 'toc_guide_collapsible', {
                      navigation_source: 'toc'
                    });
                    
                    // Send enhanced analytics immediately
                    await sendEnhancedAnalytics(0, 0, [], undefined); // TOC is chapter 0, spread 0
                    
                    console.log(`📊 Enhanced TOC collapsible tracking:`, {
                      cardType: 'guide_card',
                      action: newState ? 'expand' : 'collapse',
                      navigationSource: 'toc'
                    });
                  } catch (error) {
                    console.warn('Failed to track TOC collapsible interaction:', error);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs bg-forest-100 text-forest-700">
                    Guide
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">🌟</div>
                    {isGuideExpanded ? (
                      <ChevronUp className="w-5 h-5 text-forest-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-forest-600" />
                    )}
                  </div>
                </div>
                
                <CardTitle className="text-forest-800 text-lg text-forest-900 transition-colors">
                  How to Read This Book
                </CardTitle>
              </CardHeader>
              
              <motion.div
                initial={false}
                animate={{
                  height: isGuideExpanded ? "auto" : 0,
                  opacity: isGuideExpanded ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <CardContent className="text-center">
                  <div className="text-forest-600 mb-4 space-y-2">
                    <p className="text-base font-medium">Look for the Magic Cues!</p>
                    <p className="text-sm leading-relaxed">
                      When you see a special symbol, pause and do the activity together.
                    </p>
                  </div>
                  
                  {/* Mini Cue Preview Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-golden-50 rounded border border-golden-200">
                      <div className="text-lg mb-1">🍃</div>
                      <div className="text-xs text-golden-700">Breathe</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded border border-purple-200">
                      <div className="text-lg mb-1">🌈</div>
                      <div className="text-xs text-purple-700">Feel</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="text-lg mb-1">🛡️</div>
                      <div className="text-xs text-blue-700">Brave</div>
                    </div>
                    <div className="text-center p-2 bg-pink-50 rounded border border-pink-200">
                      <div className="text-lg mb-1">✨</div>
                      <div className="text-xs text-pink-700">Kind</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                      <div className="text-lg mb-1">💚</div>
                      <div className="text-xs text-green-700">Thanks</div>
                    </div>
                    <div className="text-center p-2 bg-cyan-50 rounded border border-cyan-200">
                      <div className="text-lg mb-1">💧</div>
                      <div className="text-xs text-cyan-700">Share</div>
                    </div>
                  </div>
                </CardContent>

                {/* How to Use This Book Section */}
                <div className="px-6 pb-6">
                  <h4 className="text-lg font-semibold text-forest-800 mb-3">How to Use This Book</h4>
                  
                  <div className="space-y-3">
                    {/* Read Together */}
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpenCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-semibold text-forest-800 text-sm">Read Together:</h5>
                        <p className="text-xs text-forest-600 mt-1">Take turns reading or listen as someone reads aloud.</p>
                      </div>
                    </div>
                    
                    {/* Pause for Cues */}
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-semibold text-forest-800 text-sm">Pause for Cues:</h5>
                        <p className="text-xs text-forest-600 mt-1">When you see activity symbols, stop and do the suggested activities.</p>
                      </div>
                    </div>
                    
                    {/* Talk About It */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-semibold text-forest-800 text-sm">Talk About It:</h5>
                        <p className="text-xs text-forest-600 mt-1">Share thoughts, feelings, and connections to your own life.</p>
                      </div>
                    </div>
                    
                    {/* Take Your Time */}
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Sun className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-semibold text-forest-800 text-sm">Take Your Time:</h5>
                        <p className="text-xs text-forest-600 mt-1">There's no rush – enjoy the journey through the forest!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Card>
          </motion.div>

          {/* Editor's Note Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full bg-white/90 backdrop-blur-sm border-forest-200 border-2">
              <CardHeader 
                className="cursor-pointer select-none"
                onClick={async () => {
                  const newState = !isEditorNoteExpanded;
                  setIsEditorNoteExpanded(newState);
                  
                  // 🎯 NEW: Enhanced tracking for Editor's Note collapsible card
                  try {
                    const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                    
                    // Track the collapsible interaction
                    trackPageInteraction('click', 'toc_editor_note_collapsible', {
                      navigation_source: 'toc'
                    });
                    
                    // Send enhanced analytics immediately
                    await sendEnhancedAnalytics(0, 0, [], undefined); // TOC is chapter 0, spread 0
                    
                    console.log(`📊 Enhanced TOC collapsible tracking:`, {
                      cardType: 'editor_note_card',
                      action: newState ? 'expand' : 'collapse',
                      navigationSource: 'toc'
                    });
                  } catch (error) {
                    console.warn('Failed to track TOC collapsible interaction:', error);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs bg-forest-100 text-forest-700">
                    Editor's Note
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">💌</div>
                    {isEditorNoteExpanded ? (
                      <ChevronUp className="w-5 h-5 text-forest-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-forest-600" />
                    )}
                  </div>
                </div>
                
                <CardTitle className="text-forest-800 text-lg text-forest-900 transition-colors">
                  A Message to Our Readers
                </CardTitle>
              </CardHeader>
              
              <motion.div
                initial={false}
                animate={{
                  height: isEditorNoteExpanded ? "auto" : 0,
                  opacity: isEditorNoteExpanded ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <CardContent>
                  <div className="text-forest-600 text-base leading-relaxed space-y-3">
                    <p>
                      Thank you so much for being among the very first readers of "Where the Brave Things Grow." Your willingness to review this book and share your thoughts means the world to us.
                    </p>
                    <p>
                      "Where the Brave Things Grow" is a heartfelt homage to the classic children's book, "Where the Wild Things Are." In Maurice Sendak's story, Max travels to a land of wild things, but ultimately returns home—because it's in coming back, not staying in the wild, that he finds comfort and growth.
                    </p>
                    <p>
                      This book builds on this idea by inviting readers to embark on their own journey of emotional growth. "Where the Brave Things Grow" gives children and adults space to experience and understand their feelings on their own terms. It shows that true bravery isn't about taming wildness, but about having the courage to engage with our emotions and grow from that experience.
                    </p>
                    <p>
                      Thank you for helping this book—and its readers—grow braver, kinder, and more connected!
                    </p>
                    <p className="font-medium">
                      With gratitude,<br />
                      Where the Brave Things Grow Team
                    </p>
                    <p className="text-center pt-2 mb-2 font-bold text-base">
                      Click below to share your valuable feedback!
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <a 
                        href="https://forms.clickup.com/2370929/f/28bbh-75171/DGU9D6EC4XJIQE26DB"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-forest-700 text-forest-900 underline font-medium text-[15px]"
                      >
                        Parent/Caregiver
                      </a>
                      <a 
                        href="https://forms.clickup.com/2370929/f/28bbh-75151/8M474434L1ITR53Z4U"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-forest-700 text-forest-900 underline font-medium text-[15px]"
                      >
                        Educator
                      </a>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            </Card>
          </motion.div>
        </div>

        {/* Second Row: Story Introduction (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="w-full max-w-md">
            <Card 
              className="h-full bg-white/90 backdrop-blur-sm border-forest-200 border-2 shadow-lg transition-all duration-300 cursor-pointer"
              onClick={handleIntroClick}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs bg-forest-100 text-forest-700">
                    Start Here
                  </Badge>
                  <div className="text-2xl">🌟</div>
                </div>
                
                <CardTitle className="text-forest-800 text-lg text-center">
                  Story Introduction
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="text-forest-600 mb-4 space-y-2">
                  <p className="text-sm font-medium">Meet the Characters!</p>
                  <p className="text-xs leading-relaxed">
                    Get to know Mila, Max, Bella, and Grandpa Tortoise as they begin their journey through the Forest of Wonder.
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-forest-500 bg-forest-600 text-white"
                  onClick={async (e) => {
                    e.stopPropagation();
                    
                    // 🎯 NEW: Enhanced navigation tracking for Start Here button
                    try {
                      const { trackPageInteraction, sendEnhancedAnalytics, startPageTiming } = await import('@/lib/platform-tracking');
                      
                      // Track the navigation click
                      trackPageInteraction('nav_click', 'toc_start_here_button', {
                        navigation_source: 'toc'
                      });
                      
                      // Send enhanced analytics immediately 
                      await sendEnhancedAnalytics(0, 0, [], undefined); // TOC is chapter 0, spread 0
                      
                      console.log(`📊 Enhanced TOC navigation tracking:`, {
                        buttonType: 'start_here_button',
                        navigationSource: 'toc',
                        destination: '/book/introduction'
                      });
                    } catch (error) {
                      console.warn('Failed to track TOC navigation:', error);
                    }
                    
                    navigate("/book/introduction");
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Here
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Third Row and Beyond: Compact Chapters Grid (2 per row) */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {chapters.map((chapter, index) => {
            const CueIcon = chapter.cueIcon;
            const isLocked = isChapterLocked(chapter.id);
            
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
              >
                <Card 
                  className={`h-full ${isLocked ? 'bg-gray-50 border-gray-200' : chapter.bgColor + ' ' + chapter.borderColor} border-2 shadow-lg transition-all duration-300 group ${isLocked ? 'opacity-75' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Chapter {chapter.id}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {isLocked ? (
                          <Lock className="w-5 h-5 text-gray-500" />
                        ) : chapter.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <CardTitle className={`group-text-forest-900 transition-colors text-base ${isLocked ? 'text-gray-600' : 'text-forest-800'}`}>
                      {chapter.title}
                    </CardTitle>
                    
                    {/* Cue Indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-6 h-6 rounded-full bg-white/80 flex items-center justify-center ${isLocked ? 'text-gray-500' : chapter.cueColor}`}>
                        <CueIcon className="w-3 h-3" />
                      </div>
                      <span className={`text-xs ${isLocked ? 'text-gray-500' : 'text-forest-600'}`}>{chapter.cue}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className={`mb-4 leading-relaxed text-sm ${isLocked ? 'text-gray-500' : 'text-forest-700'}`}>
                      {chapter.description}
                    </p>
                    
                    {/* Conditional content based on lock status */}
                    {isLocked ? (
                      <div className="space-y-3">
                        <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <Lock className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                          <p className="text-sm font-medium text-amber-800 mb-1">Preview Access</p>
                          <p className="text-xs text-amber-700">This chapter is available in the full version</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full bg-golden-500 hover:bg-golden-600 text-white h-8 text-xs"
                          onClick={async (e) => {
                            e.stopPropagation();
                            
                            // 🎯 NEW: Enhanced tracking for "Get Full Access" button
                            try {
                              const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                              
                              // Track the "Get Full Access" button click
                              trackPageInteraction('click', 'toc_get_full_access_button', {
                                navigation_source: 'toc'
                              });
                              
                              // Send enhanced analytics immediately
                              await sendEnhancedAnalytics(0, 0, [], undefined); // TOC is chapter 0, spread 0
                              
                              console.log(`📊 Enhanced TOC "Get Full Access" tracking:`, {
                                buttonType: 'get_full_access_button',
                                chapterId: chapter.id,
                                chapterTitle: chapter.title,
                                userType: 'preview_user',
                                navigationSource: 'toc',
                                action: 'open_access_modal'
                              });
                            } catch (error) {
                              console.warn('Failed to track "Get Full Access" button:', error);
                            }
                            
                            setShowAccessModal(true);
                          }}
                        >
                          <Star className="w-3 h-3 mr-1" />
                          Get Full Access
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Row 1: Pages count + Read Story button */}
                        <div className="flex items-center justify-between text-sm text-forest-600">
                          <span className="text-xs">{chapter.pages} pages</span>
                          <Button 
                            size="sm" 
                            variant="default"
                            className="bg-forest-500 bg-forest-600 text-white h-8 px-3 text-xs"
                            onClick={async (e) => {
                              e.stopPropagation();
                              
                              // 🎯 NEW: Enhanced tracking for chapter "Read Story" button
                              try {
                                const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                                
                                // Track the chapter navigation click
                                trackPageInteraction('nav_click', 'toc_chapter_read_story_button', {
                                  navigation_source: 'toc'
                                });
                                
                                // Send enhanced analytics immediately
                                await sendEnhancedAnalytics(0, 0, [], undefined); // TOC is chapter 0, spread 0
                                
                                console.log(`📊 Enhanced TOC chapter navigation tracking:`, {
                                  buttonType: 'read_story_button',
                                  chapterId: chapter.id,
                                  chapterTitle: chapter.title,
                                  navigationSource: 'toc',
                                  destination: `/book/chapter/${chapter.id}/story`
                                });
                              } catch (error) {
                                console.warn('Failed to track TOC chapter navigation:', error);
                              }
                              
                              handleChapterClick(chapter.id);
                            }}
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            Read Story
                          </Button>
                        </div>
                        
                        {/* Row 2: Activities + Family Resources buttons */}
                        <div className="flex gap-1 justify-center">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-[105px] px-2 py-1 h-7 text-[10px] text-forest-600 text-forest-800 bg-white/50 border-forest-300"
                            onClick={async (e) => {
                              e.stopPropagation();
                              
                              // 🎯 NEW: Enhanced tracking for chapter "The Science" button
                              try {
                                const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                                
                                // Track the science/activities navigation click
                                trackPageInteraction('nav_click', 'toc_chapter_science_button', {
                                  navigation_source: 'toc'
                                });
                                
                                // Send enhanced analytics immediately
                                await sendEnhancedAnalytics(0, 0, [], undefined); // TOC is chapter 0, spread 0
                                
                                console.log(`📊 Enhanced TOC chapter navigation tracking:`, {
                                  buttonType: 'science_button',
                                  chapterId: chapter.id,
                                  chapterTitle: chapter.title,
                                  navigationSource: 'toc',
                                  destination: `/book/chapter/${chapter.id}/activity`
                                });
                              } catch (error) {
                                console.warn('Failed to track TOC chapter navigation:', error);
                              }
                              
                              navigate(`/book/chapter/${chapter.id}/activity`);
                            }}
                          >
                            <Microscope className="w-2.5 h-2.5 mr-0.5" />
                            The Science
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-[105px] px-2 py-1 h-7 text-[10px] text-forest-600 text-forest-800 bg-white/50 border-forest-300"
                            onClick={async (e) => {
                              e.stopPropagation();
                              
                              // 🎯 NEW: Enhanced tracking for chapter "Family Guide" button
                              try {
                                const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                                
                                // Track the family guide navigation click
                                trackPageInteraction('nav_click', 'toc_chapter_family_guide_button', {
                                  navigation_source: 'toc'
                                });
                                
                                // Send enhanced analytics immediately
                                await sendEnhancedAnalytics(0, 0, [], undefined); // TOC is chapter 0, spread 0
                                
                                console.log(`📊 Enhanced TOC chapter navigation tracking:`, {
                                  buttonType: 'family_guide_button',
                                  chapterId: chapter.id,
                                  chapterTitle: chapter.title,
                                  navigationSource: 'toc',
                                  destination: `/book/chapter/${chapter.id}/activity#family-discussion`
                                });
                              } catch (error) {
                                console.warn('Failed to track TOC chapter navigation:', error);
                              }
                              
                              navigate(`/book/chapter/${chapter.id}/activity#family-discussion`);
                            }}
                          >
                            <Users className="w-2.5 h-2.5 mr-0.5" />
                            Family Guide
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>



        {/* Research Section (Full Width Row) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-2xl">
            <Card 
              className="h-full bg-white/90 backdrop-blur-sm border-forest-200 border-2 shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/book/references')}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs bg-forest-100 text-forest-700">
                    Research
                  </Badge>
                  <div className="text-2xl">📚</div>
                </div>
                
                <CardTitle className="text-forest-800 text-lg text-center">
                  Selected Research Behind the Stories and Activities
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="text-forest-600 mb-4 space-y-2">
                  <p className="text-sm font-medium">Academic Foundations</p>
                  <p className="text-xs leading-relaxed">
                    Explore the research and evidence-based practices that inform each chapter's social-emotional learning concepts.
                  </p>
                </div>
                
                <div className="grid grid-cols-6 gap-2 mb-4">
                  <div 
                    className="text-center p-2 bg-golden-50 rounded border border-golden-200 cursor-pointer bg-golden-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/book/references#chapter-1');
                    }}
                  >
                    <div className="text-xs text-golden-700 font-medium">Ch 1</div>
                  </div>
                  <div 
                    className="text-center p-2 bg-purple-50 rounded border border-purple-200 cursor-pointer bg-purple-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/book/references#chapter-2');
                    }}
                  >
                    <div className="text-xs text-purple-700 font-medium">Ch 2</div>
                  </div>
                  <div 
                    className="text-center p-2 bg-blue-50 rounded border border-blue-200 cursor-pointer bg-blue-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/book/references#chapter-3');
                    }}
                  >
                    <div className="text-xs text-blue-700 font-medium">Ch 3</div>
                  </div>
                  <div 
                    className="text-center p-2 bg-pink-50 rounded border border-pink-200 cursor-pointer bg-pink-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/book/references#chapter-4');
                    }}
                  >
                    <div className="text-xs text-pink-700 font-medium">Ch 4</div>
                  </div>
                  <div 
                    className="text-center p-2 bg-green-50 rounded border border-green-200 cursor-pointer bg-green-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/book/references#chapter-5');
                    }}
                  >
                    <div className="text-xs text-green-700 font-medium">Ch 5</div>
                  </div>
                  <div 
                    className="text-center p-2 bg-cyan-50 rounded border border-cyan-200 cursor-pointer bg-cyan-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/book/references#chapter-6');
                    }}
                  >
                    <div className="text-xs text-cyan-700 font-medium">Ch 6</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-forest-500 bg-forest-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/book/references');
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Research
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      
      {/* Get Full Access Modal */}
      <GetFullAccessModal 
        isOpen={showAccessModal}
        onClose={() => setShowAccessModal(false)}
      />
    </div>
  );
}