import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFacade } from '../../../application/admin.facade';
import { ButtonComponent } from '../../../../../shared/ui/atoms/button/button.component';
import { IconComponent } from '../../../../../shared/ui/atoms/icon/icon.component';
import { Role } from '../../../domain/models/admin-entities';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-role-management',
    standalone: true,
    imports: [CommonModule, ButtonComponent, IconComponent, FormsModule],
    templateUrl: './role.management.page.html',
    styleUrls: ['./role.management.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleManagementPage implements OnInit {
    private readonly adminFacade = inject(AdminFacade);

    protected readonly roles = this.adminFacade.roles;
    protected readonly isLoading = this.adminFacade.isLoading;

    // UI State
    protected expandedRoleId = signal<string | null>(null);

    ngOnInit(): void {
        this.adminFacade.loadAll();
    }

    toggleExpand(roleId: string): void {
        this.expandedRoleId.update(current => current === roleId ? null : roleId);
    }

    // Placeholder for future edit functionality
    onEditRole(role: Role): void {
        console.log('Edit role:', role);
    }
}
