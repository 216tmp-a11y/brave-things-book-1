/**
 * What Makes It Special Component
 * 
 * Dedicated section highlighting the key features that make
 * "Where the Brave Things Grow" unique and valuable.
 * 
 * Features:
 * - Clean, scannable list of benefits
 * - Professional layout with proper spacing
 * - Consistent branding and colors
 * - Engaging visual elements
 */

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

// Key features that make the book special
const keyFeatures = [
  "Interactive story elements and activities",
  "Evidence-based social-emotional learning", 
  "Family discussion guides included",
  "Printable activities and resources",
  "Suitable for ages 3-8",
  "Professional illustrations and animations"
];

export function WhatMakesSpecial() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-cream-50 to-white relative">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-gradient-to-br from-forest-100/30 to-forest-200/20 rounded-full opacity-40"
           style={{ borderRadius: "70% 30% 30% 70% / 60% 40% 60% 40%" }}></div>
      
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
              ✨ What Makes It Special
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Designed for Modern Families
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every element is carefully crafted to create meaningful learning experiences that children love and parents trust.
            </p>
          </motion.div>
        </div>

        {/* Features Grid - Force 2x3 Layout (2 columns max) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {keyFeatures.map((feature, index) => (
            <motion.div
              key={index}
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
              <Card className="border-0 shadow-lg shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden group h-full">
                <CardContent className="p-8 h-full flex items-center">
                  <div className="flex items-start gap-4 w-full">
                    {/* Icon */}
                    <div className="p-3 rounded-xl bg-forest-100 group-bg-forest-200 transition-colors duration-300 flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-forest-600" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-lg text-gray-700 leading-relaxed font-medium">
                        {feature}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-600">
            Join thousands of families who trust Brave Things Books for their children's development.
          </p>
        </motion.div>
      </div>
    </section>
  );
}