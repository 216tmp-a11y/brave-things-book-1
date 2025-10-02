import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { client } from "@/lib/api";


/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Handles user login/logout, token storage, and authentication persistence.
 * 
 * Features:
 * - Automatic token persistence in localStorage
 * - Token verification on app startup
 * - Global authentication state management
 * - Login/logout methods
 * - Loading states for authentication operations
 */

interface User {
  id: string;
  name: string;
  email: string;
  subscription_status: "free" | "premium";
  role: "user" | "admin" | "preview";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPreview: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * 
 * Wraps the application to provide authentication context.
 * Automatically verifies stored tokens on mount.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount and initialize debugging
  useEffect(() => {

    
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      verifyToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verify stored token with the server
   */
  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${tokenToVerify}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          setToken(tokenToVerify);
          localStorage.setItem("auth_token", tokenToVerify);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem("auth_token");
        }
      } else {
        // Token verification failed, remove it
        localStorage.removeItem("auth_token");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * User login function
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * User registration function
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success && data.token && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed" };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Network error. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * User logout function
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isPreview: user?.role === "preview",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 * 
 * Must be used within an AuthProvider component.
 * Provides access to authentication state and methods.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
