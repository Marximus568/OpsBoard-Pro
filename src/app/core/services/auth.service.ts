import { Observable } from 'rxjs';

export interface User {
    id: string;
    email: string;
    roles: string[];
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: User;
}

export abstract class AuthService {
    abstract login(credentials: unknown): Observable<AuthResponse>;
    abstract logout(): void;
    abstract refresh(): Observable<AuthResponse>;
    abstract getCurrentUser(): User | null;
    abstract isAuthenticated(): boolean;
}
