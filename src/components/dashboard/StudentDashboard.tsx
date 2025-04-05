
import React from 'react';
import StudentMetricsCards from './StudentMetricsCards';
import UpcomingAssessments from './UpcomingAssessments';
import StudentNotifications from './StudentNotifications';

interface AssessmentItem {
  id: number;
  title: string;
  date: string;
  status: string;
}

const StudentDashboard: React.FC = () => {
  // Mock data for student dashboard
  const upcomingAssessments = [
    { id: 1, title: 'Data Structures & Algorithms', date: '2025-04-10', status: 'scheduled' },
    { id: 2, title: 'Full Stack Development', date: '2025-04-15', status: 'scheduled' },
  ];

  const studentProgress = {
    assessmentsCompleted: 2,
    assessmentsRemaining: 3,
    highestScore: 92,
    averageScore: 88,
  };

  return (
    <>
      <StudentMetricsCards 
        assessmentsCompleted={studentProgress.assessmentsCompleted}
        assessmentsRemaining={studentProgress.assessmentsRemaining}
        highestScore={studentProgress.highestScore}
        averageScore={studentProgress.averageScore}
      />
      
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <UpcomingAssessments assessments={upcomingAssessments} />
        <StudentNotifications />
      </div>
    </>
  );
};

export default StudentDashboard;
