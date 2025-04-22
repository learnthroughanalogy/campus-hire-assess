
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import HRDashboard from '@/components/dashboard/HRDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

const Dashboard: React.FC = () => {
  const { profile, isAdministrator, isRecruiter, isCandidate, isSME, isUniversitySPOC } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.name || 'User'}! {profile?.role && `(${profile.role.replace('_', ' ')})`}
          </p>
        </div>

        {(isAdministrator || isRecruiter) && <HRDashboard />}
        
        {isCandidate && <StudentDashboard />}

        {(isSME || isUniversitySPOC) && (
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="col-span-2 p-6 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4">
                {isSME ? 'Subject Matter Expert Dashboard' : 'University SPOC Dashboard'}
              </h2>
              <p className="text-gray-500 mb-4">
                {isSME 
                  ? 'Welcome to your SME dashboard. Here you can manage questions and contribute to assessments.'
                  : 'Welcome to your University SPOC dashboard. Here you can manage candidate data and view assessment schedules.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-emerald-700 mb-2">
                    {isSME ? 'Question Bank' : 'Candidate Management'}
                  </h3>
                  <p className="text-sm text-emerald-600">
                    {isSME 
                      ? 'You have contributed 24 questions to the platform so far.'
                      : 'You have 156 candidates registered in the system.'}
                  </p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-emerald-700 mb-2">
                    {isSME ? 'Review Requests' : 'Upcoming Assessments'}
                  </h3>
                  <p className="text-sm text-emerald-600">
                    {isSME 
                      ? 'You have 3 pending review requests.'
                      : 'There are 2 assessments scheduled for next week.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
