import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-shell-layout',
    standalone: true,
    imports: [RouterOutlet, TopBarComponent, SidebarComponent],
    template: `
    <div class="shell-container">
      <app-sidebar class="sidebar"></app-sidebar>
      <div class="main-content">
        <app-top-bar></app-top-bar>
        <section class="page-content">
          <router-outlet></router-outlet>
        </section>
      </div>
    </div>
  `,
    styles: [`
    .shell-container {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-secondary);
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .page-content {
      flex: 1;
      padding: var(--spacing-md);
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      .sidebar {
        display: none; /* Mobile logic will be added */
      }
    }
  `]
})
export class ShellLayoutComponent { }
