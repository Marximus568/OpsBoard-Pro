import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { adminFeatureKey, adminReducer } from './application/state/admin.reducer';
import { AdminEffects } from './application/state/admin.effects';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideState(adminFeatureKey, adminReducer),
            provideEffects(AdminEffects)
        ],
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                loadComponent: () => import('./presentation/pages/user-management/user-management.page').then(m => m.UserManagementPage)
            },
            {
                path: 'roles',
                loadComponent: () => import('./presentation/pages/role-management/role-management.page').then(m => m.RoleManagementPage)
            },
            {
                path: 'feature-flags',
                loadComponent: () => import('./presentation/pages/feature-flags/feature-flags.page').then(m => m.FeatureFlagsPage)
            },
            {
                path: 'settings',
                loadComponent: () => import('./presentation/pages/system-settings/system-settings.page').then(m => m.SystemSettingsPage)
            }
        ]
    }
];
