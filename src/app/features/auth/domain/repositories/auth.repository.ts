import { InjectionToken } from '@angular/core';
import { User } from '../entities/user.entity';

export const IAUTH_REPOSITORY = new InjectionToken<IAuthRepository>('IAUTH_REPOSITORY');
import { AuthToken } from '../value-objects/auth-token.vo';

export interface LoginResult {
    user: User;
    tokens: AuthToken;
    requiresMfa: boolean;
}

export interface IAuthRepository {
    login(credentials: unknown): Promise<LoginResult>;
    refreshToken(token: string): Promise<AuthToken>;
    logout(): Promise<void>;
    verifyMfa(code: string): Promise<LoginResult>;
}
