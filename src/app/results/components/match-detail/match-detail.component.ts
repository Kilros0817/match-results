/**
 * Match Detail Component
 * Displays detailed information for a single match
 */

import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatchApiService } from '../../services/match-api.service';
import { MatchCardComponent } from '../match-card/match-card.component';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatchCardComponent],
  templateUrl: './match-detail.component.html',
  styleUrl: './match-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly matchApiService = inject(MatchApiService);

  readonly match = signal<Match | null>(null);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly displayMatch = computed(() => this.match());

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatch(id);
    }
  }

  private loadMatch(eventId: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.matchApiService.getMatch$(eventId).subscribe({
      next: (match) => {
        if (match) {
          this.match.set(match);
        } else {
          this.loadError.set('Match not found.');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading match:', error);
        this.loadError.set('Failed to load match details. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}
