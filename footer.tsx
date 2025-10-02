/**
 * Footer Component
 * 
 * Global footer that appears on all website pages (but not in books).
 * Contains company information, navigation links, and contact details.
 * 
 * Features:
 * - Company branding with forest/golden logo
 * - Quick navigation links
 * - Contact information
 * - Responsive grid layout
 * - Updated year and logo colors
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail } from "lucide-react";

export function Footer() {
  // Function to scroll to top when navigation links are clicked
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-forest-600 to-golden-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Brave Things Books</h3>
                <p className="text-sm text-gray-400">Interactive Learning</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Creating interactive books that help children develop emotional intelligence, 
              social skills, and mindfulness through engaging storytelling.
            </p>
            <div className="flex gap-4">
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-gray-800">
                Follow Us
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link 
                  to="/book" 
                  onClick={scrollToTop}
                  className="text-white colors"
                >
                  Our Books
                </Link>
              </li>
              <li>
                <Link 
                  to="/features" 
                  onClick={scrollToTop}
                  className="text-white colors"
                >
                  Digibook Features
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  onClick={scrollToTop}
                  className="text-white colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a 
                  href="https://forms.clickup.com/2370929/f/28bbh-75451/2WWNJ2GGXUMT0C1NUZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Brave Things Books. All rights reserved. Made with ❤️ for children everywhere.</p>
        </div>
      </div>
    </footer>
  );
}