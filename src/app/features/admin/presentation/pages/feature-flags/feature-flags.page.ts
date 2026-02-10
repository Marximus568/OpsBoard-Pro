import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFacade } from '../../../application/admin.facade';
import { BadgeComponent, BadgeType } from '../../../../../shared/ui/atoms/badge/badge.component';
import { ButtonComponent } from '../../../../../shared/ui/atoms/button/button.component';
import { IconComponent } from '../../../../../shared/ui/atoms/icon/icon.component';
import { FeatureFlag } from '../../../domain/models/admin-entities';

@Component({
    selector: 'app-feature-flags',
    standalone: true,
    imports: [CommonModule, BadgeComponent, ButtonComponent, IconComponent],
    templateUrl: './feature-flags.page.html',
    styleUrls: ['./feature-flags.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureFlagsPage implements OnInit {
    private readonly adminFacade = inject(AdminFacade);

    protected readonly flags = this.adminFacade.featureFlags;
    protected readonly isLoading = this.adminFacade.isLoading;

    ngOnInit(): void {
        this.adminFacade.loadAll();
    }

    onToggle(flag: FeatureFlag): void {
        this.adminFacade.toggleFeatureFlag(flag.id, !flag.enabled);
    }

    getScopeBadge(scope: string): BadgeType {
        switch (scope) {
            case 'GLOBAL': return 'success';
            case 'BETA': return 'warning';
            case 'INTERNAL': return 'error';
            default: return 'info';
        }
    }
}
