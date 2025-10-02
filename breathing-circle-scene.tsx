/**
* Breathing Circle Scene Component
*
* Shows the friends gathered in a circle around the pond, learning
* from Wise Frog how to sit still, close their eyes, and practice
* mindful breathing - like smelling a flower and making pond ripples.
*/
import { HTMLAttributes } from "react";

interface BreathingCircleSceneProps extends HTMLAttributes<HTMLDivElement> {
// Component props can be extended as needed
}

export function BreathingCircleScene({ className, ...props }: BreathingCircleSceneProps) {
return (
<div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
<img
src="https://static.step1.dev/53f6c8d95170634bf92655683b06d50c"
alt="The friends gathered in a circle around the pond, practicing mindful breathing with Wise Frog"
className="w-full h-full object-contain"
loading="lazy"
/>
</div>
);
}