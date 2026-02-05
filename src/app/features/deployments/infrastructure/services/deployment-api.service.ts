import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeploymentDto } from '../../application/mappers/deployment.mapper';

@Injectable({
    providedIn: 'root'
})
export class DeploymentApiService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000';

    getAll(): Observable<DeploymentDto[]> {
        return this.http.get<DeploymentDto[]>(`${this.API_URL}/deployments`);
    }

    getById(id: string): Observable<DeploymentDto> {
        return this.http.get<DeploymentDto>(`${this.API_URL}/deployments/${id}`);
    }

    create(dto: DeploymentDto): Observable<DeploymentDto> {
        return this.http.post<DeploymentDto>(`${this.API_URL}/deployments`, dto);
    }

    update(id: string, dto: Partial<DeploymentDto>): Observable<DeploymentDto> {
        return this.http.patch<DeploymentDto>(`${this.API_URL}/deployments/${id}`, dto);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${`${this.API_URL}/deployments/${id}`}`);
    }
}
