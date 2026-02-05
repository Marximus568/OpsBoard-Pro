import { EnvironmentProviders, Provider } from '@angular/core';
import { DashboardFacade } from './application/dashboard.facade';

export const DASHBOARD_PROVIDERS: (Provider | EnvironmentProviders)[] = [
    DashboardFacade
];
