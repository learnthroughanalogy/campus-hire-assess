import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  AlertCircle, Clock, ChevronLeft, ChevronRight, Flag, Camera, Eye, 
  Monitor, Shield, Maximize, Smartphone, Wifi, AlertTriangle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SystemCheckDialog from '@/components/assessment/SystemCheckDialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SecuritySetting, SuspiciousActivity } from '@/models/assessment';

const mockAssessment = {
  id: '1',
  title: 'Data Structures & Algorithms',
  totalTime: 90, // minutes
  proctoring: {
    requireWebcam: true,
    trackScreenChanges: true,
    preventTabSwitching: true,
    recordVideo: false,
    takeRandomSnapshots: true,
    snapshotInterval: 30, // seconds
    aiProctoring: true
  },
  security: {
    enforceFullscreen: true,
    preventScreenshots: true,
    blockMultipleSessions: true,
    allowedIPRanges: ['192.168.0.0/24'],
    requireDeviceVerification: true,
    maxWarningsBeforeTermination: 3
  },
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

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const getBrowserInfo = (): string => {
  return `${navigator.userAgent}`;
};

const getScreenResolution = (): string => {
  return `${window.screen.width}x${window.screen.height}`;
};

const generateDeviceId = (): string => {
  const nav = navigator as any;
  const screenProps = [
    nav.userAgent,
    nav.language,
    nav.hardwareConcurrency,
    nav.deviceMemory,
    window.screen.colorDepth,
    window.screen.width,
    window.screen.height
  ].join('_');
  
  let hash = 0;
  for (let i = 0; i < screenProps.length; i++) {
    const char = screenProps.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

const TakeAssessment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snapshotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [showSystemCheck, setShowSystemCheck] = useState(true);
  const [studentImage, setStudentImage] = useState<string | undefined>();
  const [videoAllowed, setVideoAllowed] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showProctorPanel, setShowProctorPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(mockAssessment.totalTime * 60);
  const [sectionTimeLeft, setSectionTimeLeft] = useState(mockAssessment.sections[0]?.timeLimit * 60 || 0);
  const [warningCount, setWarningCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [suspiciousActivities, setSuspiciousActivities] = useState<SuspiciousActivity[]>([]);
  const [lastActiveTime, setLastActiveTime] = useState<Date>(new Date());
  const [navigationEvents, setNavigationEvents] = useState<{
    timestamp: Date;
    action: string;
    details: string;
  }[]>([]);
  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: '',
    browserInfo: '',
    ipAddress: '0.0.0.0',
    screenResolution: '',
    fullscreenExits: 0
  });
  const [showSecurityBanner, setShowSecurityBanner] = useState(false);
  
  const currentSectionData = mockAssessment.sections[currentSection];
  const currentQuestionData = currentSectionData?.questions[currentQuestion];

  useEffect(() => {
    setDeviceInfo({
      deviceId: generateDeviceId(),
      browserInfo: getBrowserInfo(),
      ipAddress: '0.0.0.0',
      screenResolution: getScreenResolution(),
      fullscreenExits: 0
    });
    
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setDeviceInfo(prev => ({
          ...prev,
          ipAddress: data.ip
        }));
      })
      .catch(err => {
        console.error('Failed to get IP address:', err);
      });
  }, []);

  useEffect(() => {
    if (!assessmentStarted) return;

    const progressInterval = setInterval(() => {
      const progress = {
        assessmentId: mockAssessment.id,
        candidateId: 'current-user-id',
        currentSection,
        currentQuestion,
        timeRemaining: timeLeft,
        completed: false,
        suspiciousActivities: suspiciousActivities.length,
        sessionData: {
          ...deviceInfo,
          startTime: new Date(),
          lastActiveTime,
          navigationEvents
        }
      };
      
      console.log('Assessment progress update:', progress);
      
    }, 5000);
    
    return () => clearInterval(progressInterval);
  }, [assessmentStarted, currentSection, currentQuestion, timeLeft, suspiciousActivities, deviceInfo, lastActiveTime, navigationEvents]);

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
  
  useEffect(() => {
    if (!assessmentStarted) return;
    
    const sectionTimer = setInterval(() => {
      setSectionTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(sectionTimer);
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
  
  useEffect(() => {
    if (!assessmentStarted || !mockAssessment.security?.enforceFullscreen) return;

    const checkFullscreen = () => {
      const isDocumentFullscreen = document.fullscreenElement !== null;
      
      if (isFullscreen && !isDocumentFullscreen) {
        handleSuspiciousActivity('fullscreen_exit', 'Fullscreen mode exited', undefined, 'medium');
        setDeviceInfo(prev => ({
          ...prev,
          fullscreenExits: prev.fullscreenExits + 1
        }));
        setShowSecurityBanner(true);
        
        setTimeout(() => {
          requestFullscreen();
          setShowSecurityBanner(false);
        }, 5000);
      }
      
      setIsFullscreen(isDocumentFullscreen);
    };

    const requestFullscreen = () => {
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen();
        }
      } catch (err) {
        console.error('Failed to enter fullscreen:', err);
      }
    };

    if (!isFullscreen) {
      requestFullscreen();
    }

    fullscreenIntervalRef.current = setInterval(checkFullscreen, 1000);
    
    document.addEventListener('fullscreenchange', checkFullscreen);
    
    return () => {
      if (fullscreenIntervalRef.current) {
        clearInterval(fullscreenIntervalRef.current);
      }
      document.removeEventListener('fullscreenchange', checkFullscreen);
    };
  }, [assessmentStarted, isFullscreen, mockAssessment.security]);
  
  useEffect(() => {
    if (!assessmentStarted) return;
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSuspiciousActivity('tab_switch', 'You left the test window', undefined, 'high');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [assessmentStarted]);

  useEffect(() => {
    if (!assessmentStarted || !mockAssessment.security?.preventScreenshots) return;
    
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      handleSuspiciousActivity('screenshot_attempt', 'Copy attempt detected', undefined, 'low');
      return false;
    };
    
    const preventScreenCapture = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' || 
        (e.ctrlKey && e.key === 'p') || 
        (e.metaKey && e.shiftKey && e.key === '4') ||
        (e.metaKey && e.shiftKey && e.key === '3')
      ) {
        e.preventDefault();
        handleSuspiciousActivity('screenshot_attempt', 'Screenshot attempt detected', undefined, 'medium');
        return false;
      }
    };
    
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('keydown', preventScreenCapture);
    document.addEventListener('contextmenu', preventRightClick);
    
    return () => {
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('keydown', preventScreenCapture);
      document.removeEventListener('contextmenu', preventRightClick);
    };
  }, [assessmentStarted, mockAssessment.security]);
  
  useEffect(() => {
    if (!assessmentStarted || !videoAllowed) return;
    
    const detectMultipleScreens = () => {
      if (window.screen && window.screen.availWidth > window.innerWidth * 1.5) {
        handleSuspiciousActivity('screen_share', 'Multiple screens detected', undefined, 'high');
      }
    };
    
    const interval = setInterval(detectMultipleScreens, 10000);
    
    return () => clearInterval(interval);
  }, [assessmentStarted, videoAllowed]);

  useEffect(() => {
    if (!assessmentStarted) return;

    const handleActivity = () => {
      setLastActiveTime(new Date());
    };

    const activityEvents = ['mousemove', 'keypress', 'scroll', 'click'];
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    const inactivityCheck = setInterval(() => {
      const inactiveTime = new Date().getTime() - lastActiveTime.getTime();
      if (inactiveTime > 30000) {
        handleSuspiciousActivity('inactivity', `No activity detected for ${Math.floor(inactiveTime / 1000)} seconds`, undefined, 'low');
      }
    }, 10000);

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, [assessmentStarted, lastActiveTime]);
  
  useEffect(() => {
    if (!assessmentStarted || !videoAllowed) return;
    
    let stream: MediaStream | null = null;
    
    const setupWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 },
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        if (mockAssessment.proctoring?.takeRandomSnapshots) {
          snapshotIntervalRef.current = setInterval(() => {
            takeSnapshot();
          }, (mockAssessment.proctoring?.snapshotInterval || 30) * 1000);
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        toast({
          title: "Webcam access error",
          description: "Unable to access your webcam for proctoring. Please check your permissions.",
          variant: "destructive",
        });
      }
    };
    
    setupWebcam();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (snapshotIntervalRef.current) {
        clearInterval(snapshotIntervalRef.current);
      }
    };
  }, [assessmentStarted, videoAllowed]);
  
  const takeSnapshot = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    context.drawImage(
      videoRef.current,
      0, 0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    
    const snapshot = canvasRef.current.toDataURL('image/jpeg', 0.5);
    
    console.log('Snapshot taken');
    
    simulateFaceDetection(snapshot);
  };
  
  const simulateFaceDetection = (snapshot: string) => {
    const simulationValue = Math.random();
    
    if (simulationValue < 0.05) {
      handleSuspiciousActivity('no_face', 'No face detected in the webcam', snapshot, 'medium');
    } else if (simulationValue < 0.08) {
      handleSuspiciousActivity('multiple_faces', 'Multiple faces detected in the webcam', snapshot, 'high');
    } else if (simulationValue < 0.10) {
      handleSuspiciousActivity('unknown_face', 'Unrecognized face detected in the webcam', snapshot, 'high');
    }
  };
  
  const handleSuspiciousActivity = (
    type: string, 
    reason: string, 
    snapshot?: string, 
    severity: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    const newActivity = {
      timestamp: new Date(),
      type,
      details: reason,
      snapshot,
      severity
    } as SuspiciousActivity;
    
    setSuspiciousActivities(prev => [...prev, newActivity]);
    
    const newCount = warningCount + 1;
    setWarningCount(newCount);
    setWarningMessage(reason);
    setShowWarningDialog(true);
    
    const maxWarnings = mockAssessment.security?.maxWarningsBeforeTermination || 3;
    if (newCount >= maxWarnings) {
      toast({
        title: "Assessment terminated",
        description: "Your test has been terminated due to multiple violations.",
        variant: "destructive"
      });
      setTimeout(() => navigate('/my-assessments'), 2000);
    }
  };
  
  const handleSystemCheckComplete = (success: boolean, capturedImage?: string) => {
    if (success && capturedImage) {
      setStudentImage(capturedImage);
      setShowSystemCheck(false);
      setAssessmentStarted(true);
      setVideoAllowed(true);
      
      toast({
        title: "Assessment started",
        description: "Your system check is complete. You can now begin the assessment.",
      });
      
      logNavigationEvent('assessment_start', 'Assessment started with system check complete');
    } else {
      toast({
        title: "System check required",
        description: "You must complete the system check to proceed.",
        variant: "destructive",
      });
    }
  };
  
  const logNavigationEvent = (action: string, details: string) => {
    const newEvent = {
      timestamp: new Date(),
      action,
      details
    };
    
    setNavigationEvents(prev => [...prev, newEvent]);
  };
  
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
    
    logNavigationEvent('answer_change', `Answer selected for question ${questionId}`);
  };
  
  const navigateToNextQuestion = () => {
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      logNavigationEvent('question_view', `Navigated to question ${currentQuestion + 1}`);
    } else if (currentSection < mockAssessment.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
      setSectionTimeLeft(mockAssessment.sections[currentSection + 1].timeLimit * 60);
      logNavigationEvent('section_change', `Changed to section ${currentSection + 1}`);
    }
  };
  
  const navigateToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      logNavigationEvent('question_view', `Navigated to question ${currentQuestion - 1}`);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      const prevSection = mockAssessment.sections[currentSection - 1];
      setCurrentQuestion(prevSection.questions.length - 1);
      logNavigationEvent('section_change', `Changed to section ${currentSection - 1}`);
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    logNavigationEvent('assessment_submit', 'Assessment submitted');
    
    console.log('Submitting answers:', userAnswers);
    console.log('Submitting proctoring data:', suspiciousActivities);
    console.log('Submitting session data:', {
      deviceInfo,
      navigationEvents
    });
    
    setTimeout(() => {
      toast({
        title: "Assessment submitted",
        description: "Your answers have been recorded successfully.",
      });
      navigate('/my-results');
    }, 1500);
  };
  
  const calculateProgress = () => {
    let totalQuestions = 0;
    let completedQuestions = 0;
    
    mockAssessment.sections.forEach((sect, sIdx) => {
      totalQuestions += sect.questions.length;
      
      if (sIdx < currentSection) {
        completedQuestions += sect.questions.length;
      } else if (sIdx === currentSection) {
        sect.questions.forEach((q) => {
          if (userAnswers[q.id] !== undefined) {
            completedQuestions++;
          }
        });
      }
    });
    
    return (completedQuestions / totalQuestions) * 100;
  };
  
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
      <div className="hidden">
        <video ref={videoRef} autoPlay muted playsInline></video>
        <canvas ref={canvasRef} width="640" height="480"></canvas>
      </div>
      
      {showSecurityBanner && (
        <div className="bg-red-600 text-white p-3 text-center flex items-center justify-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>Security violation detected! Please return to fullscreen mode to continue your assessment.</span>
        </div>
      )}
      
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
              <div className="mt-2 font-semibold">Warning {warningCount} of {mockAssessment.security?.maxWarningsBeforeTermination || 3}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Your assessment will be terminated after {mockAssessment.security?.maxWarningsBeforeTermination || 3} warnings.
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
      
      <Sheet open={showProctorPanel} onOpenChange={setShowProctorPanel}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Proctor Monitor</SheetTitle>
            <SheetDescription>
              Real-time monitoring data for this assessment
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 h-[calc(100vh-120px)] overflow-y-auto">
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-slate-50">
                <h3 className="font-medium mb-2">Candidate Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Name:</div>
                  <div className="font-medium">John Doe</div>
                  <div>Assessment:</div>
                  <div className="font-medium">{mockAssessment.title}</div>
                  <div>Started:</div>
                  <div className="font-medium">{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
              
              <div className="p-4 border rounded-md bg-slate-50">
                <h3 className="font-medium mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-emerald-600" />
                  Security Information
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Device ID:</div>
                  <div className="font-medium">{deviceInfo.deviceId}</div>
                  <div>IP Address:</div>
                  <div className="font-medium">{deviceInfo.ipAddress}</div>
                  <div>Screen Resolution:</div>
                  <div className="font-medium">{deviceInfo.screenResolution}</div>
                  <div>Fullscreen Exits:</div>
                  <div className="font-medium">{deviceInfo.fullscreenExits}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                  Suspicious Activity Log
                </h3>
                {suspiciousActivities.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2">No suspicious activities recorded</div>
                ) : (
                  <div className="space-y-3">
                    {suspiciousActivities.map((activity, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-md p-3 text-sm ${
                          activity.severity === 'high' ? 'border-red-300 bg-red-50' : 
                          activity.severity === 'medium' ? 'border-amber-300 bg-amber-50' : 
                          'border-blue-300 bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-medium capitalize ${
                            activity.severity === 'high' ? 'text-red-600' : 
                            activity.severity === 'medium' ? 'text-amber-600' : 
                            'text-blue-600'
                          }`}>
                            {activity.type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {activity.timestamp instanceof Date 
                              ? activity.timestamp.toLocaleTimeString() 
                              : new Date(activity.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="mt-1 text-muted-foreground">{activity.details}</p>
                        {activity.snapshot && (
                          <div className="mt-2">
                            <img 
                              src={activity.snapshot} 
                              alt="Snapshot" 
                              className="w-full h-auto rounded border"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  Session Activity Log
                </h3>
                {navigationEvents.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2">No activities recorded yet</div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100 text-left">
                        <tr>
                          <th className="p-2">Time</th>
                          <th className="p-2">Action</th>
                          <th className="p-2">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {navigationEvents.map((event, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="p-2 text-xs">
                              {event.timestamp instanceof Date 
                                ? event.timestamp.toLocaleTimeString() 
                                : new Date(event.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="p-2 capitalize">{event.action.replace('_', ' ')}</td>
                            <td className="p-2 text-muted-foreground text-xs">{event.details}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <header className="bg-emerald-600 text-white py-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg">{mockAssessment.title}</h1>
            <p className="text-sm text-emerald-100">Section: {currentSectionData?.name}</p>
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
            <div onClick={() => setShowProctorPanel(true)} className="cursor-pointer">
              <Monitor className="h-5 w-5 text-white hover:text-emerald-200" />
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
                <CardDescription>{currentSectionData?.name}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {warningCount > 0 && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Warning: {warningCount}/{mockAssessment.security?.maxWarningsBeforeTermination || 3}</span>
                  </div>
                )}
                <div className="flex space-x-1">
                  {videoAllowed && (
                    <div className="flex items-center text-emerald-600">
                      <Camera className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Webcam</span>
                    </div>
                  )}
                  {isFullscreen && (
                    <div className="flex items-center text-emerald-600">
                      <Maximize className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Fullscreen</span>
                    </div>
                  )}
                  {deviceInfo.deviceId && (
                    <div className="flex items-center text-emerald-600">
                      <Smartphone className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{currentQuestionData?.text}</h3>
              <RadioGroup 
                value={userAnswers[currentQuestionData?.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(currentQuestionData?.id, parseInt(value))}
              >
                <div className="space-y-3">
                  {currentQuestionData?.options.map((option, idx) => (
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
                currentQuestion === currentSectionData.questions.length - 1) ? (
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
      
      <footer className="bg-white border-t py-3 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="inline h-4 w-4 mr-1" />
              <span>Proctoring active</span>
            </div>
            <div className="flex items-center">
              <Shield className="inline h-4 w-4 mr-1" />
              <span>Security enabled</span>
            </div>
            <div className="flex items-center">
              <Wifi className="inline h-4 w-4 mr-1" />
              <span>IP: {deviceInfo.ipAddress}</span>
            </div>
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
