/**
 * Hero Section Component
 * 
 * Main hero section for the homepage featuring:
 * - Compelling headline and description inspired by the original design
 * - Enhanced subtitle with comprehensive messaging
 * - Primary call-to-action buttons with "Start Your Adventure"
 * - Statistics cards showing key metrics
 * - Hero image/illustration
 * 
 * Updated to incorporate the stronger messaging and visual elements from the original design.
 */

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, BookOpen, Star, Users, Award, Download, Infinity } from "lucide-react";
import { Link } from "react-router-dom";

// Statistics data from the original design
const statistics = [
  {
    number: "6",
    label: "Interactive Cues",
    icon: "🍃"
  },
  {
    number: "4",
    label: "Lovable Characters",
    icon: "🐿️"
  },
  {
    number: "35",
    label: "Beautiful Pages",
    icon: "📖"
  },
  {
    number: "∞",
    label: "Learning Adventures",
    icon: "✨"
  }
];

export function HeroSection() {
  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-forest-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-golden-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-forest-50 to-golden-50 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge - Keep exactly as is */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-forest-100 text-forest-700 border-forest-200 px-4 py-2">
                🌟 Interactive Social-Emotional Learning
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Where the{" "}
              <span className="bg-gradient-to-r from-forest-600 to-golden-600 bg-clip-text text-transparent">
                Brave Things
              </span>{" "}
              Grow
            </motion.h1>

            {/* Enhanced Subtitle with comprehensive messaging */}
            <motion.p
              className="text-lg lg:text-xl text-forest-600 mb-8 font-medium leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Stories, Science & Activities for Raising Mindful, Resilient Kids
            </motion.p>

            {/* Detailed Description */}
            <motion.p
              className="text-lg text-gray-600 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Join Mila the squirrel and her friends on a magical forest adventure that teaches 
              children about mindfulness, emotions, bravery, kindness, gratitude, and sharing 
              through interactive storytelling and engaging activities.
            </motion.p>

            {/* CTA Buttons - Updated with "Start Your Adventure" */}
            <motion.div
              className="flex flex-col gap-4 mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-forest-600 bg-forest-700 text-white px-8 py-4 text-lg shadow-lg shadow-xl all duration-300"
                  onClick={() => window.open('/login', '_blank', 'noopener,noreferrer')}
                >
                  <Play className="w-6 h-6 mr-3" />
                  Start Your Adventure
                </Button>
                <Button size="lg" variant="outline" asChild className="border-forest-200 text-forest-700 bg-forest-50 text-forest-800 px-8 py-4 text-lg">
                  <Link to="/digibook">
                    <Download className="w-6 h-6 mr-3" />
                    Preview Book
                  </Link>
                </Button>
              </div>
              

            </motion.div>

            {/* Statistics Cards - Fixed Layout and Sizing */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl">
                {statistics.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm border-forest-100 shadow-xl scale-105 all duration-300 group">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl mb-3 group-scale-110 transform duration-300">{stat.icon}</div>
                        <div className="text-4xl font-bold text-forest-700 mb-2">{stat.number}</div>
                        <div className="text-sm text-forest-600 font-medium leading-tight">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Book Mockup */}
            <div className="relative mx-auto max-w-md lg:max-w-lg">
              {/* Main Book Cover */}
              <motion.div
                className="relative bg-gradient-to-br from-forest-500 to-golden-500 rounded-2xl shadow-2xl p-8 transform rotate-3"
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-forest-400 to-golden-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">🌳</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Where the Brave Things Grow</h3>
                    <p className="text-sm text-gray-600 mb-4">Interactive Learning Adventure</p>
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="bg-forest-50 rounded-lg p-3">
                      <p className="text-xs text-forest-700 font-medium">Chapter 1: The Still Pond</p>
                      <p className="text-xs text-forest-600">Learning Mindfulness</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Interactive Cue Elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-12 h-12 bg-golden-200 rounded-full flex items-center justify-center shadow-lg border-2 border-golden-300"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: 999999, ease: "easeInOut" }}
              >
                <span className="text-xl">🍃</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 w-16 h-16 bg-coral-200 rounded-full flex items-center justify-center shadow-lg border-2 border-coral-300"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: 999999, ease: "easeInOut", delay: 1 }}
              >
                <span className="text-2xl">🌈</span>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-8 w-10 h-10 bg-forest-200 rounded-full flex items-center justify-center shadow-lg border-2 border-forest-300"
                animate={{ x: [-5, 5, -5] }}
                transition={{ duration: 2.5, repeat: 999999, ease: "easeInOut", delay: 0.5 }}
              >
                <span className="text-lg">✨</span>
              </motion.div>

              {/* Additional floating character elements */}
              <motion.div
                className="absolute top-8 -right-6 w-8 h-8 bg-earth-200 rounded-full flex items-center justify-center shadow-md"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: 999999, ease: "linear" }}
              >
                <span className="text-sm">🐿️</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}