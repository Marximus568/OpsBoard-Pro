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
    protected selectedUser = signal<UserAdmin | null>(null);
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

    onEdit(user: Partial<UserAdmin>): void {
        this.selectedUser.set(user as UserAdmin);
        this.editForm.set({ ...user as UserAdmin });
        this.isModalOpen.set(true);
    }

    onToggleActive(user: UserAdmin): void {
        this.adminFacade.updateUser({ uuid: user.uuid, active: !user.active });
    }

    onDelete(user: UserAdmin): void {
        if (confirm(`Are you sure you want to delete ${user.full_name}?`)) {
            this.adminFacade.deleteUser(user.uuid);
        }
    }

    async onSave(): Promise<void> {
        if (this.selectedUser() && this.selectedUser()?.uuid) {
            await this.adminFacade.updateUser({ ...this.editForm(), uuid: this.selectedUser()!.uuid });
            this.closeModal();
        } else {
            // Handle creation
            const newUser = { ...this.editForm() };
            delete (newUser as Partial<UserAdmin>).uuid;
            this.adminFacade.createUser(newUser as unknown as UserAdmin);
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
        this.editForm.update(form => ({ ...form, [field]: value }));
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
