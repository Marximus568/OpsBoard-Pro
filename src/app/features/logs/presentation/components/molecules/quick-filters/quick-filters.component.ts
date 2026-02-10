import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsFacade } from '../../../../application/logs.facade';

@Component({
    selector: 'app-quick-filters',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="quick-filters">
            <span class="label">Quick Filters:</span>
            <button (click)="facade.applyQuickFilter('ERRORS')" class="filter-chip error">
                <span class="material-icons">error_outline</span> Errors Only
            </button>
            <button (click)="facade.applyQuickFilter('LAST_HOUR')" class="filter-chip info">
                <span class="material-icons">schedule</span> Last Hour
            </button>
            <button (click)="facade.applyQuickFilter('ALL')" class="filter-chip secondary">
                <span class="material-icons">restart_alt</span> Reset
            </button>
        </div>
    `,
    styles: [`
        .quick-filters {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
        }
        .filter-chip {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 100px;
            font-size: 0.875rem;
            font-weight: 500;
            border: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
            cursor: pointer;
            transition: all 0.2s ease;
            
            .material-icons { font-size: 1.125rem; }
            
            &:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: translateY(-1px);
            }
            
            &.error:hover { border-color: var(--error-color, #ff4d4d); color: var(--error-color, #ff4d4d); }
            &.info:hover { border-color: var(--info-color, #3b82f6); color: var(--info-color, #3b82f6); }
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickFiltersComponent {
    protected readonly facade = inject(LogsFacade);
}
