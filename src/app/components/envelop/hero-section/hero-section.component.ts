import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: false,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) active = false;
  @Output() readonly scrollNext = new EventEmitter<void>();

  @ViewChild('heroVideo', { static: true })
  private heroVideoRef!: ElementRef<HTMLVideoElement>;

  started = false;
  private readonly playbackSpeed = 0.5;

  ngAfterViewInit(): void {
    if (this.active) {
      this.startVideo();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue) {
      this.startVideo();
    }
  }

  requestScrollNext(): void {
    this.scrollNext.emit();
  }

  private startVideo(): void {
    if (this.started) {
      return;
    }

    this.started = true;

    const heroVideo = this.heroVideoRef.nativeElement;
    heroVideo.playbackRate = this.playbackSpeed;
    void heroVideo.play();
  }
}
