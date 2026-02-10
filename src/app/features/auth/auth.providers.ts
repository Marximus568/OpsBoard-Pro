import { Provider } from '@angular/core';
import { AuthHttpRepository } from './infrastructure/repositories/auth-http.repository';
import { IAUTH_REPOSITORY } from './domain/repositories/auth.repository';
import { AuthFacade } from './application/auth.facade';

export const AUTH_PROVIDERS: Provider[] = [
    {
        provide: IAUTH_REPOSITORY,
        useClass: AuthHttpRepository
    },
    AuthFacade
];
