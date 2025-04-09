
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
import Index from "./pages/Index";

// HR/Recruiter Pages
import StudentManagement from "./pages/hr/StudentManagement";
import AssessmentManagement from "./pages/hr/AssessmentManagement";
import ResultsDashboard from "./pages/hr/ResultsDashboard";
import CreateAssessment from "./pages/hr/CreateAssessment";
import ImportQuestions from "./pages/hr/ImportQuestions";
import AssessmentDetails from "./pages/hr/AssessmentDetails";

// Candidate/Student Pages
import MyAssessments from "./pages/student/MyAssessments";
import MyResults from "./pages/student/MyResults";
import TakeAssessment from "./pages/student/TakeAssessment";

// Shared Pages
import UserProfile from "./pages/shared/UserProfile";

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
            <Route path="/index" element={<Index />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - Recruiter only */}
            <Route path="/students" element={
              <ProtectedRoute allowedRoles={['administrator', 'recruiter', 'university_spoc']}>
                <StudentManagement />
              </ProtectedRoute>
            } />
            <Route path="/assessments" element={
              <ProtectedRoute allowedRoles={['administrator', 'recruiter', 'sme']}>
                <AssessmentManagement />
              </ProtectedRoute>
            } />
            <Route path="/assessments/create" element={
              <ProtectedRoute allowedRoles={['administrator', 'recruiter', 'sme']}>
                <CreateAssessment />
              </ProtectedRoute>
            } />
            <Route path="/assessments/import" element={
              <ProtectedRoute allowedRoles={['administrator', 'recruiter', 'sme']}>
                <ImportQuestions />
              </ProtectedRoute>
            } />
            <Route path="/assessments/:id" element={
              <ProtectedRoute allowedRoles={['administrator', 'recruiter', 'sme']}>
                <AssessmentDetails />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute allowedRoles={['administrator', 'recruiter']}>
                <ResultsDashboard />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - Candidate only */}
            <Route path="/my-assessments" element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <MyAssessments />
              </ProtectedRoute>
            } />
            <Route path="/my-assessments/:id" element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <TakeAssessment />
              </ProtectedRoute>
            } />
            <Route path="/my-results" element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <MyResults />
              </ProtectedRoute>
            } />
            
            {/* Shared protected routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
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
