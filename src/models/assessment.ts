
export type AssessmentType = 'aptitude' | 'coding' | 'personality' | 'interview';

export interface AssessmentBase {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  date: Date | string;
  duration: number; // Total duration in minutes
  status: 'draft' | 'published' | 'completed';
  createdBy?: string;
  createdAt?: Date | string;
  proctoring?: ProctoringSetting;
  security?: SecuritySetting;
}

export interface ProctoringSetting {
  requireWebcam: boolean;
  trackScreenChanges: boolean;
  preventTabSwitching: boolean;
  recordVideo: boolean;
  takeRandomSnapshots: boolean;
  snapshotInterval?: number; // Interval in seconds for random snapshots
  aiProctoring?: boolean; // Use AI to detect suspicious behavior
  webRTCStream?: boolean; // Enable WebRTC streaming
  liveProctoring?: boolean; // Enable live proctoring by a human
  behaviorAnalysis?: boolean; // Enable AI behavior analysis
  faceRecognition?: boolean; // Enable face recognition
  eyeMovementTracking?: boolean; // Track eye movements
  audioMonitoring?: boolean; // Monitor audio for suspicious sounds
  screenCaptureSensitivity?: 'low' | 'medium' | 'high'; // Sensitivity level for screen capture
}

export interface SecuritySetting {
  enforceFullscreen: boolean;
  preventScreenshots: boolean; 
  blockMultipleSessions: boolean;
  allowedIPRanges?: string[]; // Array of allowed IP ranges
  requireDeviceVerification: boolean;
  maxWarningsBeforeTermination: number;
}

export interface Section {
  id: string;
  name: string;
  duration: number; // Duration in minutes
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'multiple-choice' | 'coding' | 'subjective' | 'personality';
}

export interface Assessment extends AssessmentBase {
  sections: Section[];
}

// For tracking candidate's progress in real-time
export interface AssessmentProgress {
  assessmentId: string;
  candidateId: string;
  startTime: Date | string;
  currentSection: number;
  currentQuestion: number;
  timeRemaining: number; // In seconds
  completed: boolean;
  submittedAt?: Date | string;
  flaggedForReview?: boolean;
  suspiciousActivities?: SuspiciousActivity[];
  sessionData?: SessionData;
}

export interface SessionData {
  deviceId: string;
  browserInfo: string;
  ipAddress: string;
  screenResolution: string;
  startTime: Date | string;
  fullscreenExits: number;
  lastActiveTime: Date | string;
  navigationEvents: NavigationEvent[];
}

export interface NavigationEvent {
  timestamp: Date | string;
  action: 'question_view' | 'section_change' | 'answer_change' | 'flag_question' | 'timer_check';
  details: string;
}

export interface SuspiciousActivity {
  timestamp: Date | string;
  type: 'tab_switch' | 'window_blur' | 'multiple_faces' | 'no_face' | 'unknown_face' | 'screen_share' | 
         'fullscreen_exit' | 'screenshot_attempt' | 'multiple_sessions' | 'ip_change' | 'inactivity' | 
         'eye_movement' | 'face_movement' | 'audio_detection' | 'object_detection' | 'other';
  details?: string;
  snapshot?: string; // Base64 encoded image
  severity: 'low' | 'medium' | 'high';
  aiConfidence?: number; // AI confidence level (0-1)
}

// New interfaces for WebRTC and live proctoring

export interface WebRTCConnection {
  studentId: string;
  assessmentId: string;
  connectionId: string;
  startTime: Date | string;
  webRTCStatus: 'connecting' | 'connected' | 'disconnected' | 'failed';
  streamType: 'webcam' | 'screen' | 'both';
  streamQuality: 'low' | 'medium' | 'high';
  iceServers?: RTCIceServer[];
}

export interface ProctorSession {
  sessionId: string;
  proctorId?: string;
  studentId: string;
  assessmentId: string;
  startTime: Date | string;
  endTime?: Date | string;
  status: 'active' | 'completed' | 'terminated';
  notes?: ProctorNote[];
  warningsIssued: number;
  terminationReason?: string;
}

export interface ProctorNote {
  timestamp: Date | string;
  note: string;
  severity: 'info' | 'warning' | 'violation';
  action?: 'none' | 'warning_issued' | 'assessment_terminated';
}

export interface FaceDetectionResult {
  faceCount: number;
  primaryFace?: {
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    }
    landmarks?: {
      leftEye?: { x: number; y: number };
      rightEye?: { x: number; y: number };
      nose?: { x: number; y: number };
      mouth?: { x: number; y: number };
    }
  },
  verified: boolean;
  matchScore?: number; // 0-1, how closely it matches the registered face
}
