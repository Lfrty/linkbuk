import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Libro } from '../../models/Libro.model';
import { API } from '../config/api';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private http = inject(HttpClient);

  signalLibroSeleccionado = signal<Libro | null>(null);

  /**
   * BÚSQUEDA GENERAL
   */
  async buscarLibros(query: string): Promise<Libro[]> {
    if (!query.trim()) return [];

    try {
      const url = `${API.libro.search}?q=${encodeURIComponent(query)}`;

      const libros = await firstValueFrom(this.http.get<Libro[]>(url));

      console.log('Libros recibidos del interceptor:', libros);

      if (Array.isArray(libros)) {
        return libros.map(libro => ({
          ...libro,
          portada: this.resolverPortada(libro.portada)
        }));
      }

      return [];
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      return [];
    }
  }

  // libro.service.ts

  /**
   * Solicita el detalle de un libro seleccionado
   */
  async obtenerDetalleLibro(workKey: string): Promise<Libro | null> {
    const cleanKey = workKey.replace('/works/', '');
    try {
      // Usamos firstValueFrom para manejar la petición como una Promesa
      console.log("LLamo a más detalles");
      const libro = await firstValueFrom(
        this.http.get<Libro>(`${API.libro.detalle}/${cleanKey}`)
      );

      // Actualizamos la Signal con la información "oficial"
      if (libro) {
        this.libroSeleccionado(libro);
      }

      return libro;
    } catch (error) {
      console.error('Error al obtener detalle de la API propia:', error);
      return null;
    }
  }

  private resolverPortada(portada: string | undefined): string {
    if (!portada) return '/assets/img/no-cover.jpg';

    if (/^\d+$/.test(portada)) {
      return `https://covers.openlibrary.org/b/id/${portada}-L.jpg`;
    }

    return portada;
  }


  /**
   * MÉTODOS PARA EL MODAL
   */
  libroSeleccionado(libro: Libro) {
    this.signalLibroSeleccionado.set({
      ...libro,
      portada: this.resolverPortada(libro.portada)
    });
  }

  limpiarLibroSeleccionado() {
    this.signalLibroSeleccionado.set(null);
  }
}