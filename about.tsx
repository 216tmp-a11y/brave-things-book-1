/**
 * About Page
 * 
 * Provides information about Brave Things Books and our mission.
 * Features our story, values, and commitment to children's emotional development.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Users, Sparkles, BookOpen, Target, Shield, Lightbulb, ArrowRight } from "lucide-react";

// Values data
const values = [
  {
    icon: Heart,
    title: "Emotional Intelligence First",
    description: "We believe emotional intelligence is as important as academic learning. Our books help children understand and navigate their feelings.",
    color: "bg-coral-50 text-coral-600 border-coral-200"
  },
  {
    icon: Brain,
    title: "Research-Based Approach",
    description: "Every story and activity is grounded in child development research and proven social-emotional learning methodologies.",
    color: "bg-earth-50 text-earth-600 border-earth-200"
  },
  {
    icon: Users,
    title: "Family-Centered Design",
    description: "Our books are designed to bring families together, creating meaningful conversations and shared learning experiences.",
    color: "bg-forest-50 text-forest-600 border-forest-200"
  },
  {
    icon: Sparkles,
    title: "Interactive Storytelling",
    description: "We combine traditional storytelling with modern interactivity to create engaging, memorable learning experiences.",
    color: "bg-golden-50 text-golden-600 border-golden-200"
  }
];

// Team highlights
const highlights = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To create interactive books that help children develop emotional intelligence, resilience, and social skills through engaging storytelling."
  },
  {
    icon: Shield,
    title: "Our Promise",
    description: "Every book is carefully crafted with child development experts to ensure content is age-appropriate, educational, and enjoyable."
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description: "A world where every child has access to tools that help them understand their emotions and build meaningful relationships."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-cream-50 to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-forest-100 text-forest-700 border-forest-200">
                🌱 About Our Story
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Where Learning and
                <span className="text-forest-600"> Growth </span>
                Meet
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                We're passionate about creating interactive books that help children develop 
                the emotional skills they need to thrive in life. Our journey began with a simple 
                belief: every child deserves tools to understand their feelings and build resilience.
              </p>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Brave Things Lab began with a simple question: How can we help children grow into brave, kind, and emotionally wise humans?
                </p>
                <p>
                  Our work is rooted in the belief that emotional intelligence is just as vital as traditional academics. As parents, educators, and child development experts, we've witnessed how social-emotional learning can transform lives—and recognized the need for resources that help children navigate their complex emotional worlds.
                </p>
                <p>
                  Our flagship book, "Where the Brave Things Grow," invites kids and their grownups to explore feelings, practice bravery, and discover the joy of being their best selves. Each story honors the magic of childhood while providing practical tools for emotional growth. We believe every child deserves tools to thrive emotionally—and every family deserves stories that spark meaningful conversations.
                </p>
                <p>
                  Every page, interactive element, and learning activity is created with intention—to help children feel seen, understood, and empowered to embrace their full range of emotions.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-forest-100 to-golden-100 rounded-2xl p-8 border-2 border-forest-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-forest-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-forest-900 mb-4">
                    "Where the Brave Things Grow"
                  </h3>
                  <p className="text-forest-700 leading-relaxed">
                    Our heartfelt homage to Maurice Sendak's classic, designed to help 
                    children explore their emotions and develop the courage to grow through 
                    every feeling they encounter.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Promise, Vision */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-cream-50 to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-golden-100 text-golden-700 border-golden-200">
                💫 What Drives Us
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Foundation
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These core principles guide everything we create and every decision we make.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-2  transition-all duration-300 h-full">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon className="w-8 h-8 text-forest-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-coral-100 text-coral-700 border-coral-200">
                ❤️ Our Values
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                What We Believe
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These values shape how we create content and how we serve families around the world.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="border-2  transition-all duration-300 h-full">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-6 ${value.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-forest-600 to-golden-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-cream-100 mb-8 max-w-2xl mx-auto">
              Help us create a world where every child has the tools to understand their emotions 
              and build meaningful relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-forest-600 bg-cream-50 px-8 py-4 text-lg">
                <BookOpen className="w-6 h-6 mr-3" />
                Start Reading Today
              </Button>
              <Button size="lg" asChild className="bg-white text-forest-600 bg-cream-50 px-8 py-4 text-lg">
                <Link to="/feedback">
                  <ArrowRight className="w-6 h-6 mr-3" />
                  Share Your Feedback
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}