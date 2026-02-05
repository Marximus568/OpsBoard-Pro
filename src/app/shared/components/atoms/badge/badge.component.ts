import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeType = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'critical';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span class="badge" [ngClass]="type">
      <ng-content></ng-content>
    </span>
  `,
    styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }
    .badge.default { background-color: var(--color-gray-100); color: var(--color-gray-800); }
    .badge.primary { background-color: var(--color-primary-100); color: var(--color-primary-700); }
    .badge.success { background-color: #dcfce7; color: #15803d; }
    .badge.warning { background-color: #fef9c3; color: #854d0e; }
    .badge.error { background-color: #fee2e2; color: #b91c1c; }
    .badge.critical { background-color: var(--color-gray-900); color: white; }
  `]
})
export class BadgeComponent {
    @Input() type: BadgeType = 'default';
}
