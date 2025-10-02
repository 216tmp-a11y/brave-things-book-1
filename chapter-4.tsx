/**
* Chapter 4 Page
*
* Wrapper page for Chapter 4: The Kindness Meadow
* Handles navigation back to contents and integration with the overall book flow
*/
import { Chapter4Optimized } from "@/components/chapters/chapter-4-optimized";
import { useNavigate } from "react-router-dom";

export default function Chapter4() {
  const navigate = useNavigate();

  const handleBackToContents = () => {
    navigate("/book/wtbtg");
  };

  return (
    <Chapter4Optimized onBackToContents={handleBackToContents} />
  );
}