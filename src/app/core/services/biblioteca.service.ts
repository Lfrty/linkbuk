import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError, tap } from 'rxjs';
import { Libro } from '../../models/Libro.model';
import { API_URL } from '../constants/api_url';
import { resolverPortada } from '../../shared/utils/libro-utils';

@Injectable({
  providedIn: 'root',
})
export class BibliotecaService {
  private _libros = signal<any[]>([]);
  public libros = computed(() => this._libros());

  constructor(private http: HttpClient) { }

  // Busca libros
  search(query: string): Observable<Libro[]> {
    // Evitar búsqueda vacía
    if (!query.trim()) {
      return of([]);
    }


    return this.http.get<{ ok: boolean, data: Libro[] }>(`${API_URL.libro.search}?q=${encodeURIComponent(query)}`).pipe(
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
   * GESTIÓN DE BIBLIOTECA 
   */

  // Obtener la biblioteca completa del usuario logueado
  getBibliotecaUsuario() {
    return this.http.get<any>(API_URL.biblioteca.listar).subscribe({
      next: (res) => {
        const librosProcesados = (res.data || []).map((libro: any) => ({
          ...libro,
          portada: resolverPortada(libro.portada)
        }));

        this._libros.set(librosProcesados);
      },
      error: (err) => console.error(err)
    });
  }

  // Actualizar o añadir un libro con un estado
  addLibro(libroId: number, estado: string, fechaFin?: Date): Observable<any> {
    return this.http.post(API_URL.biblioteca.estadoLibro, {
      libro_id: libroId,
      estado_lectura: estado,
      fecha_finalizacion: fechaFin
    }).pipe(
      tap(() => this.getBibliotecaUsuario())
    );
  }

  // Eliminar un libro de la biblioteca personal
  eliminarLibro(libroId: number): Observable<any> {
    return this.http.delete(API_URL.biblioteca.eliminar + `${libroId}`);
  }
}
