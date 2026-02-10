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
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number = 'md';

  get sizePx(): number {
    if (typeof this.size === 'number') return this.size;
    switch (this.size) {
      case 'xs': return 12;
      case 'sm': return 16;
      case 'md': return 20;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 20;
    }
  }

  get svgContent(): string {
    const icons: Record<string, string> = {
      'plus': '<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
      'filter': '<svg viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>',
      'search': '<svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
      'chevron-right': '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
      'alert': '<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
      'edit': '<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
      'lock': '<svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3 3.1-3s3.1 1.29 3.1 3v2z"/></svg>',
      'unlock': '<svg viewBox="0 0 24 24"><path d="M12 20c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V13c0-1.1.9-2 2-2h9V6c0-1.66-1.34-3-3-3s-3 1.34-3 3v2H6V6c0-3.31 2.69-6 6-6s6 2.69 6 6v5zm-8 0h6v2H10v-2z"/></svg>',
      'sync': '<svg viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>',
      'check': '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      'dashboard': '<svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>',
      'confirmation_number': '<svg viewBox="0 0 24 24"><path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"/></svg>',
      'rocket_launch': '<svg viewBox="0 0 24 24"><path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 10.69l4.05-4.05c.47-.47 1.15-.68 1.81-.55l1.33.26zM22 5l-2.79 2.79c-.31-.14-3.61-1.54-5.9-3.57 1.33-.26 2.72-.1 4.05.54.47.23.94.47 1.33.86l2.79 2.79c1.47-1.48 1.48-3.88.52-3.41zM20 9l-.6-.6c-.23-.23-.61-.31-.96-.15-.69.31-1.4.61-2.08.97-.24-.49-.51-.96-.82-1.4.35-.67.66-1.39.97-2.08.16-.35.08-.73-.15-.96L15 4c-.58.58-1.07 1.34-1.36 2.13-.53 1.46-.38 3.08.56 4.34l-5.35-5.35C5.9 2.18 2.65 3.53 2.15 3.84c.48.5 1.83 3.75 4.97 6.69l5.35 5.35c-1.26-.94-2.88-1.09-4.34-.56-.79.29-1.55.78-2.13 1.36l.75 1.34c.23.23.61.31.96.15.69-.31 1.4-.61 2.08-.97.24.49.51.96.82 1.4-.35.67-.66 1.39-.97 2.08-.16.35-.08.73.15.96l.6.6c.93-2.28 4.2-3.64 4.7-4.13l-4.05-4.05 1.55-1.55c.31.13 3.6 1.53 5.89 3.57l2.79-2.79c-.06-.52-.3-1.03-.68-1.42z"/></svg>',
      'segment': '<svg viewBox="0 0 24 24"><path d="M9 18h12v-2H9v2zM3 6v2h18V6H3zm9 7h9v-2h-9v2z"/></svg>'
    };
    return icons[this.name] || '';
  }
}
