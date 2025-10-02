/**
 * Admin Settings Page
 * 
 * Configuration panel for:
 * - Token expiration settings
 * - System preferences
 * - Security settings
 * - Email configuration
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Shield, 
  Mail, 
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { client } from "@/lib/api";
import { toast } from "sonner";

interface SystemSettings {
  authTokenExpiry: number; // days
  bookAccessTokenExpiry: number; // days (0 = no expiration)
  maxLoginAttempts: number;
  passwordResetExpiry: number; // hours
  enableEmailNotifications: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    authTokenExpiry: 7,
    bookAccessTokenExpiry: 0, // No expiration by default
    maxLoginAttempts: 5,
    passwordResetExpiry: 1,
    enableEmailNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await client.api.admin.settings.$get({}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Settings load error:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await client.api.admin.settings.$post({
        json: { settings }
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setLastSaved(new Date().toLocaleString());
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Settings save error:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      authTokenExpiry: 7,
      bookAccessTokenExpiry: 0,
      maxLoginAttempts: 5,
      passwordResetExpiry: 1,
      enableEmailNotifications: true
    });
    toast.info("Settings reset to defaults");
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
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
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure platform behavior and security</p>
        </div>
        
        <div className="flex items-center gap-3">
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Last saved: {lastSaved}
            </div>
          )}
          
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* Token Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Token Expiration Settings
          </CardTitle>
          <CardDescription>
            Configure how long tokens remain valid before users need to re-authenticate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="authTokenExpiry">User Login Token Expiry</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="authTokenExpiry"
                  type="number"
                  min="1"
                  max="30"
                  value={settings.authTokenExpiry}
                  onChange={(e) => updateSetting('authTokenExpiry', parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
              <p className="text-xs text-gray-500">
                How long users stay logged in (recommended: 7 days)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookAccessTokenExpiry">Book Access Token Expiry</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bookAccessTokenExpiry"
                  type="number"
                  min="0"
                  max="365"
                  value={settings.bookAccessTokenExpiry}
                  onChange={(e) => updateSetting('bookAccessTokenExpiry', parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-500">days</span>
                {settings.bookAccessTokenExpiry === 0 && (
                  <Badge variant="secondary">No Expiration</Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                How long book access lasts (0 = never expires, recommended for reading)
              </p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Book Access Token Recommendation</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Setting book access tokens to "0 days" (no expiration) is recommended because users may take weeks to read a book. 
                  Once they have legitimate access, it shouldn't expire arbitrarily.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure authentication and password security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-500">attempts</span>
              </div>
              <p className="text-xs text-gray-500">
                Account locks after this many failed login attempts
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordResetExpiry">Password Reset Token Expiry</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="passwordResetExpiry"
                  type="number"
                  min="1"
                  max="24"
                  value={settings.passwordResetExpiry}
                  onChange={(e) => updateSetting('passwordResetExpiry', parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-gray-500">hours</span>
              </div>
              <p className="text-xs text-gray-500">
                How long password reset links remain valid
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            System Preferences
          </CardTitle>
          <CardDescription>
            General platform configuration options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableEmailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">Send system emails for password resets and important updates</p>
              </div>
              <Button
                variant={settings.enableEmailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting('enableEmailNotifications', !settings.enableEmailNotifications)}
              >
                {settings.enableEmailNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}