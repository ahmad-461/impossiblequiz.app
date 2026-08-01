export interface Category {
  id: string;
  name: string;
  description?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export interface Question {
  id: string;
  category: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  difficulty: Difficulty;
}

export interface GameSession {
  id: string;
  category: string;
  questions_answered: number;
  correct_count: number;
  created_at?: string;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  category: string;
  score: number;
  streak: number;
  created_at?: string;
}
