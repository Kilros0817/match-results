/**
 * Match Detail Component
 * Displays a full event view for a single match.
 */

import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Match } from '../../models/match.model';
import { MatchApiService } from '../../services/match-api.service';

interface DetailItem {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './match-detail.component.html',
  styleUrl: './match-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatchDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly matchApiService = inject(MatchApiService);

  readonly match = signal<Match | null>(null);
  readonly isLoading = signal(false);
  readonly loadError = signal<string | null>(null);

  readonly scoreLabel = computed(() => {
    const match = this.match();
    if (!match?.intHomeScore || !match?.intAwayScore) {
      return 'vs';
    }

    return `${match.intHomeScore} - ${match.intAwayScore}`;
  });

  readonly heroImage = computed(() => {
    const match = this.match();
    return match?.strBanner ?? match?.strThumb ?? match?.strPoster ?? match?.strSquare ?? null;
  });

  readonly matchStatus = computed(() => {
    const match = this.match();
    if (!match) {
      return '';
    }

    return match.strStatus ?? (match.strPostponed === 'yes' ? 'Postponed' : 'Final');
  });

  readonly overviewItems = computed<readonly DetailItem[]>(() => {
    const match = this.match();
    if (!match) {
      return [];
    }

    return this.presentItems([
      { label: 'League', value: match.strLeague },
      { label: 'Season', value: match.strSeason },
      { label: 'Round', value: match.intRound },
      { label: 'Sport', value: match.strSport },
      { label: 'Status', value: this.matchStatus() },
      { label: 'Event ID', value: match.idEvent },
    ]);
  });

  readonly scheduleItems = computed<readonly DetailItem[]>(() => {
    const match = this.match();
    if (!match) {
      return [];
    }

    return this.presentItems([
      { label: 'Event date', value: match.dateEvent },
      { label: 'Local date', value: match.dateEventLocal },
      { label: 'UTC time', value: this.trimSeconds(match.strTime) },
      { label: 'Local time', value: this.trimSeconds(match.strTimeLocal) },
      { label: 'Timestamp', value: this.formatTimestamp(match.strTimestamp) },
    ]);
  });

  readonly venueItems = computed<readonly DetailItem[]>(() => {
    const match = this.match();
    if (!match) {
      return [];
    }

    return this.presentItems([
      { label: 'Venue', value: match.strVenue },
      { label: 'City', value: match.strCity },
      { label: 'Country', value: match.strCountry },
      { label: 'Spectators', value: this.formatNumber(match.intSpectators) },
      { label: 'Official', value: match.strOfficial },
      { label: 'Weather', value: match.strWeather },
    ]);
  });

  readonly mediaItems = computed<readonly DetailItem[]>(() => {
    const match = this.match();
    if (!match) {
      return [];
    }

    return this.presentItems([
      { label: 'Video highlights', value: match.strVideo },
      { label: 'Tweet', value: match.strTweet1 },
      { label: 'Map', value: match.strMap },
    ]);
  });

  readonly hasMedia = computed(() => {
    const match = this.match();
    return Boolean(
      match?.strThumb ?? match?.strBanner ?? match?.strPoster ?? match?.strSquare ?? match?.strFanart,
    );
  });

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) {
      this.loadError.set('Missing match ID.');
      return;
    }

    this.loadMatch(id);
  }

  private loadMatch(eventId: string): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.matchApiService
      .getMatch$(eventId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (match) => {
          this.match.set(match);
          this.loadError.set(match ? null : 'Match not found.');
          this.isLoading.set(false);
        },
        error: () => {
          this.loadError.set('Failed to load match details. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  private presentItems(items: readonly { readonly label: string; readonly value: string | null }[]): DetailItem[] {
    return items
      .filter((item) => this.hasValue(item.value))
      .map((item) => ({ label: item.label, value: item.value?.trim() ?? '' }));
  }

  private hasValue(value: string | null): boolean {
    return Boolean(value?.trim());
  }

  private trimSeconds(value: string | null): string | null {
    if (!value) {
      return null;
    }

    return value.replace(/:00$/, '');
  }

  private formatTimestamp(value: string | null): string | null {
    if (!value) {
      return null;
    }

    return value.replace('T', ' ');
  }

  private formatNumber(value: string | null): string | null {
    if (!value) {
      return null;
    }

    return Number(value).toLocaleString();
  }
}
