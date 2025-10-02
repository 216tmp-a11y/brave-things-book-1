/**
* Chapter 2 Opening Scene Component
*
* Shows the exciting beginning of Chapter 2 where the sun is shining bright
* as Mila and her friends follow the next twist on their mystery map,
* eager to see what adventure awaits them.
*/
import { HTMLAttributes } from "react";

interface Chapter2OpeningSceneProps extends HTMLAttributes<HTMLDivElement> {
  // Component props can be extended as needed
}

export function Chapter2OpeningScene({ className, ...props }: Chapter2OpeningSceneProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
      <img
        src="https://static.step1.dev/abba64acd2a97782016412a1a0248a52"
        alt="The sun shining bright as Mila and her friends follow the next twist on their mystery map, eager for the next adventure"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}