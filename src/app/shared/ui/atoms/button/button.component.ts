import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';


export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button 
      [type]="type"
      [class]="'btn-' + variant"
      [class.btn-sm]="size === 'sm'"
      [class.btn-lg]="size === 'lg'"
      [disabled]="disabled || isLoading"
      (click)="onClick($event)">
      @if (isLoading) {
        <span class="loader"></span>
      }
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() isLoading = false;

  @Output() btnClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.isLoading) {
      this.btnClick.emit(event);
    }
  }
}
