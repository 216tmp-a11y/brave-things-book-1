/**
 * Chapter 3 Optimized Layout Component
 * 
 * Compact, no-scroll reading experience specifically designed for Chapter 3.
 * Everything fits in one viewport: image, text, and navigation controls.
 * Uses efficient space utilization and compact navigation bar.
 * Follows Chapter 2's proven layout system with dynamic height adjustments.
 */

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CueInteraction } from "@/components/cue-interaction";
import { BridgeScene } from "@/components/bridge-scene";
import { MaxWorriedBridgeScene } from "@/components/max-worried-bridge-scene";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { saveBookmark } from "@/lib/bookmark";
import { updateCurrentPosition } from "@/lib/platform-tracking";
import { ArrowLeft, ArrowRight, Home, BookOpen, Shield } from "lucide-react";

// Chapter 3 spreads data
const chapter3Data = {
  title: "Chapter 3: The Brave Bridge",
  subtitle: "Bravery",
  cue: "Bravery Badge",
  cueIcon: Shield,
  cueColor: "text-blue-600",
  bgColor: "bg-blue-50",
  spreads: [
    {
      spread: 1,
      section: "story",
      imageUrl: "https://static.step1.dev/9fd3a706a5d1f1702b206e9848dba48e",
      text: "Mila and her friends were buzzing with excitement as they followed the next twist on their mystery map. The path led them to the edge of a wide, wobbly wooden bridge stretching over a sparkling stream."
    },
    {
      spread: 2,
      section: "story",
      imageUrl: "https://static.step1.dev/c14f4e51d99ab263dfe03c8ad82c6145",
      text: "On the other side, a colorful banner fluttered in the breeze: \"Forest Festival—This Way!\"\n\nMila's paws tingled. \"Look! The festival is just across the bridge!\" she squeaked."
    },
    {
      spread: 3,
      section: "story",
      imageUrl: "https://static.step1.dev/5de50364bb25d046926df4c2c0225a64",
      text: "But Max the mouse stepped back, his whiskers trembling. \"That bridge looks really high...and really wobbly,\" he whispered. \"What if it creaks? What if I slip? What if I turn into a pancake and they have to roll me to the festival?\""
    },
    {
      spread: 4,
      section: "story",
      imageUrl: "https://static.step1.dev/3286ff07dade2b26703dc592171ad8af",
      text: "Bella the bunny hopped to his side. \"It's okay to feel scared, Max. Want to try crossing together?\"\n\nMax nodded, but his tummy felt twisty."
    },
    {
      spread: 5,
      section: "story",
      imageUrl: "https://static.step1.dev/99a12aca3cd25829d82cf68900df6086",
      text: "Bella smiled gently. \"Let's take one small step at a time. And if you feel scared, try a deep, slow breath—like this.\" She puffed up her cheeks and breathed in... and out... nice and slow."
    },
    {
      spread: 6,
      section: "cue",
      visualComponent: "BridgeScene",
      cue: "Bravery Badge",
      cueText: "Click to practice being brave!",
      milaPrompt: "Mila stands tall and brave at the bridge: 'Sometimes being brave means trying something even when we feel scared. Every small step counts as courage!'",
      exerciseSteps: [
        "Think of something you'd like to try that feels a little scary",
        "Take a deep breath and say: \"I can try!\"",
        "Remember: feeling scared and being brave can happen together!"
      ],
      buttonLabel: "I said I can try!"
    },
    {
      spread: 7,
      section: "story",
      imageUrl: "https://static.step1.dev/7efcd1e4ca26fd5b9461b457157f0c09",
      text: "Max put one paw on the bridge. Creak! He squeezed Mila's paw tighter and took a deep breath. Step by step, the friends moved forward."
    },
    {
      spread: 8,
      section: "story",
      imageUrl: "https://static.step1.dev/744b8a549d2bcb18ee02ab6fe70c0118",
      text: "Max's heart thumped, but Bella cheered, \"You're doing it, Max!\"\n\nStep by step, they moved forward together."
    },
    {
      spread: 9,
      section: "story",
      imageUrl: "https://static.step1.dev/6b0ed1c7ed9dd557c893422c3c284488",
      text: "Halfway across, the wind whooshed. Max's ears trembled. He wanted to turn back, but he remembered Bella's words: \"I can try!\"\n\nMax whispered to himself, \"I can try. I can try.\" He took another deep breath and kept going, feeling braver with each step."
    },
    {
      spread: 10,
      section: "story",
      imageUrl: "https://static.step1.dev/5d6ac3aab41af4695dc9bcdc11f23cf7",
      text: "Max smiled. \"I was scared, but I tried anyway. Next time, maybe I'll ask for help instead of screaming—or at least warn everyone before I turn into a pancake!\""
    },
    {
      spread: 11,
      section: "story",
      imageUrl: "https://static.step1.dev/b084365215453d317fde9d714b003f7b",
      text: "At last, all four friends reached the other side. The festival music played, and the smell of treats filled the air.\n\nMax's tummy still felt fluttery, but now it was with excitement.\n\nMila grinned. \"You were so brave, Max!\""
    },
    {
      spread: 12,
      section: "story",
      imageUrl: "https://static.step1.dev/0fa7ab2a04cd69b5284f65d9745e0d43",
      text: "Grandpa Tortoise nodded. \"Exactly. Every brave step helps us grow.\"\n\nThe friends danced and laughed at the festival, proud of their brave steps—and ready for whatever the next adventure might bring."
    }
  ]
};

// Visual component mapping
const visualComponents = {
  BridgeScene,
  MaxWorriedBridgeScene
};

interface Chapter3OptimizedProps {
  onBackToContents: () => void;
}

export function Chapter3Optimized({ onBackToContents }: Chapter3OptimizedProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize spread from URL parameter or default to 0
  const spreadParam = searchParams.get('spread');
  const initialSpread = spreadParam ? parseInt(spreadParam) : 0;
  const [currentSpread, setCurrentSpread] = useState(initialSpread);

  const totalSpreads = chapter3Data.spreads.length;
  const currentSpreadData = chapter3Data.spreads[currentSpread];
  
  // Reset spread when coming from bookmark
  useEffect(() => {
    const spreadParam = searchParams.get('spread');
    const targetSpread = spreadParam ? parseInt(spreadParam) : 0;
    setCurrentSpread(targetSpread);
  }, [searchParams]);
  
  // Save bookmark when spread changes
  useEffect(() => {
    saveBookmark(3, currentSpread, chapter3Data.title);
  }, [currentSpread]);

  // Update platform tracking when position changes
  useEffect(() => {
    updateCurrentPosition(3, currentSpread);
  }, [currentSpread]);

  // 🎯 NEW: Enhanced page load tracking for Chapter 3
  useEffect(() => {
    const setupEnhancedTracking = async () => {
      try {
        const { startPageTiming } = await import('@/lib/platform-tracking');
        
        // Start enhanced page timing for current spread
        // Classify as "story" page type
        startPageTiming(3, currentSpread + 1, 'chapter_nav');
        
        console.log('📊 Enhanced Chapter 3 page load tracking initialized:', {
          chapter: 3,
          spread: currentSpread + 1,
          pageType: 'story',
          navigationSource: 'chapter_nav',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Failed to initialize enhanced Chapter 3 tracking:', error);
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
      navigate("/book/chapter/3/activity");
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
    if (imageUrl) {
      return (
        <div className="h-full flex items-center justify-center overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={`Chapter 3 Spread ${currentSpread + 1}`}
            className="w-full h-full max-w-4xl object-contain mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      );
    }

    if (componentName) {
      const Component = visualComponents[componentName as keyof typeof visualComponents];
      if (Component) {
        return (
          <div className="h-full flex items-center justify-center overflow-hidden">
            <Component className="max-h-full max-w-full object-contain" />
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      
      {/* COMPACT HEADER - TRANSLUCENT */}
      <div className="bg-white/30 backdrop-blur-sm border-b border-blue-200/50 px-4 py-2 flex-shrink-0">
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
              Chapter 3: The Brave Bridge
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
              🛡️ Bravery Badge
            </Badge>
            
            <Button
              onClick={async () => {
                // 🎯 NEW: Enhanced activities button tracking
                try {
                  const { trackPageInteraction, sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
                  
                  trackPageInteraction('nav_click', 'activities_button', {
                    navigation_source: 'chapter_nav'
                  });
                  
                  await sendEnhancedAnalytics(3, currentSpread + 1);
                  
                  console.log(`📊 Enhanced Activities button tracking:`, {
                    chapter: 3,
                    spread: currentSpread + 1,
                    buttonType: 'activities_button'
                  });
                } catch (error) {
                  console.warn('Failed to track activities button:', error);
                }
                
                navigate("/book/chapter/3/activity");
              }}
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-8 border-blue-300 text-blue-700 bg-white/20 hover:bg-transparent hover:text-forest-600"
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
              <div className="absolute inset-0 bg-gradient-to-b from-blue-400/40 via-blue-300/60 to-blue-500/70"></div>
            </div>

            {/* Main Cue Box - Centered */}
            <div className="relative z-10 h-full flex items-center justify-center p-8">
              <motion.div 
                className="bg-cream-50 border-4 border-blue-400 rounded-3xl p-12 text-center mx-auto max-w-2xl"
                style={{ 
                  backgroundColor: '#FDF6E3',
                  borderColor: '#3B82F6'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Celebratory Emojis at Top */}
                <div className="text-5xl mb-8">
                  🛡️ ✨ 🛡️
                </div>
                
                {/* Magic Cue Found Title */}
                <h2 className="text-4xl font-bold mb-10" style={{ color: '#2563EB' }}>
                  ✨ Magic Cue Found! ✨
                </h2>
                
                {/* Instruction Text */}
                <div className="text-3xl leading-relaxed font-medium mb-6" style={{ color: '#3B82F6' }}>
                  Click the glowing Bravery Badge in the corner to try the activity!
                </div>
              </motion.div>
            </div>

            {/* Cue Interaction */}
            <CueInteraction
              cueName="Bravery Badge"
              cueText=""
              cueIcon={Shield}
              cueColor="text-blue-600"
              bgColor="bg-blue-50"
              milaPrompt={currentSpreadData.milaPrompt}
              exerciseSteps={currentSpreadData.exerciseSteps}
              buttonLabel={currentSpreadData.buttonLabel}
              position="top-right"
            />
          </div>
        ) : (
          /* STORY PAGES - SPLIT LAYOUT */
          <>
            {/* TOP: IMAGE SECTION - Dynamic height based on content needs */}
            <div className="h-3/5 bg-transparent overflow-hidden relative">
              <div className="h-full p-6 flex items-center justify-center">
                {renderVisual(currentSpreadData?.visualComponent, currentSpreadData?.imageUrl)}
              </div>
            </div>
            
            {/* BOTTOM: TEXT SECTION */}
            <div className="h-2/5 flex flex-col bg-transparent">
              <div className="flex-1 flex justify-center items-center">
                <Card className="w-full max-w-3xl mx-4 my-2 bg-white/95 border-blue-200 backdrop-blur-sm relative shadow-sm">
                  <CardContent className="p-6 flex items-center justify-center">
                    <div className="text-xl leading-relaxed text-forest-800 text-center whitespace-pre-line">
                      {currentSpreadData?.text?.split('\n\n').map((paragraph, index) => (
                        <p 
                          key={index} 
                          className={index > 0 ? 'mt-7' : ''}
                        >
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
              {chapter3Data.spreads.map((_, index) => (
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
            <span className="text-xs text-forest-600">{currentSpread + 1} of {chapter3Data.spreads.length}</span>
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