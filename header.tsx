import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookOpen, User, LogOut, Library, Home, Shield } from "lucide-react";
import { toast } from "sonner";

/**
 * Site Header Component
 * 
 * Provides navigation and authentication controls.
 * Adapts based on user authentication state.
 * 
 * Features:
 * - Brand logo and navigation
 * - Login/signup buttons for guests
 * - User menu with library access for authenticated users
 * - Responsive design
 * - Smooth animations
 * 
 * Navigation Order: Features, About, Books, Give feedback
 */

export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  // Don't show header on auth pages or when user is authenticated
  if (location.pathname === "/login" || 
      location.pathname === "/signup" || 
      isAuthenticated) {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-forest-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand - Clickable to go home */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center group-bg-forest-200 colors"
            >
              <BookOpen className="w-5 h-5 text-forest-600" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-forest-900 group-text-forest-700 colors">
                Brave Things Books
              </h1>
              <p className="text-xs text-forest-600 -mt-1">Interactive Learning Adventures</p>
            </div>
          </Link>

          {/* Navigation - Updated Order: Book Features, Digibook, About, Give Feedback */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/features" 
              className={`text-sm font-medium colors text-forest-700 ${
                location.pathname === '/features' ? 'text-forest-700' : 'text-forest-600'
              }`}
            >
              Book Features
            </Link>
            <Link 
              to="/digibook" 
              className={`text-sm font-medium colors text-forest-700 ${
                location.pathname === '/digibook' ? 'text-forest-700' : 'text-forest-600'
              }`}
            >
              Digibook
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium colors text-forest-700 ${
                location.pathname === '/about' ? 'text-forest-700' : 'text-forest-600'
              }`}
            >
              About
            </Link>
            <a 
              href="/feedback" 
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium colors text-forest-700 ${
                location.pathname === '/feedback' ? 'text-forest-700' : 'text-forest-600'
              }`}
            >
              Give Feedback
            </a>
          </nav>

          {/* Authentication */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-3 bg-forest-50 p-2"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-forest-100 text-forest-700 text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-forest-700">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-forest-900">{user.name}</p>
                    <p className="text-xs text-forest-600">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/library" className="flex items-center gap-2 cursor-pointer">
                      <Library className="w-4 h-4" />
                      My Library
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-coral-600 focus:text-coral-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  className="text-forest-600 text-forest-700 bg-forest-50"
                  onClick={() => window.open('/login', '_blank', 'noopener,noreferrer')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-forest-600 bg-forest-700 text-white"
                  onClick={() => window.open('/login', '_blank', 'noopener,noreferrer')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}