import { Component, signal, inject, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { LibroService } from '../../core/services/libro.service';
import { AuthService } from '../../core/services/auth.service';
import { BuscadorComponent } from '../../features/libros/buscador/buscador.component';
import { Libro } from '../../models/Libro.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, BuscadorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class Header implements OnDestroy {
  public libroService = inject(LibroService);
  public authService = inject(AuthService);

  @Output() solicitarRegistro = new EventEmitter<void>();
  @Output() solicitarLogin = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  searchQuery = signal<string>('');
  results = signal<Libro[]>([]);
  showResults = signal(false);
  showUserMenu = signal(false);


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.showUserMenu.set(false);
    this.authService.logout();
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
  }

  onFocus() {
    console.log('Focus detectado');
    this.showResults.set(true);
  }

  openRegistro() {
    this.solicitarRegistro.emit();
  }

  openLogin() {
    this.solicitarLogin.emit();
  }
}