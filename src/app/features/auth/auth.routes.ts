import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./presentation/pages/login/login.page').then(m => m.LoginPage)
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
