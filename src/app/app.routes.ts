import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultsComponent } from './components/results/results.component';
import { LearnComponent } from './components/learn/learn.component';
import { MathQuizComponent } from './components/math-quiz/math-quiz.component';
import { MathResultsComponent } from './components/math-results/math-results.component';
import { MathLearnComponent } from './components/math-learn/math-learn.component';
import { TimeHomeComponent } from './components/time-home/time-home.component';
import { TimeQuizComponent } from './components/time-quiz/time-quiz.component';
import { TimeResultsComponent } from './components/time-results/time-results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'learn', component: LearnComponent },
  { path: 'math-quiz', component: MathQuizComponent },
  { path: 'math-results', component: MathResultsComponent },
  { path: 'math-learn', component: MathLearnComponent },
  { path: 'time', component: TimeHomeComponent },
  { path: 'time-quiz', component: TimeQuizComponent },
  { path: 'time-results', component: TimeResultsComponent },
  { path: '**', redirectTo: '' },
];
