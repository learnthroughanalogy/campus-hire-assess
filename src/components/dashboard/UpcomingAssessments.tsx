
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

interface AssessmentItem {
  id: number;
  title: string;
  date: string;
  status: string;
}

interface UpcomingAssessmentsProps {
  assessments: AssessmentItem[];
  isHR?: boolean;
}

const UpcomingAssessments: React.FC<UpcomingAssessmentsProps> = ({ 
  assessments, 
  isHR = false 
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
        <CardDescription>
          {isHR ? 'Manage and monitor scheduled assessments' : 'Your scheduled tests and deadlines'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {assessments.length > 0 ? (
          <div className="space-y-4">
            {assessments.map((assessment) => (
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
                  onClick={() => navigate(isHR ? `/assessments/${assessment.id}` : `/my-assessments/${assessment.id}`)}
                >
                  {isHR ? 'View Details' : (assessment.status === 'scheduled' ? 'Details' : 'Start')}
                </Button>
              </div>
            ))}
            {isHR && (
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => navigate('/assessments/create')}
              >
                Create New Assessment
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">No upcoming assessments scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAssessments;
