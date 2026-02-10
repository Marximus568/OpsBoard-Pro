import { Routes } from '@angular/router';

export const DEPLOYMENT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./presentation/pages/deployment-list/deployment-list.page').then(m => m.DeploymentListPage)
    },
    {
        path: ':id',
        loadComponent: () => import('./presentation/pages/deployment-detail/deployment-detail.page').then(m => m.DeploymentDetailPage)
    }
];
