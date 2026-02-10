import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { ShellLayoutComponent } from './layouts/shell/shell-layout.component';
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
                path: 'admin',
                canActivate: [() => import('./core/guards/role.guard').then(m => m.roleGuard)],
                data: { roles: ['role-admin'] },
                loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
            },
            {
                path: 'audit',
                canActivate: [() => import('./core/guards/role.guard').then(m => m.roleGuard)],
                data: { roles: ['role-admin'] },
                loadChildren: () => import('./features/audit/audit.routes').then(m => m.AUDIT_ROUTES)
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
