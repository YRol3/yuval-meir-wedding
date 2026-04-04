import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  standalone: false,
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.css'
})
export class LoadingScreenComponent implements AfterViewInit {
  @Output() readonly experienceStarted = new EventEmitter<void>();
  @Output() readonly experienceCompleted = new EventEmitter<void>();

  @ViewChild('videoPlayer')
  private videoRef?: ElementRef<HTMLVideoElement>;

  started = false;
  isFadingOut = false;
  imageLoaded = false;
  isReady = false;
  videoSource: string | null = null;

  ngAfterViewInit(): void {
    if (this.imageLoaded) {
      this.beginMediaPreload();
    }
  }

  handleImageLoad(): void {
    this.imageLoaded = true;
    this.beginMediaPreload();
  }

  startExperience(): void {
    if (!this.isReady || this.started) {
      return;
    }

    this.started = true;
    this.experienceStarted.emit();

    const video = this.videoRef?.nativeElement;

    if (!video) {
      return;
    }

    video.addEventListener('timeupdate', this.handleVideoProgress, { passive: true });
    video.addEventListener(
      'ended',
      () => {
        this.experienceCompleted.emit();
      },
      { once: true }
    );

    void video.play();
  }

  private beginMediaPreload(): void {
    if (this.videoSource) {
      this.waitForVideoReadiness();
      return;
    }

    this.videoSource = 'assets/envelop.mp4';

    queueMicrotask(() => {
      this.waitForVideoReadiness();
    });
  }

  private waitForVideoReadiness(): void {
    const video = this.videoRef?.nativeElement;

    if (!video) {
      return;
    }

    const markReady = () => {
      this.isReady = true;
    };

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      markReady();
      return;
    }

    video.addEventListener('canplaythrough', markReady, { once: true });
    video.load();
  }

  private readonly handleVideoProgress = (): void => {
    const video = this.videoRef?.nativeElement;

    if (!video || !Number.isFinite(video.duration)) {
      return;
    }

    if (video.duration - video.currentTime <= 2) {
      this.isFadingOut = true;
    }
  };
}
