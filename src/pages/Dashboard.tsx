
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import HRDashboard from '@/components/dashboard/HRDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

const Dashboard: React.FC = () => {
  const { user, isHR, isStudent } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}!
          </p>
        </div>

        {isHR && <HRDashboard />}
        
        {isStudent && <StudentDashboard />}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
