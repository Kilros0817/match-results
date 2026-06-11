import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-box',
  standalone: true,
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  readonly value = input.required<string>();
  readonly valueChanged = output<string>();

  onInput(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.valueChanged.emit(target.value);
    }
  }
}
