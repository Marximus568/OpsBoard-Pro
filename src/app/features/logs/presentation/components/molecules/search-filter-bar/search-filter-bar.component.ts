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
        this.facade.exportLogs();
    }
}
