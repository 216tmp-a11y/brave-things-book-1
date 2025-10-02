/**
 * Admin Users Page
 * 
 * User management interface showing:
 * - Complete user list with search and filtering
 * - User details and account information
 * - Subscription status management
 * - User activity and reading progress
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Mail, 
  Calendar, 
  BookOpen,
  Clock,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { client } from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  subscription_status: "free" | "premium";
  role: "user" | "admin" | "preview";
  last_active?: string;
  total_reading_time: number;
  books_read: number;
  current_streak: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "free" | "premium" | "preview">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search and status
    let filtered = users;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      if (filterStatus === "preview") {
        filtered = filtered.filter(user => user.role === "preview");
      } else {
        filtered = filtered.filter(user => user.subscription_status === filterStatus);
      }
    }
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, filterStatus]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error("Failed to load users:", response.status, response.statusText);
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error("Users load error:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const formatReadingTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "free" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("free")}
              >
                Free
              </Button>
              <Button
                variant={filterStatus === "premium" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("premium")}
              >
                Premium
              </Button>
              <Button
                variant={filterStatus === "preview" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("preview")}
              >
                Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            All registered users and their account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found matching your criteria</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                      <span className="text-forest-700 font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <Badge variant={user.subscription_status === "premium" ? "default" : "secondary"}>
                          {user.subscription_status}
                        </Badge>
                        {user.role !== "user" && (
                          <Badge 
                            variant="outline" 
                            className={
                              user.role === "admin" 
                                ? "border-blue-500 text-blue-700 bg-blue-50" 
                                : "border-orange-500 text-orange-700 bg-orange-50"
                            }
                          >
                            {user.role}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {formatDate(user.created_at)}
                        </div>
                        
                        {user.last_active && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Active {formatDate(user.last_active)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <BookOpen className="w-3 h-3" />
                        {user.books_read} books
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatReadingTime(user.total_reading_time)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/user-analytics/${user.id}`}>
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Link>
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}