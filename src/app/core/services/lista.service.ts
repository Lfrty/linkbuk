import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../config/api';

@Injectable({
  providedIn: 'root',
})
export class ListaService {
  constructor(private http: HttpClient) { }

  // Obtener listas del usuario
  getListas(): Observable<any> {
    return this.http.get(`${API.listas.listar}`);
  }

  // Eliminar una lista (soft)
  eliminarLista(id: number): Observable<any> {
    return this.http.delete(`${API.listas}/${id}`);
  }
}
