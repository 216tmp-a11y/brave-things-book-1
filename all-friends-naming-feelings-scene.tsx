/**
* All Friends Naming Feelings Scene Component
*
* Shows the heartwarming conclusion where all friends practice naming
* their feelings together - Mila feels worried and mad, Bella feels sad
* for Max, and Grandpa Tortoise feels patient and ready to help.
*/
import { HTMLAttributes } from "react";

interface AllFriendsNamingFeelingsSceneProps extends HTMLAttributes<HTMLDivElement> {
  // Component props can be extended as needed
}

export function AllFriendsNamingFeelingsScene({ className, ...props }: AllFriendsNamingFeelingsSceneProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
      <img
        src="https://static.step1.dev/ca2766cfc02d42381340719e786f3d82"
        alt="All the friends gathered together, each practicing naming their feelings out loud with Camille's guidance"
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}