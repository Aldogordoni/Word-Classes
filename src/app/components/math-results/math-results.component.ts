import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MathQuizService } from '../../services/math-quiz.service';

@Component({
  selector: 'app-math-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './math-results.component.html',
  styleUrl: './math-results.component.css',
})
export class MathResultsComponent {
  constructor(
    public mathQuizService: MathQuizService,
    private router: Router,
  ) {
    if (!this.mathQuizService.quizFinished()) {
      this.router.navigate(['/']);
    }
  }

  get result() { return this.mathQuizService.result(); }

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
    if (p === 100) return 'Perfect score! You\'re a maths superstar!';
    if (p >= 80) return 'Brilliant work! You really know your formulas!';
    if (p >= 60) return 'Great effort! Keep practising and you\'ll be even better!';
    if (p >= 40) return 'Good try! Have another go to improve your score!';
    return 'Keep going! Practice makes perfect!';
  }

  playAgain(): void {
    this.mathQuizService.startQuiz(
      this.mathQuizService.selectedTopic(),
      this.mathQuizService.currentQuestions().length,
    );
    this.router.navigate(['/math-quiz']);
  }

  goHome(): void {
    this.mathQuizService.resetQuiz();
    this.router.navigate(['/']);
  }
}
