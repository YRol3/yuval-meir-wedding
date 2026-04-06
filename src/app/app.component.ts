import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InviteContextService } from './invite-context.service';
import { AppView, AppViewService } from './app-view.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  experienceStarted = false;
  showLoadingScreen = true;
  currentView: AppView = 'invite';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly translate: TranslateService,
    private readonly inviteContext: InviteContextService,
    private readonly appView: AppViewService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.translate.addLangs(['he', 'en']);

    this.translate.setDefaultLang('he');
    this.inviteContext.loadFromUrl(this.document.location.search);
    this.appView.syncFromPath(this.document.location.pathname);

    const activeLang = this.inviteContext.preferredLanguage;

    this.translate.use(activeLang);
    this.updateDocumentLanguage(activeLang);

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: LangChangeEvent) => {
        this.updateDocumentLanguage(event.lang);
      });

    this.appView.view$
      .pipe(takeUntil(this.destroy$))
      .subscribe((view) => {
        this.currentView = view;
      });

    fromEvent(this.document.defaultView ?? window, 'popstate')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.appView.syncFromPath(this.document.location.pathname);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
