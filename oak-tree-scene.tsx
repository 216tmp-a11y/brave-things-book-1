/**
* Oak Tree Scene Component
*
* Displays the magical oak tree where Mila and her friends gather
* at the beginning of their forest adventure. Shows the big oak tree
* with the mysterious map and the friends getting ready to explore.
*/
import { HTMLAttributes } from "react";

interface OakTreeSceneProps extends HTMLAttributes<HTMLDivElement> {
// Component props can be extended as needed
}

export function OakTreeScene({ className, ...props }: OakTreeSceneProps) {
return (
<div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
<img 
src="https://static.step1.dev/363dd2dfbabd8a0adb741a28cac9a004"
alt="Mila the squirrel and her friends gathered around the big oak tree with their mysterious map, ready to start their forest adventure"
className="w-full h-full object-contain"
loading="lazy"
/>
</div>
);
}