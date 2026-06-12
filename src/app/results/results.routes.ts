/**
 * Results Feature Routes
 */

import { Routes } from '@angular/router';

export const resultsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./results-list/results-list.component').then((m) => m.ResultsListPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./match-detail/match-detail.component').then((m) => m.MatchDetailPage),
  },
];
