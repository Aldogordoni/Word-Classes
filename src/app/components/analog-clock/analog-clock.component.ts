import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tick {
  x1: number; y1: number;
  x2: number; y2: number;
  major: boolean;
}

interface ClockNumber {
  label: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-analog-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analog-clock.component.html',
  styleUrl: './analog-clock.component.css',
})
export class AnalogClockComponent implements OnChanges {
  @Input() hours = 12;
  @Input() minutes = 0;
  @Input() seconds = 0;
  @Input() showMinutes = true;
  @Input() showSeconds = false;

  ticks: Tick[] = [];
  clockNumbers: ClockNumber[] = [];

  hourHandX = 100;
  hourHandY = 50;
  minuteHandX = 100;
  minuteHandY = 28;
  secondHandX = 100;
  secondHandY = 22;

  ngOnChanges(): void {
    this.buildTicks();
    this.buildNumbers();
    this.computeHands();
  }

  private rad(deg: number): number {
    return deg * Math.PI / 180;
  }

  private handEnd(angleDeg: number, length: number): { x: number; y: number } {
    const a = this.rad(angleDeg);
    return { x: 100 + length * Math.sin(a), y: 100 - length * Math.cos(a) };
  }

  private buildTicks(): void {
    this.ticks = [];
    for (let i = 0; i < 60; i++) {
      const a = this.rad(i * 6);
      const major = i % 5 === 0;
      const outerR = 88;
      const innerR = major ? 74 : 82;
      this.ticks.push({
        x1: 100 + outerR * Math.sin(a),
        y1: 100 - outerR * Math.cos(a),
        x2: 100 + innerR * Math.sin(a),
        y2: 100 - innerR * Math.cos(a),
        major,
      });
    }
  }

  private buildNumbers(): void {
    this.clockNumbers = [];
    for (let i = 1; i <= 12; i++) {
      const a = this.rad(i * 30);
      this.clockNumbers.push({
        label: String(i),
        x: 100 + 67 * Math.sin(a),
        y: 100 - 67 * Math.cos(a),
      });
    }
  }

  private computeHands(): void {
    const hourAngle = ((this.hours % 12) + this.minutes / 60) * 30;
    const minuteAngle = (this.minutes + this.seconds / 60) * 6;
    const secondAngle = this.seconds * 6;

    const h = this.handEnd(hourAngle, 50);
    this.hourHandX = h.x;
    this.hourHandY = h.y;

    const m = this.handEnd(minuteAngle, 72);
    this.minuteHandX = m.x;
    this.minuteHandY = m.y;

    const s = this.handEnd(secondAngle, 80);
    this.secondHandX = s.x;
    this.secondHandY = s.y;
  }
}
