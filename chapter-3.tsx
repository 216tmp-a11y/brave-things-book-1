/**
* Chapter 3 Page
*
* Wrapper page for Chapter 3: The Brave Bridge
* Handles navigation back to contents and integration with the overall book flow
*/
import { Chapter3Optimized } from "@/components/chapters/chapter-3-optimized";
import { useNavigate } from "react-router-dom";

export default function Chapter3() {
  const navigate = useNavigate();

  const handleBackToContents = () => {
    navigate("/book/wtbtg");
  };

  return (
    <Chapter3Optimized onBackToContents={handleBackToContents} />
  );
}