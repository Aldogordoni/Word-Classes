import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { WORD_CLASS_INFO } from '../../models/question.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit {
  selectedAnswer = signal<string | null>(null);
  answered = signal(false);
  isCorrect = signal(false);
  wordClassInfo = WORD_CLASS_INFO;

  constructor(
    public quizService: QuizService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.quizService.quizActive()) {
      this.router.navigate(['/']);
    }
  }

  get question() {
    return this.quizService.currentQuestion();
  }

  get questionNumber() {
    return this.quizService.currentIndex() + 1;
  }

  get totalQuestions() {
    return this.quizService.currentQuestions().length;
  }

  get progress() {
    return this.quizService.progress();
  }

  formatSentence(sentence: string): string {
    return sentence.replaceAll(/\*\*(.*?)\*\*/g, '<strong class="highlighted-word">$1</strong>');
  }

  selectAnswer(answer: string): void {
    if (this.answered()) return;
    this.selectedAnswer.set(answer);
    this.answered.set(true);
    const correct = answer === this.question?.correctAnswer;
    this.isCorrect.set(correct);
    if (this.question) {
      this.quizService.submitAnswer(this.question.id, answer);
    }
  }

  next(): void {
    this.selectedAnswer.set(null);
    this.answered.set(false);
    this.isCorrect.set(false);
    this.quizService.nextQuestion();
    if (this.quizService.quizFinished()) {
      this.router.navigate(['/results']);
    }
  }

  goHome(): void {
    this.quizService.resetQuiz();
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

  getQuestionTypeLabel(): string {
    switch (this.question?.type) {
      case 'identify':
        return 'What word class is the highlighted word?';
      case 'classify':
        return '';
      case 'fill-blank':
        return 'Choose the correct word to fill the gap.';
      default:
        return '';
    }
  }
}
