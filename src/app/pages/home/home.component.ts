import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BibliotecaService } from '../../core/services/biblioteca.service';
import { LibroService } from '../../core/services/libro.service';
import { AuthService } from '../../core/services/auth.service';
import { LibroCardComponent } from '../../components/libro-card/libro-card.component';
import { LibroDetalleComponent } from '../../components/libro-detalle/libro-detalle.component';
import { EstadoLectura } from '../../models/Libro.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, LibroDetalleComponent, LibroCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  currentFilter = signal<'todos' | 'leyendo' | 'leido' | 'pendiente'>('todos');
  searchQuery = signal('');

  constructor(
    public bibliotecaService: BibliotecaService,
    public libroService: LibroService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.bibliotecaService.getBibliotecaUsuario();
    }, 50);
  }

  // Filtrado reactivo
  filteredBooks = computed(() => {
    // Accedo al signal 'libros'
    const libros = this.bibliotecaService.libros();
    const filter = this.currentFilter();
    const query = this.searchQuery().toLowerCase();

    return libros.filter((libro: any) => {
      const estado = libro.pivot?.estado_lectura;
      const matchesFilter = filter === 'todos' || estado === filter;
      const matchesSearch =
        libro.titulo.toLowerCase().includes(query) ||
        libro.autor.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  });

  setFilter(filter: any) {
    this.currentFilter.set(filter);
  }

  verDetallesLibro(libro: any) {
    // Al seleccionar el libro, el Signal en LibroService se actualiza y el modal se abre
    this.libroService.libroSeleccionado(libro);
  }

  //Para cambio de estado del libro
  manejarCambioEstado(event: { libroId: number, nuevoEstado: string }) {
    // 1. Actualización optimista - cambiar inmediatamente en el modal
    const libroActual = this.libroService.signalLibroSeleccionado();
    if (libroActual && libroActual.id === event.libroId) {
      this.libroService.libroSeleccionado({
        ...libroActual,
        pivot: { ...libroActual.pivot, estado_lectura: event.nuevoEstado as EstadoLectura }
      });
    }

    // 2. Luego hacer la petición al backend
    this.bibliotecaService.addLibro(event.libroId, event.nuevoEstado)
      .subscribe({
        next: (res) => {
          if (res.data && res.data.libro) {
            // Actualizar con la respuesta del servidor
            this.libroService.libroSeleccionado(res.data.libro);
            this.bibliotecaService.getBibliotecaUsuario();
          }
        },
        error: (err) => {
          console.error('Error al actualizar estado:', err);
          // Aquí podrías hacer un rollback de la actualización optimista
        }
      });
  }

  //Para cualquier cambio
  onLibraryChanged() {
    this.bibliotecaService.getBibliotecaUsuario();
  }
}