import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { TelemetryService } from '../services/telemetry.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const telemetryService = inject(TelemetryService);
    const correlationId = telemetryService.getCorrelationId();

    // Retrieve token from storage (simplified for mock)
    const tokens = JSON.parse(localStorage.getItem('opsboard_auth_token') || '{}');
    const token = tokens.token;

    let headers = req.headers.set('X-Correlation-ID', correlationId);

    if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const authReq = req.clone({ headers });

    return next(authReq);
};
