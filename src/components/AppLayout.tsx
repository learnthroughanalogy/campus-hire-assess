
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ClipboardList, 
  UserCircle, 
  LogOut, 
  BarChart3,
  Home,
  Users
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout, isRecruiter, isCandidate } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-emerald-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8" />
            <span className="text-xl font-bold">CampusHire</span>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-emerald-700"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Content area with sidebar if user is logged in */}
      {user ? (
        <div className="flex flex-1">
          <nav className="w-16 sm:w-64 bg-emerald-50 border-r border-emerald-100 shadow-sm">
            <div className="p-4">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-emerald-100"
                >
                  <Home className="w-5 h-5 text-emerald-700" />
                  <span className="hidden sm:inline text-emerald-900">Dashboard</span>
                </Link>
                
                {isRecruiter && (
                  <>
                    <Link
                      to="/students"
                      className="flex items-center space-x-2 p-3 rounded-md hover:bg-emerald-100"
                    >
                      <Users className="w-5 h-5 text-emerald-700" />
                      <span className="hidden sm:inline text-emerald-900">Students</span>
                    </Link>
                    <Link
                      to="/assessments"
                      className="flex items-center space-x-2 p-3 rounded-md hover:bg-emerald-100"
                    >
                      <ClipboardList className="w-5 h-5 text-emerald-700" />
                      <span className="hidden sm:inline text-emerald-900">Assessments</span>
                    </Link>
                    <Link
                      to="/results"
                      className="flex items-center space-x-2 p-3 rounded-md hover:bg-emerald-100"
                    >
                      <BarChart3 className="w-5 h-5 text-emerald-700" />
                      <span className="hidden sm:inline text-emerald-900">Results</span>
                    </Link>
                  </>
                )}
                
                {isCandidate && (
                  <>
                    <Link
                      to="/my-assessments"
                      className="flex items-center space-x-2 p-3 rounded-md hover:bg-emerald-100"
                    >
                      <ClipboardList className="w-5 h-5 text-emerald-700" />
                      <span className="hidden sm:inline text-emerald-900">My Assessments</span>
                    </Link>
                    <Link
                      to="/my-results"
                      className="flex items-center space-x-2 p-3 rounded-md hover:bg-emerald-100"
                    >
                      <BarChart3 className="w-5 h-5 text-emerald-700" />
                      <span className="hidden sm:inline text-emerald-900">My Results</span>
                    </Link>
                  </>
                )}
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-emerald-100"
                >
                  <UserCircle className="w-5 h-5 text-emerald-700" />
                  <span className="hidden sm:inline text-emerald-900">Profile</span>
                </Link>
              </div>
            </div>
          </nav>
          
          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      ) : (
        // Content without sidebar for non-authenticated users
        <main className="flex-1">
          {children}
        </main>
      )}
      
      {/* Footer */}
      <footer className="bg-emerald-50 border-t border-emerald-100 py-4">
        <div className="container mx-auto px-4 text-center text-emerald-700">
          <p>&copy; {new Date().getFullYear()} CampusHire Assessment Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
