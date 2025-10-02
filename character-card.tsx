/**
 * Character Card Component
 * 
 * Displays individual character information including their name, species,
 * description, traits, and emoji representation.
 */

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CharacterCardProps {
  name: string;
  species: string;
  description: string;
  traits: string[];
  emoji: string;
  color: string;
}

export function CharacterCard({
  name,
  species,
  description,
  traits,
  emoji,
  color
}: CharacterCardProps) {
  return (
    <Card className="h-full bg-white/90 backdrop-blur-sm border-forest-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="text-center pb-3">
        <div className={`w-20 h-20 mx-auto rounded-full ${color} flex items-center justify-center mb-4 border-2 border-white shadow-md`}>
          <div className="text-4xl">{emoji}</div>
        </div>
        <CardTitle className="text-forest-800 text-lg">
          {name}
        </CardTitle>
        <p className="text-forest-600 text-sm capitalize">
          {species}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-forest-700 text-sm leading-relaxed mb-4">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {traits.map((trait, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className="text-xs bg-forest-50 text-forest-700 border-forest-200"
            >
              {trait}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}