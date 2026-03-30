import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { MathQuizService } from '../../services/math-quiz.service';
import { WORD_CLASS_INFO, WordClass } from '../../models/question.model';
import { MATH_TOPIC_INFO, MathTopic } from '../../models/math-question.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  wordClassInfo = WORD_CLASS_INFO;
  selectedClass: WordClass | 'all' = 'all';
  questionCount = 10;
  wordClasses: (WordClass | 'all')[];

  mathQuestionCount = 10;
  mathTopics: (MathTopic | 'all')[];

  constructor(
    private readonly quizService: QuizService,
    private readonly mathQuizService: MathQuizService,
    private readonly router: Router,
  ) {
    this.wordClasses = this.quizService.getAvailableWordClasses();
    this.mathTopics = this.mathQuizService.getAvailableTopics();
  }

  // ── Word Classes ──────────────────────────────────────────────────────────

  get loadingGenerated() {
    return this.quizService.loadingGenerated();
  }
  get totalAvailable() {
    return this.quizService.totalAvailable();
  }

  getLabel(wc: WordClass | 'all'): string {
    return wc === 'all' ? 'All Word Classes' : WORD_CLASS_INFO[wc].label;
  }

  getColour(wc: WordClass | 'all'): string {
    return wc === 'all' ? '#6c5ce7' : WORD_CLASS_INFO[wc].colour;
  }

  getDescription(wc: WordClass | 'all'): string {
    return wc === 'all'
      ? 'Practise all 8 word classes mixed together.'
      : WORD_CLASS_INFO[wc].description;
  }

  selectAndStart(wc: WordClass | 'all'): void {
    this.selectedClass = wc;
    this.quizService.startQuiz(wc, this.questionCount);
    this.router.navigate(['/quiz']);
  }

  goLearn(): void {
    this.router.navigate(['/learn']);
  }

  // ── Maths ─────────────────────────────────────────────────────────────────

  get mathTotalQuestions() {
    return this.mathQuizService.totalQuestions;
  }

  getMathLabel(topic: MathTopic | 'all'): string {
    return MATH_TOPIC_INFO[topic].label;
  }

  getMathColour(topic: MathTopic | 'all'): string {
    return MATH_TOPIC_INFO[topic].colour;
  }

  getMathIcon(topic: MathTopic | 'all'): string {
    return MATH_TOPIC_INFO[topic].icon;
  }

  getMathDescription(topic: MathTopic | 'all'): string {
    return MATH_TOPIC_INFO[topic].description;
  }

  startMathQuiz(topic: MathTopic | 'all'): void {
    this.mathQuizService.startQuiz(topic, this.mathQuestionCount);
    this.router.navigate(['/math-quiz']);
  }

  goMathLearn(): void {
    this.router.navigate(['/math-learn']);
  }

  goTime(): void {
    this.router.navigate(['/time']);
  }
}
