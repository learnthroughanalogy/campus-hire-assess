
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Auth protection
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - HR only */}
            <Route path="/students" element={
              <ProtectedRoute allowedRoles={['hr']}>
                <div>Student Management (Coming Soon)</div>
              </ProtectedRoute>
            } />
            <Route path="/assessments" element={
              <ProtectedRoute allowedRoles={['hr']}>
                <div>Assessment Management (Coming Soon)</div>
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute allowedRoles={['hr']}>
                <div>Results Dashboard (Coming Soon)</div>
              </ProtectedRoute>
            } />
            
            {/* Protected routes - Student only */}
            <Route path="/my-assessments" element={
              <ProtectedRoute allowedRoles={['student']}>
                <div>My Assessments (Coming Soon)</div>
              </ProtectedRoute>
            } />
            <Route path="/my-results" element={
              <ProtectedRoute allowedRoles={['student']}>
                <div>My Results (Coming Soon)</div>
              </ProtectedRoute>
            } />
            
            {/* Shared protected routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <div>User Profile (Coming Soon)</div>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
