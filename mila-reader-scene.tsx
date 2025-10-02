/**
* Mila Reader Scene Component
*
* Shows Mila in the special cue interaction scene where children
* are invited to practice naming their feelings out loud with 
* Camille's Rainbow Tail cue, following her guidance.
*/
import { HTMLAttributes } from "react";

interface MilaReaderSceneProps extends HTMLAttributes<HTMLDivElement> {
  // Component props can be extended as needed
}

export function MilaReaderScene({ className, ...props }: MilaReaderSceneProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
      <img
        src="https://static.step1.dev/3e2c22f4e28e496ca7b3e4bb149e213c"
        alt="Mila the squirrel ready to help children practice naming their feelings with the Rainbow Tail cue interaction"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}