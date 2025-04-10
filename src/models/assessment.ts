
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
  type: 'tab_switch' | 'window_blur' | 'multiple_faces' | 'no_face' | 'unknown_face' | 'screen_share' | 'fullscreen_exit' | 'screenshot_attempt' | 'multiple_sessions' | 'ip_change' | 'inactivity' | 'other';
  details?: string;
  snapshot?: string; // Base64 encoded image
  severity: 'low' | 'medium' | 'high';
}
