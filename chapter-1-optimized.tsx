/**
 * Chapter 1 Optimized Layout Component
 * 
 * Compact, no-scroll reading experience specifically designed for Chapter 1.
 * Everything fits in one viewport: image, text, and navigation controls.
 * Uses efficient space utilization and compact navigation bar.
 */

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CueInteraction } from "@/components/cue-interaction";
import { OakTreeScene } from "@/components/oak-tree-scene";
import { ForestPathScene } from "@/components/forest-path-scene";
import { ScatteredFriendsScene } from "@/components/scattered-friends-scene";
import { PondScene } from "@/components/pond-scene";
import { MilaAndWiseFrogScene } from "@/components/mila-and-wise-frog-scene";
import { BreathingCircleScene } from "@/components/breathing-circle-scene";
import { FriendsTogetherScene } from "@/components/friends-together-scene";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { saveReadingPosition } from "@/lib/bookmark";
import { updateCurrentPosition, trackReadingAnalytics, startReadingSession, endReadingSession } from "@/lib/platform-tracking";
import { ArrowLeft, ArrowRight, Home, BookOpen, Leaf } from "lucide-react";

// Chapter 1 spreads data
const chapter1Data = {
  title: "Chapter 1: The Still Pond",
  subtitle: "Mindfulness",
  cue: "Golden Leaf",
  cueIcon: Leaf,
  cueColor: "text-golden-600",
  bgColor: "bg-golden-50",
  spreads: [{
    spread: 1,
    section: "story",
    visualComponent: "OakTreeScene",
    text: "Today was the day! Mila the squirrel had been wiggling with excitement all week. The adventure was finally here. She and her friends—Max the mouse, Bella the bunny, and Grandpa Tortoise—gathered at the big oak tree, clutching their mysterious map."
  }, {
    spread: 2,
    section: "story",
    visualComponent: "ForestPathScene",
    text: "\"We're going to find every secret spot in the forest!\" Mila squeaked, her tail twitching. Max bounced on his toes. \"Let's go! Let's go! I want to be the first to find a clue!\" Bella tried to keep up, but her ears flopped in her face as she hurried after the others. Grandpa Tortoise, as always, moved at his own slow and steady pace."
  }, {
    spread: 3,
    section: "story",
    visualComponent: "ScatteredFriendsScene",
    text: "The friends dashed down the path, leaves crunching under their feet. But soon, Mila realized she couldn't hear Max's silly songs or Bella's giggles. She turned around—everyone was scattered! Max was tangled in a bush, Bella looked ready to cry, and Grandpa Tortoise was far behind."
  }, {
    spread: 4,
    section: "story",
    visualComponent: "PondScene",
    text: "Mila's heart thumped. \"This isn't how I imagined our adventure,\" she thought. \"We're all mixed up and grumpy.\" Just then, they reached a quiet, sparkling pond. On a lily pad sat Wise Frog, eyes closed, breathing in and out, slow and calm."
  }, {
    spread: 5,
    section: "story",
    visualComponent: "MilaAndWiseFrogScene",
    text: "Mila plopped down next to him, her fur all frazzled. \"We're supposed to be having fun, but everything feels wrong.\" Wise Frog opened one eye and smiled. \"Sometimes, the best way to start an adventure is to pause and notice what's around you. Want to try?\""
  }, {
    spread: 6,
    section: "story",
    visualComponent: "BreathingCircleScene",
    text: "Mila wasn't sure, but she nodded. The friends gathered around the pond. Wise Frog showed them how to sit still, close their eyes, and take a slow, deep breath—like smelling a flower. Then they breathed out, slow and gentle, like blowing on a pond to make tiny ripples."
  }, {
    spread: 7,
    section: "cue",
    visualComponent: "BreathingCircleScene",
    cue: "Golden Leaf",
    cueText: "Take a slow pond breath! Breathe in slowly (smell flower), breathe out gently (pond ripples)."
  }, {
    spread: 8,
    section: "story",
    visualComponent: "FriendsTogetherScene",
    text: "Mila grinned. \"I feel ready now. Let's start our adventure—together.\" The friends stood up, feeling calm and connected. They had learned their first important lesson: sometimes the best way to begin is to pause, breathe, and notice the world around you."
  }]
};

// Visual component mapping
const visualComponents = {
  OakTreeScene,
  ForestPathScene,
  ScatteredFriendsScene,
  PondScene,
  MilaAndWiseFrogScene,
  BreathingCircleScene,
  FriendsTogetherScene
};

interface Chapter1OptimizedProps {
  onBackToContents: () => void;
}

export function Chapter1Optimized({
  onBackToContents
}: Chapter1OptimizedProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentSpread, setCurrentSpread] = useState(0);
  const [showCue, setShowCue] = useState(false);
  
  // Analytics tracking
  const startTimeRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string | null>(null);
  const interactionsRef = useRef<string[]>([]);
  const pagesVisitedRef = useRef<Set<number>>(new Set());

  // Initialize spread from URL parameter
  useEffect(() => {
    const spreadParam = searchParams.get('spread');
    if (spreadParam) {
      const spreadIndex = parseInt(spreadParam) - 1;
      if (spreadIndex >= 0 && spreadIndex < chapter1Data.spreads.length) {
        setCurrentSpread(spreadIndex);
      }
    }
  }, [searchParams]);

  // Start analytics session on component mount
  useEffect(() => {
    const initSession = async () => {
      try {
        // Start ONE session for this reading session
        const sessionId = await startReadingSession();
        sessionIdRef.current = sessionId;
        startTimeRef.current = Date.now();
        
        // Track initial page visit in session
        pagesVisitedRef.current.add(currentSpread + 1);
        
        console.log('📊 SINGLE session started for Chapter 1:', sessionId);
      } catch (error) {
        console.warn('Failed to start analytics session:', error);
      }
    };
    
    initSession();
    
    // 🎯 NEW: Enhanced page load tracking for Chapter 1
    const setupEnhancedTracking = async () => {
      try {
        const { startPageTiming } = await import('@/lib/platform-tracking');
        
        // Start enhanced page timing for current spread
        // Classify as "story" page type
        startPageTiming(1, currentSpread + 1, 'chapter_nav');
        
        console.log('📊 Enhanced Chapter 1 page load tracking initialized:', {
          chapter: 1,
          spread: currentSpread + 1,
          pageType: 'story',
          navigationSource: 'chapter_nav',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Failed to initialize enhanced Chapter 1 tracking:', error);
      }
    };

    // Initialize enhanced tracking after brief delay
    setTimeout(setupEnhancedTracking, 100);
    
    // Cleanup: end session when component unmounts or user leaves
    return () => {
      if (sessionIdRef.current) {
        const totalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        endReadingSession(sessionIdRef.current, {
          totalDuration,
          pagesVisited: Array.from(pagesVisitedRef.current),
          finalInteractions: interactionsRef.current.length,
          cuesCollected: interactionsRef.current.filter(i => i.includes('Golden Leaf'))
        });
        console.log('📊 Session ENDED - Chapter 1 cleanup');
      }
    };
  }, []);

  // Save bookmark and update tracking when spread changes
  useEffect(() => {
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    // Track page visit
    pagesVisitedRef.current.add(currentSpread + 1);
    
    // Save reading position using simple localStorage system
    saveReadingPosition(1, currentSpread + 1);
    
    // Track analytics for this page
    trackReadingAnalytics({
      chapter: 1,
      spread: currentSpread + 1,
      timeSpent: Math.max(1, timeSpent), // At least 1 second
      interactions: [...interactionsRef.current]
    });
    
    console.log(`📖 Chapter 1 - Spread ${currentSpread + 1} viewed (${timeSpent}s, ${interactionsRef.current.length} interactions)`);
    console.log(`📖 User-account bookmark saved: ${chapter1Data.title} - Spread ${currentSpread + 1}`);
  }, [currentSpread]);

  const currentSpreadData = chapter1Data.spreads[currentSpread];
  const isLastSpread = currentSpread === chapter1Data.spreads.length - 1;
  const VisualComponent = currentSpreadData.visualComponent 
    ? visualComponents[currentSpreadData.visualComponent as keyof typeof visualComponents]
    : null;

  const handleNext = useCallback(() => {
    // Track navigation interaction
    interactionsRef.current.push(`navigate_next_spread_${currentSpread + 1}`);
    
    if (isLastSpread) {
      interactionsRef.current.push('navigate_to_activities');
      navigate("/book/chapter/1/activity");
    } else {
      setCurrentSpread(prev => prev + 1);
    }
  }, [currentSpread, isLastSpread, navigate]);

  const handlePrevious = useCallback(() => {
    // Track navigation interaction
    interactionsRef.current.push(`navigate_previous_spread_${currentSpread + 1}`);
    
    if (currentSpread > 0) {
      setCurrentSpread(prev => prev - 1);
    }
  }, [currentSpread]);

  const handleActivities = useCallback(async () => {
    // 🎯 NEW: Enhanced activities button tracking
    try {
      const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
      
      // Track the specific navigation interaction
      trackPageInteraction('nav_click', 'activities_button', {
        navigation_source: 'chapter_nav',
        position: { x: 0, y: 0 } // Top right nav bar
      });
      
      // Send enhanced analytics immediately
      await sendEnhancedAnalytics(1, currentSpread + 1, [], {
        print_clicks: 0,
        print_targets: [],
        time_on_activity_page: 0
      });
      
      console.log(`📊 Enhanced Activities button tracking:`, {
        chapter: 1,
        spread: currentSpread + 1,
        buttonType: 'activities_button',
        navigationSource: 'chapter_nav'
      });
    } catch (error) {
      console.warn('Failed to track activities button:', error);
    }
    
    // ⚠️ OLD: Keep existing tracking temporarily
    interactionsRef.current.push('click_activities_button');
    navigate("/book/chapter/1/activity");
  }, [navigate, currentSpread]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-golden-50 to-forest-100">
      {/* Compact Navigation Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-forest-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBackToContents}
              className="text-forest-600 hover:bg-transparent hover:text-forest-600"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Contents
            </Button>
            <div className="text-forest-400">•</div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-forest-800">{chapter1Data.title}</h1>
              <p className="text-sm text-forest-600">{chapter1Data.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${chapter1Data.bgColor} ${chapter1Data.cueColor} border-current text-xs px-2 py-1`}>
              🍃 {chapter1Data.cue}
            </Badge>
            <Button 
              onClick={handleActivities}
              variant="outline" 
              size="sm"
              className="text-xs px-2 py-1 h-7 border-forest-300 text-forest-700 hover:bg-transparent hover:text-forest-600"
            >
              🎯 Activities
            </Button>

          </div>
        </div>
      </div>

      {/* Content Container - Takes remaining space */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto px-4 py-6">
        <motion.div
          key={currentSpread}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8 min-h-[calc(100vh-200px)]"
        >
          {/* Visual Section - Top Half (Hide for cue pages) */}
          {currentSpreadData.section !== "cue" && (
            <div className="flex-shrink-0 mb-6">
              {VisualComponent && (
                <div className="relative w-full" style={{ height: 'min(45vh, 350px)' }}>
                  <VisualComponent className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          )}

          {/* Text Section - Bottom Half */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {currentSpreadData.section === "cue" ? (
              /* CUE PAGE - FULL PAGE LAYOUT WITH BACKGROUND IMAGE */
              <div className="flex-1 relative overflow-hidden">
                
                {/* Background Image */}
                <div className="absolute inset-0">
                  {VisualComponent && <VisualComponent className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-b from-golden-400/40 via-golden-300/60 to-golden-500/70"></div>
                </div>

                {/* Main Cue Box - Centered */}
                <div className="relative z-10 h-full flex items-center justify-center p-8">
                  <motion.div 
                    className="bg-cream-50 border-4 border-golden-400 rounded-3xl p-12 text-center mx-auto max-w-2xl"
                    style={{ 
                      backgroundColor: '#FDF6E3',
                      borderColor: '#F59E0B'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    {/* Celebratory Emojis at Top */}
                    <div className="text-5xl mb-8">
                      🍃 ✨ 🍃
                    </div>
                    
                    {/* Magic Cue Found Title */}
                    <h2 className="text-4xl font-bold mb-10" style={{ color: '#D97706' }}>
                      ✨ Magic Cue Found! ✨
                    </h2>
                    
                    {/* Instruction Text */}
                    <div className="text-3xl leading-relaxed font-medium mb-6" style={{ color: '#F59E0B' }}>
                      Click the glowing Golden Leaf in the corner to try the activity!
                    </div>
                  </motion.div>
                </div>

                {/* Cue Interaction */}
                <CueInteraction
                  cueName={chapter1Data.cue}
                  cueText="Breathe deeply"
                  cueIcon={chapter1Data.cueIcon}
                  cueColor={chapter1Data.cueColor}
                  bgColor={chapter1Data.bgColor}
                  position="top-right"
                  milaPrompt="Wise Frog sits peacefully on his lily pad: 'When we breathe slowly and deeply, our minds become as calm as still water. Would you like to try a pond breath with me?'"
                  exerciseSteps={[
                    "Sit comfortably and close your eyes",
                    "Breathe in slowly through your nose (like smelling a flower)",
                    "Breathe out gently through your mouth (like making pond ripples)"
                  ]}
                  buttonLabel="I took a pond breath!"
                />
              </div>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm border-forest-200">
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-forest-700 leading-relaxed text-lg">
                      {currentSpreadData.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ultra-Minimal Navigation Controls */}
            <div className="flex justify-between items-center py-0 px-2">
              {/* Previous Button - Ultra Minimal */}
              <Button
                onClick={handlePrevious}
                disabled={currentSpread === 0}
                variant="ghost"
                size="sm"
                className="text-forest-600 disabled:opacity-50 px-2 py-0 h-6 hover:bg-transparent hover:text-forest-600"
              >
                <ArrowLeft className="w-3 h-3 mr-1" />
                Prev
              </Button>

              {/* Chapter Progress with Dots */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-forest-600">Chapter Progress</span>
                <div className="flex gap-1">
                  {chapter1Data.spreads.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSpread(index)}
                      className={`w-2 h-2 rounded-full  ${
                        index === currentSpread
                          ? 'bg-forest-500'
                          : 'bg-forest-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-forest-600">{currentSpread + 1} of {chapter1Data.spreads.length}</span>
              </div>

              {/* Next Button - Ultra Minimal */}
              <Button
                onClick={handleNext}
                variant="ghost"
                size="sm"
                className="text-forest-600 px-2 py-0 h-6 hover:bg-transparent hover:text-forest-600"
              >
                {isLastSpread ? "Activities" : "Next"}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}