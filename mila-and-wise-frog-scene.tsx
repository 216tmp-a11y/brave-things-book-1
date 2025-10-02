/**
* Mila and Wise Frog Scene Component
*
* Shows the touching moment when Mila sits down next to Wise Frog,
* her fur all frazzled, expressing her frustration that their adventure
* isn't going as planned, and Wise Frog offering gentle guidance.
*/
import { HTMLAttributes } from "react";

interface MilaAndWiseFrogSceneProps extends HTMLAttributes<HTMLDivElement> {
// Component props can be extended as needed
}

export function MilaAndWiseFrogScene({ className, ...props }: MilaAndWiseFrogSceneProps) {
return (
<div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
<img 
src="https://static.step1.dev/e9d5b2fae65ef4dd756e9b9e6f3fa037"
alt="Mila sitting next to Wise Frog by the pond, her fur frazzled, while Wise Frog offers gentle guidance"
className="w-full h-full object-contain"
loading="lazy"
/>
</div>
);
}