
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <div className="bg-red-100 p-3 rounded-full inline-block mb-4">
          <ShieldAlert className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact the administrator if you believe this is an error.
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
