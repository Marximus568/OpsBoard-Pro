import { Component } from '@angular/core';

@Component({
    selector: 'app-top-bar',
    standalone: true,
    template: `
    <header class="top-bar">
      <div class="search-box">
        <!-- Placeholder for search -->
      </div>
      <div class="user-actions">
        <button class="icon-btn">🔔</button>
        <div class="user-profile">
          <span>Admin</span>
        </div>
      </div>
    </header>
  `,
    styles: [`
    .top-bar {
      height: 64px;
      background-color: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--spacing-lg);
      box-shadow: var(--shadow-sm);
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }
    .icon-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
    }
    .user-profile {
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-sm);
    }
  `]
})
export class TopBarComponent { }
