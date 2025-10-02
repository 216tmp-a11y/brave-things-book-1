/**
 * Book Preview Page
 * 
 * A dedicated preview page showcasing three key sections from the interactive book:
 * 1. Meet the Characters - Mila and her forest friends
 * 2. Interactive Learning - Collect the Magic Cues section
 * 3. The Adventure Path - Journey through the forest locations
 * 
 * This page is not visible in navigation but accessible via direct link from homepage.
 * Content is based on the actual Step1 book interface.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Sparkles, 
  TreePine, 
  Heart,
  Leaf,
  Rainbow,
  Shield,
  Coffee,
  MapPin,
  ArrowRight,
  RotateCcw,
  Play,
  ArrowLeft,
  Star,
  Gift
} from "lucide-react";
import { Link } from "react-router-dom";

// Characters data from the URL
const characters = [
  {
    name: "Mila",
    type: "squirrel",
    emoji: "🐿️",
    personality: "Curious & Energetic",
    description: "Always curious and ready for adventure! Mila loves exploring and learning new things with her friends.",
    traits: ["Curious", "Energetic", "Brave"],
    bgColor: "bg-forest-200"
  },
  {
    name: "Max",
    type: "mouse", 
    emoji: "🐭",
    personality: "Thoughtful & Helpful",
    description: "Small but mighty! Max is thoughtful and always ready to help his friends solve problems.",
    traits: ["Thoughtful", "Helpful", "Smart"],
    bgColor: "bg-earth-200"
  },
  {
    name: "Bella",
    type: "bunny",
    emoji: "🐰", 
    personality: "Gentle & Caring",
    description: "Gentle and kind, Bella teaches everyone about being caring and understanding others' feelings.",
    traits: ["Gentle", "Kind", "Caring"],
    bgColor: "bg-pink-200"
  },
  {
    name: "Grandpa Tortoise",
    type: "tortoise",
    emoji: "🐢",
    personality: "Wise & Patient", 
    description: "Wise and patient, Grandpa Tortoise shares important life lessons and helps everyone stay calm.",
    traits: ["Wise", "Patient", "Calm"],
    bgColor: "bg-green-200"
  }
];

// Interactive Magic Cues data from the URL
const magicCues = [
  {
    name: "Golden Leaf",
    skill: "Mindfulness",
    action: "Breathe deeply",
    description: "Take a mindful breath",
    icon: Leaf,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-500"
  },
  {
    name: "Rainbow Tail", 
    skill: "Emotional Awareness",
    action: "Say how you feel",
    description: "Name your feeling",
    icon: Rainbow,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    borderColor: "border-purple-500"
  },
  {
    name: "Bravery Badge",
    skill: "Courage",
    action: "Say 'I can try!'",
    description: "Show courage",
    icon: Shield,
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    borderColor: "border-blue-500"
  },
  {
    name: "Sparkling Petal",
    skill: "Kindness",
    action: "Do something kind",
    description: "Be kind",
    icon: Sparkles,
    bgColor: "bg-pink-100",
    textColor: "text-pink-600",
    borderColor: "border-pink-500"
  },
  {
    name: "Gratitude Leaf",
    skill: "Gratitude", 
    action: "Share what you're grateful for",
    description: "Show thankfulness",
    icon: Heart,
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    borderColor: "border-green-500"
  },
  {
    name: "Dew Cup",
    skill: "Sharing",
    action: "Think of when you shared",
    description: "Remember sharing",
    icon: Coffee,
    bgColor: "bg-cyan-100",
    textColor: "text-cyan-600",
    borderColor: "border-cyan-500"
  }
];

// Adventure Path locations from the URL
const adventureLocations = [
  {
    name: "Mindful Meadow",
    description: "Learn to breathe and be present",
    cue: "Golden Leaf",
    bgColor: "bg-golden-400",
    completed: true
  },
  {
    name: "Feeling Forest",
    description: "Explore and name emotions", 
    cue: "Rainbow Tail",
    bgColor: "bg-purple-400",
    completed: false
  },
  {
    name: "Courage Clearing",
    description: "Find your inner bravery",
    cue: "Bravery Badge", 
    bgColor: "bg-blue-400",
    completed: false
  },
  {
    name: "Kindness Creek",
    description: "Practice acts of kindness",
    cue: "Sparkling Petal",
    bgColor: "bg-pink-400",
    completed: false
  },
  {
    name: "Gratitude Grove",
    description: "Appreciate what we have",
    cue: "Gratitude Leaf",
    bgColor: "bg-green-400",
    completed: false
  },
  {
    name: "Sharing Springs",
    description: "Learn the joy of sharing",
    cue: "Dew Cup",
    bgColor: "bg-cyan-400",
    completed: false
  }
];

export default function BookPreview() {
  const [collectedCues, setCollectedCues] = useState<number>(0);
  const [selectedCue, setSelectedCue] = useState<number | null>(null);

  const handleCueClick = (index: number) => {
    if (selectedCue === index) {
      setSelectedCue(null);
    } else {
      setSelectedCue(index);
      if (collectedCues <= index) {
        setCollectedCues(index + 1);
      }
    }
  };

  const resetProgress = () => {
    setCollectedCues(0);
    setSelectedCue(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen forest-gradient">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl floating">🍃</div>
        <div className="absolute top-40 right-20 text-3xl bounce-gentle">🌸</div>
        <div className="absolute bottom-40 left-20 text-5xl floating">🌳</div>
        <div className="absolute bottom-20 right-10 text-3xl bounce-gentle">🦋</div>
        <div className="absolute top-60 left-1/3 text-2xl floating">✨</div>
        <div className="absolute bottom-60 right-1/3 text-4xl bounce-gentle">🌿</div>
      </div>

      {/* Header with back button */}
      <div className="relative pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center text-forest-600 text-forest-700 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Title */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-golden-100 text-golden-700 border-golden-200 px-4 py-2 text-sm font-medium">
            <Play className="w-4 h-4 mr-2" />
            Interactive Children's Storybook
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-bold text-forest-800 mb-6 leading-tight">
            Where the Brave<br />
            <span className="text-gradient">Things Grow</span>
          </h1>
          <p className="text-xl text-forest-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Stories, Science & Activities for Raising Mindful, Resilient Kids
          </p>
          <p className="text-lg text-forest-500 max-w-2xl mx-auto mb-12">
            Join Mila the squirrel and her friends on a magical forest adventure that teaches children about mindfulness, emotions, bravery, kindness, gratitude, and sharing through interactive storytelling and engaging activities.
          </p>
        </div>
      </section>

      {/* Section 1: Meet the Characters */}
      <section id="characters-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-earth-100 text-earth-700 border-earth-200 px-4 py-2 text-sm font-medium">
              <Users className="w-4 h-4 mr-2" />
              Meet the Characters
            </Badge>
            <h2 className="text-4xl font-bold text-forest-800 mb-6">Mila and Her Forest Friends</h2>
            <p className="text-lg text-forest-600 max-w-2xl mx-auto">
              Each character brings their own special wisdom and personality to help children learn important life skills through engaging stories and activities.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {characters.map((character, index) => (
              <motion.div
                key={character.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${character.bgColor} shadow-lg flex items-center justify-center text-4xl`}>
                      {character.emoji}
                    </div>
                    <h3 className="text-xl font-bold text-forest-700 mb-1">{character.name}</h3>
                    <p className="text-forest-500 text-sm mb-3 capitalize">{character.type}</p>
                    <p className="text-forest-600 text-sm mb-4 leading-relaxed">{character.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {character.traits.map((trait) => (
                        <Badge key={trait} className="bg-golden-100 text-golden-700 bg-golden-200 transition-colors text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Learning - Collect the Magic Cues */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-golden-100 text-golden-700 border-golden-200 px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Interactive Learning
            </Badge>
            <h2 className="text-4xl font-bold text-forest-800 mb-6">Collect the Magic Cues</h2>
            <p className="text-lg text-forest-600 max-w-2xl mx-auto">
              Throughout the story, children will discover special cues that invite them to participate in mindfulness activities, emotional exercises, and acts of kindness.
            </p>
          </div>

          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-forest-200">
            <CardContent className="p-8">
              {/* Progress section */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-forest-600">
                  <span>Progress</span>
                  <span>{collectedCues} / 6</span>
                </div>
                <Progress value={(collectedCues / 6) * 100} className="h-3" />
              </div>

              {/* Magic Cues Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {magicCues.map((cue, index) => {
                  const IconComponent = cue.icon;
                  const isActive = selectedCue === index;
                  const isCollected = index < collectedCues;
                  
                  return (
                    <motion.div
                      key={cue.name}
                      className="cursor-pointer"
                      onClick={() => handleCueClick(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className={`p-4 rounded-xl bg-white max-w-sm mx-auto h-48 flex flex-col justify-between transition-all duration-300 ${
                        isActive ? 'ring-2 ring-forest-400 shadow-lg' : 'shadow-md'
                      } ${isCollected ? 'border-green-300' : ''}`}>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${cue.bgColor} ${cue.textColor}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <h4 className="font-bold text-forest-700 text-base mb-2 text-center">{cue.name}</h4>
                          <p className="text-forest-600 text-xs mb-3 text-center leading-relaxed">{cue.description}</p>
                        </div>
                        <div className={`border-2 rounded-full py-1.5 px-3 text-center font-medium text-xs bg-white ${cue.borderColor} ${cue.textColor}`}>
                          {cue.action}
                        </div>
                        {isCollected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Start Over Button */}
              <div className="text-center">
                <Button 
                  onClick={resetProgress}
                  variant="outline"
                  className="text-forest-600 border-forest-300 bg-forest-50 rounded-full px-6"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3: The Adventure Path */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-forest-100 text-forest-700 border-forest-200 px-4 py-2 text-sm font-medium">
              <TreePine className="w-4 h-4 mr-2" />
              The Adventure Path
            </Badge>
            <h2 className="text-4xl font-bold text-forest-800 mb-6">Journey Through the Forest of Wonder</h2>
            <p className="text-lg text-forest-600 max-w-2xl mx-auto">
              Follow Mila and her friends as they discover six magical locations, each teaching important lessons about emotional intelligence and social skills.
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-forest-200">
            <CardContent className="p-8">
              <div className="relative py-8">
                {/* Background gradient */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-r from-forest-100 via-golden-50 to-forest-100 rounded-lg"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-4">
                    {adventureLocations.map((location, index) => (
                      <div key={location.name} className="flex flex-col lg:flex-row items-center">
                        <div className="relative">
                          <div className={`w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${location.bgColor} ${
                            location.completed ? 'magical-glow' : ''
                          }`}>
                            <MapPin className="w-8 h-8 text-white" />
                          </div>
                          <div className="mt-4 text-center max-w-32">
                            <h4 className="font-semibold text-forest-700 text-sm mb-1">{location.name}</h4>
                            <p className="text-forest-600 text-xs mb-2">{location.description}</p>
                            <Badge className="text-xs bg-golden-100 text-golden-700">
                              {location.cue}
                            </Badge>
                          </div>
                          {location.completed && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-golden-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        {index < adventureLocations.length - 1 && (
                          <div className="hidden lg:block mx-4">
                            <ArrowRight className="w-6 h-6 text-forest-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-forest-200 p-12 shadow-xl">
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="text-4xl font-bold text-forest-800 mb-6">Ready to Begin the Adventure?</h2>
            <p className="text-lg text-forest-600 mb-8 max-w-2xl mx-auto">
              Join thousands of families who are already using "Where the Brave Things Grow" to nurture emotional intelligence and create meaningful bonding moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" asChild className="bg-forest-500 bg-forest-600 text-white px-8 py-4 text-lg font-medium rounded-full shadow-lg shadow-xl transition-all duration-300 magical-glow">
                <Link to="/login" onClick={scrollToTop}>
                  <Gift className="w-5 h-5 mr-2" />
                  Get Your Copy Today
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-forest-300 text-forest-700 bg-forest-50 px-8 py-4 text-lg font-medium rounded-full">
                <Link to="/features" onClick={scrollToTop}>
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Learn More
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-forest-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Ages 3-8 years
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Research-backed activities
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Family bonding time
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Interactive digital features
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}