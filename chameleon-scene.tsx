/**
* Chameleon Scene Component
*
* Shows the magical moment when Camille the chameleon appears,
* her skin changing from green to blue to yellow as she introduces
* herself and explains how she changes colors with different feelings.
*/
import { HTMLAttributes } from "react";

interface ChameleonSceneProps extends HTMLAttributes<HTMLDivElement> {
  // Component props can be extended as needed
}

export function ChameleonScene({ className, ...props }: ChameleonSceneProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
      <img
        src="https://static.step1.dev/5d920680d8bbcfde34b8687a8256d647"
        alt="Camille the chameleon perched on a branch, her skin changing beautiful colors as she explains feelings"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}