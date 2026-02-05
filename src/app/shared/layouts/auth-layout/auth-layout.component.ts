import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <main class="auth-layout-container">
      <router-outlet></router-outlet>
    </main>
  `,
    styles: [`
    .auth-layout-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AuthLayoutComponent { }
