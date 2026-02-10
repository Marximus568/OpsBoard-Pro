
// I'll use Promises for domain contracts and handle RxJS in Application/Infrastructure.
import { Incident } from '../models/incident.entity';

export interface IIncidentRepository {
    getAll(): Promise<Incident[]>;
    getById(id: string): Promise<Incident | null>;
    save(incident: Incident): Promise<void>;
    update(incident: Incident): Promise<void>;
    delete(id: string): Promise<void>;
}
