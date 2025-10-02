/**
* Forest Path Scene Component
*
* Shows the exciting forest path where the friends begin their adventure,
* with leaves crunching under their feet as they dash down the trail
* full of energy and excitement for their treasure hunt.
*/
import { HTMLAttributes } from "react";

interface ForestPathSceneProps extends HTMLAttributes<HTMLDivElement> {
// Component props can be extended as needed
}

export function ForestPathScene({ className, ...props }: ForestPathSceneProps) {
return (
<div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
<img 
src="https://static.step1.dev/686632d2323130a8045a4d3a553a78b0"
alt="The friends dashing down the forest path with leaves crunching under their feet, excited for their adventure"
className="w-full h-full object-contain"
loading="lazy"
/>
</div>
);
}