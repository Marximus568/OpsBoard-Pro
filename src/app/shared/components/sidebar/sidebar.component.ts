import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthFacade } from '../../../features/auth/application/auth.facade';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterModule],
    template: `
    <aside class="sidebar">
      <div class="logo">
        <h1>OpsBoard</h1>
      </div>
      <nav class="nav-links">
        <a routerLink="/incidents" routerLinkActive="active" class="nav-item">
          <span class="icon">🎟️</span>
          <span class="label">Incidents</span>
        </a>
        <a routerLink="/deployments" routerLinkActive="active" class="nav-item">
          <span class="icon">🚀</span>
          <span class="label">Deployments</span>
        </a>
        <a routerLink="/logs" routerLinkActive="active" class="nav-item">
          <span class="icon">📜</span>
          <span class="label">Logs</span>
        </a>
      </nav>
      <div class="footer">
        <button class="logout-btn" (click)="onLogout()">Logout</button>
      </div>
    </aside>
  `,
    styles: [`
    .sidebar {
      width: 260px;
      background-color: var(--color-gray-900);
      color: white;
      display: flex;
      flex-direction: column;
      padding: var(--spacing-lg);
    }
    .logo {
      margin-bottom: var(--spacing-xl);
      h1 {
        font-size: var(--font-size-lg);
        color: var(--color-primary-400);
      }
    }
    .nav-links {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: 4px;
      text-decoration: none;
      color: var(--color-gray-400);
      transition: all 0.2s;

      &:hover {
        background-color: var(--color-gray-800);
        color: white;
      }

      &.active {
        background-color: var(--color-primary-600);
        color: white;
      }
    }
    .logout-btn {
      width: 100%;
      padding: var(--spacing-sm);
      background: none;
      border: 1px solid var(--color-gray-700);
      color: var(--color-gray-400);
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        border-color: var(--color-error);
        color: var(--color-error);
      }
    }
  `]
})
export class SidebarComponent {
    private readonly authFacade = inject(AuthFacade);
    private readonly router = inject(Router);

    async onLogout(): Promise<void> {
        await this.authFacade.logout();
        this.router.navigate(['/auth/login']);
    }
}
