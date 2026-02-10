import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-icon',
    standalone: true,
    imports: [CommonModule],
    template: `
    <span class="icon" [style.width.px]="size" [style.height.px]="size" [innerHTML]="svgContent"></span>
  `,
    styles: [`
    .icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: currentColor;
    }
    :host ::ng-deep svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
    @Input() name: string = '';
    @Input() size: number = 20;

    get svgContent(): string {
        // Basic mapping for common icons
        const icons: Record<string, string> = {
            'plus': '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
            'filter': '<svg viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>',
            'search': '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
            'chevron-right': '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
            'alert': '<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>'
        };
        return icons[this.name] || '';
    }
}
