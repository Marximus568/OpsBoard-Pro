import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFacade } from '../../../application/admin.facade';
import { ButtonComponent } from '../../../../../shared/ui/atoms/button/button.component';
import { IconComponent } from '../../../../../shared/ui/atoms/icon/icon.component';
import { FormsModule } from '@angular/forms';
import { SystemConfig } from '../../../domain/models/admin-entities';

@Component({
    selector: 'app-system-settings',
    standalone: true,
    imports: [CommonModule, ButtonComponent, IconComponent, FormsModule],
    templateUrl: './system-settings.page.html',
    styleUrls: ['./system-settings.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemSettingsPage implements OnInit {
    private readonly adminFacade = inject(AdminFacade);

    protected readonly configs = this.adminFacade.configurations;
    protected readonly isLoading = this.adminFacade.isLoading;

    // Group configs by category
    protected readonly groupedConfigs = computed(() => {
        const groups: { [key: string]: SystemConfig[] } = {};
        this.configs().forEach(c => {
            if (!groups[c.category]) groups[c.category] = [];
            groups[c.category].push(c);
        });
        return groups;
    });

    protected readonly categories = computed(() => Object.keys(this.groupedConfigs()));

    ngOnInit(): void {
        this.adminFacade.loadAll();
    }

    onSave(config: SystemConfig, newValue: string): void {
        this.adminFacade.updateConfig(config.id, newValue);
    }
}
