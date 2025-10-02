/**
 * Chapter 4 Optimized Layout Component
 * 
 * Compact, no-scroll reading experience specifically designed for Chapter 4.
 * Everything fits in one viewport: image, text, and navigation controls.
 * Uses efficient space utilization and compact navigation bar.
 * Follows the exact same pattern as Chapter1Optimized and Chapter2Optimized.
 */

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { CueInteraction } from "@/components/cue-interaction";
import { Chapter4OpeningScene } from "@/components/chapter-4-opening-scene";
import { KindnessMeadowScene } from "@/components/kindness-meadow-scene";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { saveBookmark } from "@/lib/bookmark";
import { updateCurrentPosition } from "@/lib/platform-tracking";
import { 
  ArrowLeft, 
  ArrowRight, 
  Home,
  BookOpen,
  Sparkles
} from "lucide-react";

// Chapter 4 spreads data
const chapter4Data = {
  title: "Chapter 4: The Kindness Meadow",
  subtitle: "Kindness",
  cue: "Sparkling Petal",
  cueIcon: Sparkles,
  cueColor: "text-pink-600",
  bgColor: "bg-pink-50",
  spreads: [
    {
      spread: 1,
      section: "story",
      imageUrl: "https://static.step1.dev/c3d631ed41695d5ce5816fd11934c342",
      text: "After their brave crossing and a night of celebration at the Forest Festival, Mila and her friends noticed a glowing path on their map, sparkling in the morning sun. \"Look!\" said Mila. \"The next clue points to Kindness Meadow. I wonder who needs our help today?\""
    },
    {
      spread: 2,
      section: "story",
      imageUrl: "https://static.step1.dev/6432d1650596508a765dff1457f62c9e",
      text: "As they entered the meadow, wildflowers swayed in the breeze and butterflies filled the air. But the friends soon spotted a group of butterflies fluttering frantically, their wings stuck together by sticky spider silk, and a young hedgehog sitting alone, looking lost and sad."
    },
    {
      spread: 3,
      section: "story",
      imageUrl: "https://static.step1.dev/644451cb1ea51597b94c078de5d07d97",
      text: "Suddenly, Gentle Deer appeared behind them, her eyes gentle and wise. \"Kindness is like a ripple in a pond,\" she said. \"One small act can spread far and wide.\""
    },
    {
      spread: 4,
      section: "story",
      imageUrl: "https://static.step1.dev/12d9ac0b5a2634ab1eeacff319aba5d1",
      text: "Max the mouse puffed out his chest. \"I'll help the butterflies! Unless they're ticklish. If they giggle, I might turn into a giggling mouse tornado!\"\n\nBella giggled, \"Don't worry, Max. I'll hold you down if you start spinning!\""
    },
    {
      spread: 5,
      section: "story",
      imageUrl: "https://static.step1.dev/ca605abd5d0613e8ce4bf40068c343ef",
      text: "Mila knelt beside the hedgehog. \"Would you like some help?\" she asked softly. The hedgehog nodded, sniffling. Mila offered a soft flower petal to comfort him while Bella and Max hurried to the butterflies."
    },
    {
      spread: 6,
      section: "cue",
      visualComponent: "KindnessMeadowScene",
      cue: "Sparkling Petal",
      cueText: "Let's make someone smile! Say something kind out loud—even a tiny word counts."
    },
    {
      spread: 7,
      section: "story",
      imageUrl: "https://static.step1.dev/bd12d1242240118fe9f9d686fa53a0ca",
      text: "Soon, the butterflies were free, and the hedgehog was smiling. The butterflies danced around the friends, and the hedgehog shared his picnic snacks with everyone. Laughter and kindness filled the meadow."
    },
    {
      spread: 8,
      section: "story",
      imageUrl: "https://static.step1.dev/fa2f908952e6dac029331c4d4c1aff41",
      text: "As the sun dipped lower, Gentle Deer handed Mila a petal with a message: \"True kindness always finds its way home.\" Mila tucked it into her bag, and the friends wondered what their next adventure would bring."
    }
  ]
};

// Visual component mapping
const visualComponents = {
  Chapter4OpeningScene,
  KindnessMeadowScene
};

interface Chapter4OptimizedProps {
  onBackToContents: () => void;
}

export function Chapter4Optimized({ onBackToContents }: Chapter4OptimizedProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize spread from URL parameter or default to 0
  const spreadParam = searchParams.get('spread');
  const initialSpread = spreadParam ? parseInt(spreadParam) : 0;
  const [currentSpread, setCurrentSpread] = useState(initialSpread);

  
  const totalSpreads = chapter4Data.spreads.length;
  const currentSpreadData = chapter4Data.spreads[currentSpread];
  
  // Reset spread when coming from bookmark
  useEffect(() => {
    const spreadParam = searchParams.get('spread');
    const targetSpread = spreadParam ? parseInt(spreadParam) : 0;
    setCurrentSpread(targetSpread);
  }, [searchParams]);
  
  // Save bookmark when spread changes
  useEffect(() => {
    saveBookmark(4, currentSpread, chapter4Data.title);
  }, [currentSpread]);

  // Update platform tracking when position changes
  useEffect(() => {
    updateCurrentPosition(4, currentSpread);
  }, [currentSpread]);

  // 🎯 NEW: Enhanced page load tracking for Chapter 4
  useEffect(() => {
    const setupEnhancedTracking = async () => {
      try {
        const { startPageTiming } = await import('@/lib/platform-tracking');
        
        // Start enhanced page timing for current spread
        // Classify as "story" page type
        startPageTiming(4, currentSpread + 1, 'chapter_nav');
        
        console.log('📊 Enhanced Chapter 4 page load tracking initialized:', {
          chapter: 4,
          spread: currentSpread + 1,
          pageType: 'story',
          navigationSource: 'chapter_nav',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Failed to initialize enhanced Chapter 4 tracking:', error);
      }
    };

    // Initialize enhanced tracking after brief delay
    setTimeout(setupEnhancedTracking, 100);
  }, [currentSpread]);

  const handleNextSpread = useCallback(() => {
    if (currentSpread < totalSpreads - 1) {
      setCurrentSpread(currentSpread + 1);
    } else {
      // Go to Activities page after the last story spread
      navigate("/book/chapter/4/activity");
    }
  }, [currentSpread, totalSpreads, navigate]);

  const handlePrevSpread = useCallback(() => {
    if (currentSpread > 0) {
      setCurrentSpread(currentSpread - 1);
    } else {
      navigate("/book/contents");
    }
  }, [currentSpread, navigate]);



  const renderVisual = (componentName?: string, imageUrl?: string) => {
    // If we have a direct image URL, use that instead of a component
    if (imageUrl) {
      const getImageClassName = () => {
        if (currentSpread === 0) { // spread 1 - direct image (normal)
          return "max-h-full max-w-full object-contain"; // Normal size
        } else { // All other spreads use KindnessMeadowScene
          return "max-h-[120%] max-w-full object-contain object-bottom"; // Scale up 20%, crop top
        }
      };

      return (
        <div className="h-full flex items-center justify-center overflow-hidden">
          <motion.img
            src={imageUrl}
            alt="Chapter 4 illustration"
            className={`${getImageClassName()} rounded-xl shadow-sm`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      );
    }

    // Fallback to component rendering
    if (componentName) {
      const Component = visualComponents[componentName as keyof typeof visualComponents];
      if (Component) {
        const getImageClassName = () => {
          if (currentSpread === 0) { // spread 1 - Chapter4OpeningScene (normal)
            return "max-h-full max-w-full object-contain"; // Normal size
          } else { // All other spreads use KindnessMeadowScene
            return "max-h-[120%] max-w-full object-contain object-bottom"; // Scale up 20%, crop top
          }
        };

        return (
          <div className="h-full flex items-center justify-center overflow-hidden">
            <Component className={getImageClassName()} />
          </div>
        );
      }
    }
    
    return null;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
      
      {/* COMPACT HEADER - TRANSLUCENT */}
      <div className="bg-white/30 backdrop-blur-sm border-b border-pink-200/50 px-4 py-2 flex-shrink-0">
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
              Chapter 4: The Kindness Meadow
            </h1>
          </div>
          
          {/* Right: Badge + Activities + Print */}
          <div className="flex items-center gap-2">
            <Badge 
              className="text-xs px-2 py-1 border bg-white/50 backdrop-blur-sm" 
              style={{ 
                color: '#5D4E37', 
                borderColor: '#E6D2AA' 
              }}
            >
              ✨ Sparkling Petal
            </Badge>
            
            <Button
              onClick={() => navigate("/book/chapter/4/activity")}
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-8 border-pink-300 text-pink-700 bg-white/20 hover:bg-transparent hover:text-forest-600"
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
              {renderVisual(currentSpreadData?.visualComponent, currentSpreadData?.imageUrl)}
              <div className="absolute inset-0 bg-gradient-to-b from-pink-400/40 via-pink-300/60 to-pink-500/70"></div>
            </div>

            {/* Main Cue Box - Centered */}
            <div className="relative z-10 h-full flex items-center justify-center p-8">
              <motion.div 
                className="bg-cream-50 border-4 border-pink-400 rounded-3xl p-12 text-center mx-auto max-w-2xl"
                style={{ 
                  backgroundColor: '#FDF6E3',
                  borderColor: '#EC4899'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Celebratory Emojis at Top */}
                <div className="text-5xl mb-8">
                  ✨ 🌸 ✨
                </div>
                
                {/* Magic Cue Found Title */}
                <h2 className="text-4xl font-bold mb-10" style={{ color: '#DB2777' }}>
                  ✨ Magic Cue Found! ✨
                </h2>
                
                {/* Instruction Text */}
                <div className="text-3xl leading-relaxed font-medium mb-6" style={{ color: '#EC4899' }}>
                  Click the glowing Sparkling Petal in the corner to try the activity!
                </div>
              </motion.div>
            </div>

            {/* Cue Interaction */}
            <CueInteraction
              cueName="Sparkling Petal"
              cueText=""
              cueIcon={Sparkles}
              cueColor="text-pink-600"
              bgColor="bg-pink-50"
              milaPrompt="Gentle Deer nods warmly: 'When we share kindness, it spreads like ripples in a pond. What kind words would you like to share?'"
              exerciseSteps={[
                "Think of a person or pet.",
                `Say one kind word or sentence to them (e.g., "Thank you," "I like playing with you").`,
                "Bonus: Give a gentle high-five or smile."
              ]}
              buttonLabel="Continue Reading"
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
                : currentSpread === 5
                ? "h-3/4" // 75% height for final spread
                : "h-3/5" // Default 60% height
            } bg-transparent overflow-hidden relative`}>
              <div className="h-full p-6 flex items-center justify-center">
                {renderVisual(currentSpreadData?.visualComponent, currentSpreadData?.imageUrl)}
              </div>
            </div>
            
            {/* BOTTOM: TEXT SECTION - Dynamic height based on content needs */}
            <div className={`${
              currentSpread === 1 || currentSpread === 2 
                ? "h-2/5" // 40% height (inverse of image)
                : currentSpread === 3 
                ? "h-1/2" // 50% height (inverse of image)
                : currentSpread === 5
                ? "h-1/4" // 25% height (inverse of image)
                : "h-2/5" // Default 40% height
            } flex flex-col bg-transparent`}>
              <div className="flex-1 flex justify-center items-center">
                <Card className="w-full max-w-3xl mx-4 my-2 bg-white/95 border-pink-200 backdrop-blur-sm relative shadow-sm">
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
              {chapter4Data.spreads.map((_, index) => (
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
            <span className="text-xs text-forest-600">{currentSpread + 1} of {chapter4Data.spreads.length}</span>
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