
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Book, CheckCircle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isHR, isStudent } = useAuth();
  const navigate = useNavigate();

  // Mock data for dashboard
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

  const studentProgress = {
    assessmentsCompleted: 2,
    assessmentsRemaining: 3,
    highestScore: 92,
    averageScore: 88,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}!
          </p>
        </div>

        {isHR && (
          <>
            {/* HR Dashboard */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-emerald-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentMetrics.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">
                    +12 from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Scheduled Assessments
                  </CardTitle>
                  <Book className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentMetrics.assessmentsScheduled}</div>
                  <p className="text-xs text-muted-foreground">
                    Next one on April 10, 2025
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Assessments
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentMetrics.assessmentsCompleted}</div>
                  <p className="text-xs text-muted-foreground">
                    Latest: System Design
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-emerald-600"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentMetrics.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% from last batch
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Assessments</CardTitle>
                  <CardDescription>
                    Manage and monitor scheduled assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAssessments.map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <p className="font-medium">{assessment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Scheduled: {new Date(assessment.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" onClick={() => navigate(`/assessments/${assessment.id}`)}>
                          View Details
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full mt-4" 
                      onClick={() => navigate('/assessments/create')}
                    >
                      Create New Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks for HR administrators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => navigate('/students')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Manage Students
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/assessments')}
                    >
                      <Book className="mr-2 h-4 w-4" />
                      Manage Assessments
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/results')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="mr-2 h-4 w-4"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                      View Results
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/assessments/import')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M21 15V6m0 0H2M2 6l10 8m9-8-3-4m3 12-10 8L2 16" />
                      </svg>
                      Import Questions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {isStudent && (
          <>
            {/* Student Dashboard */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Assessments
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentProgress.assessmentsCompleted}/{studentProgress.assessmentsCompleted + studentProgress.assessmentsRemaining}</div>
                  <Progress 
                    value={(studentProgress.assessmentsCompleted / (studentProgress.assessmentsCompleted + studentProgress.assessmentsRemaining)) * 100} 
                    className="h-2 mt-2"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Highest Score
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-emerald-600"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentProgress.highestScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    In Python Programming
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Score
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-emerald-600"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentProgress.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    Across all assessments
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Assessments</CardTitle>
                  <CardDescription>
                    Your scheduled tests and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAssessments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAssessments.map((assessment) => (
                        <div key={assessment.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">{assessment.title}</p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {new Date(assessment.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant={assessment.status === 'scheduled' ? 'outline' : 'default'} 
                            onClick={() => navigate(`/my-assessments/${assessment.id}`)}
                          >
                            {assessment.status === 'scheduled' ? 'Details' : 'Start'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                      <p className="text-muted-foreground">No upcoming assessments scheduled</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                  <CardDescription>
                    Updates and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Please verify your profile information before taking your next assessment.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-emerald-700">
                            Your Data Structures & Algorithms assessment is scheduled for April 10, 2025.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => navigate('/profile')}
                    >
                      Review Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
