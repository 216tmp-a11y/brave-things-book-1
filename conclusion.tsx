/**
 * Book Conclusion Page - End and Back Cover
 * 
 * Final celebration page that congratulates readers on completing their journey
 * through the Forest of Wonder. Features interactive elements, cue recap,
 * and navigation options to restart or explore more.
 */

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Home,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Heart,
  BookOpen,
  Leaf,
  Rainbow,
  Shield,
  Coffee,
  Star,
  Trophy
} from "lucide-react";

// All the cues learned throughout the journey
const cuesLearned = [
  {
    name: "Golden Leaf",
    icon: Leaf,
    color: "text-golden-600",
    bgColor: "bg-golden-100",
    lesson: "Mindful breathing"
  },
  {
    name: "Rainbow Tail",
    icon: Rainbow,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    lesson: "Naming feelings"
  },
  {
    name: "Bravery Badge",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    lesson: "Showing courage"
  },
  {
    name: "Sparkling Petal",
    icon: Sparkles,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    lesson: "Being kind"
  },
  {
    name: "Gratitude Leaf",
    icon: Heart,
    color: "text-green-600",
    bgColor: "bg-green-100",
    lesson: "Showing thankfulness"
  },
  {
    name: "Dew Cup",
    icon: Coffee,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100",
    lesson: "Sharing with others"
  }
];

export default function Conclusion() {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCues, setShowCues] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Stagger the animations
    setTimeout(() => setShowConfetti(true), 500);
    setTimeout(() => setShowCues(true), 1500);
  }, []);

  const handleRestartJourney = () => {
    navigate("/book/introduction");
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleVisitWebsite = () => {
    // Placeholder - user will provide link later
    window.open("#", "_blank");
  };

  const handleTableOfContents = () => {
    navigate("/book/wtbtg");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleContactUs = async () => {
    const email = 'wtbtgmedia@gmail.com';
    
    try {
      // Try to open email client
      window.location.href = `mailto:${email}`;
      
      // Also copy email to clipboard as backup
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
        // You could add a toast notification here if you had one
        console.log('Email copied to clipboard as backup');
      }
    } catch (error) {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(email);
          alert(`Email address copied to clipboard: ${email}`);
        } catch (clipError) {
          // Final fallback: show email in alert
          alert(`Please contact us at: ${email}`);
        }
      } else {
        alert(`Please contact us at: ${email}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-golden-50 relative overflow-hidden">
      {/* Floating celebration elements */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), opacity: 0 }}
              animate={{ 
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100, 
                opacity: [0, 1, 1, 0],
                rotate: 360 * 3
              }}
              transition={{ 
                duration: 4 + Math.random() * 2, 
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: 3 + Math.random() * 5
              }}
              className="absolute"
            >
              <Star className={`w-4 h-4 ${['text-golden-400', 'text-pink-400', 'text-blue-400', 'text-green-400', 'text-purple-400'][i % 5]}`} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-forest-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-forest-600 to-golden-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-forest-800">Brave Things Books</div>
              </div>
            </div>
            <div className="text-forest-400">•</div>
            <h1 className="text-xl font-bold text-forest-800">Adventure Complete!</h1>
          </div>
          <Badge className="bg-golden-100 text-golden-700 border-golden-200">
            <Trophy className="w-4 h-4 mr-2" />
            Congratulations!
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          
          <h1 className="text-5xl font-bold text-forest-800 mb-4">
            Congratulations, Adventurer!
          </h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-forest-600 max-w-2xl mx-auto leading-relaxed"
          >
            <p className="mb-4">
              You did it! You've helped Mila and her friends learn about feelings, bravery, 
              kindness, gratitude, and sharing. Remember, you can use your adventure cues 
              and activities anytime you want to grow your brave, kind heart.
            </p>
            <p>
              Thank you for joining us in the Forest of Wonder. Until our next adventure, 
              keep exploring, keep caring, and keep growing together!
            </p>
          </motion.div>
        </motion.div>

        {/* Cues Recap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showCues ? 1 : 0, y: showCues ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-forest-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-forest-800 mb-2">
                🌟 Your Adventure Cues
              </CardTitle>
              <p className="text-forest-600">
                You've learned all six magical cues! Use them whenever you need them.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cuesLearned.map((cue, index) => {
                  const CueIcon = cue.icon;
                  
                  return (
                    <motion.div
                      key={cue.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 1.8 + (index * 0.2),
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <div className={`p-4 rounded-xl ${cue.bgColor} border-2 border-white/50 text-center hover:scale-105 transition-transform`}>
                        <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-white/80 flex items-center justify-center ${cue.color}`}>
                          <CueIcon className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-forest-700 text-sm mb-1">{cue.name}</h4>
                        <p className="text-forest-600 text-xs">{cue.lesson}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-forest-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-forest-800 mb-3">
                Start a New Adventure
              </h3>
              <p className="text-forest-600 mb-4">
                Ready to experience the magic again? Restart your journey through the Forest of Wonder.
              </p>
              <Button 
                onClick={handleRestartJourney}
                className="w-full bg-forest-500 hover:bg-forest-600 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Your Journey
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-forest-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-semibold text-forest-800 mb-3">
                Want to get in touch?
              </h3>
              <p className="text-forest-600 mb-4">
                We'd love to hear from you! Reach out with questions, feedback, or just to say hello.
              </p>
              <Button 
                variant="outline"
                onClick={handleContactUs}
                className="w-full border-forest-300 text-forest-700 hover:bg-forest-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={handleTableOfContents}
            variant="ghost"
            className="text-forest-600 hover:text-forest-800 hover:bg-white/50"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Table of Contents
          </Button>
        </motion.div>

        {/* Series Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-golden-50 to-forest-50 border-golden-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-forest-800 mb-4">
                About This Series
              </h3>
              <p className="text-forest-700 mb-4 max-w-2xl mx-auto leading-relaxed">
                Where the Brave Things Grow is a story, science, and activity book series 
                for raising mindful, resilient kids. For more adventures, resources, and 
                printables, visit the author's website.
              </p>
              <p className="text-forest-600 mb-6">
                <strong>Stay tuned for more adventures to come!</strong>
              </p>
              <div className="text-sm text-forest-600 space-y-2">
                <p><strong>Brought to life by Where the Brave Things Grow Media</strong></p>
                <p>For inquiries or feedback, please contact: <button onClick={handleContactUs} className="text-forest-700 underline hover:text-forest-900 transition-colors cursor-pointer border-none bg-transparent p-0 m-0 font-inherit">wtbtgmedia@gmail.com</button></p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}