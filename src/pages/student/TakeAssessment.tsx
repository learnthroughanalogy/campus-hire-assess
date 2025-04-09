
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle, Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SystemCheckDialog from '@/components/assessment/SystemCheckDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Mock assessment with sections and questions
const mockAssessment = {
  id: '1',
  title: 'Data Structures & Algorithms',
  totalTime: 90, // minutes
  sections: [
    {
      id: '1',
      name: 'Algorithms',
      timeLimit: 30, // minutes
      questions: [
        {
          id: '1',
          text: 'What is the time complexity of binary search?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 1
        },
        {
          id: '2',
          text: 'Which sorting algorithm has the best average-case time complexity?',
          options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Quick Sort'],
          correctAnswer: 3
        },
        {
          id: '3',
          text: 'What data structure is used for implementing priority queue?',
          options: ['Stack', 'Queue', 'Linked List', 'Heap'],
          correctAnswer: 3
        }
      ]
    },
    {
      id: '2',
      name: 'Data Structures',
      timeLimit: 30,
      questions: [
        {
          id: '4',
          text: 'Which data structure follows First In First Out (FIFO) principle?',
          options: ['Stack', 'Queue', 'Tree', 'Graph'],
          correctAnswer: 1
        },
        {
          id: '5',
          text: 'What is the worst-case time complexity for search operation in a balanced binary search tree?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: '3',
      name: 'Problem Solving',
      timeLimit: 30,
      questions: [
        {
          id: '6',
          text: 'Given an array of integers, how would you find the two numbers that add up to a specific target?',
          options: [
            'Brute force with two loops',
            'Sort and use two pointers',
            'Use a hash map to track seen values',
            'All of the above approaches would work'
          ],
          correctAnswer: 3
        },
        {
          id: '7',
          text: 'Which approach is most efficient for detecting a cycle in a linked list?',
          options: [
            'Use a hash set to track visited nodes',
            'Floyd\'s cycle-finding algorithm (tortoise and hare)',
            'Mark visited nodes',
            'Check all paths recursively'
          ],
          correctAnswer: 1
        }
      ]
    }
  ]
};

const TakeAssessment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // System check and proctoring states
  const [showSystemCheck, setShowSystemCheck] = useState(true);
  const [studentImage, setStudentImage] = useState<string | undefined>();
  const [videoAllowed, setVideoAllowed] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  
  // Assessment states
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(mockAssessment.totalTime * 60); // in seconds
  const [sectionTimeLeft, setSectionTimeLeft] = useState(mockAssessment.sections[0].timeLimit * 60);
  const [warningCount, setWarningCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  
  // Timer for the overall assessment
  useEffect(() => {
    if (!assessmentStarted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [assessmentStarted]);
  
  // Timer for the current section
  useEffect(() => {
    if (!assessmentStarted) return;
    
    const sectionTimer = setInterval(() => {
      setSectionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(sectionTimer);
          // Move to next section if time's up
          if (currentSection < mockAssessment.sections.length - 1) {
            setCurrentSection(currentSection + 1);
            setCurrentQuestion(0);
            setSectionTimeLeft(mockAssessment.sections[currentSection + 1].timeLimit * 60);
            toast({
              title: "Section time's up!",
              description: `Moving to the next section: ${mockAssessment.sections[currentSection + 1].name}`,
            });
          } else {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(sectionTimer);
  }, [currentSection, assessmentStarted]);
  
  // Handle window blur events for proctoring
  useEffect(() => {
    if (!assessmentStarted) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSuspiciousActivity('You left the test window');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [assessmentStarted]);
  
  // Detect multiple screen detection (if available in browser)
  useEffect(() => {
    if (!assessmentStarted || !videoAllowed) return;
    
    // This is a simplified version - in a real app, this would be more sophisticated
    const detectMultipleScreens = () => {
      if (window.screen && window.screen.availWidth > window.innerWidth * 1.5) {
        handleSuspiciousActivity('Multiple screens detected');
      }
    };
    
    const interval = setInterval(detectMultipleScreens, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [assessmentStarted, videoAllowed]);
  
  // Handle suspicious activity detection
  const handleSuspiciousActivity = (reason: string) => {
    const newCount = warningCount + 1;
    setWarningCount(newCount);
    setWarningMessage(reason);
    setShowWarningDialog(true);
    
    if (newCount >= 3) {
      toast({
        title: "Assessment terminated",
        description: "Your test has been terminated due to multiple violations.",
        variant: "destructive"
      });
      setTimeout(() => navigate('/my-assessments'), 2000);
    }
  };
  
  const section = mockAssessment.sections[currentSection];
  const question = section?.questions[currentQuestion];
  
  // Format time as mm:ss
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // System check completion handler
  const handleSystemCheckComplete = (success: boolean, capturedImage?: string) => {
    if (success) {
      setStudentImage(capturedImage);
      setShowSystemCheck(false);
      setAssessmentStarted(true);
      setVideoAllowed(true);
      
      toast({
        title: "Assessment started",
        description: "Your system check is complete. You can now begin the assessment.",
      });
    } else {
      navigate('/my-assessments');
    }
  };
  
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };
  
  const navigateToNextQuestion = () => {
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < mockAssessment.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
      setSectionTimeLeft(mockAssessment.sections[currentSection + 1].timeLimit * 60);
    }
  };
  
  const navigateToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      const prevSection = mockAssessment.sections[currentSection - 1];
      setCurrentQuestion(prevSection.questions.length - 1);
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call to submit answers
    setTimeout(() => {
      toast({
        title: "Assessment submitted",
        description: "Your answers have been recorded successfully.",
      });
      navigate('/my-results');
    }, 1500);
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    let totalQuestions = 0;
    let completedQuestions = 0;
    
    mockAssessment.sections.forEach((sect, sIdx) => {
      totalQuestions += sect.questions.length;
      
      if (sIdx < currentSection) {
        // All questions in previous sections are considered completed
        completedQuestions += sect.questions.length;
      } else if (sIdx === currentSection) {
        // Count completed questions in current section
        sect.questions.forEach((q) => {
          if (userAnswers[q.id] !== undefined) {
            completedQuestions++;
          }
        });
      }
    });
    
    return (completedQuestions / totalQuestions) * 100;
  };
  
  // Calculate question index (overall)
  const getQuestionIndex = () => {
    let questionIndex = currentQuestion;
    
    for (let i = 0; i < currentSection; i++) {
      questionIndex += mockAssessment.sections[i].questions.length;
    }
    
    return questionIndex + 1;
  };
  
  const getTotalQuestions = () => {
    return mockAssessment.sections.reduce((sum, section) => sum + section.questions.length, 0);
  };

  if (showSystemCheck) {
    return (
      <SystemCheckDialog 
        open={showSystemCheck} 
        onOpenChange={setShowSystemCheck} 
        onComplete={handleSystemCheckComplete}
      />
    );
  }

  if (isSubmitting) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Submitting your assessment...</h2>
          <p className="text-muted-foreground mb-6">Please wait while we process your answers.</p>
          <div className="w-24 h-24 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Warning Dialog */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center text-red-600">
                <AlertCircle className="mr-2 h-5 w-5" />
                Warning: Suspicious Activity
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {warningMessage}. This incident has been recorded.
              <div className="mt-2 font-semibold">Warning {warningCount} of 3</div>
              <div className="text-sm text-muted-foreground mt-1">
                Your assessment will be terminated after 3 warnings.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              I understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <header className="bg-emerald-600 text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg">{mockAssessment.title}</h1>
            <p className="text-sm text-emerald-100">Section: {section?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xs">Section Time</span>
              <span className="font-mono font-semibold">
                <Clock className="inline h-4 w-4 mr-1" />
                {formatTime(sectionTimeLeft)}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs">Total Time</span>
              <span className="font-mono font-semibold">
                <Clock className="inline h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Progress value={calculateProgress()} className="h-2" />
        </div>
      </header>

      <div className="flex-1 container mx-auto py-6 px-4 md:px-6 overflow-y-auto">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Question {getQuestionIndex()} of {getTotalQuestions()}</CardTitle>
                <CardDescription>{section?.name}</CardDescription>
              </div>
              {warningCount > 0 && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Warning: {warningCount}/3</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{question?.text}</h3>
              <RadioGroup 
                value={userAnswers[question?.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(question?.id, parseInt(value))}
              >
                <div className="space-y-3">
                  {question?.options.map((option, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50"
                    >
                      <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                      <Label className="flex-1 cursor-pointer" htmlFor={`option-${idx}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button
              variant="outline"
              onClick={navigateToPrevQuestion}
              disabled={currentSection === 0 && currentQuestion === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="flex gap-2">
              {(currentSection === mockAssessment.sections.length - 1 && 
                currentQuestion === section.questions.length - 1) ? (
                <Button onClick={handleSubmit}>
                  Submit Assessment
                </Button>
              ) : (
                <Button onClick={navigateToNextQuestion}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <Flag className="inline h-4 w-4 mr-1" />
            Proctor monitoring active • Do not leave this window
          </div>
          <Button 
            variant="outline" 
            onClick={handleSubmit}
          >
            Save & Exit
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default TakeAssessment;
