import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimeQuizService } from '../../services/time-quiz.service';
import { AnalogClockComponent } from '../analog-clock/analog-clock.component';

@Component({
  selector: 'app-time-quiz',
  standalone: true,
  imports: [CommonModule, AnalogClockComponent],
  templateUrl: './time-quiz.component.html',
  styleUrl: './time-quiz.component.css',
})
export class TimeQuizComponent implements OnInit {
  selectedAnswer = signal<string | null>(null);
  answered = signal(false);
  isCorrect = signal(false);

  constructor(
    public timeQuizService: TimeQuizService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.timeQuizService.quizActive()) {
      this.router.navigate(['/time']);
    }
  }

  get question() { return this.timeQuizService.currentQuestion(); }
  get questionNumber() { return this.timeQuizService.currentIndex() + 1; }
  get totalQuestions() { return this.timeQuizService.currentQuestions().length; }
  get progress() { return this.timeQuizService.progress(); }

  get showMinutes(): boolean {
    const mode = this.timeQuizService.activeConfig().mode;
    return mode === 'hours-minutes' || mode === 'hours-minutes-seconds';
  }

  get showSeconds(): boolean {
    return this.timeQuizService.activeConfig().mode === 'hours-minutes-seconds';
  }

  selectAnswer(answer: string): void {
    if (this.answered()) return;
    this.selectedAnswer.set(answer);
    this.answered.set(true);
    const correct = answer === this.question?.correctAnswer;
    this.isCorrect.set(correct);
    if (this.question) {
      this.timeQuizService.submitAnswer(this.question.id, answer);
    }
  }

  next(): void {
    this.selectedAnswer.set(null);
    this.answered.set(false);
    this.isCorrect.set(false);
    this.timeQuizService.nextQuestion();
    if (this.timeQuizService.quizFinished()) {
      this.router.navigate(['/time-results']);
    }
  }

  goHome(): void {
    this.timeQuizService.resetQuiz();
    this.router.navigate(['/time']);
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
