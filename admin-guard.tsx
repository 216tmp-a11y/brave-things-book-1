import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, ShieldAlert } from "lucide-react";

/**
 * Admin Guard Component
 *
 * Protects routes that require admin privileges.
 * Redirects non-admin users to home page.
 * Shows loading state while checking authentication and admin status.
 *
 * Usage:
 * <AdminGuard>
 *   <AdminComponent />
 * </AdminGuard>
 */

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-forest-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-forest-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-lg">Checking admin access...</p>
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

  // Show access denied for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-forest-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ShieldAlert className="w-16 h-16 mx-auto mb-6 text-coral-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel. 
            Only administrators can view this content.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-forest-500 text-white rounded-lg hover:bg-forest-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin, render protected content
  return <>{children}</>;
}
