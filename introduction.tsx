/**
 * Story Introduction Page
 * 
 * Introduces readers to the Forest of Wonder and all the main characters.
 * Sets up the story world and prepares children for the interactive elements
 * they'll encounter throughout the book.
 */

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CharacterCard } from "@/components/character-card";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  Home,
  BookOpen
} from "lucide-react";

// Character data
const characters = [
  {
    name: "Mila",
    species: "squirrel",
    description: "Always curious and ready for adventure! Mila loves exploring and learning new things with her friends.",
    traits: ["Curious", "Energetic", "Brave"],
    emoji: "🐿️",
    color: "bg-forest-200"
  },
  {
    name: "Max",
    species: "mouse", 
    description: "Small but mighty! Max is thoughtful and always ready to help his friends solve problems.",
    traits: ["Thoughtful", "Helpful", "Smart"],
    emoji: "🐭",
    color: "bg-earth-200"
  },
  {
    name: "Bella",
    species: "bunny",
    description: "Gentle and kind, Bella teaches everyone about being caring and understanding others' feelings.",
    traits: ["Gentle", "Kind", "Caring"],
    emoji: "🐰",
    color: "bg-pink-200"
  },
  {
    name: "Grandpa Tortoise",
    species: "tortoise",
    description: "Wise and patient, Grandpa Tortoise shares important life lessons and helps everyone stay calm.",
    traits: ["Wise", "Patient", "Calm"],
    emoji: "🐢",
    color: "bg-green-200"
  }
];

export default function Introduction() {
  const navigate = useNavigate();

  const handleBackToContents = () => {
    navigate("/book/wtbtg");
  };

  const handleStartChapter1 = () => {
    navigate("/book/chapter/1/story");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen forest-gradient">
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToContents}
              className="text-forest-600 text-forest-800"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Contents
            </Button>
            <div className="text-forest-400">•</div>
            <h1 className="text-xl font-bold text-forest-800">Introduction</h1>
          </div>
          <Badge className="bg-golden-100 text-golden-700 border-golden-200">
            Story Beginning
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Story Opening */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🌳</div>
          <h2 className="text-4xl font-bold text-forest-800 mb-6">
            Welcome to the Forest of Wonder
          </h2>
          
          <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-forest-200">
            <CardContent className="p-8">
              <div className="text-xl text-forest-700 leading-relaxed space-y-4">
                <p>
                  Deep in a magical forest where the trees whisper secrets and the flowers 
                  sparkle with morning dew, there lives a curious little squirrel named Mila.
                </p>
                <p>
                  Mila loves to explore every corner of the Forest of Wonder with her best 
                  friends: Max the thoughtful mouse, Bella the kind bunny, and wise Grandpa Tortoise 
                  who knows all the forest's secrets.
                </p>
                <p>
                  Together, they're about to discover six magical places in the forest, each one 
                  teaching them something special about growing up brave, kind, and wise.
                </p>
                <p className="text-forest-600 font-medium">
                  But they need your help! Look for the special cues as you read, and join in 
                  their adventures.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Characters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-forest-800 text-center mb-8">
            Meet Your Forest Friends
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {characters.map((character, index) => (
              <motion.div
                key={character.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <CharacterCard {...character} />
              </motion.div>
            ))}
          </div>
        </motion.div>



        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            variant="outline" 
            onClick={handleBackToContents}
            className="border-forest-300 text-forest-700 bg-forest-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contents
          </Button>
          
          <div className="text-forest-500 text-sm">Ready to begin?</div>
          
          <Button 
            onClick={handleStartChapter1}
            className="bg-forest-500 bg-forest-600 text-white magical-glow"
          >
            Start Chapter 1
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}