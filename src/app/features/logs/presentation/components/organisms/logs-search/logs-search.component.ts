import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogsFacade } from '../../../../application/logs.facade';
import { LogLevel } from '../../../../domain/models/log-level.enum';
import { SavedSearchesComponent } from '../../molecules/saved-searches/saved-searches.component';

@Component({
    selector: 'app-logs-search',
    standalone: true,
    imports: [CommonModule, FormsModule, SavedSearchesComponent],
    template: `
        <div class="search-container glass-card">
            <div class="search-main">
                <div class="input-wrap">
                    <span class="material-icons search-icon">search</span>
                    <input 
                        type="text" 
                        [(ngModel)]="searchQuery" 
                        (keyup.enter)="applySearch()"
                        placeholder="Search logs by message, service or trace ID..."
                        class="search-input">
                    @if (searchQuery()) {
                        <button (click)="clearAndReset()" class="clear-btn">
                            <span class="material-icons">close</span>
                        </button>
                    }
                </div>
                <div class="actions">
                    <button (click)="applySearch()" class="btn-primary">
                        Search
                    </button>
                    <button (click)="facade.saveSearch(searchQuery())" [disabled]="!searchQuery()" class="btn-secondary">
                        <span class="material-icons">bookmark_border</span> Save
                    </button>
                    <button (click)="toggleFilters()" class="btn-icon" [class.active]="showAdvanced()">
                        <span class="material-icons">tune</span>
                    </button>
                </div>
            </div>

            <app-saved-searches></app-saved-searches>

            @if (showAdvanced()) {
                <div class="advanced-filters fade-in">
                    <div class="filter-group">
                        <span class="group-label">Level</span>
                        <div class="options">
                            @for (level of levels; track level) {
                                <label class="checkbox-label">
                                    <input type="checkbox" [checked]="isLevelSelected(level)" (change)="toggleLevel(level)">
                                    <span class="custom-check"></span> {{ level }}
                                </label>
                            }
                        </div>
                    </div>

                    <div class="filter-group">
                        <label for="service-select">Service</label>
                        <select id="service-select" class="filter-select" (change)="updateService($event)">
                            <option value="">All Services</option>
                            @for (service of services; track service) {
                                <option [value]="service">{{ service }}</option>
                            }
                        </select>
                    </div>

                    <div class="filter-group">
                        <label for="date-from">Date Range</label>
                        <div class="date-inputs">
                            <input id="date-from" type="datetime-local" class="date-input" (change)="updateDateFrom($event)">
                            <span>to</span>
                            <input type="datetime-local" class="date-input" (change)="updateDateTo($event)" aria-label="Date to">
                        </div>
                    </div>
                </div>
            }
        </div>
    `,
    styles: [`
        .search-container {
            padding: 1.5rem;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border-color);
            margin-bottom: 2rem;
        }
        .search-main {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        .input-wrap {
            position: relative;
            flex: 1;
            display: flex;
            align-items: center;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 0 1rem;
            transition: border-color 0.2s;
            &:focus-within { border-color: var(--primary-color, #6366f1); }
        }
        .search-icon { color: var(--text-secondary); margin-right: 0.75rem; }
        .search-input {
            background: none;
            border: none;
            color: var(--text-primary);
            height: 48px;
            width: 100%;
            font-size: 1rem;
            outline: none;
            &::placeholder { color: var(--text-secondary); }
        }
        .clear-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.5rem;
            &:hover { color: var(--text-primary); }
        }
        .actions { display: flex; gap: 0.75rem; }
        .btn-primary {
            background: var(--primary-color, #6366f1);
            color: white;
            border: none;
            padding: 0 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            height: 48px;
            &:hover { opacity: 0.9; }
        }
        .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            padding: 0 1.25rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            &:disabled { opacity: 0.5; cursor: not-allowed; }
            &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); }
        }
        .btn-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            border: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            &.active { border-color: var(--primary-color); color: var(--primary-color); }
        }
        .advanced-filters {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border-color);
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
        }
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            label, .group-label { font-size: 0.813rem; font-weight: 600; color: var(--text-secondary); }
        }
        .options { display: flex; flex-wrap: wrap; gap: 1rem; }
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            cursor: pointer;
            input { display: none; }
            .custom-check {
                width: 18px;
                height: 18px;
                border-radius: 4px;
                border: 2px solid var(--border-color);
                transition: all 0.2s;
            }
            input:checked + .custom-check {
                background: var(--primary-color);
                border-color: var(--primary-color);
                position: relative;
                &::after {
                    content: 'check';
                    font-family: 'Material Icons';
                    font-size: 14px;
                    color: white;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
        .filter-select {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            height: 40px;
            border-radius: 8px;
            padding: 0 0.75rem;
            outline: none;
        }
        .date-inputs {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        .date-input {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            height: 40px;
            border-radius: 8px;
            padding: 0 0.5rem;
            flex: 1;
        }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsSearchComponent {
    protected readonly facade = inject(LogsFacade);

    searchQuery = signal('');
    showAdvanced = signal(false);

    readonly levels = Object.values(LogLevel);
    readonly services = ['auth-service', 'inventory-api', 'gateway', 'payment-worker', 'ui-app'];

    applySearch(): void {
        this.facade.updateFilters({ query: this.searchQuery() });
    }

    clearAndReset(): void {
        this.searchQuery.set('');
        this.applySearch();
    }

    toggleFilters(): void {
        this.showAdvanced.update(v => !v);
    }

    isLevelSelected(level: LogLevel): boolean {
        return this.facade.filters().levels?.includes(level) ?? false;
    }

    toggleLevel(level: LogLevel): void {
        const current = this.facade.filters().levels || [];
        const next = current.includes(level)
            ? current.filter(l => l !== level)
            : [...current, level];

        this.facade.updateFilters({ levels: next.length ? next : undefined });
    }

    updateService(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        this.facade.updateFilters({ services: value ? [value] : undefined });
    }

    updateDateFrom(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.facade.updateFilters({ dateFrom: value ? new Date(value) : undefined });
    }

    updateDateTo(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.facade.updateFilters({ dateTo: value ? new Date(value) : undefined });
    }
}
