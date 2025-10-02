/**
* Max Polka Dotted Pizza Scene Component
*
* Shows the humorous moment when Max perks up and imagines what he would
* look like if his feelings showed on his fur - "a polka-dotted pizza!
* Or maybe a rainbow donut with extra sprinkles!" This lightens the mood.
*/
import { HTMLAttributes } from "react";

interface MaxPolkaDottedPizzaSceneProps extends HTMLAttributes<HTMLDivElement> {
  // Component props can be extended as needed
}

export function MaxPolkaDottedPizzaScene({ className, ...props }: MaxPolkaDottedPizzaSceneProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
      <img
        src="https://static.step1.dev/d3df6826650e3573dbb6d68848d6f0e5"
        alt="Max the mouse perking up and imagining himself as a polka-dotted pizza with rainbow colors, bringing humor to the moment"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}