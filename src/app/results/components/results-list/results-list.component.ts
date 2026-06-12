/**
 * Results List Page Component
 * Displays recent match results with league filtering, search, KPIs, and result states.
 */

import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { MatchApiService } from '../../services/match-api.service';
import { ResultsStoreService } from '../../services/results-store.service';
import { League, Match } from '../../models/match.model';
import { LEAGUES } from '../../constants/league.constants';
import { KpiTileComponent } from '../kpi-tile/kpi-tile.component';
import { LeagueSelectorComponent } from '../league-selector/league-selector.component';
import { MatchCardComponent } from '../match-card/match-card.component';
import { SearchBoxComponent } from '../search-box/search-box.component';
import { StateMessageComponent } from '../state-message/state-message.component';

@Component({
  selector: 'app-results-list',
  standalone: true,
  imports: [
    KpiTileComponent,
    LeagueSelectorComponent,
    MatchCardComponent,
    SearchBoxComponent,
    StateMessageComponent,
  ],
  templateUrl: './results-list.component.html',
  styleUrl: './results-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsListComponent {
  private readonly matchApiService = inject(MatchApiService);
  private readonly store = inject(ResultsStoreService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  readonly leagues = signal<League[]>(LEAGUES);
  readonly selectedLeague = this.store.selectedLeague;
  readonly searchTerm = signal('');
  readonly matches = signal<Match[]>([]);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);

  constructor() {
    // Set up debounced search with 300ms delay
    this.searchSubject
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.searchTerm.set(term);
      });

    effect(() => {
      const leagueId = this.selectedLeague().id;
      this.loadMatches(leagueId);
    });
  }

  readonly filteredMatches = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.matches();
    }

    return this.matches().filter((match) => {
      const homeTeam = match.strHomeTeam.toLowerCase();
      const awayTeam = match.strAwayTeam.toLowerCase();

      return homeTeam.includes(term) || awayTeam.includes(term);
    });
  });

  readonly totalMatches = computed(() => this.filteredMatches().length);

  readonly totalGoals = computed(() =>
    this.filteredMatches().reduce((sum, match) => {
      const homeGoals = Number(match.intHomeScore ?? 0);
      const awayGoals = Number(match.intAwayScore ?? 0);

      return sum + homeGoals + awayGoals;
    }, 0),
  );

  readonly averageGoals = computed(() => {
    const matchCount = this.totalMatches();

    if (matchCount === 0) {
      return '0.0';
    }

    return (this.totalGoals() / matchCount).toFixed(1);
  });

  onLeagueChange(league: League): void {
    this.searchTerm.set('');
    this.searchSubject.next('');
    this.store.setSelectedLeague(league);
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  retryLoad(): void {
    this.loadMatches(this.selectedLeague().id);
  }

  private loadMatches(leagueId: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.matchApiService
      .getRecentMatches$(leagueId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (matches) => {
          this.matches.set(matches);
          this.isLoading.set(false);
        },
        error: () => {
          this.matches.set([]);
          this.loadError.set('Failed to load matches from TheSportsDB. Please try again.');
          this.isLoading.set(false);
        },
      });
  }
}
