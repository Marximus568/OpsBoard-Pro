import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthFacade } from '../../features/auth/application/auth.facade';

export const roleGuard: CanActivateFn = (route, state) => {
    const authFacade = inject(AuthFacade);
    const router = inject(Router);

    const expectedRoles = route.data['roles'] as Array<string>;
    const user = authFacade.user();

    if (!user || !authFacade.isAuthenticated()) {
        router.navigate(['/auth/login']);
        return false;
    }

    // If no specific roles required, allow
    if (!expectedRoles || expectedRoles.length === 0) {
        return true;
    }

    // Check if user has any of the expected roles
    const hasRole = expectedRoles.some(role => user.hasRole(role));

    if (hasRole) {
        return true;
    }

    // Redirect to dashboard or unauthorized page
    console.warn(`User ${user.email} attempted to access restricted route ${state.url} without role(s): ${expectedRoles.join(', ')}`);
    router.navigate(['/dashboard']);
    return false;
};
