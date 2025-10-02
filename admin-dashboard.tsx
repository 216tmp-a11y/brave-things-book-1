/**
 * Admin Dashboard Page
 * 
 * Main admin dashboard showing:
 * - User statistics and analytics
 * - Reading activity overview
 * - System health metrics
 * - Recent user registrations
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Calendar,
  Mail,
  Activity,
  Download
} from "lucide-react";
import { client } from "@/lib/api";
import { toast } from "sonner";

interface UserStats {
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
  totalReadingTime: number;
  totalSessions: number;
  averageEngagementScore: number;
}

interface TopUser {
  userId: string;
  userName: string;
  userEmail: string;
  engagementScore: number;
  totalSessions: number;
  totalReadingTime: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
  subscription_status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    totalReadingTime: 0,
    totalSessions: 0,
    averageEngagementScore: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      // Load user-account-based analytics summary with enhanced error handling
      try {
        const analyticsResponse = await fetch('/api/book-access/analytics/summary');
        
        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          
          // Validate analytics data structure before setting state
          if (analyticsData && typeof analyticsData === 'object') {
            setStats({
              totalUsers: analyticsData.totalUsers || 0,
              newUsersToday: analyticsData.newUsersToday || 0,
              activeUsers: analyticsData.activeUsers || 0,
              totalReadingTime: analyticsData.totalReadingTime || 0,
              totalSessions: analyticsData.totalSessions || 0,
              averageEngagementScore: analyticsData.averageEngagementScore || 0
            });
            setTopUsers(Array.isArray(analyticsData.topUsers) ? analyticsData.topUsers : []);
            console.log("📊 Loaded user-account-based analytics:", analyticsData);
          } else {
            console.warn("⚠️ Invalid analytics data structure received");
          }
        } else {
          console.warn("⚠️ Analytics endpoint returned error:", analyticsResponse.status);
        }
      } catch (analyticsError) {
        console.warn("⚠️ Analytics data not available:", analyticsError);
        // Continue without analytics data - the dashboard will show zeros
      }

      // Load admin dashboard data (for recent users)
      try {
        const response = await client.api.admin.dashboard.$get({}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRecentUsers(data.recentUsers || []);
        }
      } catch (adminError) {
        console.log("Admin dashboard endpoint not available, using analytics data only");
      }
      
    } catch (error) {
      console.error("Dashboard load error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const exportUserData = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await client.api.admin["export-users"].$get({}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Create CSV content
        const csvContent = [
          "Name,Email,Registration Date,Subscription Status,Last Active",
          ...data.users.map((user: any) => 
            `"${user.name}","${user.email}","${user.created_at}","${user.subscription_status}","${user.last_active || 'Never'}"`
          )
        ].join("\n");
        
        // Download CSV file
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `brave-things-users-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success("User data exported successfully");
      } else {
        toast.error("Failed to export user data");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export user data");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">User analytics and platform overview</p>
        </div>
        
        <Button onClick={exportUserData} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export User Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500 mt-1">
              +{stats.newUsersToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Readers</CardTitle>
            <BookOpen className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Currently reading
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Reading Time</CardTitle>
            <Clock className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{Math.round(stats.totalReadingTime / 60)}h</div>
            <p className="text-xs text-gray-500 mt-1">
              Total minutes read
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Engagement</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-forest-600">{stats.averageEngagementScore}%</div>
            <p className="text-xs text-gray-500 mt-1">
              Average user engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout for Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Engaged Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-forest-600" />
              Top Engaged Readers
            </CardTitle>
            <CardDescription>
              Users with highest engagement scores (user-account-based analytics)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No analytics data available</p>
              ) : (
                topUsers.map((user, index) => (
                  <div key={user.userId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-golden-100 rounded-full flex items-center justify-center">
                        <span className="text-golden-700 font-bold text-sm">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.userName}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {user.totalSessions} sessions
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-forest-600">{user.engagementScore}%</div>
                      <div className="text-xs text-gray-500">
                        {user.totalReadingTime}min total
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent User Registrations
            </CardTitle>
            <CardDescription>
              New users who joined the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent users found</p>
              ) : (
                recentUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                        <span className="text-forest-700 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={user.subscription_status === "premium" ? "default" : "secondary"}>
                        {user.subscription_status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            User-Account-Based Analytics System
          </CardTitle>
          <CardDescription>
            Analytics are now tied to user accounts for continuous tracking across sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stats.totalSessions}</div>
              <div className="text-sm text-green-700">Total Sessions</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{Math.round(stats.totalReadingTime / 60)}h</div>
              <div className="text-sm text-blue-700">Reading Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{stats.averageEngagementScore}%</div>
              <div className="text-sm text-purple-700">Avg Engagement</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">✅</div>
              <div className="text-sm text-orange-700">Token Persistence</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-cream-50 rounded-lg border border-forest-200">
            <h4 className="font-semibold text-forest-800 mb-2">✨ New Analytics Features:</h4>
            <ul className="text-sm text-forest-700 space-y-1">
              <li>• <strong>User Identity Tracking:</strong> Analytics linked to user accounts, not tokens</li>
              <li>• <strong>Continuous Sessions:</strong> Data accumulates across all reading sessions</li>
              <li>• <strong>Token Persistence:</strong> Tokens persist in development for uninterrupted tracking</li>
              <li>• <strong>Engagement Scoring:</strong> Real-time calculation of user engagement levels</li>
              <li>• <strong>Reading Progression:</strong> Complete journey tracking over time</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}