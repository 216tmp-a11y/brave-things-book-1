import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BookOpen, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { client } from "@/lib/api";

/**
 * Forgot Password Page
 * 
 * Allows users to request a password reset email.
 * Features:
 * - Email validation
 * - Clear success/error messaging
 * - Professional design matching the brand
 * - Links back to login
 * - Loading states during request
 */

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await client.api.auth["forgot-password"].$post({
        json: { email }
      });

      if (response.ok) {
        const data = await response.json();
        setIsSubmitted(true);
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        const errorData = await response.json();
        const errorMessage = ('error' in errorData && errorData.error) || "Failed to send reset email. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Failed to send reset email. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setEmail("");
    setError("");
  };

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
              {isSubmitted ? (
                <CheckCircle className="w-8 h-8 text-forest-600" />
              ) : (
                <Mail className="w-8 h-8 text-forest-600" />
              )}
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-bold text-forest-800">
                {isSubmitted ? "Check Your Email" : "Forgot Your Password?"}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {isSubmitted
                  ? "We've sent a password reset link to your email address."
                  : "Enter your email address and we'll send you a link to reset your password."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isSubmitted ? (
              /* Success State */
              <div className="space-y-4">
                <Alert className="border-forest-200 bg-forest-50">
                  <Mail className="w-4 h-4 text-forest-600" />
                  <AlertDescription className="text-forest-700">
                    We've sent a password reset link to <strong>{email}</strong>.
                    Click the link in the email to reset your password.
                  </AlertDescription>
                </Alert>

                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    Didn't receive the email? Check your spam folder or
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleTryAgain}
                    className="border-forest-200 text-forest-600 "
                  >
                    Try a different email
                  </Button>
                </div>
              </div>
            ) : (
              /* Email Input Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-forest-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
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
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-forest-600 bg-forest-700 text-white font-medium py-2.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reset Link
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
              <p className="text-sm text-gray-600 mt-2">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-forest-600  font-medium underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
