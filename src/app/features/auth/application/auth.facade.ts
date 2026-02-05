import { Injectable, inject } from '@angular/core';
import { authState, selectUser, selectIsAuthenticated, selectIsLoading, selectAuthError, selectMfaRequired, AuthState } from './auth.state';
import { IAUTH_REPOSITORY } from '../domain/repositories/auth.repository';

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {
    private readonly authRepository = inject(IAUTH_REPOSITORY);

    // Selectors
    readonly user = selectUser;
    readonly isAuthenticated = selectIsAuthenticated;
    readonly mfaRequired = selectMfaRequired;
    readonly isLoading = selectIsLoading;
    readonly error = selectAuthError;

    async login(credentials: unknown): Promise<void> {
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
            }
        } catch (err) {
            this.updateState({
                isLoading: false,
                error: (err as Error).message || 'Login failed'
            });
        }
    }

    async verifyMfa(code: string): Promise<void> {
        this.updateState({ isLoading: true, error: null });
        try {
            const result = await this.authRepository.verifyMfa(code);
            this.updateState({
                user: result.user,
                isAuthenticated: true,
                mfaRequired: false,
                isLoading: false
            });
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
