/**
* Pond Scene Component
*
* Displays the quiet, sparkling pond where the friends first encounter
* Wise Frog sitting peacefully on a lily pad, breathing slowly and calmly.
* This is where they learn about mindfulness and taking a pause.
*/
import { HTMLAttributes } from "react";

interface PondSceneProps extends HTMLAttributes<HTMLDivElement> {
// Component props can be extended as needed
}

export function PondScene({ className, ...props }: PondSceneProps) {
return (
<div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
<img 
src="https://static.step1.dev/807681f32d51b451aef46f6de3d912c7"
alt="The quiet, sparkling pond with Wise Frog sitting peacefully on a lily pad, eyes closed, breathing calmly"
className="w-full h-full object-contain"
loading="lazy"
/>
</div>
);
}