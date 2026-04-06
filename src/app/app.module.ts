import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { EnvelopComponent } from './components/envelop/envelop.component';
import { CountdownSectionComponent } from './components/envelop/countdown-section/countdown-section.component';
import { DirectionsSectionComponent } from './components/envelop/directions-section/directions-section.component';
import { HeroSectionComponent } from './components/envelop/hero-section/hero-section.component';
import { RsvpSectionComponent } from './components/envelop/rsvp-section/rsvp-section.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { ThankYouPageComponent } from './components/thank-you-page/thank-you-page.component';
import { RevealOnScrollDirective } from './reveal-on-scroll.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoadingScreenComponent,
    EnvelopComponent,
    HeroSectionComponent,
    CountdownSectionComponent,
    DirectionsSectionComponent,
    RsvpSectionComponent,
    ThankYouPageComponent,
    RevealOnScrollDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'he'
    })
  ],
  providers: [
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
