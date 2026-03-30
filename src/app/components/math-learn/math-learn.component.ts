import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MATH_LEARN_CONTENT, MathTopicContent } from './math-learn-content';

@Component({
  selector: 'app-math-learn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './math-learn.component.html',
  styleUrl: './math-learn.component.css',
})
export class MathLearnComponent {
  readonly content = MATH_LEARN_CONTENT;
  activeId = 'area';

  constructor(private readonly router: Router) {}

  get active(): MathTopicContent {
    return this.content.find(c => c.id === this.activeId) ?? this.content[0];
  }

  select(id: string): void {
    this.activeId = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  startQuiz(): void {
    this.router.navigate(['/math-quiz']);
  }
}
