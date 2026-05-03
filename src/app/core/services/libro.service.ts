import { Injectable, signal } from '@angular/core';
import { Libro } from '../../models/Libro.model';

@Injectable({
  providedIn: 'root',
})
export class LibroService {

  // Signal para manejar el libro seleccionado globalmente (para el modal de detalle)
  selectedBook = signal<Libro | null>(null);

  /**
   * ESTADO DEL MODAL
   */
  selectBook(libro: Libro) {
    this.selectedBook.set(libro);
  }

  clearSelectedBook() {
    this.selectedBook.set(null);
  }
}
