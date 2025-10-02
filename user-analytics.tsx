/**
 * User Analytics Page
 * 
 * Detailed analytics view for a specific user showing:
 * - Reading session history and patterns
 * - Page-level engagement metrics
 * - Behavioral insights and recommendations
 * - Time tracking and interaction analysis
 * - Reading journey visualization
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Clock,
  BookOpen,
  MousePointer,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  Eye,
  Zap,
  CheckCircle,
  Timer,
  Activity,
  Brain
} from "lucide-react";
import { client } from "@/lib/api";
import { toast } from "sonner";

interface UserAnalytics {
  user_id: string;
  overview: {
    total_sessions: number;
    total_reading_time: number;
    last_read_at?: string;
    completion_rate: number;
    engagement_score: number;
  };
  recent_sessions: Array<{
    id: string;
    date: string;
    duration: number;
    pages_read: number;
    completion_rate: number;
  }>;
  page_analytics: Array<{
    page_number: number;
    chapter_name?: string;
    average_time: number;
    completion_rate: number;
    interaction_density: number;
  }>;
  behavior_insights: {
    reading_patterns: string[];
    engagement_trends: Array<{
      date: string;
      score: number;
    }>;
    recommendations: string[];
  };
}

export default function UserAnalytics() {
  const { userId } = useParams<{ userId: string }>();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (userId) {
      loadUserAnalytics();
    }
  }, [userId]);

  const loadUserAnalytics = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await client.api.admin["user-analytics"][":userId"].$get(
        { param: { userId: userId! } },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
        
        // Get user name from users list (you might want to add a separate endpoint for this)
        const usersResponse = await client.api.admin.users.$get({}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          const user = usersData.users.find((u: any) => u.id === userId);
          setUserName(user?.name || "Unknown User");
        }
      } else {
        toast.error("Failed to load user analytics");
      }
    } catch (error) {
      console.error("Analytics load error:", error);
      toast.error("Failed to load user analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User analytics not found</p>
        <Button asChild className="mt-4">
          <Link to="/admin/users">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Link>
        </Button>
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{userName} Analytics</h1>
            <p className="text-gray-600">Detailed reading behavior and engagement metrics</p>
          </div>
        </div>
        
        <Badge 
          variant={analytics.overview.engagement_score >= 80 ? "default" : "secondary"}
          className="text-sm"
        >
          {analytics.overview.engagement_score}% Engagement
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.overview.total_sessions}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.overview.last_read_at 
                ? `Last read ${formatDate(analytics.overview.last_read_at)}`
                : 'No recent activity'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Reading Time</CardTitle>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatDuration(analytics.overview.total_reading_time)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Avg {formatDuration(analytics.overview.total_reading_time / Math.max(analytics.overview.total_sessions, 1))} per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
              <Target className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.overview.completion_rate}%
            </div>
            <Progress value={analytics.overview.completion_rate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Engagement Score</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analytics.overview.engagement_score}%
            </div>
            <Progress value={analytics.overview.engagement_score} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reading Sessions</CardTitle>
          <CardDescription>
            Detailed breakdown of the last 10 reading sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.recent_sessions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No reading sessions found</p>
            ) : (
              analytics.recent_sessions.map((session, index) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-forest-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Session #{analytics.recent_sessions.length - index}</p>
                      <p className="text-sm text-gray-500">{formatDate(session.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Timer className="w-3 h-3" />
                        {formatDuration(session.duration)}
                      </div>
                      <p className="text-xs text-gray-500">Duration</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Eye className="w-3 h-3" />
                        {session.pages_read}
                      </div>
                      <p className="text-xs text-gray-500">Pages</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-600">
                        <CheckCircle className="w-3 h-3" />
                        {session.completion_rate}%
                      </div>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Page Engagement</CardTitle>
            <CardDescription>
              Time spent and interaction patterns per page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.page_analytics.slice(0, 10).map((page) => (
                <div key={page.page_number} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Page {page.page_number}</p>
                    {page.chapter_name && (
                      <p className="text-sm text-gray-500">{page.chapter_name}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {Math.round(page.average_time / 60)}m
                      </div>
                      <p className="text-xs text-gray-500">Avg time</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MousePointer className="w-3 h-3" />
                        {page.interaction_density}
                      </div>
                      <p className="text-xs text-gray-500">Interactions</p>
                    </div>
                    
                    <div className="text-center">
                      <Progress value={page.completion_rate} className="w-12 h-2" />
                      <p className="text-xs text-gray-500 mt-1">{page.completion_rate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Behavior Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Behavioral Insights</CardTitle>
            <CardDescription>
              AI-powered reading pattern analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reading Patterns */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Reading Patterns
              </h4>
              <div className="space-y-2">
                {analytics.behavior_insights.reading_patterns.map((pattern, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Activity className="w-3 h-3 text-forest-500" />
                    <span className="text-gray-600">{pattern}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Engagement Trends */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Recent Engagement
              </h4>
              <div className="space-y-2">
                {analytics.behavior_insights.engagement_trends.slice(0, 5).map((trend) => (
                  <div key={trend.date} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.min(trend.score, 100)} className="w-16 h-2" />
                      <span className="text-gray-900 font-medium w-8">{trend.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Recommendations
              </h4>
              <div className="space-y-2">
                {analytics.behavior_insights.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}