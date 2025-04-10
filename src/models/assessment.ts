
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
}

export interface SuspiciousActivity {
  timestamp: Date | string;
  type: 'tab_switch' | 'window_blur' | 'multiple_faces' | 'no_face' | 'unknown_face' | 'screen_share' | 'other';
  details?: string;
  snapshot?: string; // Base64 encoded image
}
