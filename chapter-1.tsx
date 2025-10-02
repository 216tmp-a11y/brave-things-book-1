/**
 * Chapter 1 Page
 * 
 * Wrapper page for Chapter 1: The Still Pond
 * Handles navigation back to contents and integration with the overall book flow.
 */

import { Chapter1Optimized } from "@/components/chapters/chapter-1-optimized";
import { useNavigate } from "react-router-dom";

export default function Chapter1() {
  const navigate = useNavigate();

  const handleBackToContents = () => {
    navigate("/book/wtbtg");
  };

  return (
    <Chapter1Optimized onBackToContents={handleBackToContents} />
  );
}