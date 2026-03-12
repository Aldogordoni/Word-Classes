import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { WORD_CLASS_INFO, WordClass } from '../../models/question.model';
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

  constructor(
    private quizService: QuizService,
    private router: Router,
  ) {
    this.wordClasses = this.quizService.getAvailableWordClasses();
  }

  get loadingGenerated() { return this.quizService.loadingGenerated(); }
  get totalAvailable() { return this.quizService.totalAvailable(); }

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

  startQuiz(): void {
    this.quizService.startQuiz(this.selectedClass, this.questionCount);
    this.router.navigate(['/quiz']);
  }

  selectAndStart(wc: WordClass | 'all'): void {
    this.selectedClass = wc;
    this.startQuiz();
  }

  goLearn(): void {
    this.router.navigate(['/learn']);
  }
}
