import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { TelemetryService } from '../services/telemetry.service';

describe('authInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    let telemetryServiceMock: { getCorrelationId: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        telemetryServiceMock = {
            getCorrelationId: vi.fn().mockReturnValue('test-correlation-id')
        };

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
                { provide: TelemetryService, useValue: telemetryServiceMock }
            ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should add Authorization header if token exists', () => {
        const mockToken = { token: 'fake-jwt-token' };
        localStorage.setItem('opsboard_auth_token', JSON.stringify(mockToken));

        httpClient.get('/api/test').subscribe();

        const req = httpMock.expectOne('/api/test');
        expect(req.request.headers.has('Authorization')).toBe(true);
        expect(req.request.headers.get('Authorization')).toBe('Bearer fake-jwt-token');
        expect(req.request.headers.get('X-Correlation-ID')).toBe('test-correlation-id');
    });

    it('should not add Authorization header if token does not exist', () => {
        httpClient.get('/api/test').subscribe();

        const req = httpMock.expectOne('/api/test');
        expect(req.request.headers.has('Authorization')).toBe(false);
    });
});
