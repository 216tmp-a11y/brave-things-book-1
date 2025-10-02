/**
 * Chapter 2 Optimized Layout Component
 * 
 * Compact, no-scroll reading experience specifically designed for Chapter 2.
 * Everything fits in one viewport: image, text, and navigation controls.
 * Uses efficient space utilization and compact navigation bar.
 * Follows the exact same optimized pattern as Chapter1Optimized.
 */

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CueInteraction } from "@/components/cue-interaction";
import { Chapter2OpeningScene } from "@/components/chapter-2-opening-scene";
import { MaxTrippingScene } from "@/components/max-tripping-scene";
import { BellaHelpingMaxScene } from "@/components/bella-helping-max-scene";
import { ChameleonScene } from "@/components/chameleon-scene";
import { MaxPolkaDottedPizzaScene } from "@/components/max-polka-dotted-pizza-scene";
import { CamilleExplainingFeelingsScene } from "@/components/camille-explaining-feelings-scene";
import { MilaReaderScene } from "@/components/mila-reader-scene";
import { MaxThoughtfulBreathingScene } from "@/components/max-thoughtful-breathing-scene";
import { AllFriendsNamingFeelingsScene } from "@/components/all-friends-naming-feelings-scene";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { saveReadingPosition } from "@/lib/bookmark";
import { updateCurrentPosition, trackReadingAnalytics, startReadingSession, endReadingSession } from "@/lib/platform-tracking";
import { ArrowLeft, ArrowRight, Home, BookOpen, Rainbow } from "lucide-react";

// Chapter 2 spreads data
const chapter2Data = {
  title: "Chapter 2: The Colorful Chameleon",
  subtitle: "Emotional Management",
  cue: "Rainbow Tail",
  cueIcon: Rainbow,
  cueColor: "text-purple-600",
  bgColor: "bg-purple-50",
  spreads: [
    {
      spread: 1,
      section: "story",
      visualComponent: "Chapter2OpeningScene",
      text: "The sun was shining bright as Mila and her friends followed the next twist on their mystery map. Mila skipped ahead, eager to see what adventure waited."
    },
    {
      spread: 2,
      section: "story",
      visualComponent: "MaxTrippingScene",
      text: "Suddenly, Max the mouse tripped over a root and tumbled into a pile of leaves.\n\n\"Ouch!\" Max squeaked, rubbing his paw. His face scrunched up, and Mila saw tears in his eyes."
    },
    {
      spread: 3,
      section: "story",
      visualComponent: "BellaHelpingMaxScene",
      text: "Bella the bunny tried to help, but Max pushed her away. \"I'm fine!\" he snapped, even though he didn't look fine at all.\n\nMila felt a swirl of feelings—worried for Max, annoyed at his snapping, and a little bit confused."
    },
    {
      spread: 4,
      section: "story",
      visualComponent: "ChameleonScene",
      text: "Just then, a bright flash of color caught her eye. A chameleon was perched on a nearby branch, her skin changing from green to blue to yellow.\n\n\"Hello there,\" said the chameleon gently. \"My name is Camille. I change colors when I feel different things. Sometimes I'm happy and sunny yellow, sometimes I'm sad and blue, and sometimes I'm mad and red.\""
    },
    {
      spread: 5,
      section: "story",
      visualComponent: "MaxPolkaDottedPizzaScene",
      text: "Max perked up, wiping his nose. \"If my feelings showed up on my fur, I'd look like a polka-dotted pizza! Or maybe a rainbow donut with extra sprinkles!\"\n\nBella giggled. \"Or a mouse disco ball!\""
    },
    {
      spread: 6,
      section: "story",
      visualComponent: "CamilleExplainingFeelingsScene",
      text: "Camille smiled. \"Even if your feelings don't show on the outside, it's important to notice them on the inside. When I feel a big feeling, I take a slow breath and name it. That helps me figure out what I need.\""
    },
    {
      spread: 7,
      section: "cue",
      visualComponent: "MilaReaderScene",
      cue: "Rainbow Tail",
      cueText: "Time to name your feeling out loud!"
    },
    {
      spread: 8,
      section: "story",
      visualComponent: "MaxThoughtfulBreathingScene",
      text: "Max sniffled and took a deep breath. \"I guess I feel hurt and embarrassed. Maybe my fur's turning invisible!\"\n\n\"That's a brave thing to say,\" said Camille. \"When you notice your feeling and name it, it can start to change—just like my colors.\""
    },
    {
      spread: 9,
      section: "story",
      visualComponent: "AllFriendsNamingFeelingsScene",
      text: "The friends each tried naming their feelings out loud. Mila felt worried and a little bit mad. Bella felt sad for Max. Grandpa Tortoise said he felt patient and ready to help. Together, they took a slow, deep breath, just like Camille. Max's face relaxed, and he even managed a small smile.\n\nMax grinned. \"Next time I feel all mixed-up, I'll ask for help instead of screaming. Or maybe I'll just turn into a rainbow donut and surprise everyone!\"\n\n\"Whatever color you feel,\" Camille said, \"remember, all feelings are welcome here.\""
    }
  ]
};

// Visual component mapping
const visualComponents = {
  Chapter2OpeningScene,
  MaxTrippingScene,
  BellaHelpingMaxScene,
  ChameleonScene,
  MaxPolkaDottedPizzaScene,
  CamilleExplainingFeelingsScene,
  MilaReaderScene,
  MaxThoughtfulBreathingScene,
  AllFriendsNamingFeelingsScene
};

interface Chapter2OptimizedProps {
  onBackToContents: () => void;
}

export function Chapter2Optimized({ onBackToContents }: Chapter2OptimizedProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize spread from URL parameter or default to 0
  const spreadParam = searchParams.get('spread');
  const initialSpread = spreadParam ? parseInt(spreadParam) : 0;
  const [currentSpread, setCurrentSpread] = useState(initialSpread);

  // Analytics tracking
  const startTimeRef = useRef<number>(Date.now());
  const sessionIdRef = useRef<string | null>(null);
  const interactionsRef = useRef<string[]>([]);
  const pagesVisitedRef = useRef<Set<number>>(new Set());

  const totalSpreads = chapter2Data.spreads.length;
  const currentSpreadData = chapter2Data.spreads[currentSpread];
  
  // Reset spread when coming from bookmark
  useEffect(() => {
    const spreadParam = searchParams.get('spread');
    const targetSpread = spreadParam ? parseInt(spreadParam) : 0;
    setCurrentSpread(targetSpread);
  }, [searchParams]);
  
  // Start analytics session on component mount
  useEffect(() => {
    const initSession = async () => {
      try {
        // Start ONE session for this reading session
        const sessionId = await startReadingSession();
        sessionIdRef.current = sessionId;
        startTimeRef.current = Date.now();
        pagesVisitedRef.current.add(currentSpread + 1);
        
        console.log('📊 SINGLE session started for Chapter 2:', sessionId);
      } catch (error) {
        console.warn('Failed to start analytics session:', error);
      }
    };
    
    initSession();
    
    // 🎯 NEW: Enhanced page load tracking for Chapter 2
    const setupEnhancedTracking = async () => {
      try {
        const { startPageTiming } = await import('@/lib/platform-tracking');
        
        // Start enhanced page timing for current spread
        // Classify as "story" page type
        startPageTiming(2, currentSpread + 1, 'chapter_nav');
        
        console.log('📊 Enhanced Chapter 2 page load tracking initialized:', {
          chapter: 2,
          spread: currentSpread + 1,
          pageType: 'story',
          navigationSource: 'chapter_nav',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Failed to initialize enhanced Chapter 2 tracking:', error);
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
          cuesCollected: interactionsRef.current.filter(i => i.includes('Rainbow Tail'))
        });
        console.log('📊 Session ENDED - Chapter 2 cleanup');
      }
    };
  }, []);

  // Save bookmark when spread changes
  useEffect(() => {
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    pagesVisitedRef.current.add(currentSpread + 1);
    
    saveReadingPosition(2, currentSpread + 1);
    updateCurrentPosition(2, currentSpread);
    
    trackReadingAnalytics({
      chapter: 2,
      spread: currentSpread + 1,
      timeSpent: Math.max(1, timeSpent),
      interactions: [...interactionsRef.current]
    });
    
    console.log(`📊 Chapter 2 - Spread ${currentSpread + 1} viewed (${timeSpent}s, ${interactionsRef.current.length} interactions)`);
  }, [currentSpread]);

  const handleNextSpread = useCallback(() => {
    interactionsRef.current.push(`navigate_next_spread_${currentSpread + 1}`);
    
    if (currentSpread < totalSpreads - 1) {
      setCurrentSpread(currentSpread + 1);
    } else {
      interactionsRef.current.push('navigate_to_activities');
      navigate("/book/chapter/2/activity");
    }
  }, [currentSpread, totalSpreads, navigate]);

  const handlePrevSpread = useCallback(() => {
    interactionsRef.current.push(`navigate_previous_spread_${currentSpread + 1}`);
    
    if (currentSpread > 0) {
      setCurrentSpread(currentSpread - 1);
    } else {
      navigate("/book/contents");
    }
  }, [currentSpread, navigate]);

  const renderVisual = (componentName: string) => {
    const Component = visualComponents[componentName as keyof typeof visualComponents];
    if (Component) {
      return <Component className="w-full h-full object-contain" />;
    }
    return null;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
      
      {/* COMPACT HEADER - TRANSLUCENT */}
      <div className="bg-white/30 backdrop-blur-sm border-b border-purple-200/50 px-4 py-2 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Back + Chapter Title */}
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
              onClick={onBackToContents}
              variant="ghost"
              size="sm"
              className="text-forest-700 px-2 py-1 h-8 hover:bg-transparent hover:text-forest-600"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Contents
            </Button>
            <div className="text-forest-400">•</div>
            <h1 className="text-lg font-bold text-forest-700">
              Chapter 2: The Colorful Chameleon
            </h1>
          </div>
          
          {/* Right: Badge + Activities */}
          <div className="flex items-center gap-2">
            <Badge 
              className="text-xs px-2 py-1 border bg-white/50 backdrop-blur-sm" 
              style={{ 
                color: '#5D4E37', 
                borderColor: '#E6D2AA' 
              }}
            >
              🌈 Rainbow Tail
            </Badge>
            
            <Button
              onClick={async () => {
                // 🎯 NEW: Enhanced activities button tracking
                try {
                  const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                  
                  trackPageInteraction('nav_click', 'activities_button', {
                    navigation_source: 'chapter_nav'
                  });
                  
                  await sendEnhancedAnalytics(2, currentSpread + 1);
                  
                  console.log(`📊 Enhanced Activities button tracking:`, {
                    chapter: 2,
                    spread: currentSpread + 1,
                    buttonType: 'activities_button'
                  });
                } catch (error) {
                  console.warn('Failed to track activities button:', error);
                }
                
                navigate("/book/chapter/2/activity");
              }}
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-8 border-purple-300 text-purple-700 bg-white/20 hover:bg-transparent hover:text-forest-600"
            >
              🎯 Activities
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {currentSpreadData?.section === "cue" ? (
          /* CUE PAGE - FULL PAGE LAYOUT WITH BACKGROUND IMAGE */
          <div className="flex-1 relative overflow-hidden">
            
            {/* Background Image */}
            <div className="absolute inset-0">
              {renderVisual(currentSpreadData.visualComponent)}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-400/40 via-purple-300/60 to-purple-500/70"></div>
            </div>

            {/* Main Cue Box - Centered */}
            <div className="relative z-10 h-full flex items-center justify-center p-8">
              <motion.div 
                className="bg-cream-50 border-4 border-purple-400 rounded-3xl p-12 text-center mx-auto max-w-2xl"
                style={{ 
                  backgroundColor: '#FDF6E3',
                  borderColor: '#9333EA'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Celebratory Emojis at Top */}
                <div className="text-5xl mb-8">
                  🌈 ✨ 🌈
                </div>
                
                {/* Magic Cue Found Title */}
                <h2 className="text-4xl font-bold mb-10" style={{ color: '#7C3AED' }}>
                  ✨ Magic Cue Found! ✨
                </h2>
                
                {/* Instruction Text */}
                <div className="text-3xl leading-relaxed font-medium mb-6" style={{ color: '#9333EA' }}>
                  Click the glowing Rainbow Tail in the corner to try the activity!
                </div>
              </motion.div>
            </div>

            {/* Cue Interaction */}
            <CueInteraction
              cueName="Rainbow Tail"
              cueText=""
              cueIcon={Rainbow}
              cueColor="text-purple-600"
              bgColor="bg-purple-50"
              milaPrompt="Camille the chameleon changes colors gently: 'When we name our feelings, they become easier to understand. What feeling would you like to share?'"
              exerciseSteps={[
                "Think about how you're feeling right now.",
                "Say your feeling out loud: \"I feel _____\"",
                "Remember: all feelings are okay!"
              ]}
              buttonLabel="I named my feeling!"
              position="top-right"
            />
          </div>
        ) : (
          /* STORY PAGES - SPLIT LAYOUT */
          <>
            {/* TOP: IMAGE SECTION - Dynamic height based on content needs */}
            <div className={`${
              currentSpread === 1 || currentSpread === 2 
                ? "h-3/5" // 60% height for spreads needing more text space
                : currentSpread === 3 
                ? "h-1/2" // 50% height for balanced text/image
                : currentSpread === 8
                ? "h-3/4" // 75% height for final spread
                : "h-3/5" // Default 60% height
            } bg-transparent overflow-hidden relative`}>
              <div className="h-full p-6 flex items-center justify-center">
                {currentSpreadData?.visualComponent && renderVisual(currentSpreadData.visualComponent)}
              </div>
            </div>
            
            {/* BOTTOM: TEXT SECTION - Dynamic height based on content needs */}
            <div className={`${
              currentSpread === 1 || currentSpread === 2 
                ? "h-2/5" // 40% height (inverse of image)
                : currentSpread === 3 
                ? "h-1/2" // 50% height (inverse of image)
                : currentSpread === 8
                ? "h-1/4" // 25% height (inverse of image)
                : "h-2/5" // Default 40% height
            } flex flex-col bg-transparent`}>
              <div className="flex-1 flex justify-center items-center">
                <Card className="w-full max-w-3xl mx-4 my-2 bg-white/95 border-purple-200 backdrop-blur-sm relative shadow-sm">
                  <CardContent className="p-6 flex items-center justify-center">
                    <div className="text-lg leading-relaxed text-forest-800 text-center whitespace-pre-line">
                      {currentSpreadData?.text?.split('\n\n').map((paragraph, index) => (
                        <p key={index} className={index > 0 ? 'mt-7' : ''}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Minimal Navigation Controls */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between items-center py-0 px-2">
          {/* Previous Button - Ultra Minimal */}
          <Button
            onClick={handlePrevSpread}
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
              {chapter2Data.spreads.map((_, index) => (
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
            <span className="text-xs text-forest-600">{currentSpread + 1} of {chapter2Data.spreads.length}</span>
          </div>

          {/* Next Button - Ultra Minimal */}
          <Button
            onClick={handleNextSpread}
            variant="ghost"
            size="sm"
            className="text-forest-600 px-2 py-0 h-6 hover:bg-transparent hover:text-forest-600"
          >
            {currentSpread === totalSpreads - 1 ? "Activities" : "Next"}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

    </div>
  );
}