/**
 * Match API Service
 * Handles all HTTP communication with TheSportsDB API.
 * Falls back to local JSON data if the external API is unavailable.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { EventsResponse, Match } from '../models/match.model';

const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';
const MATCHES_FALLBACK_URL = '/assets/mock/matches.json';
const MATCH_DETAIL_FALLBACK_URL = '/assets/mock/match-detail.json';

@Injectable({
  providedIn: 'root',
})
export class MatchApiService {
  private readonly http = inject(HttpClient);

  /**
   * Fetch recent events for a given league.
   * If TheSportsDB is unavailable, use local mock data with the same response shape.
   */
  getRecentMatches$(leagueId: string): Observable<Match[]> {
    return this.http
      .get<EventsResponse>(`${API_BASE_URL}/eventspastleague.php`, {
        params: { id: leagueId },
      })
      .pipe(
        map((response) => response.events ?? []),
        catchError(() => this.getFallbackMatches$()),
      );
  }

  /**
   * Fetch a single match by event ID.
   * If TheSportsDB is unavailable, use local mock data with the same response shape.
   */
  getMatch$(eventId: string): Observable<Match | null> {
    return this.http
      .get<EventsResponse>(`${API_BASE_URL}/lookupevent.php`, {
        params: { id: eventId },
      })
      .pipe(
        map((response) => response.events?.[0] ?? null),
        catchError(() => this.getFallbackMatch$(eventId)),
      );
  }

  private getFallbackMatches$(): Observable<Match[]> {
    return this.http
      .get<EventsResponse>(MATCHES_FALLBACK_URL)
      .pipe(map((response) => response.events ?? []));
  }

  private getFallbackMatch$(eventId: string): Observable<Match | null> {
    return this.http.get<EventsResponse>(MATCH_DETAIL_FALLBACK_URL).pipe(
      map((response) => {
        const events = response.events ?? [];
        return events.find((event) => event.idEvent === eventId) ?? events[0] ?? null;
      }),
    );
  }
}
