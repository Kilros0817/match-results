import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-state-message',
  standalone: true,
  templateUrl: './state-message.component.html',
  styleUrl: './state-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateMessageComponent {
  readonly kind = input.required<'loading' | 'error' | 'empty'>();
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly actionLabel = input<string>();
  readonly actionClicked = output<void>();
}
