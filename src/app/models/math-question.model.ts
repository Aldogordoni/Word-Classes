export type MathTopic = 'area' | 'perimeter' | 'circle' | 'volume';

export interface MathQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  topic: MathTopic;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface MathQuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: { question: MathQuestion; userAnswer: string }[];
}

export const MATH_TOPIC_INFO: Record<MathTopic | 'all', { label: string; description: string; colour: string; icon: string }> = {
  all:       { label: 'All Topics',  description: 'All maths formulas mixed together.',             colour: '#00b894', icon: '🔢' },
  area:      { label: 'Area',        description: 'Rectangles, squares, triangles & parallelograms.', colour: '#e17055', icon: '📐' },
  perimeter: { label: 'Perimeter',   description: 'Distance around different shapes.',              colour: '#0984e3', icon: '📏' },
  circle:    { label: 'Circles',     description: 'Circumference and area of circles.',             colour: '#6c5ce7', icon: '⭕' },
  volume:    { label: 'Volume',      description: 'Volume of cuboids and cubes.',                   colour: '#00cec9', icon: '📦' },
};
