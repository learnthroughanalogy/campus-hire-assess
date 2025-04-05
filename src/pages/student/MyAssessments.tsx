
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data for assessments
const mockAssessments = [
  {
    id: '1',
    title: 'Data Structures & Algorithms',
    date: '2025-04-10',
    duration: 90,
    status: 'scheduled',
    sections: ['Algorithms', 'Data Structures', 'Problem Solving']
  },
  {
    id: '2',
    title: 'Full Stack Development',
    date: '2025-04-15',
    duration: 120,
    status: 'scheduled',
    sections: ['Frontend', 'Backend', 'Databases', 'APIs']
  },
  {
    id: '3',
    title: 'System Design',
    date: '2025-04-05',
    duration: 60,
    status: 'completed',
    score: 85,
    sections: ['Architecture', 'Scalability', 'Design Patterns']
  }
];

const MyAssessments: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleStartAssessment = (assessmentId: string) => {
    // In a real app, we'd check if the assessment is available to start
    const assessment = mockAssessments.find(a => a.id === assessmentId);
    if (assessment?.status === 'scheduled') {
      navigate(`/my-assessments/${assessmentId}`);
    } else {
      toast({
        title: "Cannot start assessment",
        description: "This assessment is not currently available to start.",
        variant: "destructive"
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assessments</h1>
          <p className="text-muted-foreground">
            View your scheduled and completed assessments
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assessments</CardTitle>
              <CardDescription>
                Scheduled tests that you need to complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockAssessments.filter(a => a.status === 'scheduled').length > 0 ? (
                <div className="space-y-5">
                  {mockAssessments
                    .filter(a => a.status === 'scheduled')
                    .map((assessment) => (
                      <div 
                        key={assessment.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-5"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium">{assessment.title}</h3>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(assessment.date).toLocaleDateString()} • {assessment.duration} minutes
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {assessment.sections.map(section => (
                              <span 
                                key={section} 
                                className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full"
                              >
                                {section}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button 
                          className="mt-3 md:mt-0"
                          onClick={() => handleStartAssessment(assessment.id)}
                        >
                          Start Assessment
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-sm font-medium">No upcoming assessments</h3>
                  <p className="text-sm text-muted-foreground">
                    You don't have any scheduled assessments at the moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Assessments</CardTitle>
              <CardDescription>
                Your assessment history and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mockAssessments.filter(a => a.status === 'completed').length > 0 ? (
                <div className="space-y-5">
                  {mockAssessments
                    .filter(a => a.status === 'completed')
                    .map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-5"
                      >
                        <div className="space-y-1">
                          <h3 className="font-medium">{assessment.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            Completed on {new Date(assessment.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Score: {assessment.score}%</span>
                            {assessment.score >= 70 ? (
                              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                                Passed
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                Failed
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          className="mt-3 md:mt-0"
                          onClick={() => navigate(`/my-results?id=${assessment.id}`)}
                        >
                          View Results
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-sm font-medium">No completed assessments</h3>
                  <p className="text-sm text-muted-foreground">
                    You haven't completed any assessments yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default MyAssessments;
