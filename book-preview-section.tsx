/**
 * Book Preview Section Component
 * 
 * Compact book preview + simplified chapter overview side-by-side.
 * Shows the book visual on the left and a condensed 2x3 grid of chapters on the right.
 * 
 * Features:
 * - Balanced left/right layout
 * - Compact chapter grid (2x3 instead of long vertical list)
 * - Clear visual hierarchy
 * - Prominent call-to-action
 */

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Leaf, Rainbow, Shield, Sparkles, Heart, Coffee, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Simplified chapter data for compact display
const chapters = [
  {
    id: 1,
    title: "The Still Pond",
    theme: "Mindfulness",
    icon: Leaf,
    color: "bg-green-100 text-green-700"
  },
  {
    id: 2,
    title: "The Colorful Chameleon", 
    theme: "Emotional Awareness",
    icon: Rainbow,
    color: "bg-purple-100 text-purple-700"
  },
  {
    id: 3,
    title: "The Brave Bridge",
    theme: "Courage",
    icon: Shield,
    color: "bg-blue-100 text-blue-700"
  },
  {
    id: 4,
    title: "The Kindness Meadow",
    theme: "Kindness",
    icon: Sparkles,
    color: "bg-pink-100 text-pink-700"
  },
  {
    id: 5,
    title: "The Gratitude Garden",
    theme: "Gratitude", 
    icon: Heart,
    color: "bg-red-100 text-red-700"
  },
  {
    id: 6,
    title: "The Sharing Tree",
    theme: "Sharing & Connection",
    icon: Coffee,
    color: "bg-orange-100 text-orange-700"
  }
];

export function BookPreviewSection() {
  return (
    <section className="py-24 lg:py-32 bg-white relative">
      {/* Background decoration */}
      <div className="absolute bottom-20 left-10 w-[350px] h-[350px] bg-gradient-to-br from-golden-200/20 to-golden-300/15 rounded-full"
           style={{ borderRadius: "50% 50% 50% 50% / 70% 30% 70% 30%" }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 bg-forest-100 text-forest-700 border-forest-200 px-6 py-3 text-base">
              📚 Featured Book
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Meet "Where the Brave Things Grow"
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A beautifully crafted interactive journey through six magical locations, each teaching essential life skills.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Book Preview */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Main Book Cover */}
            <div className="relative max-w-md mx-auto">
              <motion.div
                className="bg-gradient-to-br from-forest-500 to-golden-500 rounded-3xl shadow-2xl p-6 transform -rotate-2"
                whileHover={{ 
                  rotate: 0, 
                  scale: 1.05,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl">
                  <div className="text-center">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-r from-forest-400 to-golden-400 rounded-full mx-auto mb-6 flex items-center justify-center"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-4xl">🌳</span>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Where the Brave Things Grow
                    </h3>
                    <p className="text-gray-600 mb-6">Interactive Learning Adventure</p>
                    
                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center">
                        <div className="text-xl font-bold text-forest-600 mb-1">6</div>
                        <div className="text-xs text-gray-500">Chapters</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-golden-600 mb-1">35</div>
                        <div className="text-xs text-gray-500">Pages</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-coral-600 mb-1">∞</div>
                        <div className="text-xs text-gray-500">Adventures</div>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex justify-center items-center gap-2">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-golden-400 text-golden-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">Ages 3-8</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Age Badge */}
              <motion.div
                className="absolute -top-4 -right-4 bg-coral-400 text-white rounded-full px-4 py-2 font-bold text-sm shadow-xl"
                animate={{ 
                  y: [-6, 6, -6],
                  rotate: [-1, 1, -1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                Free to Start
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Compact Chapter Grid */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Six Learning Adventures</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Each chapter teaches a different social-emotional skill through interactive storytelling.
              </p>
            </div>
            
            {/* Compact 2x3 Chapter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -2,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                >
                  <Card className="border-0 shadow-md shadow-lg all duration-300 bg-white rounded-xl overflow-hidden group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${chapter.color} group-scale-110 transform duration-300`}>
                          <chapter.icon className="w-5 h-5" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-400 mb-1">Chapter {chapter.id}</div>
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-1">
                            {chapter.title}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {chapter.theme}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-forest-600 to-golden-600 from-forest-700 to-golden-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl shadow-2xl all duration-300"
                  onClick={() => window.open('/login', '_blank', 'noopener,noreferrer')}
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Start Your Adventure
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </motion.div>
              <p className="text-base text-gray-600 mt-4">
                Free to start • No credit card required
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}