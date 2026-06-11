import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-tile',
  standalone: true,
  templateUrl: './kpi-tile.component.html',
  styleUrl: './kpi-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiTileComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input.required<'pitch' | 'ball' | 'chart'>();
}
