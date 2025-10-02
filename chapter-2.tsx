/**
* Chapter 2 Page
*
* Wrapper page for Chapter 2: The Colorful Chameleon
* Handles navigation back to contents and integration with the overall book flow
*/
import { Chapter2Optimized } from "@/components/chapters/chapter-2-optimized";
import { useNavigate } from "react-router-dom";

export default function Chapter2() {
  const navigate = useNavigate();

  const handleBackToContents = () => {
    navigate("/book/wtbtg");
  };

  return (
    <Chapter2Optimized onBackToContents={handleBackToContents} />
  );
}