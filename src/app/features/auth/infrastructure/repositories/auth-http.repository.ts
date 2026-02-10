import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IAuthRepository, LoginResult } from '../../domain/repositories/auth.repository';
import { AuthToken } from '../../domain/value-objects/auth-token.vo';
import { AuthMapper, AuthResponseDto, UserDto } from '../../application/mappers/auth.mapper';
import { AuthApiService } from '../services/auth-api.service';

/**
 * Repository implementation for Authentication using HTTP transport.
 * Acts as an adapter between the Domain repository contract and the Infrastructure API services.
 * 
 * DESIGN PATTERN: Repository pattern coordinates between API services (I/O) and Mappers (Transformation).
 */
@Injectable({
    providedIn: 'root'
})
export class AuthHttpRepository implements IAuthRepository {
    private readonly api = inject(AuthApiService);
    private readonly TOKEN_KEY = 'opsboard_auth_token';

    /**
     * Performs authentication against the remote API.
     * @param credentials Login data (email, password).
     * @returns A promise that resolves to a LoginResult (User + Tokens).
     * @throws Error if credentials are invalid or user is not found.
     */
    async login(credentials: unknown): Promise<LoginResult> {
        const creds = credentials as { email?: string; password?: string };

        // Step 1: Delegate I/O to ApiService
        const users: UserDto[] = await firstValueFrom(this.api.getUsersByEmail(creds.email || ''));
        const foundUser = users[0];

        // Step 2: Validate
        if (foundUser && foundUser.password === creds.password) {

            // Step 3: Simulate MFA Requirement for Admin
            if (foundUser.user_email === 'admin@opsboard.pro') {
                return {
                    user: AuthMapper.toDomainUser(foundUser),
                    tokens: new AuthToken('pending', 'pending', 0),
                    requiresMfa: true
                };
            }

            // Step 4: Simulate AuthResponse
            const mockDto: AuthResponseDto = {
                access_token: 'jwt-mock-' + Math.random().toString(36).substring(7),
                refresh_token: 'refresh-mock-' + Math.random().toString(36).substring(7),
                expires_in: 3600,
                user_data: foundUser
            };

            const result: LoginResult = {
                user: AuthMapper.toDomainUser(mockDto.user_data),
                tokens: AuthMapper.toDomainToken(mockDto),
                requiresMfa: false
            };

            this.saveTokens(result.tokens);
            return result;
        }

        throw new Error('Invalid credentials');
    }

    /**
     * Refreshes the authentication session.
     */
    async refreshToken(): Promise<AuthToken> {
        // Simulate network delay for "Pro" feel
        await new Promise(resolve => setTimeout(resolve, 800));

        return new AuthToken(
            'new-jwt-' + Math.random().toString(36).substring(7),
            'new-refresh-' + Math.random().toString(36).substring(7),
            Date.now() + 3600000
        );
    }

    /**
     * Revokes the current session and clears local storage.
     */
    async logout(): Promise<void> {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    /**
     * Verifies an MFA challenge.
     */
    async verifyMfa(code: string): Promise<LoginResult> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (code === '123456') {
            const mockUser: UserDto = {
                uuid: 'admin-1',
                user_email: 'admin@opsboard.pro',
                full_name: 'Administrator',
                permission_roles: ['ADMIN']
            };

            const mockDto: AuthResponseDto = {
                access_token: 'jwt-mfa-mock-' + Math.random().toString(36).substring(7),
                refresh_token: 'refresh-mfa-mock-' + Math.random().toString(36).substring(7),
                expires_in: 3600,
                user_data: mockUser
            };

            const result: LoginResult = {
                user: AuthMapper.toDomainUser(mockDto.user_data),
                tokens: AuthMapper.toDomainToken(mockDto),
                requiresMfa: false
            };

            this.saveTokens(result.tokens);
            return result;
        }

        throw new Error('Invalid MFA code. Hint: use 123456');
    }

    /**
     * Internal helper to persist tokens in local storage.
     */
    private saveTokens(tokens: AuthToken): void {
        localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
    }
}
