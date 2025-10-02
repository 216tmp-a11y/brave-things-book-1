/**
 * Cue Popup Component
 * 
 * Beautiful, simple popup modal that appears when users click on interactive cues.
 * Shows clear instructions on what to do with a greyed background overlay.
 * Features smooth animations and child-friendly design.
 */

import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

interface CuePopupProps {
  isOpen: boolean;
  onClose: () => void;
  cueName: string;
  cueText: string;
  cueIcon: LucideIcon;
  cueColor: string;
  bgColor: string;
  milaPrompt?: string;
  exerciseSteps?: string[];
  buttonLabel?: string;
}

export function CuePopup({
  isOpen,
  onClose,
  cueName,
  cueText,
  cueIcon: Icon,
  cueColor,
  bgColor,
  milaPrompt,
  exerciseSteps,
  buttonLabel
}: CuePopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Header - Compact Design */}
            <div className="p-3 text-center border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="bg-gray-100 text-gray-600 text-gray-800 h-8 w-8 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center ${cueColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <Badge className={`${cueColor} bg-gray-100 border-current text-sm py-1 px-3`}>
                {cueName}
              </Badge>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {/* Mila's Prompt (if provided) */}
              {milaPrompt && (
                <div className="bg-golden-50 p-4 rounded-lg border border-golden-200 mb-4">
                  <p className="text-forest-700 italic">
                    {milaPrompt}
                  </p>
                </div>
              )}
              
              {/* Exercise Steps (if provided) */}
              {exerciseSteps && exerciseSteps.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-forest-800 mb-3">Let's try this together:</h4>
                  <ol className="space-y-2">
                    {exerciseSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full ${bgColor} ${cueColor} flex items-center justify-center text-sm font-bold`}>
                          {index + 1}
                        </span>
                        <span className="text-forest-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              
              {/* Action Button */}
              <div className="text-center">
                <Button
                  onClick={onClose}
                  className={`${bgColor} ${cueColor} border border-current bg-white/20 px-8 py-2`}
                >
                  {buttonLabel || "Great job! Continue reading →"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}