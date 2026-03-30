import { Injectable, signal, computed } from '@angular/core';
import {
  TimeConfig, TimeContent, TimeFormat, TimeMode,
  TimeQuestion, TimeQuizResult,
} from '../models/time-question.model';

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(h: number, m: number, s: number, fmt: TimeFormat, mode: TimeMode): string {
  if (fmt === '12hr') {
    const period = h >= 12 ? 'pm' : 'am';
    const dh = h % 12 || 12;
    if (mode === 'hours') return `${dh} o'clock`;
    if (mode === 'hours-minutes') return `${dh}:${pad(m)} ${period}`;
    return `${dh}:${pad(m)}:${pad(s)} ${period}`;
  } else {
    if (mode === 'hours') return `${pad(h)}:00`;
    if (mode === 'hours-minutes') return `${pad(h)}:${pad(m)}`;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
}

// ─────────────────────────────────────────────────────────────────
// Static SAT-style time problems bank
// ─────────────────────────────────────────────────────────────────

interface StaticProblem extends Omit<TimeQuestion, 'id' | 'type'> {
  appliesToFormat: '12hr' | '24hr' | 'both';
}

const TIME_PROBLEMS: StaticProblem[] = [
  // ── 12-hour problems ──────────────────────────────────────────
  {
    appliesToFormat: '12hr',
    question: 'A film starts at 2:45 pm and lasts 1 hour 35 minutes. What time does it finish?',
    options: ['4:15 pm', '4:20 pm', '4:25 pm', '4:10 pm'],
    correctAnswer: '4:20 pm',
    difficulty: 'medium',
    explanation: '2:45 pm + 1 hour = 3:45 pm. 3:45 pm + 35 minutes = 4:20 pm.',
  },
  {
    appliesToFormat: '12hr',
    question: 'A party starts at 3:30 pm and lasts 2 hours 45 minutes. What time does it end?',
    options: ['6:10 pm', '6:15 pm', '6:20 pm', '6:30 pm'],
    correctAnswer: '6:15 pm',
    difficulty: 'medium',
    explanation: '3:30 pm + 2 hours = 5:30 pm. 5:30 pm + 45 minutes = 6:15 pm.',
  },
  {
    appliesToFormat: '12hr',
    question: 'A bus arrives at 10:45 am. The journey took 1 hour 20 minutes. What time did the bus depart?',
    options: ['9:20 am', '9:25 am', '9:30 am', '9:15 am'],
    correctAnswer: '9:25 am',
    difficulty: 'medium',
    explanation: '10:45 am − 1 hour = 9:45 am. 9:45 am − 20 minutes = 9:25 am.',
  },
  {
    appliesToFormat: '12hr',
    question: 'A TV programme starts at 7:35 pm and finishes at 9:10 pm. How long is the programme?',
    options: ['1 hour 30 minutes', '1 hour 35 minutes', '1 hour 40 minutes', '1 hour 25 minutes'],
    correctAnswer: '1 hour 35 minutes',
    difficulty: 'medium',
    explanation: '7:35 pm to 8:35 pm = 1 hour. 8:35 pm to 9:10 pm = 35 minutes. Total: 1 hour 35 minutes.',
  },
  {
    appliesToFormat: '12hr',
    question: 'Emma goes to sleep at 9:45 pm and wakes up at 7:15 am. How long does she sleep?',
    options: ['9 hours 15 minutes', '9 hours 30 minutes', '9 hours 45 minutes', '9 hours'],
    correctAnswer: '9 hours 30 minutes',
    difficulty: 'hard',
    explanation: '9:45 pm to 7:45 am = 10 hours. 7:45 am back to 7:15 am = subtract 30 minutes. Total: 9 hours 30 minutes.',
  },
  {
    appliesToFormat: '12hr',
    question: 'A doctor\'s appointment is at 11:20 am and lasts 25 minutes. What time does it finish?',
    options: ['11:40 am', '11:45 am', '11:50 am', '11:55 am'],
    correctAnswer: '11:45 am',
    difficulty: 'easy',
    explanation: '11:20 am + 25 minutes = 11:45 am.',
  },
  {
    appliesToFormat: '12hr',
    question: 'Ben leaves school at 3:25 pm and takes 47 minutes to walk home. What time does he arrive?',
    options: ['4:10 pm', '4:12 pm', '4:15 pm', '4:07 pm'],
    correctAnswer: '4:12 pm',
    difficulty: 'hard',
    explanation: '3:25 pm + 35 minutes = 4:00 pm. 4:00 pm + 12 minutes = 4:12 pm.',
  },
  {
    appliesToFormat: '12hr',
    question: 'A class starts at 9:00 am and finishes at 10:25 am. How long is the class?',
    options: ['1 hour 20 minutes', '1 hour 25 minutes', '1 hour 30 minutes', '1 hour 15 minutes'],
    correctAnswer: '1 hour 25 minutes',
    difficulty: 'easy',
    explanation: '9:00 am to 10:00 am = 1 hour. 10:00 am to 10:25 am = 25 minutes. Total: 1 hour 25 minutes.',
  },
  {
    appliesToFormat: '12hr',
    question: 'A cinema shows a film at 1:50 pm. The film is 2 hours 10 minutes long. What time does it finish?',
    options: ['3:55 pm', '4:00 pm', '4:05 pm', '4:10 pm'],
    correctAnswer: '4:00 pm',
    difficulty: 'medium',
    explanation: '1:50 pm + 2 hours = 3:50 pm. 3:50 pm + 10 minutes = 4:00 pm.',
  },
  {
    appliesToFormat: '12hr',
    question: 'Mia finishes her homework at 6:05 pm. She started at 4:40 pm. How long did it take?',
    options: ['1 hour 20 minutes', '1 hour 25 minutes', '1 hour 30 minutes', '1 hour 35 minutes'],
    correctAnswer: '1 hour 25 minutes',
    difficulty: 'medium',
    explanation: '4:40 pm to 5:40 pm = 1 hour. 5:40 pm to 6:05 pm = 25 minutes. Total: 1 hour 25 minutes.',
  },
  {
    appliesToFormat: '12hr',
    question: 'A shop opens at 9:15 am and closes at 5:30 pm. How long is it open?',
    options: ['8 hours 10 minutes', '8 hours 15 minutes', '8 hours 20 minutes', '8 hours 30 minutes'],
    correctAnswer: '8 hours 15 minutes',
    difficulty: 'hard',
    explanation: '9:15 am to 5:15 pm = 8 hours. 5:15 pm to 5:30 pm = 15 minutes. Total: 8 hours 15 minutes.',
  },
  {
    appliesToFormat: '12hr',
    question: 'A train journey takes 2 hours 40 minutes. The train arrives at 11:55 am. When did it depart?',
    options: ['9:10 am', '9:15 am', '9:20 am', '9:25 am'],
    correctAnswer: '9:15 am',
    difficulty: 'hard',
    explanation: '11:55 am − 2 hours = 9:55 am. 9:55 am − 40 minutes = 9:15 am.',
  },
  // ── 24-hour problems ──────────────────────────────────────────
  {
    appliesToFormat: '24hr',
    question: 'A train leaves at 09:15 and arrives at 11:40. How long is the journey?',
    options: ['2 hours 20 minutes', '2 hours 25 minutes', '2 hours 30 minutes', '2 hours 15 minutes'],
    correctAnswer: '2 hours 25 minutes',
    difficulty: 'medium',
    explanation: '09:15 to 11:15 = 2 hours. 11:15 to 11:40 = 25 minutes. Total: 2 hours 25 minutes.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A baker starts work at 04:45 and works for 8 hours 15 minutes. What time does he finish?',
    options: ['12:45', '13:00', '13:15', '13:05'],
    correctAnswer: '13:00',
    difficulty: 'medium',
    explanation: '04:45 + 8 hours = 12:45. 12:45 + 15 minutes = 13:00.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A shop opens at 08:30 and stays open for 9 hours 30 minutes. What time does it close?',
    options: ['17:45', '18:00', '18:15', '18:30'],
    correctAnswer: '18:00',
    difficulty: 'medium',
    explanation: '08:30 + 9 hours = 17:30. 17:30 + 30 minutes = 18:00.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A flight departs at 14:30 and takes 3 hours 45 minutes. What time does it arrive?',
    options: ['18:00', '18:15', '18:20', '18:30'],
    correctAnswer: '18:15',
    difficulty: 'medium',
    explanation: '14:30 + 3 hours = 17:30. 17:30 + 45 minutes = 18:15.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A concert starts at 19:45 and ends at 22:15. How long is the concert?',
    options: ['2 hours 15 minutes', '2 hours 30 minutes', '2 hours 45 minutes', '2 hours 20 minutes'],
    correctAnswer: '2 hours 30 minutes',
    difficulty: 'medium',
    explanation: '19:45 to 21:45 = 2 hours. 21:45 to 22:15 = 30 minutes. Total: 2 hours 30 minutes.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A bus departs at 07:55 and arrives 1 hour 35 minutes later. What time does it arrive?',
    options: ['09:25', '09:30', '09:35', '09:40'],
    correctAnswer: '09:30',
    difficulty: 'medium',
    explanation: '07:55 + 1 hour = 08:55. 08:55 + 35 minutes = 09:30.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A meeting starts at 10:40 and ends at 12:15. How long is the meeting?',
    options: ['1 hour 30 minutes', '1 hour 35 minutes', '1 hour 40 minutes', '1 hour 25 minutes'],
    correctAnswer: '1 hour 35 minutes',
    difficulty: 'medium',
    explanation: '10:40 to 11:40 = 1 hour. 11:40 to 12:15 = 35 minutes. Total: 1 hour 35 minutes.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A sports match starts at 15:30 and lasts 1 hour 45 minutes. What time does it end?',
    options: ['17:10', '17:15', '17:20', '17:30'],
    correctAnswer: '17:15',
    difficulty: 'easy',
    explanation: '15:30 + 1 hour = 16:30. 16:30 + 45 minutes = 17:15.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A student starts an exam at 09:00 and finishes at 10:55. How long did the exam last?',
    options: ['1 hour 50 minutes', '1 hour 55 minutes', '2 hours', '1 hour 45 minutes'],
    correctAnswer: '1 hour 55 minutes',
    difficulty: 'easy',
    explanation: '09:00 to 10:00 = 1 hour. 10:00 to 10:55 = 55 minutes. Total: 1 hour 55 minutes.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A library opens at 09:00 and closes at 17:30. How long is it open?',
    options: ['8 hours 15 minutes', '8 hours 30 minutes', '8 hours 45 minutes', '8 hours'],
    correctAnswer: '8 hours 30 minutes',
    difficulty: 'easy',
    explanation: '09:00 to 17:00 = 8 hours. 17:00 to 17:30 = 30 minutes. Total: 8 hours 30 minutes.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A runner starts a race at 11:25 and finishes at 13:10. How long did the race take?',
    options: ['1 hour 40 minutes', '1 hour 45 minutes', '1 hour 50 minutes', '1 hour 35 minutes'],
    correctAnswer: '1 hour 45 minutes',
    difficulty: 'medium',
    explanation: '11:25 to 12:25 = 1 hour. 12:25 to 13:10 = 45 minutes. Total: 1 hour 45 minutes.',
  },
  {
    appliesToFormat: '24hr',
    question: 'A factory starts at 06:20 and runs for 12 hours 15 minutes. What time does it stop?',
    options: ['18:30', '18:35', '18:40', '18:45'],
    correctAnswer: '18:35',
    difficulty: 'hard',
    explanation: '06:20 + 12 hours = 18:20. 18:20 + 15 minutes = 18:35.',
  },
  // ── Conversion problems (both formats) ───────────────────────
  {
    appliesToFormat: 'both',
    question: 'What is 3:00 pm in 24-hour time?',
    options: ['03:00', '15:00', '13:00', '14:00'],
    correctAnswer: '15:00',
    difficulty: 'easy',
    explanation: 'For pm times, add 12 to the hours: 3 + 12 = 15. So 3:00 pm = 15:00.',
  },
  {
    appliesToFormat: 'both',
    question: 'What is 21:45 in 12-hour time?',
    options: ['9:45 am', '9:45 pm', '11:45 pm', '10:45 pm'],
    correctAnswer: '9:45 pm',
    difficulty: 'easy',
    explanation: '21 − 12 = 9. Since 21:00 is after noon, it is pm. So 21:45 = 9:45 pm.',
  },
  {
    appliesToFormat: 'both',
    question: 'What is 6:30 am in 24-hour time?',
    options: ['6:30', '06:30', '18:30', '16:30'],
    correctAnswer: '06:30',
    difficulty: 'easy',
    explanation: 'For am times before noon, the hours stay the same — add a leading zero: 6:30 am = 06:30.',
  },
  {
    appliesToFormat: 'both',
    question: 'What is 8:15 pm in 24-hour time?',
    options: ['08:15', '20:15', '18:15', '19:15'],
    correctAnswer: '20:15',
    difficulty: 'easy',
    explanation: 'For pm times, add 12 to the hours: 8 + 12 = 20. So 8:15 pm = 20:15.',
  },
  {
    appliesToFormat: 'both',
    question: 'What is 13:05 in 12-hour time?',
    options: ['1:05 am', '1:05 pm', '3:05 pm', '2:05 pm'],
    correctAnswer: '1:05 pm',
    difficulty: 'easy',
    explanation: '13 − 12 = 1. Since 13:00 is after noon, it is pm. So 13:05 = 1:05 pm.',
  },
  {
    appliesToFormat: 'both',
    question: 'A timetable shows departures at 07:20 and 19:20. How many hours apart are the two trains?',
    options: ['6 hours', '8 hours', '10 hours', '12 hours'],
    correctAnswer: '12 hours',
    difficulty: 'easy',
    explanation: '19:20 − 07:20 = 12 hours. In 12-hour time these are both 7:20, one am and one pm.',
  },
  {
    appliesToFormat: 'both',
    question: 'What is midnight written in 24-hour time?',
    options: ['12:00', '24:00', '00:00', '0:00'],
    correctAnswer: '00:00',
    difficulty: 'medium',
    explanation: 'Midnight is the start of a new day, written as 00:00 in 24-hour time.',
  },
  {
    appliesToFormat: 'both',
    question: 'A train departs at 11:50 am. In 24-hour time, this is written as:',
    options: ['23:50', '11:50', '00:50', '12:50'],
    correctAnswer: '11:50',
    difficulty: 'easy',
    explanation: '11:50 am is before noon, so the 24-hour time is the same: 11:50.',
  },
  {
    appliesToFormat: 'both',
    question: 'What is 00:30 in 12-hour time?',
    options: ['12:30 pm', '12:30 am', '0:30 am', '12:30 midnight'],
    correctAnswer: '12:30 am',
    difficulty: 'medium',
    explanation: '00:30 is 30 minutes after midnight. In 12-hour time this is 12:30 am.',
  },
];

// ─────────────────────────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: TimeConfig = {
  mode: 'hours-minutes',
  format: '12hr',
  content: 'both',
};

@Injectable({ providedIn: 'root' })
export class TimeQuizService {
  readonly currentQuestions = signal<TimeQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly userAnswers = signal<Map<number, string>>(new Map());
  readonly quizActive = signal(false);
  readonly quizFinished = signal(false);
  readonly activeConfig = signal<TimeConfig>({ ...DEFAULT_CONFIG });

  readonly currentQuestion = computed(() => {
    const questions = this.currentQuestions();
    return questions[this.currentIndex()] ?? null;
  });

  readonly progress = computed(() => {
    const total = this.currentQuestions().length;
    return total > 0 ? (this.currentIndex() / total) * 100 : 0;
  });

  readonly result = computed<TimeQuizResult | null>(() => {
    if (!this.quizFinished()) return null;
    const questions = this.currentQuestions();
    const answers = this.userAnswers();
    let correct = 0;
    const wrong: TimeQuizResult['wrongAnswers'] = [];
    for (const q of questions) {
      const userAnswer = answers.get(q.id) ?? '';
      if (userAnswer === q.correctAnswer) {
        correct++;
      } else {
        wrong.push({ question: q, userAnswer });
      }
    }
    return { totalQuestions: questions.length, correctAnswers: correct, wrongAnswers: wrong };
  });

  startQuiz(config: TimeConfig, count: number): void {
    this.activeConfig.set({ ...config });

    let pool: TimeQuestion[] = [];

    if (config.content === 'clock') {
      pool = this.generateClockQuestions(config, count);
    } else if (config.content === 'problems') {
      pool = this.getProblems(config);
    } else {
      const half = Math.ceil(count / 2);
      const clocks = this.generateClockQuestions(config, half);
      const problems = shuffle(this.getProblems(config)).slice(0, count - half);
      pool = shuffle([...clocks, ...problems]);
    }

    pool = shuffle(pool).slice(0, Math.min(count, pool.length));

    this.currentQuestions.set(pool);
    this.currentIndex.set(0);
    this.userAnswers.set(new Map());
    this.quizActive.set(true);
    this.quizFinished.set(false);
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

  // ── Private helpers ────────────────────────────────────────────

  private getProblems(config: TimeConfig): TimeQuestion[] {
    return TIME_PROBLEMS
      .filter(p => p.appliesToFormat === config.format || p.appliesToFormat === 'both')
      .map((p, i) => ({ ...p, id: 2000 + i, type: 'problem' as const }));
  }

  private generateClockQuestions(config: TimeConfig, count: number): TimeQuestion[] {
    const result: TimeQuestion[] = [];
    const used = new Set<string>();

    for (let attempt = 0; result.length < count && attempt < count * 10; attempt++) {
      const q = this.makeClockQuestion(3000 + result.length, config);
      if (!used.has(q.correctAnswer)) {
        used.add(q.correctAnswer);
        result.push(q);
      }
    }
    return result;
  }

  private makeClockQuestion(id: number, config: TimeConfig): TimeQuestion {
    const maxH = config.format === '24hr' ? 24 : 12;
    // For 12hr hours-only, generate 1–12 (display-friendly)
    const rawH = config.format === '12hr' && config.mode === 'hours'
      ? Math.floor(Math.random() * 12) + 1   // 1-12
      : Math.floor(Math.random() * maxH);     // 0-11 or 0-23

    const minutes = config.mode === 'hours'
      ? 0
      : Math.floor(Math.random() * 60);

    const seconds = config.mode === 'hours-minutes-seconds'
      ? Math.floor(Math.random() * 60)
      : 0;

    const correct = formatTime(rawH, minutes, seconds, config.format, config.mode);
    const wrongs = this.wrongAnswers(rawH, minutes, seconds, correct, config, maxH);
    const allOptions = shuffle([correct, ...wrongs]);

    // Context hint for 24hr clock (clock face only shows 12hr)
    let context = '';
    if (config.format === '24hr') {
      context = rawH < 12 ? ' (It is in the morning.)' : ' (It is in the afternoon or evening.)';
    }

    const diffMap: Record<TimeMode, 'easy' | 'medium' | 'hard'> = {
      'hours': 'easy',
      'hours-minutes': 'medium',
      'hours-minutes-seconds': 'hard',
    };

    return {
      id,
      type: 'clock',
      clockHours: rawH,
      clockMinutes: minutes,
      clockSeconds: seconds,
      question: `What time does this clock show?${context}`,
      options: allOptions,
      correctAnswer: correct,
      difficulty: diffMap[config.mode],
      explanation: `The clock shows ${correct}.`,
    };
  }

  private wrongAnswers(
    h: number, m: number, s: number,
    correct: string,
    config: TimeConfig,
    maxH: number,
  ): string[] {
    const wrongs = new Set<string>();

    const tryAdd = (wh: number, wm: number, ws: number) => {
      if (wrongs.size >= 3) return;
      const w = formatTime(((wh % maxH) + maxH) % maxH, ((wm % 60) + 60) % 60, ((ws % 60) + 60) % 60, config.format, config.mode);
      if (w !== correct) wrongs.add(w);
    };

    if (config.mode === 'hours') {
      // Change hour by ±1, ±2, ±3
      for (const delta of shuffle([1, -1, 2, -2, 3, -3, 4, -4])) {
        tryAdd(h + delta, 0, 0);
      }
    } else if (config.mode === 'hours-minutes') {
      // Nearby minutes and hour shifts
      for (const delta of shuffle([5, -5, 10, -10, 15, -15])) {
        tryAdd(h, m + delta, 0);
      }
      tryAdd(h + 1, m, 0);
      tryAdd(h - 1, m, 0);
    } else {
      // Nearby seconds and minute shifts
      for (const delta of shuffle([5, -5, 10, -10, 15, -15])) {
        tryAdd(h, m, s + delta);
      }
      tryAdd(h, m + 1, s);
      tryAdd(h, m - 1, s);
    }

    // Fallback: random hours
    while (wrongs.size < 3) {
      const rh = Math.floor(Math.random() * maxH);
      tryAdd(rh, m, s);
    }

    return [...wrongs].slice(0, 3);
  }
}
