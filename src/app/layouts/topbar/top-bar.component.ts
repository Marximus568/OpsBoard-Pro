import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFacade } from '../../features/auth/application/auth.facade';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  protected readonly auth = inject(AuthFacade);
}
