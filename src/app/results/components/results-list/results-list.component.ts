/**
 * Results List Page Component
 * Displays a list of recent match results with league selector
 */

import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatchApiService } from '../../services/match-api.service';
import { Match, League } from '../../models/match.model';
import { LEAGUES, DEFAULT_LEAGUE } from '../../constants/league.constants';

@Component({
  selector: 'app-results-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './results-list.component.html',
  styleUrl: './results-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsListComponent implements OnInit {
  // Dependency injection
  private readonly matchApiService = inject(MatchApiService);

  // State signals
  readonly leagues = signal<League[]>(LEAGUES);
  readonly selectedLeague = signal<League>(DEFAULT_LEAGUE);
  readonly matches = signal<Match[]>([]);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMatches();
  }

  /**
   * Handle league selection change
   */
  onLeagueChange(league: League): void {
    this.selectedLeague.set(league);
    this.loadMatches();
  }

  /**
   * Load matches for the selected league
   */
  loadMatches(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.matchApiService.getRecentMatches$(this.selectedLeague().id).subscribe({
      next: (matches) => {
        this.matches.set(matches);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading matches:', error);
        this.loadError.set('Failed to load matches. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  }

  /**
   * Format time for display
   */
  formatTime(timeStr: string | null | undefined): string {
    return timeStr ?? '--:--';
  }

  /**
   * Get score display string
   */
  getScore(match: Match): string {
    if (match.intHomeScore === null || match.intAwayScore === null) {
      return '--:--';
    }
    return `${match.intHomeScore}:${match.intAwayScore}`;
  }
}
