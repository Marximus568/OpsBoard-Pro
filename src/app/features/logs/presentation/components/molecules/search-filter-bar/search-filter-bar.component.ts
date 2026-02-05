import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogsFacade } from '../../../../application/logs.facade';
import { LogLevel } from '../../../../domain/models/log-level.enum';

@Component({
    selector: 'app-search-filter-bar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './search-filter-bar.component.html',
    styleUrls: ['./search-filter-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFilterBarComponent {
    protected readonly facade = inject(LogsFacade);

    query = '';
    selectedLevel: LogLevel | null = null;
    levels = Object.values(LogLevel);

    onFilterChange(): void {
        this.facade.updateFilters({
            query: this.query,
            levels: this.selectedLevel ? [this.selectedLevel] : []
        });
    }

    onExport(): void {
        const content = this.facade.exportLogs();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-export-${new Date().getTime()}.log`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
