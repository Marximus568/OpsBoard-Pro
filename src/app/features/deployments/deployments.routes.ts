import { Routes } from '@angular/router';
import { DEPLOYMENTS_PROVIDERS } from './deployments.providers';

export const DEPLOYMENT_ROUTES: Routes = [
    {
        path: '',
        providers: [DEPLOYMENTS_PROVIDERS],
        children: [
            {
                path: '',
                loadComponent: () => import('./presentation/pages/deployments/deployments.page').then(m => m.DeploymentsPage)
            }
        ]
    }
];
