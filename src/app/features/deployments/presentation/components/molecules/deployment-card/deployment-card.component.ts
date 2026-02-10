import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Deployment } from '../../../../domain/models/deployment.entity';
import { BadgeComponent, BadgeType } from '../../../../../../shared/ui/atoms/badge/badge.component';
import { DeploymentStatus } from '../../../../domain/models/deployment-status.model';

@Component({
    selector: 'app-deployment-card',
    standalone: true,
    imports: [CommonModule, BadgeComponent],
    templateUrl: './deployment-card.component.html',
    styleUrls: ['./deployment-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentCardComponent {
    @Input({ required: true }) deployment!: Deployment;

    getStatusType(): BadgeType {
        const map: Record<DeploymentStatus, BadgeType> = {
            [DeploymentStatus.REQUESTED]: 'default',
            [DeploymentStatus.REVIEW]: 'info',
            [DeploymentStatus.APPROVED]: 'warning',
            [DeploymentStatus.RUNNING]: 'primary',
            [DeploymentStatus.SUCCESS]: 'success',
            [DeploymentStatus.FAILED]: 'error'
        };
        return map[this.deployment.status] || 'default';
    }
}
