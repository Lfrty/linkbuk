import { Injectable, inject } from '@angular/core';
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
export class UsuarioService {

  protected http = inject(HttpClient);
  protected auth = inject(AuthService);
  //public nombreUsuario = computed(() => this.auth.sesion()?.nombre || 'Invitado')

  obtenerPerfil(): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(API_URL.user.getUser).pipe(
      map(res => res));
  }

  actualizarPerfil(dataUsuario: Partial<Usuario>) {
    return this.http.put<ApiResponse<Usuario>>(API_URL.user.updateUser, dataUsuario).pipe(
      map(res => res)
    );
  }

}
