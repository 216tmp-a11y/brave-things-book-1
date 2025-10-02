/**
 * User-Specific Bookmark System for Interactive Book
 * 
 * Hybrid approach: localStorage for fast access + optional server backup
 * Each user gets their own bookmark key based on their authentication
 */

export interface BookmarkData {
  chapterId: number;
  spreadIndex: number;
  timestamp: number;
  chapterTitle?: string;
  userId?: string;
}

/**
 * Get user-specific bookmark key
 * If user is authenticated, include userId in key for isolation
 */
function getBookmarkKey(): string {
  try {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      // Create a simple hash from token for user identification
      const hashCode = authToken.split('').reduce((hash, char) => {
        return ((hash << 5) - hash) + char.charCodeAt(0);
      }, 0);
      return `brave-things-bookmark-${Math.abs(hashCode)}`;
    }
  } catch (error) {
    console.warn('Could not get user info for bookmark key:', error);
  }
  
  // Fallback to generic key for non-authenticated users
  return 'brave-things-bookmark';
}

/**
 * Save reading progress to localStorage
 * Called when user views a new spread
 */
export function saveBookmark(chapterId: number, spreadIndex: number, chapterTitle?: string): void {
  try {
    const bookmark: BookmarkData = {
      chapterId,
      spreadIndex,
      timestamp: Date.now(),
      chapterTitle
    };
    
    const key = getBookmarkKey();
    localStorage.setItem(key, JSON.stringify(bookmark));
    
    console.log(`📖 Bookmark saved: Chapter ${chapterId}, Spread ${spreadIndex + 1}`);
  } catch (error) {
    // Silently fail if localStorage is not available
    console.warn('Could not save bookmark:', error);
  }
}

/**
 * Load saved reading progress from localStorage
 * Returns null if no bookmark exists
 */
export function loadBookmark(): BookmarkData | null {
  try {
    const key = getBookmarkKey();
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    
    const bookmark = JSON.parse(saved) as BookmarkData;
    
    // Validate bookmark structure
    if (typeof bookmark.chapterId === 'number' && 
        typeof bookmark.spreadIndex === 'number' &&
        typeof bookmark.timestamp === 'number') {
      return bookmark;
    }
    
    return null;
  } catch (error) {
    console.warn('Could not load bookmark:', error);
    return null;
  }
}

/**
 * Clear saved bookmark
 * Useful when user completes the book or wants to start over
 */
export function clearBookmark(): void {
  try {
    const key = getBookmarkKey();
    localStorage.removeItem(key);
    console.log('📖 Bookmark cleared');
  } catch (error) {
    console.warn('Could not clear bookmark:', error);
  }
}

/**
 * Check if there's a saved bookmark
 * Quick utility for conditional rendering
 */
export function hasBookmark(): boolean {
  return loadBookmark() !== null;
}

/**
 * Get formatted bookmark description for UI
 * Returns human-readable string like "Chapter 2, Page 3"
 */
export function getBookmarkDescription(bookmark: BookmarkData): string {
  const chapterTitle = bookmark.chapterTitle || `Chapter ${bookmark.chapterId}`;
  const pageNumber = bookmark.spreadIndex + 1;
  return `${chapterTitle}, Page ${pageNumber}`;
}

/**
 * Calculate reading progress percentage
 * Based on actual chapter page counts from our system
 */
export function calculateProgress(chapterId: number, spreadIndex: number): number {
  // Actual spreads per chapter from our chapter data
  const chaptersData = [
    { id: 1, pages: 8 },  // Chapter 1: The Still Pond
    { id: 2, pages: 9 },  // Chapter 2: The Colorful Chameleon  
    { id: 3, pages: 12 }, // Chapter 3: The Brave Bridge
    { id: 4, pages: 8 },  // Chapter 4: The Kindness Meadow
    { id: 5, pages: 8 },  // Chapter 5: The Gratitude Garden
    { id: 6, pages: 9 }   // Chapter 6: The Sharing Tree
  ];
  
  let totalPagesRead = 0;
  
  // Add all pages from completed chapters
  for (let i = 1; i < chapterId; i++) {
    const chapter = chaptersData.find(c => c.id === i);
    if (chapter) {
      totalPagesRead += chapter.pages;
    }
  }
  
  // Add current spread (spreadIndex + 1 because it's 0-based)
  totalPagesRead += (spreadIndex + 1);
  
  // Calculate total pages in book
  const totalPages = chaptersData.reduce((sum, chapter) => sum + chapter.pages, 0);
  
  return Math.min(Math.round((totalPagesRead / totalPages) * 100), 100);
}

/**
 * Get chapter title by ID
 * Returns proper chapter titles from our system
 */
export function getChapterTitle(chapterId: number): string {
  const chapterTitles = {
    1: "The Still Pond",
    2: "The Colorful Chameleon", 
    3: "The Brave Bridge",
    4: "The Kindness Meadow",
    5: "The Gratitude Garden",
    6: "The Sharing Tree"
  };
  
  return chapterTitles[chapterId as keyof typeof chapterTitles] || `Chapter ${chapterId}`;
}

/**
 * Save reading position (simplified bookmark for automatic progress tracking)
 * This is the same as saveBookmark but with a clearer name for auto-tracking
 */
export function saveReadingPosition(chapter: number, spread: number): void {
  const chapterTitle = getChapterTitle(chapter);
  saveBookmark(chapter, spread - 1, chapterTitle); // Convert to 0-based spread index
}

/**
 * Get current reading position
 * Returns the bookmark data in a position format
 */
export function getReadingPosition(): { chapter: number; spread: number; lastReadAt?: string } | null {
  const bookmark = loadBookmark();
  if (!bookmark) return null;
  
  return {
    chapter: bookmark.chapterId,
    spread: bookmark.spreadIndex + 1, // Convert from 0-based to 1-based
    lastReadAt: new Date(bookmark.timestamp).toISOString()
  };
}

/**
 * Format timestamp for "saved just now" display
 */
export function formatTimestamp(timestamp?: string | number): string {
  if (!timestamp) return "Saved just now";
  
  const now = Date.now();
  const saved = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const diffMinutes = Math.floor((now - saved) / (1000 * 60));
  
  if (diffMinutes < 1) return "Saved just now";
  if (diffMinutes < 60) return `Saved ${diffMinutes} minutes ago`;
  if (diffMinutes < 1440) return `Saved ${Math.floor(diffMinutes / 60)} hours ago`;
  return `Saved ${Math.floor(diffMinutes / 1440)} days ago`;
}

// Legacy functions for compatibility with existing code
export async function getAllBookmarks(): Promise<Array<{
  id: string;
  chapter: number;
  spread: number;
  title: string;
  note?: string;
  timestamp: string;
}>> {
  const bookmark = loadBookmark();
  if (!bookmark) return [];
  
  return [{
    id: 'current-bookmark',
    chapter: bookmark.chapterId,
    spread: bookmark.spreadIndex + 1,
    title: bookmark.chapterTitle || getChapterTitle(bookmark.chapterId),
    timestamp: new Date(bookmark.timestamp).toISOString()
  }];
}

export async function deleteBookmark(bookmarkId: string): Promise<void> {
  clearBookmark();
}

export async function updateBookmark(bookmarkId: string, updates: {
  note?: string;
  title?: string;
}): Promise<void> {
  // Not needed for simple localStorage approach
  console.log('Update bookmark not implemented for localStorage system');
}

export async function clearBookmarks(): Promise<void> {
  clearBookmark();
}