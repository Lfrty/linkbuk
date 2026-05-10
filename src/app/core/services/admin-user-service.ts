import { Injectable, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants/api_url';
import { map } from 'rxjs/operators';
import { Usuario } from '../../models/Usuario.model';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../models/Api-response.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AdminUserService {

  protected http = inject(HttpClient);
  protected auth = inject(AuthService);

  obtenerPerfiles(): Observable<ApiResponse<Usuario[]>> {
    return this.http.get<ApiResponse<Usuario[]>>(API_URL.admin.listarUsuarios).pipe(
      map(res => res));
  }

  obtenerPerfil(id: number): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(API_URL.admin.obtenerUsuario(id)).pipe(
      map(res => res));
  }

  crearUsuario(dataUsuario: Usuario) {
    return this.http.post<ApiResponse<Usuario>>(API_URL.admin.crearUsuario, dataUsuario);
  }

  actualizarPerfil(dataUsuario: Partial<Usuario>) {
    return this.http.put<ApiResponse<Usuario>>(API_URL.admin.actualizarUsuario, dataUsuario);
  }

  borrarUsuario(id: number) {
    return this.http.delete<ApiResponse<Usuario>>(API_URL.admin.eliminarUsuario(id)).pipe(
      map(res => res)
    );
  }

  destruirUsuario(id: number) {
    return this.http.delete<ApiResponse<Usuario>>(API_URL.admin.destruirUsuario(id)).pipe(
      map(res => res)
    );
  }


  /** 
  restaurarUsuario(id: number) {
    return this.http.put<ApiResponse<Usuario>>(API_URL.user.updateUser).pipe(
      map(res => res)
    );
  }*/
}
