export type TimeMode = 'hours' | 'hours-minutes' | 'hours-minutes-seconds';
export type TimeFormat = '12hr' | '24hr';
export type TimeContent = 'clock' | 'problems' | 'both';

export interface TimeConfig {
  mode: TimeMode;
  format: TimeFormat;
  content: TimeContent;
}

export interface TimeQuestion {
  id: number;
  type: 'clock' | 'problem';
  /** For clock questions: the actual hours (0-23) to display on the clock face */
  clockHours?: number;
  clockMinutes?: number;
  clockSeconds?: number;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface TimeQuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: { question: TimeQuestion; userAnswer: string }[];
}
