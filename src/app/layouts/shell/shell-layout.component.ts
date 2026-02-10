import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '../topbar/top-bar.component';
import { SidebarComponent } from '../sidenav/sidebar.component';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent, SidebarComponent],
  templateUrl: './shell-layout.component.html',
  styleUrls: ['./shell-layout.component.scss']
})
export class ShellLayoutComponent { }
