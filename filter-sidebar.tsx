/**
 * Filter Sidebar Component
 * 
 * Comprehensive filtering interface for the book catalog including:
 * - Age group selection
 * - Category filtering
 * - Difficulty levels
 * - Price range slider
 * - Special filters (Interactive, Premium)
 * - Clear all functionality
 * 
 * Responsive design that works as sidebar on desktop and overlay on mobile.
 */

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Filter, RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  isVisible: boolean;
  selectedAgeGroups: string[];
  setSelectedAgeGroups: (groups: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedDifficulties: string[];
  setSelectedDifficulties: (difficulties: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showInteractiveOnly: boolean;
  setShowInteractiveOnly: (show: boolean) => void;
  showPremiumOnly: boolean;
  setShowPremiumOnly: (show: boolean) => void;
  ageGroups: string[];
  categories: string[];
  difficulties: string[];
  onClearAll: () => void;
}

export function FilterSidebar({
  isVisible,
  selectedAgeGroups,
  setSelectedAgeGroups,
  selectedCategories,
  setSelectedCategories,
  selectedDifficulties,
  setSelectedDifficulties,
  priceRange,
  setPriceRange,
  showInteractiveOnly,
  setShowInteractiveOnly,
  showPremiumOnly,
  setShowPremiumOnly,
  ageGroups,
  categories,
  difficulties,
  onClearAll
}: FilterSidebarProps) {
  
  const handleAgeGroupChange = (ageGroup: string, checked: boolean) => {
    if (checked) {
      setSelectedAgeGroups([...selectedAgeGroups, ageGroup]);
    } else {
      setSelectedAgeGroups(selectedAgeGroups.filter(group => group !== ageGroup));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    }
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    if (checked) {
      setSelectedDifficulties([...selectedDifficulties, difficulty]);
    } else {
      setSelectedDifficulties(selectedDifficulties.filter(diff => diff !== difficulty));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-forest-600";
      case "Intermediate":
        return "text-golden-600";
      case "Advanced":
        return "text-coral-600";
      default:
        return "text-gray-600";
    }
  };

  const activeFiltersCount = 
    selectedAgeGroups.length + 
    selectedCategories.length + 
    selectedDifficulties.length + 
    (showInteractiveOnly ? 1 : 0) + 
    (showPremiumOnly ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 30 ? 1 : 0);

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="px-2 py-1 bg-forest-100 text-forest-700">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-coral-600  "
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Clear All
        </Button>
      </div>

      <Separator className="bg-cream-300" />

      {/* Age Groups */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Age Groups</h3>
        <div className="space-y-3">
          {ageGroups.map((ageGroup) => (
            <div key={ageGroup} className="flex items-center space-x-2">
              <Checkbox
                id={`age-${ageGroup}`}
                checked={selectedAgeGroups.includes(ageGroup)}
                onCheckedChange={(checked) => 
                  handleAgeGroupChange(ageGroup, checked as boolean)
                }
                className="border-forest-300 data-[state=checked]:bg-forest-500 data-[state=checked]:border-forest-500"
              />
              <label
                htmlFor={`age-${ageGroup}`}
                className="text-sm text-gray-700 cursor-pointer  transition-colors"
              >
                Ages {ageGroup}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-cream-300" />

      {/* Categories */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category, checked as boolean)
                }
                className="border-forest-300 data-[state=checked]:bg-forest-500 data-[state=checked]:border-forest-500"
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm text-gray-700 cursor-pointer  transition-colors"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-cream-300" />

      {/* Difficulty */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Difficulty Level</h3>
        <div className="space-y-3">
          {difficulties.map((difficulty) => (
            <div key={difficulty} className="flex items-center space-x-2">
              <Checkbox
                id={`difficulty-${difficulty}`}
                checked={selectedDifficulties.includes(difficulty)}
                onCheckedChange={(checked) => 
                  handleDifficultyChange(difficulty, checked as boolean)
                }
                className="border-forest-300 data-[state=checked]:bg-forest-500 data-[state=checked]:border-forest-500"
              />
              <label
                htmlFor={`difficulty-${difficulty}`}
                className={`text-sm cursor-pointer font-medium ${getDifficultyColor(difficulty)}  transition-opacity`}
              >
                {difficulty}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-cream-300" />

      {/* Price Range */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={30}
            min={0}
            step={1}
            className="mb-3 [&_[role=slider]]:bg-forest-500 [&_[role=slider]]:border-forest-500 [&_.range]:bg-forest-500"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="bg-cream-100 px-2 py-1 rounded font-medium">${priceRange[0]}</span>
            <span className="bg-cream-100 px-2 py-1 rounded font-medium">${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator className="bg-cream-300" />

      {/* Special Filters */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Special Features</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="interactive-only"
              checked={showInteractiveOnly}
              onCheckedChange={setShowInteractiveOnly}
              className="border-forest-300 data-[state=checked]:bg-forest-500 data-[state=checked]:border-forest-500"
            />
            <label
              htmlFor="interactive-only"
              className="text-sm text-gray-700 cursor-pointer  transition-colors flex items-center gap-2"
            >
              Interactive Books Only
              <Badge className="bg-forest-100 text-forest-700 text-xs">Premium</Badge>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium-only"
              checked={showPremiumOnly}
              onCheckedChange={setShowPremiumOnly}
              className="border-forest-300 data-[state=checked]:bg-forest-500 data-[state=checked]:border-forest-500"
            />
            <label
              htmlFor="premium-only"
              className="text-sm text-gray-700 cursor-pointer  transition-colors flex items-center gap-2"
            >
              Premium Content Only
              <Badge className="bg-gradient-to-r from-coral-500 to-golden-500 text-white text-xs">Exclusive</Badge>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <Card className="sticky top-24 h-fit border-cream-300 bg-cream-50">
          <CardContent className="p-6">
            {sidebarContent}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-forest-900 bg-opacity-50 z-50"
              onClick={() => {}}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto"
            >
              <Card className="h-full border-0 rounded-none">
                <CardHeader className="border-b border-cream-300 bg-cream-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-forest-600">Filters</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => {}} className="">
                      <X className="w-5 h-5 text-coral-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {sidebarContent}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}