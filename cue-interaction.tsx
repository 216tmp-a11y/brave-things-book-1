/**
 * Cue Interaction Component
 * 
 * Interactive cue button that triggers a popup with breathing exercise instructions.
 * Positioned as an overlay on the scene image with beautiful animations.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { CuePopup } from "@/components/cue-popup";
import { trackReadingAnalytics, trackCueInteraction, startPageTiming } from "@/lib/platform-tracking";

interface CueInteractionProps {
  cueName: string;
  cueText: string;
  cueIcon: LucideIcon;
  cueColor: string;
  bgColor: string;
  position: string;
  exerciseSteps?: string[];
  buttonLabel?: string;
  milaPrompt?: string;
}

export function CueInteraction({
  cueName,
  cueText,
  cueIcon: Icon,
  cueColor,
  bgColor,
  position,
  exerciseSteps,
  buttonLabel,
  milaPrompt
}: CueInteractionProps) {
  const [showPopup, setShowPopup] = useState(false);

  const handleCueClick = async () => {
    setShowPopup(true);
    
    // Enhanced cue interaction tracking
    try {
      // Determine chapter and spread from cue name
      const chapterMap = {
        'Golden': { chapter: 1, spread: 7 },
        'Rainbow': { chapter: 2, spread: 7 },
        'Bravery': { chapter: 3, spread: 6 },
        'Sparkling': { chapter: 4, spread: 6 },
        'Gratitude': { chapter: 5, spread: 8 },
        'Dew': { chapter: 6, spread: 7 }
      };
      
      const cueKey = Object.keys(chapterMap).find(key => cueName.includes(key));
      const { chapter, spread } = cueKey ? chapterMap[cueKey as keyof typeof chapterMap] : { chapter: 1, spread: 7 };
      
      // 🎯 NEW: Use enhanced cue tracking
      const cueData = trackCueInteraction(cueName, Icon.name || 'icon', chapter, spread);
      
      // 🎯 NEW: Send enhanced analytics immediately with cue interaction data  
      const { sendEnhancedAnalytics } = await import('@/lib/platform-tracking');
      await sendEnhancedAnalytics(chapter, spread, [cueData]);
      
      // ⚠️ OLD: Keep existing tracking temporarily for compatibility 
      await trackReadingAnalytics({
        chapter,
        spread,
        timeSpent: 1,
        interactions: [`cue_clicked_${cueName.replace(/\s+/g, '_').toLowerCase()}`]
      });
      
      console.log(`📊 Enhanced cue interaction tracked:`, {
        cueName,
        chapter,
        spread,
        timeBeforeClick: cueData.time_before_click,
        engagementScore: cueData.engagement_score,
        enhancedAnalyticsSent: true
      });
    } catch (error) {
      console.warn('Failed to track cue interaction:', error);
    }
  };

  // For cue pages, always position in top-right corner regardless of position prop
  const isCuePage = cueText.includes("corner") || cueText.includes("Spot the");
  const finalPosition = isCuePage ? "top-right" : position;

  return (
    <>
      {/* Floating cue button */}
      <motion.button
        className={`${finalPosition === 'relative' ? 'relative mx-auto' : 'absolute'} ${finalPosition === 'top-right' ? 'top-4 right-4 z-10' : finalPosition === 'top-left' ? 'top-4 left-4 z-10' : ''} ${bgColor} p-6 rounded-full border-2 border-white/50 shadow-lg backdrop-blur-sm w-20 h-20 flex items-center justify-center`}
        onClick={handleCueClick}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: [1, 1.4, 1],
          boxShadow: [
            "0 0 0 0 rgba(251, 191, 36, 0.7)",
            "0 0 0 25px rgba(251, 191, 36, 0)",
            "0 0 0 0 rgba(251, 191, 36, 0.7)",
          ],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon className={`w-8 h-8 ${cueColor}`} />
      </motion.button>

      {/* Popup modal */}
      <CuePopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        cueName={cueName}
        cueText={cueText}
        cueIcon={Icon}
        cueColor={cueColor}
        bgColor={bgColor}
        milaPrompt={milaPrompt}
        exerciseSteps={exerciseSteps}
        buttonLabel={buttonLabel}
      />
    </>
  );
}