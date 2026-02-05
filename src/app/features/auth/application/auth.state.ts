import { signal, computed } from '@angular/core';
import { User } from '../domain/entities/user.entity';

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    mfaRequired: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    mfaRequired: false,
    isLoading: false,
    error: null,
};

export const authState = signal<AuthState>(initialState);

export const selectUser = computed(() => authState().user);
export const selectIsAuthenticated = computed(() => authState().isAuthenticated);
export const selectMfaRequired = computed(() => authState().mfaRequired);
export const selectAuthError = computed(() => authState().error);
export const selectIsLoading = computed(() => authState().isLoading);
