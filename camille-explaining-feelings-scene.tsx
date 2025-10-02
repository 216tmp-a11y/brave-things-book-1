/**
* Camille Explaining Feelings Scene Component
*
* Shows Camille the chameleon teaching the important lesson about
* noticing feelings on the inside and taking a slow breath to name them,
* helping figure out what you need when big emotions arise.
*/
import { HTMLAttributes } from "react";

interface CamilleExplainingFeelingsSceneProps extends HTMLAttributes<HTMLDivElement> {
  // Component props can be extended as needed
}

export function CamilleExplainingFeelingsScene({ className, ...props }: CamilleExplainingFeelingsSceneProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
      <img
        src="https://static.step1.dev/2a5f575966a47de33bea579d8aa2d6b5"
        alt="Camille the chameleon smiling and teaching about noticing feelings inside and taking slow breaths to name them"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}