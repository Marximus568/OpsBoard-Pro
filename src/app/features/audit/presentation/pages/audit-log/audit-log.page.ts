import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditFacade } from '../../../application/audit.facade';
import { BadgeComponent } from '../../../../../shared/ui/atoms/badge/badge.component';
import { ButtonComponent } from '../../../../../shared/ui/atoms/button/button.component';
import { IconComponent } from '../../../../../shared/ui/atoms/icon/icon.component';


@Component({
    selector: 'app-audit-log',
    standalone: true,
    imports: [CommonModule, FormsModule, BadgeComponent, ButtonComponent, IconComponent],
    templateUrl: './audit-log.page.html',
    styleUrls: ['./audit-log.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditLogPage implements OnInit {
    private readonly auditFacade = inject(AuditFacade);

    protected readonly logs = this.auditFacade.logs;
    protected readonly isLoading = this.auditFacade.isLoading;

    // Filters
    protected searchTerm = signal('');
    protected filterAction = signal('');

    protected readonly filteredLogs = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const action = this.filterAction();
        return this.logs().filter(log => {
            const matchesTerm = log.userId.toLowerCase().includes(term) || log.resource.toLowerCase().includes(term);
            const matchesAction = action ? log.action === action : true;
            return matchesTerm && matchesAction;
        });
    });

    ngOnInit(): void {
        this.auditFacade.loadLogs();
    }

    exportToCsv(): void {
        const logs = this.filteredLogs();
        if (!logs.length) return;

        const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Metadata'];
        const rows = logs.map(log => [
            log.timestamp,
            log.userId,
            log.action,
            log.resource,
            JSON.stringify(log.metadata || {})
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `audit_logs_${new Date().toISOString()}.csv`;
        link.click();
    }
}
