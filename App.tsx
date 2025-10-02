import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AdminGuard } from "@/components/auth/admin-guard";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import { initializeTrackingWithAuth, stopPlatformTracking } from "@/lib/platform-tracking";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

// Public pages
import Homepage from "./pages/homepage";
import Catalog from "./pages/catalog";
import Features from "./pages/features";
import About from "./pages/about";
import Feedback from "./pages/feedback";
import NotFound from "./pages/404";

// Auth pages
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";
import PasswordRecovery from "./pages/auth/password-recovery";

// Protected pages
import Library from "./pages/dashboard/library";

// Admin pages
import { AdminLayout } from "./components/admin/admin-layout";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminSettings from "./pages/admin/admin-settings";
import AdminUsers from "./pages/admin/admin-users";
import UserAnalytics from "./pages/admin/user-analytics";

// Demo pages  
import BookPreview from "./pages/book-preview";

// Book pages
import WTBTGBook from "./pages/book/wtbtg";
import Introduction from "./pages/book/introduction";
import Chapter1 from "./pages/book/chapter-1";
import Chapter2 from "./pages/book/chapter-2";
import Chapter3 from "./pages/book/chapter-3";
import Chapter4 from "./pages/book/chapter-4";
import Chapter5 from "./pages/book/chapter-5";
import Chapter6 from "./pages/book/chapter-6";
import Activity from "./pages/book/activity";
import Conclusion from "./pages/book/conclusion";
import References from "./pages/book/references";

const queryClient = new QueryClient();

// Layout component that conditionally shows footer
function AppLayout() {
  const location = useLocation();
  const { user, isAuthenticated, token } = useAuth();
  
  // Initialize tracking when user logs in
  useEffect(() => {
    if (isAuthenticated && user && token) {
      console.log('[App] User authenticated, initializing tracking');
      initializeTrackingWithAuth(token);
    }
    
    return () => {
      stopPlatformTracking();
    };
  }, [isAuthenticated, user, token]);
  
  // Don't show header/footer on book-specific pages
  const hideHeaderFooter = location.pathname === "/book-preview" || location.pathname.startsWith("/book/");
  
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/digibook" element={<BookPreview />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          
          {/* Protected routes */}
          <Route 
            path="/library" 
            element={
              <AuthGuard>
                <Library />
              </AuthGuard>
            } 
          />
          
          {/* Admin routes - protected */}
          <Route path="/admin" element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="user-analytics/:userId" element={<UserAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* Book routes - token-protected reading experience */}
          <Route path="/book/wtbtg" element={<WTBTGBook />} />
          <Route path="/book/introduction" element={<Introduction />} />
          <Route path="/book/chapter/1/story" element={<Chapter1 />} />
          <Route path="/book/chapter/2/story" element={<Chapter2 />} />
          <Route path="/book/chapter/3/story" element={<Chapter3 />} />
          <Route path="/book/chapter/4/story" element={<Chapter4 />} />
          <Route path="/book/chapter/5/story" element={<Chapter5 />} />
          <Route path="/book/chapter/6/story" element={<Chapter6 />} />
          <Route path="/book/chapter/:id/activity" element={<Activity />} />
          <Route path="/book/conclusion" element={<Conclusion />} />
          <Route path="/book/references" element={<References />} />
          
          {/* Hidden/Archive routes - keep catalog accessible but not in main nav */}
          <Route path="/catalog-full" element={<Catalog />} />
          <Route path="/book-preview" element={<BookPreview />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}

    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors />
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;