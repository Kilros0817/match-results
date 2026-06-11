import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Match } from '../../models/match.model';

const TEAM_FALLBACK_LOGO = '/assets/logos/team-fallback.svg';
const LEAGUE_FALLBACK_LOGO = '/assets/logos/league-fallback.svg';
const GERMANY_FLAG = '/assets/logos/germany-flag.svg';

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './match-card.component.html',
  styleUrl: './match-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchCardComponent {
  readonly match = input.required<Match>();

  readonly score = computed(() => {
    const match = this.match();

    if (match.intHomeScore === null || match.intAwayScore === null) {
      return '— : —';
    }

    return `${match.intHomeScore} : ${match.intAwayScore}`;
  });

  readonly homeLogo = computed(() => this.match().strHomeTeamBadge ?? TEAM_FALLBACK_LOGO);
  readonly awayLogo = computed(() => this.match().strAwayTeamBadge ?? TEAM_FALLBACK_LOGO);
  readonly leagueLogo = computed(() => this.match().strLeagueBadge ?? LEAGUE_FALLBACK_LOGO);
  readonly countryFlag = computed(() => (this.match().strCountry === 'Germany' ? GERMANY_FLAG : null));

  readonly displayTime = computed(() => {
    const match = this.match();
    return match.strTimeLocal ?? match.strTime ?? 'Time unavailable';
  });

  readonly displayDate = computed(() => {
    const dateStr = this.match().dateEvent;
    return this.formatDate(dateStr);
  });

  private formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);

      if (Number.isNaN(date.getTime())) {
        return dateStr;
      }

      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateStr;
    }
  }
}
