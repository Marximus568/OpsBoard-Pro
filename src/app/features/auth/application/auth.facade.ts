import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { authState, selectUser, selectIsAuthenticated, selectIsLoading, selectAuthError, selectMfaRequired, AuthState } from './auth.state';
import { IAUTH_REPOSITORY } from '../domain/repositories/auth.repository';

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {
    private readonly authRepository = inject(IAUTH_REPOSITORY);
    private readonly router = inject(Router);

    // Selectors
    readonly user = selectUser;
    readonly isAuthenticated = selectIsAuthenticated;
    readonly mfaRequired = selectMfaRequired;
    readonly isLoading = selectIsLoading;
    readonly error = selectAuthError;

    async login(credentials: unknown, returnUrl?: string): Promise<void> {
        this.updateState({ isLoading: true, error: null });
        try {
            const result = await this.authRepository.login(credentials);

            if (result.requiresMfa) {
                this.updateState({
                    user: result.user,
                    mfaRequired: true,
                    isLoading: false
                });
            } else {
                this.updateState({
                    user: result.user,
                    isAuthenticated: true,
                    mfaRequired: false,
                    isLoading: false
                });
                await this.router.navigateByUrl(returnUrl || '/dashboard');
            }
        } catch (err) {
            this.updateState({
                isLoading: false,
                error: (err as Error).message || 'Login failed'
            });
        }
    }

    async verifyMfa(code: string, returnUrl?: string): Promise<void> {
        this.updateState({ isLoading: true, error: null });
        try {
            const result = await this.authRepository.verifyMfa(code);
            this.updateState({
                user: result.user,
                isAuthenticated: true,
                mfaRequired: false,
                isLoading: false
            });
            await this.router.navigateByUrl(returnUrl || '/dashboard');
        } catch (err) {
            this.updateState({
                isLoading: false,
                error: (err as Error).message || 'MFA verification failed'
            });
        }
    }

    async logout(): Promise<void> {
        try {
            await this.authRepository.logout();
        } finally {
            authState.set({
                user: null,
                isAuthenticated: false,
                mfaRequired: false,
                isLoading: false,
                error: null
            });
        }
    }

    private updateState(partialState: Partial<AuthState>): void {
        authState.update(state => ({ ...state, ...partialState }));
    }
}
