/**
 * Match Detail Page Component
 * Displays detailed information for a single match.
 */

import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MatchCardComponent } from '../components/match-card/match-card.component';
import { Match } from '../models/match.model';
import { MatchApiService } from '../services/match-api.service';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [RouterLink, MatchCardComponent],
  templateUrl: './match-detail.component.html',
  styleUrl: './match-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchDetailPage implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly matchApiService = inject(MatchApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly match = signal<Match | null>(null);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly displayMatch = computed(() => this.match());

  ngOnInit(): void {
    const eventId = this.activatedRoute.snapshot.paramMap.get('id');

    if (!eventId) {
      this.loadError.set('Match id is missing.');
      return;
    }

    this.loadMatch(eventId);
  }

  private loadMatch(eventId: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.matchApiService
      .getMatch$(eventId)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (match) => {
          if (!match) {
            this.match.set(null);
            this.loadError.set('Match not found.');
            return;
          }

          this.match.set(match);
        },
        error: () => {
          this.match.set(null);
          this.loadError.set('Failed to load match details. Please try again.');
        },
      });
  }
}
