import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../../../layouts/topbar/top-bar.component';
import { SidebarComponent } from '../../../layouts/sidenav/sidebar.component';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent, SidebarComponent],
  template: `
    <div class="shell-layout">
      <app-sidebar></app-sidebar>
      <div class="shell-main">
        <app-top-bar></app-top-bar>
        <main class="shell-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shell-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .shell-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .shell-content {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      background: var(--surface-ground, #0f1117);
    }
  `]
})
export class ShellLayoutComponent { }
