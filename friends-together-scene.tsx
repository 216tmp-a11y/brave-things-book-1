/**
* Friends Together Scene Component
*
* Shows the happy ending of Chapter 1 where all the friends stand up
* feeling calm and connected, ready to start their adventure together
* after learning the important lesson about pausing and breathing.
*/
import { HTMLAttributes } from "react";

interface FriendsTogetherSceneProps extends HTMLAttributes<HTMLDivElement> {
// Component props can be extended as needed
}

export function FriendsTogetherScene({ className, ...props }: FriendsTogetherSceneProps) {
return (
<div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
<img 
src="https://static.step1.dev/e8a0a25d78983ec83f8f3aa82c79e2d0"
alt="All the friends standing together, feeling calm and connected, ready to start their adventure"
className="w-full h-full object-contain"
loading="lazy"
/>
</div>
);
}