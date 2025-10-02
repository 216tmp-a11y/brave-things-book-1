/**
 * Chapter 5 Optimized Layout Component
 * 
 * Compact, no-scroll reading experience specifically designed for Chapter 5.
 * Everything fits in one viewport: image, text, and navigation controls.
 * Uses Chapter 2's proven layout system with dynamic height adjustments.
 * Follows Chapter 4's exact formatting patterns.
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
import { 
  ArrowLeft, 
  ArrowRight, 
  Home,
  BookOpen,
  Heart
} from "lucide-react";

// Chapter 5 spreads data
const chapter5Data = {
  title: "Chapter 5: The Gratitude Garden",
  subtitle: "Gratitude",
  cue: "Gratitude Leaf",
  cueIcon: Heart,
  cueColor: "text-green-600",
  bgColor: "bg-green-50",
  spreads: [
    {
      spread: 1,
      section: "story",
      imageUrl: "https://static.step1.dev/af7d79868fc54169a8768bd03b7b23c0",
      text: "The next morning, while packing up their picnic in Kindness Meadow, Mila found a sparkling leaf tucked into the map. On it was a message: \"Sometimes, the best adventures are the ones we appreciate most.\""
    },
    {
      spread: 2,
      section: "story",
      imageUrl: "https://static.step1.dev/b8a7e82065d5fe8052c8dcd7ccd47097",
      text: "Grandpa Tortoise waved from a nearby path, calling, \"Come along, friends! The Gratitude Garden is waiting.\""
    },
    {
      spread: 3,
      section: "story",
      imageUrl: "https://static.step1.dev/7bb20585f7b57d45b88bae407b5f3a06",
      text: "Mila and her friends followed Grandpa Tortoise to a garden bursting with color. Every branch and bush shimmered with paper leaves, each covered in drawings and words. Animals from all over the forest were adding their own gratitude leaves."
    },
    {
      spread: 4,
      section: "story",
      imageUrl: "https://static.step1.dev/87efdb8c0f8535f041e28aaf99946707",
      text: "Max squinted at the garden and said, \"If I write 'cheese snacks' on every leaf, do you think the trees will start growing cheese?\"\n\nBella giggled. \"Or maybe sunshine-flavored carrots!\"\n\nMila rolled her eyes. \"Let's not turn the garden into a snack shop.\""
    },
    {
      spread: 5,
      section: "story",
      imageUrl: "https://static.step1.dev/377ca9b7aa4908ddf1bd9fb6e1eab7f7",
      text: "Grandpa Tortoise smiled. \"In this garden, we remember all the good things—big and small—that make our hearts feel full. Would you like to add your own gratitude leaves?\""
    },
    {
      spread: 6,
      section: "story",
      imageUrl: "https://static.step1.dev/985b9e0c4555ca2672704a8f61d2180b",
      text: "Mila thought of her warm nest, her friends, and the adventure they were sharing. Max drew a picture of cheese, and Bella wrote \"sunshine.\""
    },
    {
      spread: 7,
      section: "story",
      imageUrl: "https://static.step1.dev/c1de4bbdce08d187574c3ce9f5976138",
      text: "As they hung their leaves, Mila noticed her worries felt lighter and her smile grew bigger."
    },
    {
      spread: 8,
      section: "cue",
      imageUrl: "https://static.step1.dev/c1de4bbdce08d187574c3ce9f5976138",
      cue: "Gratitude Leaf",
      cueText: "Mila hugs a shiny leaf close and says, \"I'm thankful for adventures with friends. What about you? Let's share one thing we're grateful for!\""
    }
  ]
};

interface Chapter5OptimizedProps {
  onBackToContents: () => void;
}

export function Chapter5Optimized({ onBackToContents }: Chapter5OptimizedProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize spread from URL parameter or default to 0
  const spreadParam = searchParams.get('spread');
  const initialSpread = spreadParam ? parseInt(spreadParam) : 0;
  const [currentSpread, setCurrentSpread] = useState(initialSpread);

  
  const totalSpreads = chapter5Data.spreads.length;
  const currentSpreadData = chapter5Data.spreads[currentSpread];
  
  // Reset spread when coming from bookmark
  useEffect(() => {
    const spreadParam = searchParams.get('spread');
    const targetSpread = spreadParam ? parseInt(spreadParam) : 0;
    setCurrentSpread(targetSpread);
  }, [searchParams]);
  
  // Save bookmark when spread changes
  useEffect(() => {
    saveBookmark(5, currentSpread, chapter5Data.title);
  }, [currentSpread]);

  // Update platform tracking when position changes
  useEffect(() => {
    updateCurrentPosition(5, currentSpread);
  }, [currentSpread]);

  // 🎯 NEW: Enhanced page load tracking for Chapter 5
  useEffect(() => {
    const setupEnhancedTracking = async () => {
      try {
        const { startPageTiming } = await import('@/lib/platform-tracking');
        
        // Start enhanced page timing for current spread
        // Classify as "story" page type
        startPageTiming(5, currentSpread + 1, 'chapter_nav');
        
        console.log('📊 Enhanced Chapter 5 page load tracking initialized:', {
          chapter: 5,
          spread: currentSpread + 1,
          pageType: 'story',
          navigationSource: 'chapter_nav',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.warn('Failed to initialize enhanced Chapter 5 tracking:', error);
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
      navigate("/book/chapter/5/activity");
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
            alt={`Chapter 5 Spread ${currentSpread + 1}`}
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
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
      
      {/* COMPACT HEADER */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-green-200 px-4 py-3 flex-shrink-0">
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
              className="text-forest-700 px-2 py-1 h-8"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Contents
            </Button>
            <div className="text-forest-400">•</div>
            <h1 className="text-lg font-bold text-forest-700">
              Chapter 5: The Gratitude Garden
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
              💖 Gratitude Leaf
            </Badge>
            
            <Button
              onClick={() => navigate("/book/chapter/5/activity")}
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1 h-8 border-green-300 text-green-700 bg-white/20"
            >
              🎯 Activities
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {currentSpreadData?.section === "cue" ? (
          /* CUE PAGE - FULL PAGE LAYOUT */
          <div className="flex-1 relative overflow-hidden">
            
            {/* Background Image */}
            <div className="absolute inset-0">
              <motion.img
                src={currentSpreadData.imageUrl}
                alt={`Chapter 5 Spread ${currentSpread + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-green-400/40 via-green-300/60 to-green-500/70"></div>
            </div>

            {/* Main Cue Box - Centered */}
            <div className="relative z-10 h-full flex items-center justify-center p-8">
              <motion.div 
                className="bg-cream-50 border-4 border-green-400 rounded-3xl p-12 text-center mx-auto max-w-2xl"
                style={{ 
                  backgroundColor: '#FDF6E3',
                  borderColor: '#22C55E'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Celebratory Emojis at Top */}
                <div className="text-5xl mb-8">
                  💚 ✨ 💚
                </div>
                
                {/* Magic Cue Found Title */}
                <h2 className="text-4xl font-bold mb-10" style={{ color: '#166534' }}>
                  ✨ Magic Cue Found! ✨
                </h2>
                
                {/* Instruction Text */}
                <div className="text-3xl leading-relaxed font-medium mb-6" style={{ color: '#15803D' }}>
                  Click the glowing Gratitude Leaf in the corner to try the activity!
                </div>
              </motion.div>
            </div>

            {/* Cue Interaction */}
            <CueInteraction
              cueName="Gratitude Leaf"
              cueText="Let's make someone smile! Say something kind out loud—even a tiny word counts."
              cueIcon={Heart}
              cueColor="text-green-600"
              bgColor="bg-green-50"
              milaPrompt="Mila smiles warmly: 'Gratitude helps our hearts grow bigger. What fills your heart with joy today?'"
              exerciseSteps={[
                "Place a hand on your heart.",
                "Take one slow breath.",
                "Say one thing you're thankful for right now."
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
              currentSpread === 0 || currentSpread === 2 || currentSpread === 4 
                ? "h-3/5" // 60% height for spreads needing more text space
                : currentSpread === 3 
                ? "h-1/2" // 50% height for balanced text/image (most text)
                : currentSpread === 6
                ? "h-3/4" // 75% height for short text spreads
                : "h-3/5" // Default 60% height
            } bg-transparent overflow-hidden relative`}>
              <div className="h-full p-6 flex items-center justify-center">
                {renderVisual(currentSpreadData?.imageUrl)}
              </div>
            </div>
            
            {/* BOTTOM: TEXT SECTION - Dynamic height based on content needs */}
            <div className={`${
              currentSpread === 0 || currentSpread === 2 || currentSpread === 4 
                ? "h-2/5" // 40% height (inverse of image)
                : currentSpread === 3 
                ? "h-1/2" // 50% height (inverse of image) - most text
                : currentSpread === 6
                ? "h-1/4" // 25% height for short text spreads
                : "h-2/5" // Default 40% height
            } flex flex-col bg-transparent`}>
              <div className="flex-1 flex justify-center items-center">
                <Card className="w-full max-w-3xl mx-4 my-2 bg-white/95 border-green-200 backdrop-blur-sm relative shadow-sm">
                  <CardContent className="p-6 flex items-center justify-center">
                    <div className="text-lg leading-relaxed text-forest-800 text-center whitespace-pre-line [&>p]:mb-7">
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
          {/* Previous Button */}
          <Button
            onClick={handlePrevSpread}
            disabled={currentSpread === 0}
            variant="ghost"
            size="sm"
            className="text-forest-600 disabled:opacity-50 px-2 py-0 h-6"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Prev
          </Button>

          {/* Chapter Progress with Dots */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-forest-600">Chapter Progress</span>
            <div className="flex gap-1">
              {chapter5Data.spreads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSpread(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSpread
                      ? 'bg-forest-500'
                      : 'bg-forest-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-forest-600">{currentSpread + 1} of {chapter5Data.spreads.length}</span>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNextSpread}
            variant="ghost"
            size="sm"
            className="text-forest-600 px-2 py-0 h-6"
          >
            {currentSpread === totalSpreads - 1 ? "Activities" : "Next"}
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

    </div>
  );
}