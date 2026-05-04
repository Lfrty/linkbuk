import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AuthComponent } from '../login/auth.component';
import { CommonModule } from '@angular/common';
import { AuthMode } from '../login/auth.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class Home {
  constructor(public authService: AuthService) { }

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
