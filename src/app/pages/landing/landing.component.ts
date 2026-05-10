import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AuthComponent } from '../login/auth.component';
import { CommonModule } from '@angular/common';
import { AuthMode } from '../login/auth.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  protected authService = inject(AuthService);

  showLogin = false;
  modoInicial: AuthMode = 'login';

  openAuth(mode: AuthMode) {
    this.modoInicial = mode;
    this.showLogin = true;
  }

  modalLogin() {
    this.showLogin = true;
  }

  closeUserModal() {
    this.showLogin = false;
  }

}
