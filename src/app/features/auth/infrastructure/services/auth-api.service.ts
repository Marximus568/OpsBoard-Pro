import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../../application/mappers/auth.mapper';

/**
 * Service dedicated exclusively to data transport for Authentication.
 * This service implements the "Pure I/O" principle of the Infrastructure layer.
 * No business rules or domain transformations are performed here.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000';

    /**
     * Fetches a user list filtered by email from the backend.
     * @param email The email to filter users by.
     * @returns An Observable containing a list of matching UserDto objects.
     */
    getUsersByEmail(email: string): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${this.API_URL}/users`, {
            params: { user_email: email }
        });
    }
}
