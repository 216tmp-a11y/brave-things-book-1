/**
* Max Thoughtful Breathing Scene Component
*
* Shows Max taking a deep breath and bravely naming his feelings:
* "I guess I feel hurt and embarrassed." This demonstrates the 
* courage it takes to acknowledge and share our emotions.
*/
import { HTMLAttributes } from "react";

interface MaxThoughtfulBreathingSceneProps extends HTMLAttributes<HTMLDivElement> {
  // Component props can be extended as needed
}

export function MaxThoughtfulBreathingScene({ className, ...props }: MaxThoughtfulBreathingSceneProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
      <img
        src="https://static.step1.dev/a903fd7bccfef0f6dd87f959c774f2e3"
        alt="Max the mouse taking a thoughtful deep breath and courageously naming his feelings of hurt and embarrassment"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}