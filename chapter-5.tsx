/**
* Chapter 5 Page
*
* Wrapper page for Chapter 5: The Gratitude Garden
* Handles navigation back to contents and integration with the overall book flow
*/
import { Chapter5Optimized } from "@/components/chapters/chapter-5-optimized";
import { useNavigate } from "react-router-dom";

export default function Chapter5() {
  const navigate = useNavigate();

  const handleBackToContents = () => {
    navigate("/book/wtbtg");
  };

  return (
    <Chapter5Optimized onBackToContents={handleBackToContents} />
  );
}