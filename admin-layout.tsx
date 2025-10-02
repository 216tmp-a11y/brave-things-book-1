/**
 * Admin Layout Component
 * 
 * Provides consistent layout for admin panel pages including:
 * - Admin navigation sidebar
 * - Header with admin controls
 * - Main content area
 * - Admin-only access control
 */

import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  Users, 
  BarChart3, 
  BookOpen, 
  Clock, 
  Shield,
  Home,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

const adminNavItems = [
  {
    path: "/admin",
    label: "Dashboard",
    icon: BarChart3,
    description: "User analytics and stats"
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: Users,
    description: "Manage user accounts"
  },
  {
    path: "/admin/settings",
    label: "Settings",
    icon: Settings,
    description: "System configuration"
  }
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button + Logo (Left) */}
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-forest-600 to-golden-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-gray-900">Brave Things Books</div>
                  <div className="text-sm text-gray-500">Interactive Learning</div>
                </div>
              </Link>
            </div>

            {/* Admin Panel Title (Center) */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-forest-600" />
                <span className="text-lg font-semibold text-gray-900">Admin Panel</span>
              </div>
            </div>

            {/* Status & User Menu (Right) */}
            <div className="flex items-center gap-4">
              {/* Online Status */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Online</span>
              </div>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-forest-600 text-white text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name || 'Admin'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/library" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      My Library
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300`}>
          <div className="p-6">
            <nav className="space-y-2">
              {adminNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? "bg-forest-50 text-forest-700 border-forest-200 border" 
                        : "bg-gray-50 text-gray-700"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${
                        isActive ? "text-forest-600" : "text-gray-500 group-text-gray-700"
                      }`} />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}