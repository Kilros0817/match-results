import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'results',
    loadChildren: () => import('./results/results.routes').then((m) => m.resultsRoutes),
  },
  {
    path: '',
    redirectTo: '/results',
    pathMatch: 'full',
  },
];
