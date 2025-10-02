/**
 * Chapter Activity Header Component
 * 
 * Universal header for all chapter activity pages with:
 * - Chapter number and title display
 * - Navigation controls (back to contents, back to chapter)
 * - Print functionality button
 * - Badge with chapter theme
 * - Consistent styling across all chapters
 */

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Home, Download } from "lucide-react";

interface ChapterActivityHeaderProps {
  chapterNumber: number;
  chapterTitle: string;
  badgeEmoji: string;
  badgeText: string;
  onBackToContents: () => void;
  onBackToChapter: () => void;
  onPrint: () => void;
}

export function ChapterActivityHeader({
  chapterNumber,
  chapterTitle,
  badgeEmoji,
  badgeText,
  onBackToContents,
  onBackToChapter,
  onPrint
}: ChapterActivityHeaderProps) {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Navigation */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToContents}
              className="text-gray-600 hover:text-gray-800"
            >
              <Home className="w-4 h-4 mr-2" />
              Contents
            </Button>
            <div className="text-gray-400">•</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToChapter}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Chapter {chapterNumber}
            </Button>
          </div>

          {/* Center: Title */}
          <div className="text-center">
            <h1 className="text-xl font-bold" style={{ color: '#5D4E37' }}>
              {chapterTitle}
            </h1>
            <Badge 
              variant="outline" 
              className="mt-1 text-xs"
              style={{ borderColor: '#E6D2AA', color: '#5D4E37' }}
            >
              {badgeEmoji} {badgeText}
            </Badge>
          </div>

          {/* Right: Print Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrint}
              className="flex items-center gap-2"
              style={{ borderColor: '#E6D2AA', color: '#5D4E37' }}
            >
              <Download className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}