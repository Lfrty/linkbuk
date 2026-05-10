import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from '../constants/api_url';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Datos de usuario (privado)
  private _usuario = signal<any>(this.getInitialUser());

  // Propiedad que define propeidades de acceso del usuario
  public sesion = computed(() => {
    const user = this._usuario();
    const rol = user?.rol_name || 'usuario';
    const nombre = user?.nombre;
    return {
      nombre,
      estaLogueado: !!user,
      rol,
      esAdmin: rol === 'admin',
      esSupervisor: rol === 'supervisor',
      esEspecial: rol === 'admin' || rol === 'supervisor'
    };
  });

  /**
   * Login de usuario
   */
  login(credenciales: any) {
    return this.http.post<any>(API_URL.auth.login, credenciales).pipe(
      tap(res => {
        console.log(res);
        // Extraemos de res.data porque así viene en tu log
        const token = res.data?.token;
        const user = res.data?.user;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('usuario', JSON.stringify(user));

          this._usuario.set(user);
        }
      })
    );
  }

  /**
   * Registro de usuario
   */
  registro(datos: any) {
    return this.http.post<any>(API_URL.auth.registar, datos).pipe(
      tap(res => {
        // Ahora consistente: res.data contiene token y user
        const token = res.data?.token;
        const user = res.data?.user;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('usuario', JSON.stringify(user));
          this._usuario.set(user);
        }
      })
    );
  }

  /**
   * Cierre de sesión
   */
  logout() {
    // Es buena práctica avisar al backend (opcional)
    this.http.post(API_URL.auth.logout, {}).subscribe();

    // Limpiar rastro
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    // Resetear signals
    this._usuario.set(null);

    this.router.navigate(['/']);
  }

  /**
   * Helper para obtener el token rápidamente (para el interceptor)
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  updateProfile(userData: any) {
    // Usamos tu ruta configurada en constantes (ej: API_URL.user.update)
    return this.http.put<any>(API_URL.user.updateUser, userData).pipe(
      tap(res => {
        // Si la API nos devuelve el usuario actualizado
        if (res.user) {
          this.updateDataSesion(res.user);
        }
      })
    );
  }

  private updateDataSesion(user: any) {
    localStorage.setItem('usuario', JSON.stringify(user));
    this._usuario.set(user);
  }

  // Controla el JSON de storage cuando de error
  private getInitialUser() {
    const userJson = localStorage.getItem('usuario');
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch (e) {
      console.error("Error parseando el usuario del localStorage, limpiando...", e);
      localStorage.removeItem('usuario');
      return null;
    }
  }

  /**
   * Limpia la sesión (util para logout automático por token expirado)
   */
  private limpiarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this._usuario.set(null);
  }

  /**
   * Maneja errores de autenticación (ej: 401 Unauthorized)
   */
  onError401() {
    console.warn('Token inválido o expirado, limpiando sesión...');
    this.limpiarSesion();
    this.router.navigate(['/']);
  }
}