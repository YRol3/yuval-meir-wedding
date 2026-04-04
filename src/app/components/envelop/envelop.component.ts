import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-envelop',
  standalone: false,
  templateUrl: './envelop.component.html',
  styleUrl: './envelop.component.css'
})
export class EnvelopComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) active = false;
  @Input({ required: true }) activeVideo = false;

  @ViewChild('musicPlayer', { static: true })
  private musicRef!: ElementRef<HTMLAudioElement>;

  @ViewChild('countdownSection')
  private countdownSectionRef?: ElementRef<HTMLElement>;

  startedSound = false;

  constructor(private readonly translate: TranslateService) {}

  ngAfterViewInit(): void {
    if (this.active) {
      this.startExperienceSound();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['active']?.currentValue) {
      this.startExperienceSound();
    }
  }

  ngOnDestroy(): void {
    this.musicRef.nativeElement.pause();
  }

  scrollToCountdown(): void {
    this.countdownSectionRef?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  switchLanguage(lang: 'en' | 'he'): void {
    if (this.currentLanguage === lang) {
      return;
    }

    void this.translate.use(lang);
  }

  get currentLanguage(): 'en' | 'he' {
    return this.translate.currentLang === 'en' ? 'en' : 'he';
  }

  private startExperienceSound(): void {
    if (this.startedSound) {
      return;
    }

    this.startedSound = true;
    void this.musicRef.nativeElement.play();
  }
}
