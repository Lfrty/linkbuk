import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class Header {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  showUserMenu = false;

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  buscarClick() {
    // Implementar búsqueda
    console.log('Search clicked');
  }

  logout() {
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }
}
