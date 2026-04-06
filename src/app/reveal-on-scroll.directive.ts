import { AfterViewInit, Directive, ElementRef, HostBinding, Input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: false
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input() revealFrom: 'left' | 'right' = 'left';
  @Input() revealDelay = 0;

  @HostBinding('class.reveal-on-scroll') readonly revealClass = true;
  @HostBinding('class.reveal-on-scroll--visible') isVisible = false;
  @HostBinding('class.reveal-on-scroll--left') get isLeft(): boolean {
    return this.revealFrom === 'left';
  }

  @HostBinding('class.reveal-on-scroll--right') get isRight(): boolean {
    return this.revealFrom === 'right';
  }

  @HostBinding('style.transition-delay.ms') get transitionDelay(): number {
    return this.isVisible ? this.revealDelay : 0;
  }

  private observer?: IntersectionObserver;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        this.isVisible = true;
        this.observer?.disconnect();
        this.observer = undefined;
      },
      {
        threshold: 0.22
      }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
