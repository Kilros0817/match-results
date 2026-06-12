import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, inject } from '@angular/core';

const MIN_SCROLL_DURATION_SECONDS = 8;
const MAX_SCROLL_DURATION_SECONDS = 18;
const SCROLL_SPEED_DIVISOR = 96;
const OVERFLOW_TOLERANCE_PX = 2;

@Directive({
  selector: '[appOverflowSlide]',
  standalone: true,
})
export class OverflowSlideDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef) as ElementRef<HTMLElement>;
  private readonly ngZone = inject(NgZone);
  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      const container = this.elementRef.nativeElement;
      const textElement = container.firstElementChild as HTMLElement | null;
      const updateOverflowState = () => this.updateOverflowState(container, textElement);

      requestAnimationFrame(updateOverflowState);

      this.resizeObserver = new ResizeObserver(updateOverflowState);
      this.resizeObserver.observe(container);

      if (textElement) {
        this.resizeObserver.observe(textElement);
      }

      document.fonts?.ready.then(updateOverflowState).catch(() => undefined);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private updateOverflowState(container: HTMLElement, textElement: HTMLElement | null): void {
    const textWidth = textElement?.scrollWidth ?? container.scrollWidth;
    const visibleWidth = container.clientWidth;
    const scrollDistance = Math.max(0, textWidth - visibleWidth);
    const isOverflowing = scrollDistance > OVERFLOW_TOLERANCE_PX;
    const duration = Math.min(
      MAX_SCROLL_DURATION_SECONDS,
      Math.max(MIN_SCROLL_DURATION_SECONDS, textWidth / SCROLL_SPEED_DIVISOR),
    );

    container.classList.toggle('is-overflowing', isOverflowing);
    container.style.setProperty('--team-name-scroll-distance', `${scrollDistance}px`);
    container.style.setProperty('--team-name-scroll-duration', `${duration}s`);
  }
}
