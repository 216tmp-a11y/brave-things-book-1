/**
 * Book Card Component
 * 
 * Displays individual book information in either grid or list view.
 * Features book cover, title, author, rating, price, and quick actions.
 * Supports both compact grid view and detailed list view layouts.
 */

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, BookOpen, ShoppingCart, Heart, Users, Zap } from "lucide-react";

interface Book {
  id: number;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  price: number;
  ageGroup: string;
  category: string;
  subjects: string[];
  difficulty: string;
  duration: string;
  isInteractive: boolean;
  isPremium: boolean;
  publishDate: string;
  popularity: number;
  chapters: number;
}

interface BookCardProps {
  book: Book;
  viewMode: "grid" | "list";
}

export function BookCard({ book, viewMode }: BookCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-golden-400 text-golden-400"
            : i < rating
            ? "fill-golden-200 text-golden-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-forest-100 text-forest-700 border-forest-200";
      case "Intermediate":
        return "bg-golden-100 text-golden-700 border-golden-200";
      case "Advanced":
        return "bg-coral-100 text-coral-700 border-coral-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="shadow-lg all duration-300 group">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-32 h-40 object-cover rounded-lg shadow-md group-shadow-lg shadow"
                />
                {book.isPremium && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-coral-500 to-golden-500 text-white border-0">
                    Premium
                  </Badge>
                )}
                {book.isInteractive && (
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-forest-500 text-white border-0 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Interactive
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-text-forest-600 colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">{book.subtitle}</p>
                  <p className="text-sm text-gray-700 font-medium">by {book.author}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-forest-600">${book.price}</div>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    {renderStars(book.rating)}
                    <span className="text-sm text-gray-600 ml-1">
                      ({book.reviewCount})
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {book.description}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge variant="outline" className="border-forest-200 text-forest-700">Ages {book.ageGroup}</Badge>
                <Badge variant="outline" className={getDifficultyColor(book.difficulty)}>
                  {book.difficulty}
                </Badge>
                <Badge variant="outline" className="border-golden-200 text-golden-700">{book.category}</Badge>
                <div className="flex items-center text-sm text-gray-600 gap-1">
                  <Clock className="w-4 h-4" />
                  {book.duration}
                </div>
                <div className="flex items-center text-sm text-gray-600 gap-1">
                  <BookOpen className="w-4 h-4" />
                  {book.chapters} chapters
                </div>
              </div>

              {/* Subjects */}
              <div className="flex flex-wrap gap-1 mb-4">
                {book.subjects.slice(0, 3).map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-xs bg-cream-200 text-forest-700">
                    {subject}
                  </Badge>
                ))}
                {book.subjects.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-cream-200 text-forest-700">
                    +{book.subjects.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button className="bg-forest-600 bg-forest-700 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="border-golden-300 text-golden-700 bg-golden-50">
                  Preview
                </Button>
                <Button variant="ghost" size="icon" className="text-coral-500 text-coral-600 bg-coral-50">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full shadow-lg all duration-300 group overflow-hidden border border-cream-300 border-forest-300">
        <div className="relative">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-48 object-cover group-scale-105 transform duration-300"
          />
          {book.isPremium && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-coral-500 to-golden-500 text-white border-0">
              Premium
            </Badge>
          )}
          {book.isInteractive && (
            <Badge className="absolute top-3 left-3 bg-forest-500 text-white border-0">
              <Zap className="w-3 h-3 mr-1" />
              Interactive
            </Badge>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-forest-900 bg-opacity-0 group-bg-opacity-20 all duration-300 flex items-center justify-center opacity-0 group-opacity-100">
            <Button variant="secondary" size="sm" className="bg-white text-forest-600 bg-cream-50">
              Quick Preview
            </Button>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex-1">
            {/* Header */}
            <div className="mb-3">
              <h3 className="font-bold text-lg text-gray-900 group-text-forest-600 colors line-clamp-2 mb-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{book.subtitle}</p>
              <p className="text-sm text-gray-700 font-medium">by {book.author}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {renderStars(book.rating)}
              <span className="text-sm text-gray-600 ml-1">
                ({book.reviewCount})
              </span>
            </div>

            {/* Info Badges */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs border-forest-200 text-forest-700">Ages {book.ageGroup}</Badge>
                <Badge variant="outline" className={`text-xs ${getDifficultyColor(book.difficulty)}`}>
                  {book.difficulty}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {book.duration}
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {book.chapters} chapters
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="flex flex-wrap gap-1 mb-4">
              {book.subjects.slice(0, 2).map((subject) => (
                <Badge key={subject} variant="secondary" className="text-xs bg-cream-200 text-forest-700">
                  {subject}
                </Badge>
              ))}
              {book.subjects.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-cream-200 text-forest-700">
                  +{book.subjects.length - 2}
                </Badge>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xl font-bold text-forest-600">
                ${book.price}
              </div>
              <Button variant="ghost" size="icon" className="text-coral-500 text-coral-600 bg-coral-50">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full bg-forest-600 bg-forest-700 text-white" size="sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full border-golden-300 text-golden-700 bg-golden-50" size="sm">
                Preview Book
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}