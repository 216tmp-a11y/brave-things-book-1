/**
 * Book Catalog Page
 * 
 * Displays a filterable catalog of interactive books with:
 * - Search functionality
 * - Category filtering (Age groups, subjects, difficulty)
 * - Sort options (popularity, rating, newest)
 * - Grid layout with book cards
 * - Pagination
 * - Filter sidebar with clear options
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BookCard } from "@/components/catalog/book-card";
import { FilterSidebar } from "@/components/catalog/filter-sidebar";
import { SearchIcon, Filter, Grid3X3, List, X, BookOpen, Star, Calendar, TrendingUp } from "lucide-react";

// Sample book data - in a real app this would come from an API
const booksData = [
  {
    id: 1,
    title: "Where the Brave Things Grow",
    subtitle: "Interactive Social-Emotional Learning",
    author: "Dr. Sarah Johnson",
    description: "An interactive journey teaching mindfulness, emotional regulation, and social skills through forest adventures.",
    coverImage: "/api/placeholder/300/400",
    rating: 4.9,
    reviewCount: 247,
    price: 19.99,
    ageGroup: "3-8",
    category: "Social-Emotional Learning",
    subjects: ["Mindfulness", "Emotional Intelligence", "Social Skills"],
    difficulty: "Beginner",
    duration: "45 minutes",
    isInteractive: true,
    isPremium: false,
    publishDate: "2024-01-15",
    popularity: 95,
    chapters: 6
  },
  {
    id: 2,
    title: "The Science Explorers",
    subtitle: "Interactive STEM Adventures",
    author: "Prof. Mike Chen",
    description: "Hands-on science experiments and discoveries for curious young minds.",
    coverImage: "/api/placeholder/300/400",
    rating: 4.8,
    reviewCount: 189,
    price: 24.99,
    ageGroup: "6-12",
    category: "STEM",
    subjects: ["Science", "Experiments", "Discovery"],
    difficulty: "Intermediate",
    duration: "60 minutes",
    isInteractive: true,
    isPremium: true,
    publishDate: "2024-02-20",
    popularity: 87,
    chapters: 8
  },
  {
    id: 3,
    title: "Creative Storytelling Adventures",
    subtitle: "Building Language & Imagination",
    author: "Emily Rodriguez",
    description: "Interactive storytelling that develops creativity, vocabulary, and narrative skills.",
    coverImage: "/api/placeholder/300/400",
    rating: 4.7,
    reviewCount: 156,
    price: 16.99,
    ageGroup: "4-10",
    category: "Language Arts",
    subjects: ["Creative Writing", "Vocabulary", "Storytelling"],
    difficulty: "Beginner",
    duration: "35 minutes",
    isInteractive: true,
    isPremium: false,
    publishDate: "2024-03-10",
    popularity: 78,
    chapters: 5
  },
  {
    id: 4,
    title: "Math Magic Kingdom",
    subtitle: "Numbers Come Alive",
    author: "Dr. Lisa Park",
    description: "Making math fun and engaging through magical adventures and interactive problem solving.",
    coverImage: "/api/placeholder/300/400",
    rating: 4.6,
    reviewCount: 203,
    price: 22.99,
    ageGroup: "5-11",
    category: "Mathematics",
    subjects: ["Basic Math", "Problem Solving", "Logic"],
    difficulty: "Intermediate",
    duration: "50 minutes",
    isInteractive: true,
    isPremium: true,
    publishDate: "2024-01-28",
    popularity: 82,
    chapters: 7
  },
  {
    id: 5,
    title: "World Cultures Explorer",
    subtitle: "Global Adventures for Kids",
    author: "Marcus Thompson",
    description: "Discover different cultures, traditions, and geography through interactive experiences.",
    coverImage: "/api/placeholder/300/400",
    rating: 4.8,
    reviewCount: 134,
    price: 18.99,
    ageGroup: "6-14",
    category: "Social Studies",
    subjects: ["Geography", "Culture", "History"],
    difficulty: "Intermediate",
    duration: "55 minutes",
    isInteractive: true,
    isPremium: false,
    publishDate: "2024-02-14",
    popularity: 73,
    chapters: 6
  },
  {
    id: 6,
    title: "Nature's Wonders",
    subtitle: "Environmental Science for Kids",
    author: "Dr. Anna Green",
    description: "Explore ecosystems, wildlife, and environmental conservation through interactive learning.",
    coverImage: "/api/placeholder/300/400",
    rating: 4.9,
    reviewCount: 178,
    price: 21.99,
    ageGroup: "7-13",
    category: "Science",
    subjects: ["Environmental Science", "Biology", "Conservation"],
    difficulty: "Advanced",
    duration: "65 minutes",
    isInteractive: true,
    isPremium: true,
    publishDate: "2024-03-05",
    popularity: 91,
    chapters: 9
  }
];

const ageGroups = ["3-8", "4-10", "5-11", "6-12", "6-14", "7-13"];
const categories = ["Social-Emotional Learning", "STEM", "Language Arts", "Mathematics", "Social Studies", "Science"];
const difficulties = ["Beginner", "Intermediate", "Advanced"];
const sortOptions = [
  { value: "popularity", label: "Most Popular", icon: TrendingUp },
  { value: "rating", label: "Highest Rated", icon: Star },
  { value: "newest", label: "Newest First", icon: Calendar },
  { value: "price-low", label: "Price: Low to High", icon: BookOpen },
  { value: "price-high", label: "Price: High to Low", icon: BookOpen }
];

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30]);
  const [showInteractiveOnly, setShowInteractiveOnly] = useState(false);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // Filter and sort logic
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = booksData.filter(book => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query) ||
          book.subjects.some(subject => subject.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Age groups
      if (selectedAgeGroups.length > 0 && !selectedAgeGroups.includes(book.ageGroup)) {
        return false;
      }

      // Categories
      if (selectedCategories.length > 0 && !selectedCategories.includes(book.category)) {
        return false;
      }

      // Difficulties
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(book.difficulty)) {
        return false;
      }

      // Price range
      if (book.price < priceRange[0] || book.price > priceRange[1]) {
        return false;
      }

      // Interactive only
      if (showInteractiveOnly && !book.isInteractive) {
        return false;
      }

      // Premium only
      if (showPremiumOnly && !book.isPremium) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedAgeGroups, selectedCategories, selectedDifficulties, sortBy, priceRange, showInteractiveOnly, showPremiumOnly]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedAgeGroups([]);
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setPriceRange([0, 30]);
    setShowInteractiveOnly(false);
    setShowPremiumOnly(false);
  };

  const activeFiltersCount = 
    selectedAgeGroups.length + 
    selectedCategories.length + 
    selectedDifficulties.length + 
    (showInteractiveOnly ? 1 : 0) + 
    (showPremiumOnly ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 30 ? 1 : 0);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-300 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title and Search */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-forest-600 mb-4 font-playful">Book Catalog</h1>
              <div className="relative max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-400 w-5 h-5" />
                <Input
                  placeholder="Search books, authors, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-forest-200 focus:border-forest-400 focus:ring-forest-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-coral-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-forest-200 focus:border-forest-400 focus:ring-forest-400">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-forest-200 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-r-none ${viewMode === "grid" ? "bg-forest-500 bg-forest-600" : "bg-forest-50"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-l-none border-l border-forest-200 ${viewMode === "list" ? "bg-forest-500 bg-forest-600" : "bg-forest-50"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden border-forest-200 text-forest-600 bg-forest-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 px-1.5 py-0.5 text-xs bg-coral-500 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-4 flex-wrap"
            >
              <span className="text-sm font-medium text-forest-700">Active filters:</span>
              
              {selectedAgeGroups.map(age => (
                <Badge key={age} variant="secondary" className="gap-1 bg-forest-100 text-forest-700 bg-forest-200">
                  Age: {age}
                  <X 
                    className="w-3 h-3 cursor-pointer text-coral-500 transition-colors" 
                    onClick={() => setSelectedAgeGroups(prev => prev.filter(a => a !== age))}
                  />
                </Badge>
              ))}
              
              {selectedCategories.map(category => (
                <Badge key={category} variant="secondary" className="gap-1 bg-golden-100 text-golden-700 bg-golden-200">
                  {category}
                  <X 
                    className="w-3 h-3 cursor-pointer text-coral-500 transition-colors" 
                    onClick={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
                  />
                </Badge>
              ))}
              
              {selectedDifficulties.map(difficulty => (
                <Badge key={difficulty} variant="secondary" className="gap-1 bg-cream-200 text-forest-700 bg-cream-300">
                  {difficulty}
                  <X 
                    className="w-3 h-3 cursor-pointer text-coral-500 transition-colors" 
                    onClick={() => setSelectedDifficulties(prev => prev.filter(d => d !== difficulty))}
                  />
                </Badge>
              ))}

              {showInteractiveOnly && (
                <Badge variant="secondary" className="gap-1 bg-forest-100 text-forest-700 bg-forest-200">
                  Interactive Only
                  <X 
                    className="w-3 h-3 cursor-pointer text-coral-500 transition-colors" 
                    onClick={() => setShowInteractiveOnly(false)}
                  />
                </Badge>
              )}

              {showPremiumOnly && (
                <Badge variant="secondary" className="gap-1 bg-coral-100 text-coral-700 bg-coral-200">
                  Premium Only
                  <X 
                    className="w-3 h-3 cursor-pointer text-coral-500 transition-colors" 
                    onClick={() => setShowPremiumOnly(false)}
                  />
                </Badge>
              )}

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-coral-600 text-coral-700 bg-coral-50"
              >
                Clear All
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar
            isVisible={showFilters}
            selectedAgeGroups={selectedAgeGroups}
            setSelectedAgeGroups={setSelectedAgeGroups}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedDifficulties={selectedDifficulties}
            setSelectedDifficulties={setSelectedDifficulties}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            showInteractiveOnly={showInteractiveOnly}
            setShowInteractiveOnly={setShowInteractiveOnly}
            showPremiumOnly={showPremiumOnly}
            setShowPremiumOnly={setShowPremiumOnly}
            ageGroups={ageGroups}
            categories={categories}
            difficulties={difficulties}
            onClearAll={clearAllFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredAndSortedBooks.length} Books Found
                </h2>
                {searchQuery && (
                  <p className="text-sm text-gray-600">
                    Results for "<span className="font-medium text-forest-600">{searchQuery}</span>"
                  </p>
                )}
              </div>
            </div>

            {/* Books Grid/List */}
            <AnimatePresence mode="wait">
              {filteredAndSortedBooks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <BookOpen className="w-16 h-16 text-forest-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms to find more books.
                  </p>
                  <Button variant="outline" onClick={clearAllFilters} className="border-forest-300 text-forest-600 bg-forest-50">
                    Clear All Filters
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${viewMode}-${filteredAndSortedBooks.length}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredAndSortedBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <BookCard book={book} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}