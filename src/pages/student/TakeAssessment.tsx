
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  AlertCircle, Clock, ChevronLeft, ChevronRight, Flag, Camera, Eye, 
  Monitor, Shield, Maximize, Smartphone, Wifi, AlertTriangle, Mic, Video, ScreenShare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SystemCheckDialog from '@/components/assessment/SystemCheckDialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SecuritySetting, SuspiciousActivity, FaceDetectionResult, WebRTCConnection } from '@/models/assessment';
import MonitoringScreen from '@/components/assessment/MonitoringScreen';

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
    aiProctoring: true,
    webRTCStream: true,
    liveProctoring: true,
    behaviorAnalysis: true,
    faceRecognition: true,
    eyeMovementTracking: true,
    audioMonitoring: false,
    screenCaptureSensitivity: 'medium'
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
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snapshotIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const webRTCIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // WebRTC related refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  
  const [showSystemCheck, setShowSystemCheck] = useState(true);
  const [studentImage, setStudentImage] = useState<string | undefined>();
  const [videoAllowed, setVideoAllowed] = useState(false);
  const [screenShareAllowed, setScreenShareAllowed] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showProctorPanel, setShowProctorPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [webRTCStatus, setWebRTCStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'failed'>('disconnected');
  const [webRTCConnectionId, setWebRTCConnectionId] = useState<string>('');
  const [liveProctoring, setLiveProctoring] = useState<boolean>(false);
  
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
  const [faceDetectionResult, setFaceDetectionResult] = useState<FaceDetectionResult | null>(null);
  
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
      
      // When live proctoring is enabled, also send webRTC status
      if (liveProctoring && mockAssessment.proctoring?.webRTCStream) {
        const webRTCData: WebRTCConnection = {
          studentId: 'current-user-id',
          assessmentId: mockAssessment.id,
          connectionId: webRTCConnectionId,
          startTime: new Date(),
          webRTCStatus,
          streamType: screenShareAllowed ? 'both' : 'webcam',
          streamQuality: 'medium'
        };
        console.log('WebRTC connection status:', webRTCData);
      }
      
    }, 5000);
    
    return () => clearInterval(progressInterval);
  }, [assessmentStarted, currentSection, currentQuestion, timeLeft, suspiciousActivities, deviceInfo, 
     lastActiveTime, navigationEvents, liveProctoring, webRTCStatus, webRTCConnectionId, screenShareAllowed]);

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
          audio: mockAssessment.proctoring?.audioMonitoring || false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          webcamStreamRef.current = stream;
        }
        
        if (mockAssessment.proctoring?.takeRandomSnapshots) {
          snapshotIntervalRef.current = setInterval(() => {
            takeSnapshot();
          }, (mockAssessment.proctoring?.snapshotInterval || 30) * 1000);
        }
        
        // If WebRTC streaming is enabled, initialize the connection
        if (mockAssessment.proctoring?.webRTCStream && mockAssessment.proctoring?.liveProctoring) {
          setLiveProctoring(true);
          initializeWebRTCConnection();
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
      
      // Clean up WebRTC connection if it exists
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (webRTCIntervalRef.current) {
        clearInterval(webRTCIntervalRef.current);
      }
    };
  }, [assessmentStarted, videoAllowed]);
  
  const initializeWebRTCConnection = async () => {
    try {
      setWebRTCStatus('connecting');
      
      // In a real implementation, these would be fetched from your server
      const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' }
      ];
      
      // Create a new WebRTC peer connection
      peerConnectionRef.current = new RTCPeerConnection({ 
        iceServers 
      });
      
      // Add the webcam stream to the peer connection
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => {
          if (peerConnectionRef.current && webcamStreamRef.current) {
            peerConnectionRef.current.addTrack(track, webcamStreamRef.current);
          }
        });
      }
      
      // Set up screen sharing if enabled
      if (mockAssessment.proctoring?.trackScreenChanges) {
        setupScreenSharing();
      }
      
      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          // In a real implementation, you would send this candidate to your signaling server
          console.log('New ICE candidate:', event.candidate);
        }
      };
      
      // Handle connection state changes
      peerConnectionRef.current.onconnectionstatechange = () => {
        if (peerConnectionRef.current) {
          switch(peerConnectionRef.current.connectionState) {
            case 'connected':
              setWebRTCStatus('connected');
              console.log('WebRTC connected successfully');
              toast({
                title: "Live proctoring connected",
                description: "Your webcam stream is now being monitored by a proctor.",
              });
              break;
            case 'disconnected':
            case 'failed':
              setWebRTCStatus('failed');
              console.error('WebRTC connection failed or disconnected');
              toast({
                title: "Proctoring connection lost",
                description: "Connection to the proctoring service has been interrupted.",
                variant: "destructive",
              });
              
              // Attempt to reconnect after a delay
              setTimeout(() => {
                if (assessmentStarted && videoAllowed) {
                  initializeWebRTCConnection();
                }
              }, 5000);
              break;
            default:
              break;
          }
        }
      };
      
      // Create and set local description for WebRTC
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      // In a real implementation, you would send this offer to your signaling server
      // and handle the response to set the remote description
      console.log('Created WebRTC offer:', offer);
      
      // Simulate connecting to a signaling server and receiving an answer
      // In a real application, this would be an API call to your backend
      simulateSignalingServer(offer);
      
      // Generate a connection ID for tracking
      setWebRTCConnectionId(`webrtc-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
      
      // Set up a heartbeat to maintain the connection
      webRTCIntervalRef.current = setInterval(() => {
        if (peerConnectionRef.current && peerConnectionRef.current.connectionState === 'connected') {
          console.log('WebRTC connection active');
        } else if (peerConnectionRef.current && webRTCStatus === 'connected') {
          console.warn('WebRTC connection state mismatch, reconnecting...');
          initializeWebRTCConnection();
        }
      }, 30000);
      
    } catch (err) {
      console.error('Error initializing WebRTC:', err);
      setWebRTCStatus('failed');
    }
  };
  
  // Simulate communication with a signaling server
  const simulateSignalingServer = (offer: RTCSessionDescriptionInit) => {
    // In a real implementation, this would be an API call to your backend
    // The backend would relay this offer to the proctor and return their answer
    
    setTimeout(async () => {
      if (peerConnectionRef.current) {
        try {
          // Simulate receiving an answer from the server
          const simulatedAnswer: RTCSessionDescriptionInit = {
            type: 'answer',
            sdp: offer.sdp // In real scenario, this would be the proctor's SDP
          };
          
          // Set the remote description with the answer
          await peerConnectionRef.current.setRemoteDescription(simulatedAnswer);
          console.log('Set remote description with simulated answer');
          
          // For this simulation, we'll consider this a successful connection
          if (peerConnectionRef.current.connectionState !== 'connected') {
            setWebRTCStatus('connected');
          }
        } catch (err) {
          console.error('Error setting remote description:', err);
        }
      }
    }, 1000);
  };
  
  const setupScreenSharing = async () => {
    try {
      if (!navigator.mediaDevices.getDisplayMedia) {
        console.error('Screen sharing not supported in this browser');
        return;
      }
      
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: {
          displaySurface: 'monitor',
          logicalSurface: true,
        } as any
      });
      
      // Store the screen stream
      screenStreamRef.current = screenStream;
      
      // Display the screen stream in a hidden video element
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = screenStream;
      }
      
      // Add the screen sharing tracks to the peer connection
      if (peerConnectionRef.current) {
        screenStream.getTracks().forEach(track => {
          if (peerConnectionRef.current && screenStreamRef.current) {
            peerConnectionRef.current.addTrack(track, screenStreamRef.current);
          }
        });
      }
      
      // Listen for the end of screen sharing
      screenStream.getVideoTracks()[0].onended = () => {
        console.log('Screen sharing stopped by user');
        handleSuspiciousActivity('screen_share', 'Screen sharing was stopped', undefined, 'medium');
        
        // Attempt to restart screen sharing after a warning
        setTimeout(async () => {
          if (assessmentStarted && videoAllowed) {
            toast({
              title: "Screen sharing required",
              description: "Screen sharing is required for this assessment. Please enable it again.",
              variant: "destructive",
            });
            setupScreenSharing();
          }
        }, 3000);
      };
      
      setScreenShareAllowed(true);
      
    } catch (err) {
      console.error('Error accessing screen sharing:', err);
      handleSuspiciousActivity('screen_share', 'Failed to start screen sharing', undefined, 'medium');
    }
  };
  
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
    
    // Use enhanced face detection
    if (mockAssessment.proctoring?.behaviorAnalysis) {
      enhancedFaceDetection(snapshot);
    } else {
      simulateFaceDetection(snapshot);
    }
  };
  
  const enhancedFaceDetection = async (snapshot: string) => {
    // In a real implementation, this would use a face detection API or library
    // like TensorFlow.js with face-api.js
    
    // For this demo, we'll simulate the results
    const simulationValue = Math.random();
    const result: FaceDetectionResult = {
      faceCount: 1,
      verified: true,
      primaryFace: {
        confidence: 0.95,
        boundingBox: { x: 120, y: 80, width: 200, height: 200 }
      }
    };
    
    if (simulationValue < 0.03) {
      // No face detected
      result.faceCount = 0;
      result.verified = false;
      handleSuspiciousActivity('no_face', 'No face detected in the webcam', snapshot, 'medium');
    } else if (simulationValue < 0.06) {
      // Multiple faces detected
      result.faceCount = 2;
      result.verified = false;
      handleSuspiciousActivity('multiple_faces', 'Multiple faces detected in the webcam', snapshot, 'high');
    } else if (simulationValue < 0.09) {
      // Face too far from camera
      result.faceCount = 1;
      result.verified = false;
      result.primaryFace!.confidence = 0.6;
      result.primaryFace!.boundingBox = { x: 150, y: 100, width: 100, height: 100 };
      handleSuspiciousActivity('face_movement', 'Face too far from the camera', snapshot, 'low');
    } else if (simulationValue < 0.12) {
      // Face identity verification failed
      result.faceCount = 1;
      result.verified = false;
      result.matchScore = 0.65; // Below threshold
      handleSuspiciousActivity('unknown_face', 'Face identity verification failed', snapshot, 'high');
    } else if (simulationValue < 0.15) {
      // Abnormal eye movement detected 
      result.faceCount = 1;
      result.verified = true;
      result.primaryFace!.landmarks = {
        leftEye: { x: 150, y: 120 },
        rightEye: { x: 250, y: 120 },
      };
      handleSuspiciousActivity('eye_movement', 'Suspicious eye movements detected', snapshot, 'medium');
    }
    
    setFaceDetectionResult(result);
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
    severity: 'low' | 'medium' | 'high' = 'medium',
    aiConfidence?: number
  ) => {
    const newActivity = {
      timestamp: new Date(),
      type,
      details: reason,
      snapshot,
      severity,
      aiConfidence: aiConfidence || (severity === 'high' ? 0.9 : severity === 'medium' ? 0.7 : 0.5)
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
    
    // Here we would normally send the answers to the server
    console.log('Submitting answers:', userAnswers);
    
    toast({
      title: "Assessment submitted",
      description: "Your answers have been submitted successfully. You will be redirected shortly.",
    });
    
    setTimeout(() => navigate('/my-assessments'), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* System check dialog */}
      <SystemCheckDialog 
        open={showSystemCheck} 
        onComplete={handleSystemCheckComplete}
      />

      {/* Warning dialog for suspicious activities */}
      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning</AlertDialogTitle>
            <AlertDialogDescription>
              {warningMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Acknowledge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Security banner */}
      {showSecurityBanner && (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white p-2 text-center z-50">
          <AlertTriangle className="inline-block mr-2 h-4 w-4" />
          Please return to fullscreen mode to continue the assessment
        </div>
      )}

      {/* Main assessment content */}
      {assessmentStarted && (
        <div className="container mx-auto py-6 px-4">
          {/* Assessment header */}
          <header className="mb-6">
            <h1 className="text-2xl font-bold">{mockAssessment.title}</h1>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    Section {currentSection + 1}/{mockAssessment.sections.length}: {formatTime(sectionTimeLeft)}
                  </span>
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
            </div>
            <Progress 
              value={(currentSection / mockAssessment.sections.length) * 100} 
              className="mt-2 h-1"
            />
          </header>

          {/* Question area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>
                  Question {currentQuestion + 1} of {currentSectionData?.questions.length}
                </CardTitle>
                <CardDescription>
                  {currentSectionData?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-lg">{currentQuestionData?.text}</p>
                  
                  <RadioGroup 
                    value={userAnswers[currentQuestionData?.id] !== undefined ? userAnswers[currentQuestionData?.id].toString() : undefined}
                    onValueChange={(value) => currentQuestionData && handleAnswerSelect(currentQuestionData.id, parseInt(value))}
                    className="space-y-3"
                  >
                    {currentQuestionData?.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="text-base">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={navigateToPrevQuestion}
                  disabled={currentSection === 0 && currentQuestion === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={navigateToNextQuestion}
                  disabled={
                    currentSection === mockAssessment.sections.length - 1 && 
                    currentQuestion === currentSectionData?.questions.length - 1
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-4">
              {/* Section progress card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-1">
                    {currentSectionData?.questions.map((_, index) => (
                      <Button
                        key={index}
                        variant={currentQuestion === index ? "default" : userAnswers[currentSectionData?.questions[index].id] !== undefined ? "outline" : "ghost"}
                        className="h-8 w-8 p-0"
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Hidden canvas for snapshots */}
              <canvas ref={canvasRef} className="hidden" width="640" height="480" />
              
              {/* Hidden screen sharing video */}
              <video ref={screenVideoRef} className="hidden" autoPlay playsInline muted />
            </div>
          </div>
        </div>
      )}

      {/* Monitoring panel - always visible when assessment is started */}
      {assessmentStarted && videoAllowed && (
        <MonitoringScreen 
          videoRef={videoRef}
          screenVideoRef={screenVideoRef}
          webRTCStatus={webRTCStatus}
          suspiciousActivities={suspiciousActivities}
        />
      )}
    </div>
  );
};

export default TakeAssessment;
