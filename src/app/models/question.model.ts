export type WordClass =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'determiner';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  type: 'identify' | 'classify' | 'fill-blank';
  sentence: string;
  highlightedWord?: string;
  options: string[];
  correctAnswer: string;
  wordClass: WordClass;
  difficulty: Difficulty;
  explanation: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: { question: Question; userAnswer: string }[];
}

export const WORD_CLASS_INFO: Record<WordClass, { label: string; description: string; colour: string }> = {
  noun: {
    label: 'Noun',
    description: 'A word that names a person, place, thing or idea (e.g. dog, London, happiness).',
    colour: '#e74c3c',
  },
  verb: {
    label: 'Verb',
    description: 'A word that describes an action, state or occurrence (e.g. run, is, happened).',
    colour: '#3498db',
  },
  adjective: {
    label: 'Adjective',
    description: 'A word that describes a noun (e.g. tall, beautiful, quick).',
    colour: '#2ecc71',
  },
  adverb: {
    label: 'Adverb',
    description: 'A word that describes a verb, adjective or other adverb (e.g. quickly, very, silently).',
    colour: '#9b59b6',
  },
  pronoun: {
    label: 'Pronoun',
    description: 'A word used instead of a noun (e.g. he, she, they, it).',
    colour: '#e67e22',
  },
  preposition: {
    label: 'Preposition',
    description: 'A word that shows the relationship between a noun/pronoun and other words (e.g. on, under, between).',
    colour: '#1abc9c',
  },
  conjunction: {
    label: 'Conjunction',
    description: 'A word that joins words, phrases or clauses (e.g. and, but, because).',
    colour: '#f39c12',
  },
  determiner: {
    label: 'Determiner',
    description: 'A word that introduces a noun (e.g. the, a, some, every).',
    colour: '#e84393',
  },
};
