import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Libro } from '../../models/Libro.model';
import { API } from '../config/api';
import { resolverPortada } from '../utils/libro-utils';

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

      const res = await firstValueFrom(this.http.get<any>(url));

      console.log('Libros recibidos del interceptor empaquetados:', res);

      const listaLibros = res.data;

      if (Array.isArray(listaLibros)) {
        return listaLibros.map(libro => ({
          ...libro,
          portada: resolverPortada(libro.portada)
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
        this.http.get<any>(`${API.libro.detalle}/${cleanKey}`)
      );

      // Actualizo el signal con mayores detalles
      if (libro.data) {
        this.libroSeleccionado(libro.data);
      }

      return libro.data;
    } catch (error) {
      console.error('Error al obtener detalle de la API propia:', error);
      return null;
    }
  }

  /**
   * MÉTODOS PARA EL MODAL
   */
  libroSeleccionado(libro: Libro) {
    this.signalLibroSeleccionado.set({
      ...libro,
      portada: resolverPortada(libro.portada)
    });
  }

  limpiarLibroSeleccionado() {
    this.signalLibroSeleccionado.set(null);
  }
}