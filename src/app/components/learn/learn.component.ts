import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LEARN_CONTENT, WordClassContent } from './learn-content';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.css',
})
export class LearnComponent {
  readonly content = LEARN_CONTENT;
  activeId = 'noun';

  constructor(private router: Router) {}

  get active(): WordClassContent {
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
    this.router.navigate(['/']);
  }
}
