import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { ShellLayoutComponent } from './shared/layouts/shell-layout/shell-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: ShellLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
            },
            {
                path: 'incidents',
                loadChildren: () => import('./features/incidents/incidents.routes').then(m => m.INCIDENTS_ROUTES)
            },
            {
                path: 'deployments',
                loadChildren: () => import('./features/deployments/deployments.routes').then(m => m.DEPLOYMENT_ROUTES)
            },
            {
                path: 'logs',
                loadChildren: () => import('./features/logs/logs.routes').then(m => m.LOGS_ROUTES)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    }
];
