import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AppView = 'invite' | 'thanks';

@Injectable({
  providedIn: 'root'
})
export class AppViewService {
  private readonly viewSubject = new BehaviorSubject<AppView>('invite');

  readonly view$ = this.viewSubject.asObservable();

  syncFromPath(pathname: string): void {
    this.viewSubject.next(pathname === '/thanks' ? 'thanks' : 'invite');
  }

  showThanks(): void {
    window.history.pushState({}, '', '/thanks');
    this.viewSubject.next('thanks');
  }

  showInvite(): void {
    window.history.pushState({}, '', '/');
    this.viewSubject.next('invite');
  }
}
