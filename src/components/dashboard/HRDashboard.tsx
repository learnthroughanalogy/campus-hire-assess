
import React from 'react';
import HRMetricsCards from './HRMetricsCards';
import UpcomingAssessments from './UpcomingAssessments';
import HRQuickActions from './HRQuickActions';

interface AssessmentItem {
  id: number;
  title: string;
  date: string;
  status: string;
}

const HRDashboard: React.FC = () => {
  // Mock data for HR dashboard
  const upcomingAssessments = [
    { id: 1, title: 'Data Structures & Algorithms', date: '2025-04-10', status: 'scheduled' },
    { id: 2, title: 'Full Stack Development', date: '2025-04-15', status: 'scheduled' },
  ];

  const studentMetrics = {
    totalStudents: 248,
    assessmentsScheduled: 4,
    assessmentsCompleted: 2,
    averageScore: 82.5,
  };

  return (
    <>
      <HRMetricsCards 
        totalStudents={studentMetrics.totalStudents}
        assessmentsScheduled={studentMetrics.assessmentsScheduled}
        assessmentsCompleted={studentMetrics.assessmentsCompleted}
        averageScore={studentMetrics.averageScore}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <div className="col-span-2">
          <UpcomingAssessments assessments={upcomingAssessments} isHR={true} />
        </div>
        <div>
          <HRQuickActions />
        </div>
      </div>
    </>
  );
};

export default HRDashboard;
