/**
 * Book Showcase Component
 * 
 * Highlights the main book "Where the Brave Things Grow" with:
 * - Book cover/preview image
 * - Chapter breakdown showing the 6 learning modules
 * - Key features and learning outcomes
 * - Call-to-action to start reading
 * 
 * Redesigned with Google-inspired aesthetic: spacious layout, unified colors, organic flow
 */

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Heart, Shield, Sparkles, Leaf, Coffee, Rainbow, Star } from "lucide-react";

// Simplified chapter data with unified color palette
const chapters = [
  {
    id: 1,
    title: "The Still Pond",
    theme: "Mindfulness",
    icon: Leaf,
    description: "Mila learns to pause, breathe, and be present in the moment",
    gradient: "from-forest-400/20 to-forest-500/30"
  },
  {
    id: 2,
    title: "The Colorful Chameleon", 
    theme: "Emotional Awareness",
    icon: Rainbow,
    description: "Max discovers how to name and understand his feelings",
    gradient: "from-coral-400/20 to-coral-500/30"
  },
  {
    id: 3,
    title: "The Brave Bridge",
    theme: "Courage",
    icon: Shield,
    description: "The friends learn that bravery means trying even when scared",
    gradient: "from-golden-400/20 to-golden-500/30"
  },
  {
    id: 4,
    title: "The Kindness Meadow",
    theme: "Kindness",
    icon: Sparkles,
    description: "Everyone practices showing compassion to others",
    gradient: "from-earth-400/20 to-earth-500/30"
  },
  {
    id: 5,
    title: "The Gratitude Garden",
    theme: "Gratitude", 
    icon: Heart,
    description: "Learning to appreciate the good things in life",
    gradient: "from-coral-400/20 to-coral-500/30"
  },
  {
    id: 6,
    title: "The Sharing Tree",
    theme: "Sharing & Connection",
    icon: Coffee,
    description: "Discovering the joy of cooperation and helping friends",
    gradient: "from-forest-400/20 to-forest-500/30"
  }
];

const keyFeatures = [
  "Interactive story elements and activities",
  "Evidence-based social-emotional learning", 
  "Family discussion guides included",
  "Printable activities and resources",
  "Suitable for ages 3-8",
  "Professional illustrations and animations"
];

export function BookShowcase() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header - Enhanced Spacing */}
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Badge className="mb-8 bg-forest-100 text-forest-700 border-forest-200 px-6 py-3 text-base">
            📚 Featured Book
          </Badge>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Meet "Where the Brave Things Grow"
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            A beautifully crafted interactive journey that teaches children essential life skills 
            through engaging stories, memorable characters, and hands-on activities.
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left Column - Book Preview - Enhanced */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Main Book Cover */}
          <div className="relative">
            <motion.div
              className="bg-gradient-to-br from-forest-500 to-golden-500 rounded-3xl shadow-3xl p-8 transform -rotate-2"
              whileHover={{ 
                rotate: 0, 
                scale: 1.02,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
            >
              <div className="bg-white rounded-2xl p-10 shadow-2xl">
                <div className="text-center">
                  <motion.div 
                    className="w-28 h-28 bg-gradient-to-r from-forest-400 to-golden-400 rounded-full mx-auto mb-8 flex items-center justify-center"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-5xl">🌳</span>
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Where the Brave Things Grow
                  </h3>
                  <p className="text-gray-600 text-lg mb-8">Interactive Social-Emotional Learning</p>
                  
                  {/* Key Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-forest-600 mb-1">6</div>
                      <div className="text-sm text-gray-500">Chapters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-golden-600 mb-1">35</div>
                      <div className="text-sm text-gray-500">Pages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-coral-600 mb-1">∞</div>
                      <div className="text-sm text-gray-500">Adventures</div>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex justify-center items-center gap-2 mb-6">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-golden-400 text-golden-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">Loved by families</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Age Badge */}
            <motion.div
              className="absolute -top-6 -right-6 bg-coral-400 text-white rounded-full px-6 py-3 font-bold text-lg shadow-2xl"
              animate={{ 
                y: [-8, 8, -8],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              Ages 3-8
            </motion.div>
          </div>

          {/* Key Features - Simplified */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-2xl font-semibold text-gray-900 mb-8">What Makes It Special</h4>
            <div className="space-y-4">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 text-gray-600 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-3 h-3 bg-forest-500 rounded-full flex-shrink-0"></div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Learning Journey - Completely Redesigned */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">The Learning Journey</h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              Six magical locations, each teaching essential life skills through interactive storytelling.
            </p>
          </div>
          
          {/* Simplified, Spacious Chapter Grid */}
          <div className="grid gap-8">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -4,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <Card className="border-0 shadow-lg shadow-2xl all duration-500 bg-white rounded-3xl overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      {/* Icon with Gradient Background */}
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${chapter.gradient} group-scale-110 transform duration-300`}>
                        <chapter.icon className="w-8 h-8 text-gray-700" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-medium text-gray-400">Chapter {chapter.id}</span>
                          <Badge variant="outline" className="text-sm px-3 py-1 bg-gray-50">
                            {chapter.theme}
                          </Badge>
                        </div>
                        <h4 className="text-2xl font-semibold text-gray-900 mb-3 group-text-forest-600 colors duration-300">
                          {chapter.title}
                        </h4>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {chapter.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Enhanced CTA */}
          <motion.div
            className="mt-16 text-center"
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
              <Button size="lg" className="bg-gradient-to-r from-forest-600 to-golden-600 from-forest-700 to-golden-700 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl shadow-3xl all duration-300">
                <BookOpen className="w-6 h-6 mr-3" />
                Start Reading Today
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </motion.div>
            <p className="text-lg text-gray-600 mt-6">
              Free to start • No credit card required
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}