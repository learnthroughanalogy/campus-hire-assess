
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, BarChart3 } from 'lucide-react';

// Mock data for completed assessments and their results
const mockResults = [
  {
    id: '3',
    title: 'System Design',
    date: '2025-04-05',
    duration: 60,
    score: 85,
    totalQuestions: 30,
    correctAnswers: 26,
    incorrectAnswers: 4,
    sections: [
      { name: 'Architecture', score: 90, totalQuestions: 10, correct: 9 },
      { name: 'Scalability', score: 80, totalQuestions: 10, correct: 8 },
      { name: 'Design Patterns', score: 83, totalQuestions: 10, correct: 8 },
    ]
  }
];

const MyResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const assessmentId = searchParams.get('id');
  
  // Find the selected assessment or default to the first one
  const selectedAssessment = assessmentId 
    ? mockResults.find(result => result.id === assessmentId) 
    : mockResults[0];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
          <p className="text-muted-foreground">
            View your assessment results and performance
          </p>
        </div>

        {selectedAssessment ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedAssessment.title}</CardTitle>
                <CardDescription>
                  Completed on {new Date(selectedAssessment.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 rounded-lg">
                    <div className="text-5xl font-bold text-emerald-600">
                      {selectedAssessment.score}%
                    </div>
                    <div className="mt-2 text-sm text-emerald-700">
                      Overall Score
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span>
                        {selectedAssessment.correctAnswers} Correct ({Math.round((selectedAssessment.correctAnswers / selectedAssessment.totalQuestions) * 100)}%)
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span>
                        {selectedAssessment.incorrectAnswers} Incorrect ({Math.round((selectedAssessment.incorrectAnswers / selectedAssessment.totalQuestions) * 100)}%)
                      </span>
                    </div>
                  </div>

                  {/* Section Scores */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Section Performance</h3>
                    <div className="space-y-4">
                      {selectedAssessment.sections.map(section => (
                        <div key={section.name} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{section.name}</div>
                            <div className="text-sm font-medium">
                              {section.score}% ({section.correct}/{section.totalQuestions})
                            </div>
                          </div>
                          <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full" 
                              style={{ width: `${section.score}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Statistics */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Time Statistics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">Total Time Allowed</div>
                        <div className="text-xl font-medium">{selectedAssessment.duration} minutes</div>
                      </div>
                      <div className="p-4 rounded-lg border">
                        <div className="text-sm text-muted-foreground">Time Taken</div>
                        <div className="text-xl font-medium">{selectedAssessment.duration - 15} minutes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground opacity-50" />
            <h2 className="mt-4 text-lg font-medium">No Results Found</h2>
            <p className="mt-2 text-sm text-center text-muted-foreground">
              We couldn't find any assessment results. Complete an assessment to view your results here.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyResults;
