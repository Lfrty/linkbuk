import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AuthComponent } from '../login/auth.component';
import { CommonModule } from '@angular/common';

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

  openLoginModal() {
    console.log("Abro modal");
    this.showLogin = true;
  }

  closeLoginModal() {
    this.showLogin = false;
  }

}
