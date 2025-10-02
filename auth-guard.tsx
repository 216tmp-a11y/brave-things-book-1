import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

/**
 * Auth Guard Component
 * 
 * Protects routes that require authentication.
 * Redirects unauthenticated users to login page.
 * Preserves intended destination for post-login redirect.
 * 
 * Usage:
 * <AuthGuard>
 *   <ProtectedComponent />
 * </AuthGuard>
 */

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-forest-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-forest-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}
