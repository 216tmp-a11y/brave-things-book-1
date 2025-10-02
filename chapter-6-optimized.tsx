/**
 * Chapter 6 Optimized Layout Component
 * 
 * Compact, no-scroll reading experience specifically designed for Chapter 6.
 * Everything fits in one viewport: image, text, and navigation controls.
 * Uses Chapter 2's proven layout system with dynamic height adjustments.
 * Follows Chapter 4's cue page and footer styling (no hover effects).
 */

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CueInteraction } from "@/components/cue-interaction";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { saveBookmark } from "@/lib/bookmark";
import { updateCurrentPosition } from "@/lib/platform-tracking";
import { ArrowLeft, ArrowRight, Home, BookOpen, Coffee } from "lucide-react";

// Chapter 6 spreads data
const chapter6Data = {
  title: "Chapter 6: The Sharing Tree",
  subtitle: "Sharing & Connection",
  cue: "Dew Cup",
  cueIcon: Coffee,
  cueColor: "text-cyan-600",
  bgColor: "bg-cyan-50",
  spreads: [
    {
      spread: 1,
      section: "story",
      imageUrl: "https://static.step1.dev/0917dd95aed6ef87a6e192ba8d83fca3",
      text: "Leaving the glowing Gratitude Garden, Mila spotted tiny, silver squirrel footprints on the map. \"They lead to the Sharing Tree!\" Bella exclaimed. \"I bet we'll learn our next lesson there.\""
    },
    {
      spread: 2,
      section: "story",
      imageUrl: "https://static.step1.dev/5d5d56d68ed074df75d8a45660ee1c19",
      text: "At the foot of the ancient Sharing Tree, the Squirrel Twins argued over the very last golden acorn.\n\nTessa wanted the acorn shell to make a tiny cup for gathering morning dew.\nToby wanted the nut inside because he'd missed breakfast and was starving."
    },
    {
      spread: 3,
      section: "story",
      imageUrl: "https://static.step1.dev/90f05838f31916ae11d52f9ca5bb2f74",
      text: "They pulled the acorn back and forth until Mila stepped between them. Remembering what she'd learned about listening to feelings and needs, she asked gently, \"Can we each share why we want the acorn?\""
    },
    {
      spread: 4,
      section: "story",
      imageUrl: "https://static.step1.dev/74ac6fc1a95f83def49168085647e22c",
      text: "Toby groaned, \"I'm so hungry, I might turn into a squirrel balloon and float away!\"\nTessa huffed, \"If I don't get the shell, I'll have to drink dew from my paws and they're ticklish!\"\nMax whispered to Mila, \"If they keep arguing, maybe the acorn will split itself just to get some peace.\""
    },
    {
      spread: 5,
      section: "story",
      imageUrl: "https://static.step1.dev/140aa1ae48ca2aecc82171046ffc7587",
      text: "After both twins explained, Mila's face lit up. \"You don't both need the whole acorn—you need different parts!\" Carefully Mila, cracked the acorn In two."
    },
    {
      spread: 6,
      section: "story",
      imageUrl: "https://static.step1.dev/600c259e67031c8d01f2e0798d3948c2",
      text: "Tessa polished the sturdy shell into a perfect little cup, and Toby happily munched the nut. The solution met both needs—and the quarrel dissolved into giggles."
    },
    {
      spread: 7,
      section: "cue",
      imageUrl: "https://static.step1.dev/600c259e67031c8d01f2e0798d3948c2",
      cue: "Dew Cup",
      cueText: "Let's think of a clever way to share—can you come up with a win-win idea?"
    },
    {
      spread: 8,
      section: "story",
      imageUrl: "https://static.step1.dev/832049a8bd5840365cfeac3e87f108c7",
      text: "The friends then used extra shells and nuts to help other animals: birds filled shell-cups with water for seedlings, and chipmunks shared nut pieces with a hungry fawn. Soon the base of the Sharing Tree buzzed with cooperation."
    },
    {
      spread: 9,
      section: "story",
      imageUrl: "https://static.step1.dev/0633db345891fdf91ce837e1c5d26c40",
      text: "Mila noticed that talking about needs—not just splitting things in half—made everyone feel closer and understood.\n\nAs sunset painted the forest orange and gold, the Twins gifted Mila a tiny dew cup. \"For the road,\" they said. Mila tucked it beside her other treasures, feeling the warm glow of true connection."
    }
  ]
};

interface Chapter6OptimizedProps {
  onBackToContents: () => void;
}

export function Chapter6Optimized({ onBackToContents }: Chapter6OptimizedProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize spread from URL parameter or default to 0
  const spreadParam = searchParams.get('spread');
  const initialSpread = spreadParam ? parseInt(spreadParam) : 0;
  const [currentSpread, setCurrentSpread] = useState(initialSpread);

  const totalSpreads = chapter6Data.spreads.length;
  const currentSpreadData = chapter6Data.spreads[currentSpread];
  
  // Reset spread when coming from bookmark
  useEffect(() => {
    const spreadParam = searchParams.get('spread');
    const targetSpread = spreadParam ? parseInt(spreadParam) : 0;
    setCurrentSpread(targetSpread);
  }, [searchParams]);
  
  // Save bookmark when spread changes
  useEffect(() => {
    saveBookmark(6, currentSpread, chapter6Data.title);
  }, [currentSpread]);

  // Update platform tracking when position changes
  useEffect(() => {
    updateCurrentPosition(6, currentSpread);
  }, [currentSpread]);

  // 🎯 NEW: Enhanced page load tracking for Chapter 6
  useEffect(() => {
    const setupEnhancedTracking = async () => {
      try {
        const { startPageTiming } = await import('@/lib/platform-tracking');
        
        // Start enhanced page timing for current spread
        // Classify as "story" page type
        startPageTiming(6, currentSpread + 1, 'chapter_nav');
        
        console.log('📊 Enhanced Chapter 6 page load tracking initialized:', {
          chapter: 6,
          spread: currentSpread + 1,
          pageType: 'story',
          navigationSource: 'chapter_nav',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Failed to initialize enhanced Chapter 6 tracking:', error);
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
      navigate("/book/chapter/6/activity");
    }
  }, [currentSpread, totalSpreads, navigate]);

  const handlePrevSpread = useCallback(() => {
    if (currentSpread > 0) {
      setCurrentSpread(currentSpread - 1);
    } else {
      navigate("/book/contents");
    }
  }, [currentSpread, navigate]);

  const renderVisual = (imageUrl?: string) => {
    if (imageUrl) {
      return (
        <div className="h-full flex items-center justify-center overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={`Chapter 6 Spread ${currentSpread + 1}`}
            className="w-full h-full object-contain mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-cyan-50 to-teal-50">
      
      {/* COMPACT HEADER - TRANSLUCENT */}
      <div className="bg-white/30 backdrop-blur-sm border-b border-cyan-200/50 px-4 py-2 flex-shrink-0">
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
              className="text-forest-700 hover:bg-white/20 px-2 py-1 h-8"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Contents
            </Button>
            <div className="text-forest-400">•</div>
            <h1 className="text-lg font-bold text-forest-700">
              Chapter 6: The Sharing Tree
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
              ☕ Dew Cup
            </Badge>
            
            <Button
              onClick={() => navigate("/book/chapter/6/activity")}
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-8 border-cyan-300 text-cyan-700 bg-white/20 hover:bg-white/30"
            >
              🎯 Activities
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {currentSpreadData?.section === "cue" ? (
          /* CUE PAGE - FULL PAGE LAYOUT (Chapter 4 style) */
          <div 
            className="flex-1 relative"
            style={{
              backgroundImage: `url(${currentSpreadData.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Centered cue box */}
            <div className="relative z-10 h-full flex items-center justify-center p-8">
              <motion.div 
                className="bg-white/95 backdrop-blur-sm border-4 border-cyan-400 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Cue icon and title */}
                <div className="text-6xl mb-6">☕</div>
                <h2 className="text-3xl font-bold text-cyan-700 mb-8">
                  ✨ Magic Cue Found! ✨
                </h2>
                
                {/* Instruction text */}
                <p className="text-xl text-cyan-600 mb-8 leading-relaxed">
                  Click the glowing Dew Cup to practice sharing!
                </p>
              </motion.div>
            </div>

            {/* Cue Interaction positioned in corner */}
            <CueInteraction
              cueName="Dew Cup"
              cueText="Let's think of a clever way to share—can you come up with a win-win idea?"
              cueIcon={Coffee}
              cueColor="text-cyan-600"
              bgColor="bg-cyan-50"
              position="top-right"
              milaPrompt="Mila balances a tiny dew cup and says: 'When we listen to everyone's needs, we can find creative solutions that make everyone happy!'"
              exerciseSteps={[
                "Pick any nearby object (pencil, toy).",
                "Say, \"I need it for...\" and \"You need it for...\"",
                "Suggest a win-win (take turns, use different parts, or trade)."
              ]}
              buttonLabel="I Did It!"
            />
          </div>
        ) : (
          /* STORY PAGES - SPLIT LAYOUT with dynamic heights */
          <>
            {/* TOP: IMAGE SECTION - Dynamic height based on content needs */}
            <div className={`${
              currentSpread === 1 || currentSpread === 3 || currentSpread === 8 
                ? "h-3/5" // 60% height for spreads needing more text space
                : currentSpread === 4 
                ? "h-1/2" // 50% height for balanced text/image (most text)
                : currentSpread === 5 || currentSpread === 6
                ? "h-3/4" // 75% height for shorter text spreads
                : "h-3/5" // Default 60% height
            } bg-transparent overflow-hidden relative`}>
              <div className="h-full p-6 flex items-center justify-center">
                {renderVisual(currentSpreadData?.imageUrl)}
              </div>
            </div>
            
            {/* BOTTOM: TEXT SECTION - Dynamic height based on content needs */}
            <div className={`${
              currentSpread === 1 || currentSpread === 3 || currentSpread === 8 
                ? "h-2/5" // 40% height (inverse of image)
                : currentSpread === 4 
                ? "h-1/2" // 50% height (inverse of image) - most text
                : currentSpread === 5 || currentSpread === 6
                ? "h-1/4" // 25% height for shorter text spreads
                : "h-2/5" // Default 40% height
            } flex flex-col bg-transparent`}>
              <div className="flex-1 flex justify-center items-center">
                <Card className="w-full max-w-3xl mx-4 my-2 bg-white/95 border-cyan-200 backdrop-blur-sm relative shadow-sm">
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

      {/* BOTTOM NAVIGATION - Chapter 4 style (no hover effects) */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between w-full">
            
            {/* Far Left: Prev Button - No hover effects */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handlePrevSpread}
              disabled={currentSpread === 0}
              className="text-forest-700 px-3 py-2 h-9"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Prev
            </Button>
            
            {/* Center: Progress Bar */}
            <div className="flex-1 mx-8 flex items-center gap-3">
              <span className="text-xs text-forest-600 whitespace-nowrap">Chapter Progress</span>
              <div className="flex-1 bg-transparent border border-white/30 rounded-full h-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentSpread + 1) / totalSpreads) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-forest-500 whitespace-nowrap">
                {currentSpread + 1} of {totalSpreads}
              </span>
            </div>
            
            {/* Far Right: Next Button - No hover effects */}
            <Button 
              onClick={handleNextSpread}
              variant="ghost"
              size="sm"
              className="text-forest-700 px-3 py-2 h-9"
            >
              {currentSpread === totalSpreads - 1 ? "Activities" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}