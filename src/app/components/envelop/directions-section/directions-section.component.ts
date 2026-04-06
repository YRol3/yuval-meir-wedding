import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-directions-section',
  standalone: false,
  templateUrl: './directions-section.component.html',
  styleUrl: './directions-section.component.css'
})
export class DirectionsSectionComponent implements OnInit, OnDestroy {
  directionsMapUrl: SafeResourceUrl;
  googleMapsUrl = '';
  wazeUrl = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly translate: TranslateService,
    private readonly sanitizer: DomSanitizer
  ) {
    this.directionsMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
  }

  ngOnInit(): void {
    this.updateDirectionsLinks();

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: LangChangeEvent) => {
        this.updateDirectionsLinks(event.lang as 'en' | 'he');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateDirectionsLinks(lang = this.currentLanguage): void {
    const destinationQuery = encodeURIComponent(this.translate.instant('envelop.directions.destinationQuery'));

    this.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${destinationQuery}`;
    this.wazeUrl = `https://waze.com/ul?q=${destinationQuery}&navigate=yes`;
    this.directionsMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${destinationQuery}&output=embed&hl=${lang}`
    );
  }

  private get currentLanguage(): 'en' | 'he' {
    return this.translate.currentLang === 'en' ? 'en' : 'he';
  }
}
