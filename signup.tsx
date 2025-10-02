import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, BookOpen, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

/**
 * Signup Page
 * 
 * Provides user registration with:
 * - Name, email, and password validation
 * - Password strength requirements
 * - Error handling and user feedback
 * - Automatic login after successful registration
 * - Beautiful, brand-consistent design
 * - Information about free book access
 */

export default function Signup() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    setIsSubmitting(true);

    const result = await register(formData.name.trim(), formData.email, formData.password);

    if (result.success) {
      toast.success("Welcome to Brave Things Books!");
      navigate("/library");
    } else {
      setError(result.error || "Registration failed. Please try again.");
      toast.error(result.error || "Registration failed");
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
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-golden-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-coral-200 rounded-full opacity-20 blur-3xl" />
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
              Join Brave Things Books
            </CardTitle>
            <CardDescription className="text-forest-600">
              Create your account and start your reading adventure
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Free access notice */}
            <div className="mb-6 p-4 bg-golden-50 border border-golden-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-golden-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-golden-800 mb-1">
                    Free Access Included!
                  </h4>
                  <p className="text-sm text-golden-700">
                    Get instant access to "Where the Brave Things Grow" when you create your account.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-coral-200 bg-coral-50">
                  <AlertDescription className="text-coral-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-forest-700 font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="border-forest-200 focus:border-forest-400 focus:ring-forest-400"
                />
              </div>

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
                  placeholder="At least 6 characters"
                  required
                  className="border-forest-200 focus:border-forest-400 focus:ring-forest-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-forest-700 font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-forest-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-forest-700  font-medium underline"
                >
                  Sign in here
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
            Start building your personal library today
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
