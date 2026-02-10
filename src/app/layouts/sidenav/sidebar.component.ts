import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthFacade } from '../../features/auth/application/auth.facade';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  protected readonly currentUser = this.authFacade.user;

  async onLogout(): Promise<void> {
    await this.authFacade.logout();
    this.router.navigate(['/auth/login']);
  }
}
