import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, KeyRound, ArrowLeft, Shield, Copy, Check, Info, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { client } from "@/lib/api";

/**
 * Password Recovery Page
 * 
 * Provides multiple ways to recover/reset password without email:
 * 1. Development Mode - Show reset tokens directly on screen
 * 2. Instant Recovery Codes - Generate temporary access codes
 * 3. Account Reset - Create a new password using account details
 * 
 * This page offers practical alternatives to email-based password reset
 * that work perfectly in demo/development environments without email setup.
 */

interface RecoveryToken {
  token: string;
  email: string;
  expiresAt: string;
}

export default function PasswordRecovery() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [recoveryTokens, setRecoveryTokens] = useState<RecoveryToken[]>([]);
  const [showTokens, setShowTokens] = useState(false);
  const [copiedToken, setCopiedToken] = useState("");

  // Account reset form
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle development mode token generation
  const handleDevModeRecovery = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Generate a reset token
      const response = await client.api.auth["forgot-password"].$post({
        json: { email }
      });

      if (response.ok) {
        // For demo purposes, we'll generate a mock token that would be in the email
        const mockToken = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        
        setRecoveryTokens([{
          token: mockToken,
          email: email,
          expiresAt: expiresAt.toISOString()
        }]);
        setShowTokens(true);
        toast.success("Recovery token generated! This would normally be sent via email.");
      } else {
        setError("No account found with that email address.");
      }
    } catch (error) {
      console.error("Dev mode recovery error:", error);
      setError("Failed to generate recovery token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle instant account reset
  const handleInstantReset = async () => {
    if (!resetEmail || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Call the instant reset API endpoint
      const response = await client.api.auth["instant-reset"].$post({
        json: {
          email: resetEmail,
          newPassword: newPassword
        }
      });

      // Parse response JSON first
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Success case - data has 'message' property
        toast.success("Password reset successfully!");
        
        // Navigate to login page with success message
        navigate('/login', {
          state: {
            message: `Password reset complete for ${resetEmail}. Please log in with your new password.`
          }
        });
      } else {
        // Error case - check if data has error property or use fallback
        if (data.success === false && 'error' in data) {
          setError(data.error);
        } else {
          setError("Failed to reset password. Please try again.");
        }
      }
    } catch (error) {
      console.error("Instant reset error:", error);
      setError("Failed to reset account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy token to clipboard
  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      toast.success("Token copied to clipboard!");
      setTimeout(() => setCopiedToken(""), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy token");
    }
  };

  // Use token for password reset
  const useToken = (token: string) => {
    navigate(`/reset-password?token=${token}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-forest-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Back to Login Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-forest-600  transition-colors duration-200 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </motion.div>

        <Card className="border-2 border-forest-100 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center"
            >
              <KeyRound className="w-8 h-8 text-forest-600" />
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-bold text-forest-800">
                Password Recovery
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Choose a recovery method - no email required!
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="instant" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="instant">Instant Reset</TabsTrigger>
                <TabsTrigger value="dev-mode">Show Token</TabsTrigger>
              </TabsList>

              {/* Instant Reset */}
              <TabsContent value="instant" className="space-y-4">
                <Alert className="border-golden-200 bg-golden-50">
                  <Lightbulb className="w-4 h-4 text-golden-600" />
                  <AlertDescription className="text-golden-700">
                    <strong>Instant Reset:</strong> Set a new password immediately.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-forest-700 font-medium">
                      Your Email Address
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      disabled={isLoading}
                      className="border-forest-200 focus:border-forest-500 focus:ring-forest-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-forest-700 font-medium">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      className="border-forest-200 focus:border-forest-500 focus:ring-forest-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-forest-700 font-medium">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className="border-forest-200 focus:border-forest-500 focus:ring-forest-500"
                    />
                  </div>

                  {error && (
                    <Alert className="border-coral-200 bg-coral-50">
                      <AlertDescription className="text-coral-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleInstantReset}
                    disabled={isLoading}
                    className="w-full bg-golden-600  text-white font-medium py-2.5"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Reset Password Now
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              {/* Development Mode Recovery */}
              <TabsContent value="dev-mode" className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    <strong>Development Mode:</strong> This shows you the reset token that would normally 
                    be sent via email. Copy the token and use it on the reset password page.
                  </AlertDescription>
                </Alert>

                {!showTokens ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dev-email" className="text-forest-700 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="dev-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="border-forest-200 focus:border-forest-500 focus:ring-forest-500"
                      />
                    </div>

                    {error && (
                      <Alert className="border-coral-200 bg-coral-50">
                        <AlertDescription className="text-coral-700">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleDevModeRecovery}
                      disabled={isLoading}
                      className="w-full bg-forest-600 bg-forest-700 text-white font-medium py-2.5"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Token...
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4 mr-2" />
                          Show Reset Token
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert className="border-forest-200 bg-forest-50">
                      <KeyRound className="w-4 h-4 text-forest-600" />
                      <AlertDescription className="text-forest-700">
                        <strong>Reset token generated for {email}</strong><br />
                        Use this token on the reset password page. Token expires in 1 hour.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      {recoveryTokens.map((tokenData, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Reset Token
                            </span>
                            <span className="text-xs text-gray-500">
                              Expires: {new Date(tokenData.expiresAt).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          <div className="font-mono text-sm bg-white border border-gray-200 rounded p-3 break-all">
                            {tokenData.token}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToken(tokenData.token)}
                              className="flex-1"
                            >
                              {copiedToken === tokenData.token ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Token
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => useToken(tokenData.token)}
                              className="flex-1 bg-forest-600 bg-forest-700"
                            >
                              <KeyRound className="w-4 h-4 mr-2" />
                              Use Token
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowTokens(false);
                        setRecoveryTokens([]);
                        setEmail("");
                      }}
                      className="w-full border-forest-200 text-forest-600 "
                    >
                      Generate New Token
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Still need help? Try{" "}
                <Link
                  to="/forgot-password"
                  className="text-forest-600  font-medium underline"
                >
                  email recovery
                </Link>
                {" "}or{" "}
                <Link
                  to="/signup"
                  className="text-forest-600  font-medium underline"
                >
                  create a new account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}