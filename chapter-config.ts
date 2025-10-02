/**
 * Chapter Configuration Library
 * 
 * Provides configuration data for each chapter including:
 * - Basic chapter information (number, title, theme)
 * - Badge and visual elements
 * - Print functionality
 * - Navigation helpers
 */

interface ChapterConfig {
  number: number;
  title: string;
  theme: string;
  badgeEmoji: string;
  badgeText: string;
  printFunction: () => void;
}

// Chapter configurations
const chapterConfigs: Record<number, ChapterConfig> = {
  1: {
    number: 1,
    title: "The Still Pond",
    theme: "Mindfulness",
    badgeEmoji: "🍃",
    badgeText: "Mindfulness Activities",
    printFunction: () => {
      // Print functionality for Chapter 1
      window.print();
    }
  },
  2: {
    number: 2,
    title: "The Colorful Chameleon",
    theme: "Emotional Awareness",
    badgeEmoji: "🌈",
    badgeText: "Feelings Activities",
    printFunction: () => {
      // Print functionality for Chapter 2
      window.print();
    }
  },
  3: {
    number: 3,
    title: "The Brave Bridge",
    theme: "Courage",
    badgeEmoji: "🛡️",
    badgeText: "Bravery Activities",
    printFunction: () => {
      // Print functionality for Chapter 3
      window.print();
    }
  },
  4: {
    number: 4,
    title: "The Kindness Meadow",
    theme: "Kindness",
    badgeEmoji: "✨",
    badgeText: "Kindness Activities",
    printFunction: () => {
      // Print functionality for Chapter 4
      window.print();
    }
  },
  5: {
    number: 5,
    title: "The Gratitude Garden",
    theme: "Gratitude",
    badgeEmoji: "💚",
    badgeText: "Gratitude Activities",
    printFunction: () => {
      // Print functionality for Chapter 5
      window.print();
    }
  },
  6: {
    number: 6,
    title: "The Sharing Tree",
    theme: "Sharing",
    badgeEmoji: "💧",
    badgeText: "Sharing Activities",
    printFunction: () => {
      // Print functionality for Chapter 6
      window.print();
    }
  }
};

/**
 * Get chapter configuration by chapter ID
 */
export function getChapterConfig(chapterId: number): ChapterConfig | null {
  return chapterConfigs[chapterId] || null;
}

/**
 * Get all available chapter configurations
 */
export function getAllChapterConfigs(): ChapterConfig[] {
  return Object.values(chapterConfigs);
}