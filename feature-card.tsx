/**
* Feature Card Component
*
* Reusable card component for displaying features, benefits, or highlights.
* Used throughout the website pages to maintain consistent styling.
* Enhanced with Google-inspired design: better shadows, rounded corners, and hover effects.
*
* Props:
* - icon: Lucide icon component
* - title: Feature headline
* - description: Feature description
* - color: Tailwind color classes for styling
* - className: Additional CSS classes
*/
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  className?: string;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color = "bg-blue-50 text-blue-600 border-blue-200",
  className = "",
  delay = 0
}: FeatureCardProps) {
  return (
    <Card className={`border-0 shadow-lg shadow-2xl all duration-500 ease-out h-full group bg-white rounded-3xl overflow-hidden ${className}`}>
      <CardContent className="p-10 text-center h-full flex flex-col">
        {/* Icon - Enhanced with Better Hover Effect */}
        <motion.div
          className={`w-20 h-20 mx-auto mb-8 rounded-2xl border-2 flex items-center justify-center ${color} group-scale-110 all duration-300`}
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-10 h-10" />
        </motion.div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 group-text-forest-600 colors duration-300 leading-tight">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}