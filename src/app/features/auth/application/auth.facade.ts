import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { authState, selectUser, selectIsAuthenticated, selectIsLoading, selectAuthError, selectMfaRequired, AuthState } from './auth.state';
import { IAUTH_REPOSITORY } from '../domain/repositories/auth.repository';
import { AuditService } from '../../../core/services/audit.service';

@Injectable({
    providedIn: 'root'
})
export class AuthFacade {
    private readonly authRepository = inject(IAUTH_REPOSITORY);
    private readonly router = inject(Router);
    private readonly auditService = inject(AuditService);
    private refreshTimer: ReturnType<typeof setTimeout> | undefined;

    // Selectors
    readonly user = selectUser;
    readonly isAuthenticated = selectIsAuthenticated;
    readonly mfaRequired = selectMfaRequired;
    readonly isLoading = selectIsLoading;
    readonly error = selectAuthError;

    async login(credentials: Record<string, unknown>, returnUrl?: string): Promise<void> {
        this.updateState({ isLoading: true, error: null });
        try {
            const result = await this.authRepository.login(credentials);

            if (credentials['rememberMe']) {
                localStorage.setItem('opsboard_remembered_email', credentials['email'] as string);
            } else {
                localStorage.removeItem('opsboard_remembered_email');
            }

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
                this.auditService.log('LOGIN', 'AUTH', result.user.id, { email: credentials['email'], method: 'password' });
                await this.router.navigateByUrl(returnUrl || '/dashboard');

                // Simulate Pro Refresh Logic
                this.startRefreshTimer(result.tokens);
            }
        } catch (err) {
            this.auditService.log('LOGIN_FAILED', 'AUTH', 'unknown', { email: credentials['email'], error: (err as Error).message });
            this.updateState({
                isLoading: false,
                error: (err as Error).message || 'Login failed'
            });
        }
    }

    getRememberedEmail(): string | null {
        return localStorage.getItem('opsboard_remembered_email');
    }

    private startRefreshTimer(tokens: { refreshToken: string }): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }

        // In a real app, this would refresh before expiry. 
        // Here we just simulate a "silent refresh" every 5 minutes if logged in.
        this.refreshTimer = setTimeout(async () => {
            if (this.isAuthenticated()) {
                console.log('[Auth] [PRO] Performing silent refresh...');
                try {
                    const newTokens = await this.authRepository.refreshToken(tokens.refreshToken);
                    console.log('[Auth] [PRO] Session refreshed successfully.');
                    // Recursive call to keep refreshing
                    this.startRefreshTimer(newTokens);
                } catch (e) {
                    console.error('[Auth] [PRO] Refresh failed', e);
                }
            }
        }, 300000); // 5 minutes
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
            this.auditService.log('LOGIN', 'AUTH', result.user.id, { method: 'mfa' });
            await this.router.navigateByUrl(returnUrl || '/dashboard');

            this.startRefreshTimer(result.tokens);
        } catch (err) {
            this.updateState({
                isLoading: false,
                error: (err as Error).message || 'MFA verification failed'
            });
        }
    }

    async logout(): Promise<void> {
        const currentUser = this.user();
        try {
            if (currentUser) {
                this.auditService.log('LOGOUT', 'AUTH', currentUser.id);
            }
            await this.authRepository.logout();
        } finally {
            if (this.refreshTimer) {
                clearTimeout(this.refreshTimer);
            }
            authState.set({
                user: null,
                isAuthenticated: false,
                mfaRequired: false,
                isLoading: false,
                error: null
            });
        }
    }

    /**
     * Bootstraps the session from persistent storage.
     * Called during app initialization via APP_INITIALIZER.
     */
    initializeSession(): void {
        const savedUser = this.authRepository.getSavedUser();
        if (savedUser) {
            console.log('[Auth] [PRO] Restoring session for:', savedUser.email);
            this.updateState({
                user: savedUser,
                isAuthenticated: true,
                isLoading: false
            });

            // Resume refresh cycles if tokens exist
            const tokensRaw = localStorage.getItem('opsboard_auth_token');
            if (tokensRaw) {
                try {
                    const tokens = JSON.parse(tokensRaw);
                    this.startRefreshTimer(tokens);
                } catch (e) {
                    console.error('[Auth] [PRO] Failed to resume refresh timer', e);
                }
            }
        }
    }

    private updateState(partialState: Partial<AuthState>): void {
        authState.update(state => ({ ...state, ...partialState }));
    }
}
