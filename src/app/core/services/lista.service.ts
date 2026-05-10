import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../constants/api_url';
import { resolverPortada } from '../../shared/utils/libro-utils';
import { Lista } from '../../models/Lista.model';

@Injectable({
  providedIn: 'root',
})
export class ListaService {
  private _listas = signal<Lista[]>([]);
  public listas = computed(() => this._listas());
  private http = inject(HttpClient);

  // Obtener listas del usuario
  getListas() {
    this.http.get<{ data: Lista[] }>(API_URL.listas.listar).subscribe({
      next: (res) => {
        const rawListas = res.data || [];
        const listasProcesadas: Lista[] = rawListas.map(lista => ({
          ...lista,
          es_default: !!lista.es_default,
          libros: lista.libros?.map(libro => ({
            ...libro,
            portada: resolverPortada(libro.portada)
          }))
        }));

        this._listas.set(listasProcesadas);
      },
      error: (err) => console.error('Error al interpretar listas:', err)
    });
  }

  crearLista(nombre: string) {
    return this.http.post(API_URL.listas.crear, { nombre }).pipe(
      tap(() => this.getListas())
    );
  }

  updateLista(id: any, nombre: string) {
    return this.http.post(API_URL.listas.actualizar(id), { nombre }).pipe(
      tap(() => this.getListas())
    );
  }


  addLibro(listaId: number, libroId: number) {
    return this.http.post(API_URL.listas.addLibro(listaId), { libro_id: libroId }).pipe(
      tap(() => this.getListas())
    );
  }

  quitarLibro(listaId: number, libroId: number) {
    return this.http.delete(`${API_URL.listas.eliminarLibro(listaId, libroId)}`).pipe(
      tap(() => this.getListas())
    );
  }

  // Eliminar una lista (soft)
  eliminarLista(id: number): Observable<any> {
    return this.http.delete(`${API_URL.listas}/${id}`);
  }
}
