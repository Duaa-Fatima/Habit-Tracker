// Fix: Added full implementation for the types file to define data structures used across the application.
export enum LogStatus {
  Pending = 'pending',
  Done = 'done',
  Skipped = 'skipped',
}

export enum Category {
  Health = 'Health & Fitness',
  Productivity = 'Productivity',
  Study = 'Study & Learning',
  Mindfulness = 'Mindfulness',
}

export enum Frequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

export interface HabitLog {
  date: string;
  status: LogStatus;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: Category;
  frequency: Frequency;
  startDate: string;
  logs: HabitLog[];
}

export interface HabitStats {
  streak: number;
  longestStreak: number;
  completionRate: number;
  totalDays: number;
  doneDays: number;
  skippedDays: number;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    isLoading?: boolean;
}

// Added User type for authentication
export interface User {
    uid: string; // Changed from email to uid for robust user identification
    email: string | null;
}

// --- New Mood Tracker Types ---
export enum Mood {
    Happy = '😊',
    Neutral = '😐',
    Sad = '😞',
    Angry = '😡',
    Tired = '😴',
    Loved = '😍',
}

export interface MoodLog {
    date: string;
    mood: Mood;
    note?: string;
}

export type View = 'habits' | 'analytics' | 'coach' | 'garden' | 'mood';
