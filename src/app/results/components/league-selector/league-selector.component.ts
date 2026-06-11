import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { League } from '../../models/match.model';

@Component({
  selector: 'app-league-selector',
  standalone: true,
  templateUrl: './league-selector.component.html',
  styleUrl: './league-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeagueSelectorComponent {
  readonly leagues = input.required<League[]>();
  readonly selectedLeagueId = input.required<string>();
  readonly leagueSelected = output<League>();
}
