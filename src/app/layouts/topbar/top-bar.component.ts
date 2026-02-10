import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '../../features/auth/application/auth.facade';
import { ThemeService } from '../../core/services/theme.service';
import { IconComponent } from '../../shared/ui/atoms/icon/icon.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  protected readonly auth = inject(AuthFacade);
  protected readonly themeService = inject(ThemeService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
