
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
