import { Routes } from '@angular/router';

export const LOGS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/logs/logs.page').then(m => m.LogsPage)
    }
];
