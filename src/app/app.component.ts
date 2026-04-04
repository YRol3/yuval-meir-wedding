import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  experienceStarted = false;
  showLoadingScreen = true;

  constructor(
    private readonly translate: TranslateService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.translate.addLangs(['he', 'en']);

    this.translate.setDefaultLang('he');

    const activeLang = 'he';

    this.translate.use(activeLang);
    this.updateDocumentLanguage(activeLang);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateDocumentLanguage(event.lang);
    });
  }

  private updateDocumentLanguage(lang: string): void {
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }

  handleLoadingStarted(): void {
    this.experienceStarted = true;
  }

  handleLoadingCompleted(): void {
    this.showLoadingScreen = false;
  }
}
