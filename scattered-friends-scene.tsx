/**
* Scattered Friends Scene Component
*
* Shows the moment when the friends realize they've gotten separated
* during their excited dash through the forest. Max is tangled in a bush,
* Bella looks ready to cry, and Grandpa Tortoise is far behind.
*/
import { HTMLAttributes } from "react";

interface ScatteredFriendsSceneProps extends HTMLAttributes<HTMLDivElement> {
// Component props can be extended as needed
}

export function ScatteredFriendsScene({ className, ...props }: ScatteredFriendsSceneProps) {
return (
<div className={`relative rounded-lg overflow-hidden ${className || ''}`} {...props}>
<img 
src="https://static.step1.dev/e90e4daf71ff73422897b99704da84b9"
alt="The friends scattered in the forest - Max tangled in a bush, Bella looks upset, and Grandpa Tortoise far behind"
className="w-full h-full object-contain"
loading="lazy"
/>
</div>
);
}