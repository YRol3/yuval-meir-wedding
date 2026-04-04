import { Component, OnDestroy, OnInit } from '@angular/core';

type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';

@Component({
  selector: 'app-countdown-section',
  standalone: false,
  templateUrl: './countdown-section.component.html',
  styleUrl: './countdown-section.component.css'
})
export class CountdownSectionComponent implements OnInit, OnDestroy {
  private readonly targetDate = new Date('2026-09-15T19:30:00+03:00');
  private intervalId: ReturnType<typeof setInterval> | null = null;

  countdown: Record<CountdownUnit, string> = {
    days: '000',
    hours: '00',
    minutes: '00',
    seconds: '00'
  };

  ngOnInit(): void {
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const diff = Math.max(0, this.targetDate.getTime() - now);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    this.countdown = {
      days: String(days).padStart(3, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }
}
