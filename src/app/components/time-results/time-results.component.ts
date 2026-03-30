import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimeQuizService } from '../../services/time-quiz.service';
import { AnalogClockComponent } from '../analog-clock/analog-clock.component';

@Component({
  selector: 'app-time-results',
  standalone: true,
  imports: [CommonModule, AnalogClockComponent],
  templateUrl: './time-results.component.html',
  styleUrl: './time-results.component.css',
})
export class TimeResultsComponent {
  constructor(
    public timeQuizService: TimeQuizService,
    private readonly router: Router,
  ) {
    if (!this.timeQuizService.quizFinished()) {
      this.router.navigate(['/time']);
    }
  }

  get result() { return this.timeQuizService.result(); }

  get percentage() {
    if (!this.result) return 0;
    return Math.round((this.result.correctAnswers / this.result.totalQuestions) * 100);
  }

  get stars() {
    const p = this.percentage;
    if (p >= 90) return 3;
    if (p >= 60) return 2;
    if (p >= 30) return 1;
    return 0;
  }

  get message() {
    const p = this.percentage;
    if (p === 100) return 'Perfect! You\'re a time master!';
    if (p >= 80) return 'Brilliant! You really know your time!';
    if (p >= 60) return 'Great effort! Keep practising!';
    if (p >= 40) return 'Good try! Have another go!';
    return 'Keep going! Practice makes perfect!';
  }

  get showMinutes(): boolean {
    const mode = this.timeQuizService.activeConfig().mode;
    return mode === 'hours-minutes' || mode === 'hours-minutes-seconds';
  }

  get showSeconds(): boolean {
    return this.timeQuizService.activeConfig().mode === 'hours-minutes-seconds';
  }

  playAgain(): void {
    this.timeQuizService.startQuiz(
      this.timeQuizService.activeConfig(),
      this.timeQuizService.currentQuestions().length,
    );
    this.router.navigate(['/time-quiz']);
  }

  goHome(): void {
    this.timeQuizService.resetQuiz();
    this.router.navigate(['/time']);
  }
}
