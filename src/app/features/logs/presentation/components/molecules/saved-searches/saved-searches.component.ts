import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsFacade } from '../../../../application/logs.facade';

@Component({
    selector: 'app-saved-searches',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (facade.savedSearches().length > 0) {
            <div class="saved-searches">
                <span class="label">Recently Saved:</span>
                <div class="chips-container">
                    @for (search of facade.savedSearches(); track search) {
                        <div class="search-chip">
                            <span (click)="facade.updateFilters({ query: search })" 
                                  (keydown.enter)="facade.updateFilters({ query: search })"
                                  tabindex="0"
                                  role="button"
                                  class="term">{{ search }}</span>
                            <button (click)="facade.removeSearch(search)" class="remove-btn">
                                <span class="material-icons">close</span>
                            </button>
                        </div>
                    }
                </div>
            </div>
        }
    `,
    styles: [`
        .saved-searches {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
        }
        .label {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-secondary);
            white-space: nowrap;
        }
        .chips-container {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .search-chip {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 0 0.5rem;
            height: 28px;
            transition: all 0.2s;
            
            .term {
                font-size: 0.813rem;
                color: var(--text-primary);
                cursor: pointer;
                padding: 0 0.25rem;
                &:hover { color: var(--primary-color, #6366f1); }
            }
            
            .remove-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                display: flex;
                align-items: center;
                padding: 0;
                margin-left: 0.25rem;
                &:hover { color: var(--error-color, #ff4d4d); }
                .material-icons { font-size: 14px; }
            }
            
            &:hover { background: rgba(255, 255, 255, 0.08); }
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedSearchesComponent {
    protected readonly facade = inject(LogsFacade);
}
