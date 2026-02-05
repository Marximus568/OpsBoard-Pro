import { Deployment } from '../models/deployment.entity';

/**
 * Repository Port for Deployment operations.
 * NO RxJS in Domain? Rule 47 says Domain MUST NOT depend on RxJS.
 * Correcting: Use Promises or a generic interface if strictly required.
 * Re-reading AGENTS.md Rule 47: "Domain MUST NOT depend on ... RxJS".
 * Refactoring to use native Promises for Domain contracts.
 */
export interface IDeploymentRepository {
    getAll(): Promise<Deployment[]>;
    getById(id: string): Promise<Deployment | undefined>;
    save(deployment: Deployment): Promise<void>;
    delete(id: string): Promise<void>;
}
