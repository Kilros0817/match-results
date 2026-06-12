import { ChangeDetectionStrategy, Component, DestroyRef, input, inject, output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-box',
  standalone: true,
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchInput$ = new Subject<string>();

  readonly value = input.required<string>();
  readonly valueChanged = output<string>();

  constructor() {
    this.searchInput$
      .pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((searchValue) => {
        this.valueChanged.emit(searchValue);
      });
  }

  onInput(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.searchInput$.next(target.value);
    }
  }
}
