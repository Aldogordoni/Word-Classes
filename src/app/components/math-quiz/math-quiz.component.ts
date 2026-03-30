import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MathQuizService } from '../../services/math-quiz.service';

@Component({
  selector: 'app-math-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './math-quiz.component.html',
  styleUrl: './math-quiz.component.css',
})
export class MathQuizComponent implements OnInit {
  selectedAnswer = signal<string | null>(null);
  answered = signal(false);
  isCorrect = signal(false);

  constructor(
    public mathQuizService: MathQuizService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.mathQuizService.quizActive()) {
      this.router.navigate(['/']);
    }
  }

  get question() { return this.mathQuizService.currentQuestion(); }
  get questionNumber() { return this.mathQuizService.currentIndex() + 1; }
  get totalQuestions() { return this.mathQuizService.currentQuestions().length; }
  get progress() { return this.mathQuizService.progress(); }

  selectAnswer(answer: string): void {
    if (this.answered()) return;
    this.selectedAnswer.set(answer);
    this.answered.set(true);
    const correct = answer === this.question?.correctAnswer;
    this.isCorrect.set(correct);
    if (this.question) {
      this.mathQuizService.submitAnswer(this.question.id, answer);
    }
  }

  next(): void {
    this.selectedAnswer.set(null);
    this.answered.set(false);
    this.isCorrect.set(false);
    this.mathQuizService.nextQuestion();
    if (this.mathQuizService.quizFinished()) {
      this.router.navigate(['/math-results']);
    }
  }

  goHome(): void {
    this.mathQuizService.resetQuiz();
    this.router.navigate(['/']);
  }

  getDifficultyLabel(): string {
    switch (this.question?.difficulty) {
      case 'easy': return '🟢 Easy';
      case 'medium': return '🟡 Medium';
      case 'hard': return '🔴 Hard';
      default: return '';
    }
  }

  getDifficultyClass(): string {
    return this.question?.difficulty ?? '';
  }
}
