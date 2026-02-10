import { TestBed } from '@angular/core/testing';
import { AuthFacade } from './auth.facade';
import { IAUTH_REPOSITORY } from '../domain/repositories/auth.repository';
import { Router } from '@angular/router';
import { AuditService } from '../../../core/services/audit.service';
import { User } from '../domain/entities/user.entity';
import { AuthToken } from '../domain/value-objects/auth-token.vo';
import { authState } from './auth.state';

describe('AuthFacade', () => {
    let facade: AuthFacade;
    let authRepoMock: {
        login: ReturnType<typeof vi.fn>;
        verifyMfa: ReturnType<typeof vi.fn>;
        logout: ReturnType<typeof vi.fn>;
        getSavedUser: ReturnType<typeof vi.fn>;
        refreshToken: ReturnType<typeof vi.fn>;
    };
    let routerMock: { navigateByUrl: ReturnType<typeof vi.fn> };
    let auditServiceMock: { log: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        // Reset global signal to ensure test isolation
        authState.set({
            user: null,
            isAuthenticated: false,
            mfaRequired: false,
            isLoading: false,
            error: null,
        });

        authRepoMock = {
            login: vi.fn(),
            verifyMfa: vi.fn(),
            logout: vi.fn(),
            getSavedUser: vi.fn(),
            refreshToken: vi.fn(),
        };

        routerMock = {
            navigateByUrl: vi.fn(),
        };

        auditServiceMock = {
            log: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                AuthFacade,
                { provide: IAUTH_REPOSITORY, useValue: authRepoMock },
                { provide: Router, useValue: routerMock },
                { provide: AuditService, useValue: auditServiceMock },
            ],
        });

        facade = TestBed.inject(AuthFacade);
    });

    it('should restore session if user is saved in repository', () => {
        const mockUser = new User({
            id: '1',
            email: 'admin@opsboard.com',
            fullName: 'Admin',
            roles: ['role-admin'],
        });
        authRepoMock.getSavedUser.mockReturnValue(mockUser);

        facade.initializeSession();

        expect(facade.user()).toEqual(mockUser);
        expect(facade.isAuthenticated()).toBe(true);
    });

    it('should update state on successful login', async () => {
        const mockUser = new User({
            id: '1',
            email: 'test@test.com',
            fullName: 'Test User',
            roles: ['operator'],
        });
        const mockTokens = new AuthToken('at', 'rt', 3600);
        authRepoMock.login.mockResolvedValue({ user: mockUser, tokens: mockTokens, requiresMfa: false });

        await facade.login({ email: 'test@test.com', password: 'password' });

        expect(facade.user()).toEqual(mockUser);
        expect(facade.isAuthenticated()).toBe(true);
        expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('should handle login failure', async () => {
        authRepoMock.login.mockRejectedValue(new Error('Invalid credentials'));

        await facade.login({ email: 'test@test.com', password: 'wrong' });

        expect(facade.error()).toBe('Invalid credentials');
        expect(facade.isAuthenticated()).toBe(false);
    });

    it('should clear state on logout', async () => {
        await facade.logout();

        expect(facade.user()).toBeNull();
        expect(facade.isAuthenticated()).toBe(false);
        expect(authRepoMock.logout).toHaveBeenCalled();
    });
});
