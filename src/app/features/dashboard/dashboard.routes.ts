import { Routes } from '@angular/router';
import { DASHBOARD_PROVIDERS } from './dashboard.providers';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        providers: [DASHBOARD_PROVIDERS],
        loadComponent: () => import('./presentation/pages/dashboard/dashboard.page').then(m => m.DashboardPage)
    }
];
