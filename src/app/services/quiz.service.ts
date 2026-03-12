import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question, QuizResult, WordClass } from '../models/question.model';
import { QUESTION_BANK } from './question-bank';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly http = inject(HttpClient);

  // Static bank is always available immediately
  private allQuestions: Question[] = [...QUESTION_BANK];

  readonly generatedCount = signal(0);
  readonly loadingGenerated = signal(true);

  readonly currentQuestions = signal<Question[]>([]);
  readonly currentIndex = signal(0);
  readonly userAnswers = signal<Map<number, string>>(new Map());
  readonly quizActive = signal(false);
  readonly quizFinished = signal(false);
  readonly selectedWordClass = signal<WordClass | 'all'>('all');

  readonly currentQuestion = computed(() => {
    const questions = this.currentQuestions();
    const idx = this.currentIndex();
    return questions[idx] ?? null;
  });

  readonly progress = computed(() => {
    const total = this.currentQuestions().length;
    return total > 0 ? (this.currentIndex() / total) * 100 : 0;
  });

  readonly result = computed<QuizResult | null>(() => {
    if (!this.quizFinished()) return null;
    const questions = this.currentQuestions();
    const answers = this.userAnswers();
    let correct = 0;
    const wrong: QuizResult['wrongAnswers'] = [];

    for (const q of questions) {
      const userAnswer = answers.get(q.id) ?? '';
      if (userAnswer === q.correctAnswer) {
        correct++;
      } else {
        wrong.push({ question: q, userAnswer });
      }
    }

    return {
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
    };
  });

  readonly totalAvailable = computed(() => QUESTION_BANK.length + this.generatedCount());

  constructor() {
    this.loadGeneratedQuestions();
  }

  private loadGeneratedQuestions(): void {
    this.http.get<Question[]>('/assets/questions/all.json').subscribe({
      next: (generated) => {
        this.allQuestions = [...QUESTION_BANK, ...generated];
        this.generatedCount.set(generated.length);
        this.loadingGenerated.set(false);
      },
      error: () => {
        // Generated bank not yet created — fall back to static bank silently
        this.loadingGenerated.set(false);
      },
    });
  }

  startQuiz(wordClass: WordClass | 'all', count: number = 10): void {
    let pool =
      wordClass === 'all'
        ? [...this.allQuestions]
        : this.allQuestions.filter((q) => q.wordClass === wordClass);

    // Shuffle question order
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Shuffle options within each question
    const shuffled = pool.slice(0, Math.min(count, pool.length)).map((q) => {
      const options = [...q.options];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      return { ...q, options };
    });

    this.currentQuestions.set(shuffled);
    this.currentIndex.set(0);
    this.userAnswers.set(new Map());
    this.quizActive.set(true);
    this.quizFinished.set(false);
    this.selectedWordClass.set(wordClass);
  }

  submitAnswer(questionId: number, answer: string): void {
    const answers = new Map(this.userAnswers());
    answers.set(questionId, answer);
    this.userAnswers.set(answers);
  }

  nextQuestion(): void {
    const idx = this.currentIndex();
    if (idx < this.currentQuestions().length - 1) {
      this.currentIndex.set(idx + 1);
    } else {
      this.quizFinished.set(true);
      this.quizActive.set(false);
    }
  }

  resetQuiz(): void {
    this.currentQuestions.set([]);
    this.currentIndex.set(0);
    this.userAnswers.set(new Map());
    this.quizActive.set(false);
    this.quizFinished.set(false);
  }

  getAvailableWordClasses(): (WordClass | 'all')[] {
    return ['all', 'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'determiner'];
  }
}
