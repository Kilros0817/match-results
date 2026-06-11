/**
 * Match API Service
 * Handles all HTTP communication with TheSportsDB API
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EventsResponse, Match } from '../models/match.model';

const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

@Injectable({
  providedIn: 'root',
})
export class MatchApiService {
  private readonly http = inject(HttpClient);

  /**
   * Fetch recent events for a given league.
   */
  getRecentMatches$(leagueId: string): Observable<Match[]> {
    return this.http
      .get<EventsResponse>(`${API_BASE_URL}/eventspastleague.php`, {
        params: { id: leagueId },
      })
      .pipe(map((response) => response.events ?? []));
  }

  /**
   * Fetch a single match by event ID.
   */
  getMatch$(eventId: string): Observable<Match | null> {
    return this.http
      .get<EventsResponse>(`${API_BASE_URL}/lookupevent.php`, {
        params: { id: eventId },
      })
      .pipe(map((response) => response.events?.[0] ?? null));
  }
}
