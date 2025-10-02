import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BookOpen, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

/**
 * Login Page
 * 
 * Provides user authentication with:
 * - Email and password validation
 * - Error handling and user feedback
 * - Automatic redirect to intended page after login
 * - Beautiful, brand-consistent design
 * - Loading states during authentication
 */

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the intended destination from location state (for redirect after login)
  const from = location.state?.from?.pathname || "/library";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Login failed. Please try again.");
      toast.error(result.error || "Login failed");
    }

    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-forest-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-forest-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-forest-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-golden-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-forest-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to home button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            asChild
            className="text-forest-600  "
          >
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="border-forest-200 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-forest-100 rounded-full flex items-center justify-center"
            >
              <BookOpen className="w-8 h-8 text-forest-600" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-forest-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-forest-600">
              Sign in to continue your reading journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-coral-200 bg-coral-50">
                  <AlertDescription className="text-coral-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-forest-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  className="border-forest-200 focus:border-forest-400 focus:ring-forest-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-forest-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="border-forest-200 focus:border-forest-400 focus:ring-forest-400"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-forest-600  text-white py-6 text-lg font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4 text-center">
              <div className="space-y-2">
                <div>
                  <Link
                    to="/password-recovery"
                    className="text-forest-600  text-sm font-medium underline"
                  >
                    Forgot your password? (No email needed!)
                  </Link>
                </div>
                <div>
                  <Link
                    to="/forgot-password"
                    className="text-forest-500  text-xs underline"
                  >
                    Or try traditional email reset
                  </Link>
                </div>
              </div>
              <p className="text-forest-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-forest-700  font-medium underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-forest-500 text-sm">
            Access your personal library and reading progress
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
