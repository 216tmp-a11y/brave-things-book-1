/**
* Max Tripping Scene Component
*
* Shows the moment when Max the mouse trips over a root and tumbles
* into a pile of leaves, setting up the emotional learning opportunity
* in this chapter about naming and understanding feelings.
*/
import { HTMLAttributes } from "react";

interface MaxTrippingSceneProps extends HTMLAttributes<HTMLDivElement> {
  // Component props can be extended as needed
}

export function MaxTrippingScene({ className, ...props }: MaxTrippingSceneProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
      <img
        src="https://static.step1.dev/cdd2a51ca33c90ab1102635a1ff9b1e9"
        alt="Max the mouse tripping over a root and tumbling into a pile of leaves, looking hurt and upset"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}