import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeploymentDto } from '../../application/mappers/deployment.mapper';
import { API_BASE_URL } from '../../../../core/tokens/api.tokens';

@Injectable({
    providedIn: 'root'
})
export class DeploymentApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(API_BASE_URL);

    getAll(): Observable<DeploymentDto[]> {
        return this.http.get<DeploymentDto[]>(`${this.baseUrl}/deployments`);
    }

    getById(id: string): Observable<DeploymentDto> {
        return this.http.get<DeploymentDto>(`${this.baseUrl}/deployments/${id}`);
    }

    create(dto: DeploymentDto): Observable<DeploymentDto> {
        return this.http.post<DeploymentDto>(`${this.baseUrl}/deployments`, dto);
    }

    update(id: string, dto: Partial<DeploymentDto>): Observable<DeploymentDto> {
        return this.http.patch<DeploymentDto>(`${this.baseUrl}/deployments/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/deployments/${id}`);
    }
}
