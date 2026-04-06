import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

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

  @ViewChild('scrolldown')
  private scrolldownRef?: ElementRef<HTMLElement>;

  startedSound = false;
  soundEnabled = true;

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

  scrollDown(): void {
    this.scrolldownRef?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  async switchLanguage(lang: 'en' | 'he'): Promise<void> {
    if (this.currentLanguage === lang) {
      return;
    }

    await firstValueFrom(this.translate.use(lang));
  }

  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
    this.musicRef.nativeElement.muted = !this.soundEnabled;
  }

  get currentLanguage(): 'en' | 'he' {
    return this.translate.currentLang === 'en' ? 'en' : 'he';
  }

  private startExperienceSound(): void {
    if (this.startedSound) {
      return;
    }

    this.startedSound = true;
    this.musicRef.nativeElement.muted = !this.soundEnabled;
    void this.musicRef.nativeElement.play();
  }
}
