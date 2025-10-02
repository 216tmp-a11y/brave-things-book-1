/**
* Bella Helping Max Scene Component
*
* Shows the caring moment when Bella the bunny tries to help Max,
* but he pushes her away and snaps "I'm fine!" even though he's clearly
* not okay, demonstrating the emotional complexity children experience.
*/
import { HTMLAttributes } from "react";

interface BellaHelpingMaxSceneProps extends HTMLAttributes<HTMLDivElement> {
  // Component props can be extended as needed
}

export function BellaHelpingMaxScene({ className, ...props }: BellaHelpingMaxSceneProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
      <img
        src="https://static.step1.dev/4ee48789119a21b980886ae4640be15f"
        alt="Bella the bunny gently trying to help Max while he pushes her away, showing the tension of big emotions"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}