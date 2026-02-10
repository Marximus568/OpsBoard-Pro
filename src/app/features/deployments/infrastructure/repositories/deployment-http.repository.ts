import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IDeploymentRepository } from '../../domain/contracts/deployment.repository';
import { Deployment } from '../../domain/models/deployment.entity';
import { DeploymentApiService } from '../services/deployment-api.service';
import { DeploymentMapper } from '../../application/mappers/deployment.mapper';

@Injectable({
    providedIn: 'root'
})
export class DeploymentHttpRepository implements IDeploymentRepository {
    private readonly api = inject(DeploymentApiService);

    async getAll(): Promise<Deployment[]> {
        const dtos = await firstValueFrom(this.api.getAll());
        return dtos.map(dto => DeploymentMapper.toDomain(dto));
    }

    async getById(id: string): Promise<Deployment | undefined> {
        const dto = await firstValueFrom(this.api.getById(id));
        return dto ? DeploymentMapper.toDomain(dto) : undefined;
    }

    async save(deployment: Deployment): Promise<void> {
        const dto = DeploymentMapper.toPersistence(deployment);
        // Logic for create vs update
        const exists = await this.getById(deployment.id).catch(() => undefined);
        if (exists) {
            await firstValueFrom(this.api.update(deployment.id, dto));
        } else {
            await firstValueFrom(this.api.create(dto));
        }
    }

    async delete(id: string): Promise<void> {
        await firstValueFrom(this.api.delete(id));
    }
}
