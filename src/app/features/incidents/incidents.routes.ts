import { Routes } from '@angular/router';


export const INCIDENTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/incidents-list/incidents-list.page').then(m => m.IncidentsListPage)
    },
    {
        path: 'create',
        loadComponent: () => import('./presentation/pages/incident-create/incident-create.page').then(m => m.IncidentCreatePageComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./presentation/pages/incident-detail/incident-detail.page').then(m => m.IncidentDetailPageComponent)
    }
];
