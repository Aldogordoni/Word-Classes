import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { WORD_CLASS_INFO } from '../../models/question.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent {
  wordClassInfo = WORD_CLASS_INFO;

  constructor(
    public quizService: QuizService,
    private router: Router,
  ) {
    if (!this.quizService.quizFinished()) {
      this.router.navigate(['/']);
    }
  }

  get result() {
    return this.quizService.result();
  }

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
    if (p === 100) return 'Perfect score! You\'re a word class superstar!';
    if (p >= 80) return 'Brilliant work! You really know your word classes!';
    if (p >= 60) return 'Great effort! Keep practising and you\'ll be even better!';
    if (p >= 40) return 'Good try! Have another go to improve your score!';
    return 'Keep going! Practice makes perfect!';
  }

  formatSentence(sentence: string): string {
    return sentence.replace(/\*\*(.*?)\*\*/g, '<strong class="highlighted-word">$1</strong>');
  }

  playAgain(): void {
    this.quizService.startQuiz(
      this.quizService.selectedWordClass(),
      this.quizService.currentQuestions().length,
    );
    this.router.navigate(['/quiz']);
  }

  goHome(): void {
    this.quizService.resetQuiz();
    this.router.navigate(['/']);
  }
}
