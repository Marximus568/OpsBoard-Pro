import { Routes } from '@angular/router';

export const INCIDENTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/incidents-list/incidents-list.page').then(m => m.IncidentsListPage)
    }
];
