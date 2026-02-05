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
                path: 'incidents',
                loadChildren: () => import('./features/incidents/incidents.routes').then(m => m.INCIDENTS_ROUTES)
            },
            {
                path: '',
                redirectTo: 'incidents',
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
