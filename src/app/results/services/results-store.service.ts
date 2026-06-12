/**
 * Results Store Service
 * Manages shared state for the results feature (selected league, filters, etc.)
 */

import { Injectable, signal } from '@angular/core';
import { League } from '../models/match.model';
import { DEFAULT_LEAGUE } from '../constants/league.constants';

@Injectable({ providedIn: 'root' })
export class ResultsStoreService {
  readonly selectedLeague = signal<League>(DEFAULT_LEAGUE);

  setSelectedLeague(league: League): void {
    this.selectedLeague.set(league);
  }

  getSelectedLeague(): League {
    return this.selectedLeague();
  }
}
