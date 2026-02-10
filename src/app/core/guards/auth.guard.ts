import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    // Simplified check using localStorage for mock
    const token = localStorage.getItem('opsboard_auth_token');

    if (token) {
        return true;
    }

    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
