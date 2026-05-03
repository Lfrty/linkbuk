import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../config/api';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signal privado para el usuario
  private _usuarioActual = signal<any | null>(null);

  // Signal de lectura
  public usuarioActual = computed(() => this._usuarioActual());

  constructor(private http: HttpClient) {
    const userStored = localStorage.getItem('user');
    const tokenStored = localStorage.getItem('token');

    if (userStored && tokenStored) {
      try {
        this._usuarioActual.set(JSON.parse(userStored));
      } catch (e) {
        // Por si el JSON está mal formado
        this.logout();
      }
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(API.auth.login, { email, password }).pipe(
      tap(response => {
        this.guardarSesion(response.token, response.user);
      })
    );
  }

  register(nombre: string, email: string, password: string) {
    return this.http.post<any>(API.auth.registar, { nombre, email, password }).pipe(
      tap(response => {
        this.guardarSesion(response.token, response.user);
      })
    );
  }

  private guardarSesion(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._usuarioActual.set(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._usuarioActual.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}