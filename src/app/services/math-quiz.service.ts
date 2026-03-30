import { Injectable, signal, computed } from '@angular/core';
import { MathQuestion, MathQuizResult, MathTopic } from '../models/math-question.model';

const MATH_QUESTION_BANK: MathQuestion[] = [
  // ── AREA: formula recall ──────────────────────────────────────────────────
  {
    id: 1,
    question: 'What is the formula for the area of a rectangle?',
    options: ['length + width', 'length × width', '2 × (length + width)', 'length × width × height'],
    correctAnswer: 'length × width',
    topic: 'area', difficulty: 'easy',
    explanation: 'Area of a rectangle = length × width. For example, a 5 cm × 3 cm rectangle has area 15 cm².',
  },
  {
    id: 2,
    question: 'What is the formula for the area of a square?',
    options: ['4 × side', 'side + side', 'side × side', '2 × side'],
    correctAnswer: 'side × side',
    topic: 'area', difficulty: 'easy',
    explanation: 'Area of a square = side × side. All four sides are equal so you multiply the side by itself.',
  },
  {
    id: 3,
    question: 'What is the formula for the area of a triangle?',
    options: ['base × height', '½ × base × height', 'base + height', '2 × base × height'],
    correctAnswer: '½ × base × height',
    topic: 'area', difficulty: 'easy',
    explanation: 'Area of a triangle = ½ × base × height. A triangle is exactly half of a rectangle with the same base and height.',
  },
  {
    id: 4,
    question: 'What is the formula for the area of a parallelogram?',
    options: ['base + height', 'base × height', '½ × base × height', '2 × (base + height)'],
    correctAnswer: 'base × height',
    topic: 'area', difficulty: 'medium',
    explanation: 'Area of a parallelogram = base × height. The height must be perpendicular (at right angles) to the base.',
  },
  // ── AREA: calculate ───────────────────────────────────────────────────────
  {
    id: 5,
    question: 'A rectangle has length 8 cm and width 5 cm. What is its area?',
    options: ['26 cm²', '13 cm²', '40 cm²', '45 cm²'],
    correctAnswer: '40 cm²',
    topic: 'area', difficulty: 'easy',
    explanation: 'Area = length × width = 8 × 5 = 40 cm².',
  },
  {
    id: 6,
    question: 'A square has sides of 7 cm. What is its area?',
    options: ['14 cm²', '28 cm²', '49 cm²', '42 cm²'],
    correctAnswer: '49 cm²',
    topic: 'area', difficulty: 'easy',
    explanation: 'Area = side × side = 7 × 7 = 49 cm².',
  },
  {
    id: 7,
    question: 'A triangle has a base of 10 cm and a height of 6 cm. What is its area?',
    options: ['60 cm²', '30 cm²', '16 cm²', '8 cm²'],
    correctAnswer: '30 cm²',
    topic: 'area', difficulty: 'easy',
    explanation: 'Area = ½ × base × height = ½ × 10 × 6 = 30 cm².',
  },
  {
    id: 8,
    question: 'A rectangle has length 12 cm and width 4 cm. What is its area?',
    options: ['32 cm²', '48 cm²', '16 cm²', '36 cm²'],
    correctAnswer: '48 cm²',
    topic: 'area', difficulty: 'easy',
    explanation: 'Area = length × width = 12 × 4 = 48 cm².',
  },
  {
    id: 9,
    question: 'A triangle has base 8 cm and height 5 cm. What is its area?',
    options: ['40 cm²', '13 cm²', '20 cm²', '80 cm²'],
    correctAnswer: '20 cm²',
    topic: 'area', difficulty: 'medium',
    explanation: 'Area = ½ × base × height = ½ × 8 × 5 = 20 cm².',
  },
  {
    id: 10,
    question: 'A parallelogram has base 9 cm and height 4 cm. What is its area?',
    options: ['26 cm²', '36 cm²', '13 cm²', '18 cm²'],
    correctAnswer: '36 cm²',
    topic: 'area', difficulty: 'medium',
    explanation: 'Area = base × height = 9 × 4 = 36 cm².',
  },
  {
    id: 11,
    question: 'A rectangle has length 7 cm and width 3 cm. What is its area?',
    options: ['10 cm²', '20 cm²', '21 cm²', '42 cm²'],
    correctAnswer: '21 cm²',
    topic: 'area', difficulty: 'easy',
    explanation: 'Area = length × width = 7 × 3 = 21 cm².',
  },
  {
    id: 12,
    question: 'A room is 8 m long and 6 m wide. What is its area?',
    options: ['14 m²', '28 m²', '48 m²', '96 m²'],
    correctAnswer: '48 m²',
    topic: 'area', difficulty: 'easy',
    explanation: 'Area = length × width = 8 × 6 = 48 m².',
  },
  // ── AREA: find missing dimension ──────────────────────────────────────────
  {
    id: 13,
    question: 'A rectangle has area 40 cm² and width 5 cm. What is its length?',
    options: ['8 cm', '35 cm', '4 cm', '45 cm'],
    correctAnswer: '8 cm',
    topic: 'area', difficulty: 'medium',
    explanation: 'length = area ÷ width = 40 ÷ 5 = 8 cm.',
  },
  {
    id: 14,
    question: 'A square has area 64 cm². What is the length of one side?',
    options: ['16 cm', '32 cm', '8 cm', '4 cm'],
    correctAnswer: '8 cm',
    topic: 'area', difficulty: 'medium',
    explanation: 'Area = side², so side = √64 = 8 cm. (Check: 8 × 8 = 64 ✓)',
  },
  {
    id: 15,
    question: 'A triangle has area 24 cm² and base 8 cm. What is its height?',
    options: ['3 cm', '6 cm', '16 cm', '12 cm'],
    correctAnswer: '6 cm',
    topic: 'area', difficulty: 'hard',
    explanation: 'Area = ½ × base × height, so height = (2 × area) ÷ base = 48 ÷ 8 = 6 cm.',
  },
  {
    id: 16,
    question: 'A rectangle has area 60 cm² and length 12 cm. What is its width?',
    options: ['48 cm', '5 cm', '6 cm', '4 cm'],
    correctAnswer: '5 cm',
    topic: 'area', difficulty: 'medium',
    explanation: 'width = area ÷ length = 60 ÷ 12 = 5 cm.',
  },
  {
    id: 17,
    question: 'Which shape has the greater area: a square with sides 6 cm, or a rectangle with length 8 cm and width 4 cm?',
    options: ['They are the same', 'The square (36 cm²)', 'The rectangle (32 cm²)', 'Cannot be determined'],
    correctAnswer: 'The square (36 cm²)',
    topic: 'area', difficulty: 'hard',
    explanation: 'Square area = 6 × 6 = 36 cm². Rectangle area = 8 × 4 = 32 cm². The square is larger.',
  },
  {
    id: 18,
    question: 'A square tile has sides of 4 cm. How many tiles are needed to cover an area of 80 cm²?',
    options: ['20', '5', '10', '16'],
    correctAnswer: '5',
    topic: 'area', difficulty: 'hard',
    explanation: 'Each tile has area = 4 × 4 = 16 cm². Number of tiles = 80 ÷ 16 = 5.',
  },
  // ── PERIMETER: formula recall ─────────────────────────────────────────────
  {
    id: 19,
    question: 'What is the formula for the perimeter of a rectangle?',
    options: ['length + width', 'length × width', '2 × (length + width)', '4 × length'],
    correctAnswer: '2 × (length + width)',
    topic: 'perimeter', difficulty: 'easy',
    explanation: 'Perimeter of a rectangle = 2 × (length + width). You add the length and width, then multiply by 2 because there are two of each side.',
  },
  {
    id: 20,
    question: 'What is the formula for the perimeter of a square?',
    options: ['2 × side', 'side × side', '4 × side', 'side²'],
    correctAnswer: '4 × side',
    topic: 'perimeter', difficulty: 'easy',
    explanation: 'Perimeter of a square = 4 × side. All four sides are equal, so you multiply one side by 4.',
  },
  // ── PERIMETER: calculate ──────────────────────────────────────────────────
  {
    id: 21,
    question: 'A rectangle has length 9 cm and width 4 cm. What is its perimeter?',
    options: ['26 cm', '36 cm', '13 cm', '17 cm'],
    correctAnswer: '26 cm',
    topic: 'perimeter', difficulty: 'easy',
    explanation: 'Perimeter = 2 × (9 + 4) = 2 × 13 = 26 cm.',
  },
  {
    id: 22,
    question: 'A square has sides of 8 cm. What is its perimeter?',
    options: ['16 cm', '64 cm', '24 cm', '32 cm'],
    correctAnswer: '32 cm',
    topic: 'perimeter', difficulty: 'easy',
    explanation: 'Perimeter = 4 × side = 4 × 8 = 32 cm.',
  },
  {
    id: 23,
    question: 'A rectangle has length 15 cm and width 6 cm. What is its perimeter?',
    options: ['21 cm', '90 cm', '42 cm', '31 cm'],
    correctAnswer: '42 cm',
    topic: 'perimeter', difficulty: 'easy',
    explanation: 'Perimeter = 2 × (15 + 6) = 2 × 21 = 42 cm.',
  },
  {
    id: 24,
    question: 'A garden is rectangular with length 12 m and width 5 m. How much fencing is needed to go all the way around?',
    options: ['60 m', '17 m', '34 m', '60 m²'],
    correctAnswer: '34 m',
    topic: 'perimeter', difficulty: 'medium',
    explanation: 'Fencing needed = perimeter = 2 × (12 + 5) = 2 × 17 = 34 m.',
  },
  // ── PERIMETER: find missing dimension ────────────────────────────────────
  {
    id: 25,
    question: 'A square has a perimeter of 36 cm. What is the length of one side?',
    options: ['12 cm', '6 cm', '9 cm', '18 cm'],
    correctAnswer: '9 cm',
    topic: 'perimeter', difficulty: 'medium',
    explanation: 'side = perimeter ÷ 4 = 36 ÷ 4 = 9 cm.',
  },
  {
    id: 26,
    question: 'A rectangle has perimeter 30 cm and length 10 cm. What is its width?',
    options: ['20 cm', '10 cm', '5 cm', '15 cm'],
    correctAnswer: '5 cm',
    topic: 'perimeter', difficulty: 'medium',
    explanation: 'Perimeter = 2 × (l + w), so 30 = 2 × (10 + w) → 15 = 10 + w → w = 5 cm.',
  },
  {
    id: 27,
    question: 'A rectangle has perimeter 24 cm and width 4 cm. What is its length?',
    options: ['10 cm', '8 cm', '20 cm', '6 cm'],
    correctAnswer: '8 cm',
    topic: 'perimeter', difficulty: 'medium',
    explanation: 'Perimeter = 2 × (l + w), so 24 = 2 × (l + 4) → 12 = l + 4 → l = 8 cm.',
  },
  // ── CIRCLE: concept ───────────────────────────────────────────────────────
  {
    id: 28,
    question: 'The radius of a circle is 6 cm. What is its diameter?',
    options: ['3 cm', '18 cm', '12 cm', '36 cm'],
    correctAnswer: '12 cm',
    topic: 'circle', difficulty: 'easy',
    explanation: 'Diameter = 2 × radius = 2 × 6 = 12 cm.',
  },
  {
    id: 29,
    question: 'The diameter of a circle is 18 cm. What is its radius?',
    options: ['36 cm', '9 cm', '6 cm', '12 cm'],
    correctAnswer: '9 cm',
    topic: 'circle', difficulty: 'easy',
    explanation: 'Radius = diameter ÷ 2 = 18 ÷ 2 = 9 cm.',
  },
  {
    id: 30,
    question: 'What does "r" represent in the formula A = πr²?',
    options: ['the diameter', 'the radius', 'the circumference', 'the area'],
    correctAnswer: 'the radius',
    topic: 'circle', difficulty: 'easy',
    explanation: '"r" is the radius — the distance from the centre of the circle to its edge. The diameter is twice the radius.',
  },
  {
    id: 31,
    question: 'A swimming pool has a circular end with a diameter of 8 m. What is its radius?',
    options: ['2 m', '4 m', '8 m', '16 m'],
    correctAnswer: '4 m',
    topic: 'circle', difficulty: 'easy',
    explanation: 'Radius = diameter ÷ 2 = 8 ÷ 2 = 4 m.',
  },
  // ── CIRCLE: formula recall ────────────────────────────────────────────────
  {
    id: 32,
    question: 'What is the formula for the circumference of a circle?',
    options: ['π × r²', 'π × diameter', 'π × radius', 'diameter²'],
    correctAnswer: 'π × diameter',
    topic: 'circle', difficulty: 'easy',
    explanation: 'Circumference = π × diameter (also written as 2 × π × r). π ≈ 3.14.',
  },
  {
    id: 33,
    question: 'What is the formula for the area of a circle?',
    options: ['π × d', 'π × r', 'π × r²', '2 × π × r'],
    correctAnswer: 'π × r²',
    topic: 'circle', difficulty: 'easy',
    explanation: 'Area of a circle = π × r² (pi times radius squared). π ≈ 3.14.',
  },
  {
    id: 34,
    question: 'Which formula gives the distance around a circle?',
    options: ['π × r²', 'r²', 'π × d', '2 × r'],
    correctAnswer: 'π × d',
    topic: 'circle', difficulty: 'easy',
    explanation: 'Circumference (distance around) = π × diameter. π ≈ 3.14.',
  },
  // ── CIRCLE: calculate ─────────────────────────────────────────────────────
  {
    id: 35,
    question: 'A circle has a diameter of 10 cm. What is its circumference? (Use π = 3.14)',
    options: ['31.4 cm', '78.5 cm', '15.7 cm', '62.8 cm'],
    correctAnswer: '31.4 cm',
    topic: 'circle', difficulty: 'medium',
    explanation: 'Circumference = π × diameter = 3.14 × 10 = 31.4 cm.',
  },
  {
    id: 36,
    question: 'A circle has a radius of 5 cm. What is its area? (Use π = 3.14)',
    options: ['15.7 cm²', '31.4 cm²', '78.5 cm²', '157 cm²'],
    correctAnswer: '78.5 cm²',
    topic: 'circle', difficulty: 'medium',
    explanation: 'Area = π × r² = 3.14 × 5² = 3.14 × 25 = 78.5 cm².',
  },
  {
    id: 37,
    question: 'A circle has a diameter of 20 cm. What is its circumference? (Use π = 3.14)',
    options: ['31.4 cm', '62.8 cm', '314 cm', '125.6 cm'],
    correctAnswer: '62.8 cm',
    topic: 'circle', difficulty: 'medium',
    explanation: 'Circumference = π × diameter = 3.14 × 20 = 62.8 cm.',
  },
  {
    id: 38,
    question: 'A circle has a radius of 3 cm. What is its area? (Use π = 3.14)',
    options: ['9.42 cm²', '28.26 cm²', '18.84 cm²', '6.28 cm²'],
    correctAnswer: '28.26 cm²',
    topic: 'circle', difficulty: 'medium',
    explanation: 'Area = π × r² = 3.14 × 3² = 3.14 × 9 = 28.26 cm².',
  },
  {
    id: 39,
    question: 'A circle has a radius of 7 cm. What is its area? (Use π = 3.14)',
    options: ['43.96 cm²', '153.86 cm²', '21.98 cm²', '49 cm²'],
    correctAnswer: '153.86 cm²',
    topic: 'circle', difficulty: 'medium',
    explanation: 'Area = π × r² = 3.14 × 7² = 3.14 × 49 = 153.86 cm².',
  },
  // ── VOLUME: formula recall ────────────────────────────────────────────────
  {
    id: 40,
    question: 'What is the formula for the volume of a cuboid?',
    options: ['length + width + height', 'length × width', 'length × width × height', '2(lw + lh + wh)'],
    correctAnswer: 'length × width × height',
    topic: 'volume', difficulty: 'easy',
    explanation: 'Volume of a cuboid = length × width × height. This tells you how much space is inside.',
  },
  {
    id: 41,
    question: 'What is the formula for the volume of a cube?',
    options: ['6 × side²', 'side²', 'side × side × side', '4 × side'],
    correctAnswer: 'side × side × side',
    topic: 'volume', difficulty: 'easy',
    explanation: 'Volume of a cube = side × side × side (or side³). All sides of a cube are equal.',
  },
  // ── VOLUME: calculate ─────────────────────────────────────────────────────
  {
    id: 42,
    question: 'A cuboid has length 5 cm, width 4 cm, and height 3 cm. What is its volume?',
    options: ['12 cm³', '47 cm³', '60 cm³', '20 cm³'],
    correctAnswer: '60 cm³',
    topic: 'volume', difficulty: 'easy',
    explanation: 'Volume = 5 × 4 × 3 = 60 cm³.',
  },
  {
    id: 43,
    question: 'A cube has sides of 3 cm. What is its volume?',
    options: ['9 cm³', '27 cm³', '18 cm³', '81 cm³'],
    correctAnswer: '27 cm³',
    topic: 'volume', difficulty: 'easy',
    explanation: 'Volume = 3 × 3 × 3 = 27 cm³.',
  },
  {
    id: 44,
    question: 'A cuboid has length 6 cm, width 4 cm, and height 5 cm. What is its volume?',
    options: ['120 cm³', '15 cm³', '240 cm³', '96 cm³'],
    correctAnswer: '120 cm³',
    topic: 'volume', difficulty: 'easy',
    explanation: 'Volume = 6 × 4 × 5 = 120 cm³.',
  },
  {
    id: 45,
    question: 'A cube has sides of 5 cm. What is its volume?',
    options: ['25 cm³', '15 cm³', '75 cm³', '125 cm³'],
    correctAnswer: '125 cm³',
    topic: 'volume', difficulty: 'easy',
    explanation: 'Volume = 5 × 5 × 5 = 125 cm³.',
  },
  {
    id: 46,
    question: 'A box is 10 cm long, 5 cm wide, and 2 cm tall. What is its volume?',
    options: ['17 cm³', '100 cm³', '50 cm³', '34 cm³'],
    correctAnswer: '100 cm³',
    topic: 'volume', difficulty: 'easy',
    explanation: 'Volume = 10 × 5 × 2 = 100 cm³.',
  },
  // ── VOLUME: find missing dimension ────────────────────────────────────────
  {
    id: 47,
    question: 'A cuboid has volume 120 cm³, length 10 cm, and width 4 cm. What is its height?',
    options: ['3 cm', '12 cm', '30 cm', '6 cm'],
    correctAnswer: '3 cm',
    topic: 'volume', difficulty: 'hard',
    explanation: 'height = volume ÷ (length × width) = 120 ÷ (10 × 4) = 120 ÷ 40 = 3 cm.',
  },
  {
    id: 48,
    question: 'A cuboid has volume 180 cm³, length 9 cm, and height 4 cm. What is its width?',
    options: ['36 cm', '5 cm', '20 cm', '8 cm'],
    correctAnswer: '5 cm',
    topic: 'volume', difficulty: 'hard',
    explanation: 'width = volume ÷ (length × height) = 180 ÷ (9 × 4) = 180 ÷ 36 = 5 cm.',
  },
  {
    id: 49,
    question: 'A cube has volume 64 cm³. What is the length of one side?',
    options: ['8 cm', '16 cm', '32 cm', '4 cm'],
    correctAnswer: '4 cm',
    topic: 'volume', difficulty: 'hard',
    explanation: 'Volume = side³, so side = ∛64 = 4 cm. (Check: 4 × 4 × 4 = 64 ✓)',
  },
  {
    id: 50,
    question: 'A cuboid has length 8 cm, height 3 cm, and volume 96 cm³. What is its width?',
    options: ['4 cm', '12 cm', '2 cm', '6 cm'],
    correctAnswer: '4 cm',
    topic: 'volume', difficulty: 'hard',
    explanation: 'width = volume ÷ (length × height) = 96 ÷ (8 × 3) = 96 ÷ 24 = 4 cm.',
  },
];

@Injectable({ providedIn: 'root' })
export class MathQuizService {
  private readonly allQuestions = MATH_QUESTION_BANK;

  readonly currentQuestions = signal<MathQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly userAnswers = signal<Map<number, string>>(new Map());
  readonly quizActive = signal(false);
  readonly quizFinished = signal(false);
  readonly selectedTopic = signal<MathTopic | 'all'>('all');

  readonly currentQuestion = computed(() => {
    const questions = this.currentQuestions();
    const idx = this.currentIndex();
    return questions[idx] ?? null;
  });

  readonly progress = computed(() => {
    const total = this.currentQuestions().length;
    return total > 0 ? (this.currentIndex() / total) * 100 : 0;
  });

  readonly result = computed<MathQuizResult | null>(() => {
    if (!this.quizFinished()) return null;
    const questions = this.currentQuestions();
    const answers = this.userAnswers();
    let correct = 0;
    const wrong: MathQuizResult['wrongAnswers'] = [];

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

  readonly totalQuestions = MATH_QUESTION_BANK.length;

  startQuiz(topic: MathTopic | 'all', count: number = 10): void {
    let pool = topic === 'all'
      ? [...this.allQuestions]
      : this.allQuestions.filter(q => q.topic === topic);

    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const shuffled = pool.slice(0, Math.min(count, pool.length)).map(q => {
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
    this.selectedTopic.set(topic);
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

  getAvailableTopics(): (MathTopic | 'all')[] {
    return ['all', 'area', 'perimeter', 'circle', 'volume'];
  }
}
