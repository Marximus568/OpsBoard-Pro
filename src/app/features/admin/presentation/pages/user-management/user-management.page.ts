import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminFacade } from '../../../application/admin.facade';
import { BadgeComponent, BadgeType } from '../../../../../shared/ui/atoms/badge/badge.component';
import { ButtonComponent } from '../../../../../shared/ui/atoms/button/button.component';
import { IconComponent } from '../../../../../shared/ui/atoms/icon/icon.component';
import { UserAdmin } from '../../../domain/models/admin-entities';
import { FormsModule } from '@angular/forms';
import { ExcelService } from '../../../../../core/services/excel.service';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, BadgeComponent, ButtonComponent, IconComponent, FormsModule],
    templateUrl: './user.management.page.html',
    styleUrls: ['./user.management.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserManagementPage implements OnInit {
    private readonly adminFacade = inject(AdminFacade);
    private readonly excelService = inject(ExcelService);

    protected readonly users = this.adminFacade.users;
    protected readonly isLoading = this.adminFacade.isLoading;
    protected readonly error = this.adminFacade.error;

    // Local UI State for Edit Modal
    protected isModalOpen = signal(false);
    protected isDeleteConfirmOpen = signal(false);
    protected selectedUser = signal<UserAdmin | null>(null);
    protected userToDelete = signal<UserAdmin | null>(null);
    protected editForm = signal<UserAdmin>({
        uuid: '',
        user_email: '',
        full_name: '',
        active: true,
        permission_roles: [],
        createdAt: ''
    });

    ngOnInit(): void {
        this.adminFacade.loadAll();
    }

    onEdit(user?: UserAdmin): void {
        if (!user) {
            this.selectedUser.set(null);
            this.editForm.set({
                uuid: '',
                user_email: '',
                full_name: '',
                active: true,
                permission_roles: [],
                createdAt: ''
            });
        } else {
            this.selectedUser.set(user);
            this.editForm.set({ ...user });
        }
        this.isModalOpen.set(true);
    }

    onToggleActive(user: UserAdmin): void {
        this.adminFacade.updateUser({ uuid: user.uuid, active: !user.active });
    }

    onDelete(user: UserAdmin): void {
        this.userToDelete.set(user);
        this.isDeleteConfirmOpen.set(true);
    }

    onConfirmDelete(): void {
        const user = this.userToDelete();
        if (user) {
            this.adminFacade.deleteUser(user.uuid);
        }
        this.closeDeleteConfirm();
    }

    closeDeleteConfirm(): void {
        this.isDeleteConfirmOpen.set(false);
        this.userToDelete.set(null);
    }

    async onSave(): Promise<void> {
        if (this.selectedUser() && this.selectedUser()?.uuid) {
            await this.adminFacade.updateUser({ ...this.editForm(), uuid: this.selectedUser()!.uuid });
            this.closeModal();
        } else {
            // Handle creation
            const newId = 'usr-' + Math.random().toString(36).substring(2, 9);
            const newUser = {
                ...this.editForm(),
                id: newId,
                uuid: newId,
                createdAt: new Date().toISOString()
            };
            this.adminFacade.createUser(newUser as UserAdmin);
            this.closeModal();
        }
    }

    closeModal(): void {
        this.isModalOpen.set(false);
        this.selectedUser.set(null);
        this.editForm.set({
            uuid: '',
            user_email: '',
            full_name: '',
            active: true,
            permission_roles: [],
            createdAt: ''
        });
    }

    updateEditForm(field: keyof UserAdmin, value: unknown): void {
        if (field === 'permission_roles' && typeof value === 'string') {
            const roles = value.split(',').map(r => r.trim()).filter(r => r.length > 0);
            this.editForm.update(form => ({ ...form, [field]: roles }));
        } else {
            this.editForm.update(form => ({ ...form, [field]: value }));
        }
    }

    // Helper for badge type
    getRoleBadge(role: string): BadgeType {
        switch (role) {
            case 'role-admin': return 'error';
            case 'role-operator': return 'warning';
            default: return 'info';
        }
    }

    onExport(): void {
        if (!this.users().length) return;

        // Transform data for export
        const exportData = this.users().map(user => ({
            Name: user.full_name,
            Email: user.user_email,
            Roles: user.permission_roles.join(', '),
            Status: user.active ? 'Active' : 'Inactive',
            Joined: new Date(user.createdAt).toLocaleDateString()
        }));

        this.excelService.exportAsExcelFile(exportData, 'users');
    }
}
