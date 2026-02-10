import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { INCIDENTS_PROVIDERS } from './features/incidents/incidents.providers';
import { DEPLOYMENTS_PROVIDERS } from './features/deployments/deployments.providers';
import { AUTH_PROVIDERS } from './features/auth/auth.providers';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './core/tokens/api.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(),
    provideEffects(),
    { provide: API_BASE_URL, useValue: environment.apiUrl },
    ...INCIDENTS_PROVIDERS,
    ...DEPLOYMENTS_PROVIDERS,
    ...AUTH_PROVIDERS
  ]
};
