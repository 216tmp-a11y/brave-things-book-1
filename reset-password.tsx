import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, KeyRound, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { client } from "@/lib/api";

/**
 * Reset Password Page
 * 
 * Allows users to reset their password using a token from their email.
 * Features:
 * - Token validation on page load
 * - Password strength requirements
 * - Confirm password matching
 * - Error handling for invalid/expired tokens
 * - Success state with login redirect
 * - Professional design matching the brand
 */

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setIsValidatingToken(false);
        return;
      }

      try {
        const response = await client.api.auth["verify-reset-token"].$get({
          query: { token }
        });

        const data = await response.json();
        setIsTokenValid(data.valid);
        
        if (!data.valid) {
          setError(data.error || "Invalid or expired reset token");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
        setError("Failed to validate reset token");
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("No reset token provided");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await client.api.auth["reset-password"].$post({
        json: {
          token,
          newPassword: password
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        toast.success("Password reset successfully!");
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login", {
            state: { message: "Your password has been reset. Please log in with your new password." }
          });
        }, 3000);
      } else {
        const errorData = await response.json();
        const errorMessage = ('error' in errorData && errorData.error) || "Failed to reset password. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Failed to reset password. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-forest-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-2 border-forest-100 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-forest-600" />
            <p className="text-forest-700 font-medium">Validating reset token...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-forest-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
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
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center"
            >
              {!isTokenValid ? (
                <AlertTriangle className="w-8 h-8 text-coral-600" />
              ) : isSuccess ? (
                <CheckCircle className="w-8 h-8 text-forest-600" />
              ) : (
                <KeyRound className="w-8 h-8 text-forest-600" />
              )}
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-bold text-forest-800">
                {!isTokenValid
                  ? "Invalid Reset Link"
                  : isSuccess
                  ? "Password Reset Successfully!"
                  : "Reset Your Password"}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {!isTokenValid
                  ? "This password reset link is invalid or has expired."
                  : isSuccess
                  ? "You can now log in with your new password."
                  : "Enter your new password below."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isTokenValid ? (
              /* Invalid Token State */
              <div className="space-y-4">
                <Alert className="border-coral-200 bg-coral-50">
                  <AlertTriangle className="w-4 h-4 text-coral-600" />
                  <AlertDescription className="text-coral-700">
                    {error || "This reset link is invalid or has expired. Please request a new password reset."}
                  </AlertDescription>
                </Alert>

                <div className="text-center space-y-3">
                  <Button asChild className="bg-forest-600 bg-forest-700 text-white">
                    <Link to="/forgot-password">
                      Request New Reset Link
                    </Link>
                  </Button>
                </div>
              </div>
            ) : isSuccess ? (
              /* Success State */
              <div className="space-y-4">
                <Alert className="border-forest-200 bg-forest-50">
                  <CheckCircle className="w-4 h-4 text-forest-600" />
                  <AlertDescription className="text-forest-700">
                    Your password has been successfully reset. You will be redirected to the login page in a few seconds.
                  </AlertDescription>
                </Alert>

                <div className="text-center">
                  <Button asChild className="bg-forest-600 bg-forest-700 text-white">
                    <Link to="/login">
                      Go to Login
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              /* Password Reset Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-forest-700 font-medium">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="border-forest-200 focus:border-forest-500 focus:ring-forest-500"
                  />
                  <p className="text-xs text-gray-600">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-forest-700 font-medium">
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
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
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-forest-600 bg-forest-700 text-white font-medium py-2.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Footer Links */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-forest-600  font-medium underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
