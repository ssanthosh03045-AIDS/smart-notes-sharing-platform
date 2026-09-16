export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor';
  bio?: string;
  joinedDate: string;
}

export type CategoryType = 
  | 'computer-science' 
  | 'mathematics' 
  | 'physics' 
  | 'chemistry' 
  | 'biology' 
  | 'history' 
  | 'literature' 
  | 'business';

export interface Note {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  author: string;
  authorId: string;
  uploadDate: string;
  fileSize: string;
  fileType: 'pdf' | 'doc' | 'txt' | 'ppt';
  downloads: number;
  views: number;
  rating: number;
  content: string; // The text content of the note used as AI context
  tags: string[];
}

export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
