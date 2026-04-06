import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: false,
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) active = false;
  @Input({ required: true }) activeVideo = false;
  @Output() readonly scrollNext = new EventEmitter<void>();

  @ViewChild('heroForwardVideo', { static: true })
  private heroForwardVideoRef!: ElementRef<HTMLVideoElement>;

  @ViewChild('heroBackVideo', { static: true })
  private heroBackVideoRef!: ElementRef<HTMLVideoElement>;

  started = false;
  showingForwardVideo = true;
  private readonly playbackSpeed = 0.5;

  ngAfterViewInit(): void {
    this.applyPlaybackSpeed();

    if (this.activeVideo) {
      this.startVideo();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeVideo']?.currentValue) {
      this.startVideo();
    }
  }

  ngOnDestroy(): void {
    this.heroForwardVideoRef.nativeElement.pause();
    this.heroBackVideoRef.nativeElement.pause();
  }

  requestScrollNext(): void {
    this.scrollNext.emit();
  }

  handleVideoEnded(video: 'forward' | 'back'): void {
    if (video === 'forward') {
      this.playVideo('back');
      return;
    }

    this.playVideo('forward');
  }

  private startVideo(): void {
    if (this.started) {
      return;
    }

    this.started = true;
    this.playVideo('forward');
  }

  private applyPlaybackSpeed(): void {
    this.heroForwardVideoRef.nativeElement.playbackRate = this.playbackSpeed;
    this.heroBackVideoRef.nativeElement.playbackRate = this.playbackSpeed;
  }

  private playVideo(video: 'forward' | 'back'): void {
    const nextVideo =
      video === 'forward'
        ? this.heroForwardVideoRef.nativeElement
        : this.heroBackVideoRef.nativeElement;
    const previousVideo =
      video === 'forward'
        ? this.heroBackVideoRef.nativeElement
        : this.heroForwardVideoRef.nativeElement;

    previousVideo.pause();
    nextVideo.currentTime = 0;
    this.showingForwardVideo = video === 'forward';
    void nextVideo.play();
  }
}
