/**
 * Match API Service
 * Handles all HTTP communication with TheSportsDB API
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Match, EventsResponse, EventResponse } from '../models/match.model';

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/123';

@Injectable({
  providedIn: 'root',
})
export class MatchApiService {
  private readonly http = inject(HttpClient);

  /**
   * Fetch recent events (matches) for a given league
   * @param leagueId - TheSportsDB league ID
   * @returns Observable of Match array
   */
  getRecentMatches$(leagueId: string): Observable<Match[]> {
    const url = `${API_BASE}/eventspastleague.php?id=${leagueId}`;

    return this.http.get<EventsResponse>(url).pipe(
      map((response) => response.results ?? []),
      catchError((error) => {
        console.error('Failed to fetch matches:', error);
        return of([]);
      }),
    );
  }

  /**
   * Fetch a single match by event ID
   * @param eventId - TheSportsDB event ID
   * @returns Observable of Match or null if not found
   */
  getMatch$(eventId: string): Observable<Match | null> {
    const url = `${API_BASE}/lookupevent.php?id=${eventId}`;

    return this.http.get<EventResponse>(url).pipe(
      map((response) => response.results?.[0] ?? null),
      catchError((error) => {
        console.error('Failed to fetch match:', error);
        return of(null);
      }),
    );
  }
}
