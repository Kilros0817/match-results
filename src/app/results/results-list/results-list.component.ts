/**
 * Results List Page Component
 * Displays recent match results with league filtering, debounced search,
 * computed KPIs, sorting, and resilient loading states.
 */

import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { KpiTileComponent } from '../components/kpi-tile/kpi-tile.component';
import { LeagueSelectorComponent } from '../components/league-selector/league-selector.component';
import { MatchCardComponent } from '../components/match-card/match-card.component';
import { SearchBoxComponent } from '../components/search-box/search-box.component';
import { StateMessageComponent } from '../components/state-message/state-message.component';
import { DEFAULT_LEAGUE, LEAGUES } from '../constants/league.constants';
import { League, Match } from '../models/match.model';
import { MatchApiService } from '../services/match-api.service';

const SEARCH_DEBOUNCE_MS = 300;

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
export class ResultsListPage {
  private readonly matchApiService = inject(MatchApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly leagues = LEAGUES;
  readonly selectedLeague = signal<League>(DEFAULT_LEAGUE);
  readonly searchTerm = signal('');
  readonly debouncedSearchTerm = signal('');
  readonly isSortedByGoals = signal(false);
  readonly matches = signal<Match[]>([]);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);

  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly filteredMatches = computed(() => {
    const term = this.debouncedSearchTerm().trim().toLowerCase();

    if (!term) {
      return this.matches();
    }

    return this.matches().filter((match) => {
      const homeTeam = match.strHomeTeam.toLowerCase();
      const awayTeam = match.strAwayTeam.toLowerCase();

      return homeTeam.includes(term) || awayTeam.includes(term);
    });
  });

  readonly visibleMatches = computed(() => {
    const matches = this.filteredMatches();

    if (!this.isSortedByGoals()) {
      return matches;
    }

    return [...matches].sort((firstMatch, secondMatch) => this.getMatchGoals(secondMatch) - this.getMatchGoals(firstMatch));
  });

  readonly totalMatches = computed(() => this.filteredMatches().length);

  readonly totalGoals = computed(() =>
    this.filteredMatches().reduce((total, match) => total + this.getMatchGoals(match), 0),
  );

  readonly averageGoals = computed(() => {
    const totalMatches = this.totalMatches();

    if (totalMatches === 0) {
      return '0.0';
    }

    return (this.totalGoals() / totalMatches).toFixed(1);
  });

  constructor() {
    effect(() => {
      this.loadMatches(this.selectedLeague().id);
    });

    this.destroyRef.onDestroy(() => this.clearSearchDebounce());
  }

  onLeagueChange(league: League): void {
    if (league.id === this.selectedLeague().id) {
      return;
    }

    this.searchTerm.set('');
    this.debouncedSearchTerm.set('');
    this.clearSearchDebounce();
    this.selectedLeague.set(league);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.clearSearchDebounce();

    this.searchDebounceTimer = setTimeout(() => {
      this.debouncedSearchTerm.set(value);
      this.searchDebounceTimer = null;
    }, SEARCH_DEBOUNCE_MS);
  }

  toggleGoalsSort(): void {
    this.isSortedByGoals.update((isSortedByGoals) => !isSortedByGoals);
  }

  retryLoad(): void {
    this.loadMatches(this.selectedLeague().id);
  }

  private loadMatches(leagueId: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.matchApiService
      .getRecentMatches$(leagueId)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (matches) => {
          this.matches.set(matches);
        },
        error: () => {
          this.matches.set([]);
          this.loadError.set('Failed to load matches from TheSportsDB. Please try again.');
        },
      });
  }

  private getMatchGoals(match: Match): number {
    const homeGoals = Number(match.intHomeScore ?? 0);
    const awayGoals = Number(match.intAwayScore ?? 0);

    return homeGoals + awayGoals;
  }

  private clearSearchDebounce(): void {
    if (!this.searchDebounceTimer) {
      return;
    }

    clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = null;
  }
}
