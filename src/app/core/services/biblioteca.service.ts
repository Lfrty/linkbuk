import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Libro } from '../../models/Libro.model';
import { API } from '../config/api';

@Injectable({
  providedIn: 'root',
})
export class BibliotecaService {

  constructor(private http: HttpClient) { }

  // Busca libros
  search(query: string): Observable<Libro[]> {
    // Evitar búsqueda vacía
    if (!query.trim()) {
      return of([]);
    }


    return this.http.get<{ ok: boolean, data: Libro[] }>(`${API.libro.search}?q=${encodeURIComponent(query)}`).pipe(
      map(res => {
        return res.ok ? res.data : [];
      }),
      catchError((err): Observable<Libro[]> => {
        console.error('Error buscando libros en la API:', err);
        return of([]);
      })
    );
  }

  /**
   * GESTIÓN DE BIBLIOTECA (Tu API Laravel)
   */

  // Obtener la biblioteca completa del usuario logueado
  getBibliotecaUsuario(): Observable<any> {
    return this.http.get(API.biblioteca.listar);
  }

  // Actualizar o añadir un libro con un estado (leyendo, leido, pendiente)
  updateEstadoLibro(libroId: number, estado: string, fechaFin?: Date): Observable<any> {
    return this.http.post(API.biblioteca.estadoLibro + `/${libroId}`, {
      estado_lectura: estado,
      fecha_finalizacion: fechaFin
    });
  }

  // Eliminar un libro de la biblioteca personal
  eliminarLibro(libroId: number): Observable<any> {
    return this.http.delete(API.biblioteca.eliminar + `${libroId}`);
  }
}
