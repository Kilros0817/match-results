/**
 * Results Feature Routes
 */

import { Routes } from '@angular/router';

export const resultsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/results-list/results-list.component').then(
        (m) => m.ResultsListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/match-detail/match-detail.component').then(
        (m) => m.MatchDetailComponent,
      ),
  },
];
