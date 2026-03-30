import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeQuizService } from '../../services/time-quiz.service';
import { TimeContent, TimeFormat, TimeMode } from '../../models/time-question.model';

@Component({
  selector: 'app-time-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-home.component.html',
  styleUrl: './time-home.component.css',
})
export class TimeHomeComponent {
  selectedContent: TimeContent = 'both';
  selectedMode: TimeMode = 'hours-minutes';
  selectedFormat: TimeFormat = '24hr';
  questionCount = 10;

  constructor(
    private readonly timeQuizService: TimeQuizService,
    private readonly router: Router,
  ) {}

  get showModeSelector(): boolean {
    return this.selectedContent === 'clock' || this.selectedContent === 'both';
  }

  startQuiz(): void {
    this.timeQuizService.startQuiz(
      { mode: this.selectedMode, format: this.selectedFormat, content: this.selectedContent },
      this.questionCount,
    );
    this.router.navigate(['/time-quiz']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
