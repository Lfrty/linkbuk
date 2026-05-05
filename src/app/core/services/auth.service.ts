import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API } from '../config/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = environment.apiUrl;

  // Indica si estoy logueado
  private _logeado = signal<boolean>(!!localStorage.getItem('token'));

  // Datos de usuario (privado)
  private _usuario = signal<any>(this.getInitialUser());

  // Datos Usuario (Solo lectura)
  public estaLogueado = computed(() => this._logeado());
  public usuarioActual = computed(() => this._usuario());

  // Señales para roles
  public rolActual = computed(() => this._usuario()?.rol_name || 'usuario');
  public esAdmin = computed(() => this.rolActual() === 'admin');
  public esSupervisor = computed(() => this.rolActual() === 'supervisor');

  public tienePermisosEspeciales = computed(() => {
    return this.esAdmin() || this.esSupervisor();
  });

  /**
   * Login de usuario
   */
  login(credenciales: any) {
    return this.http.post<any>(API.auth.login, credenciales).pipe(
      tap(res => {
        // Extraemos de res.data porque así viene en tu log
        const token = res.data?.token;
        const user = res.data?.user;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('usuario', JSON.stringify(user));

          this._usuario.set(user);
          this._logeado.set(true);
        }
      })
    );
  }

  /**
   * Registro de usuario
   */
  registro(datos: any) {
    return this.http.post<any>(API.auth.registar, datos).pipe(
      tap(res => {
        // Ahora consistente: res.data contiene token y user
        const token = res.data?.token;
        const user = res.data?.user;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('usuario', JSON.stringify(user));
          this._logeado.set(true);
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
    this.http.post(API.auth.logout, {}).subscribe();

    // Limpiar rastro
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    // Resetear signals
    this._logeado.set(false);
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
    // Usamos tu ruta configurada en constantes (ej: API.user.update)
    return this.http.put<any>(API.user.updateUser, userData).pipe(
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
    this._logeado.set(false);
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