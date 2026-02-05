import { Routes } from '@angular/router';
import { AUTH_PROVIDERS } from './auth.providers';

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        providers: AUTH_PROVIDERS,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./presentation/pages/login/login.page').then(m => m.LoginPage)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    }
];
