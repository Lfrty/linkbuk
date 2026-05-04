import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BibliotecaService } from '../../core/services/biblioteca.service';
import { LibroService } from '../../core/services/libro.service';
import { AuthService } from '../../core/services/auth.service';
import { LibroCardComponent } from '../../components/libro-card/libro-card.component';
import { LibroDetalleComponent } from '../../components/libro-detalle/libro-detalle.component';

@Component({
  selector: 'app-home-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, LibroDetalleComponent, LibroCardComponent],
  templateUrl: './home-usuario.component.html',
  styleUrl: './home-usuario.component.scss',
})
export class HomeUsuarioComponent implements OnInit {
  currentFilter = signal<'todos' | 'leyendo' | 'leido' | 'pendiente'>('todos');
  searchQuery = signal('');

  // Signal para la biblioteca
  bibliotecaData = signal<any>(null);

  constructor(
    private BibliotecaService: BibliotecaService,
    public LibroService: LibroService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadLibrary();
  }

  loadLibrary() {
    console.log('1. Llamando al servicio...');
    this.BibliotecaService.getBibliotecaUsuario().subscribe({
      next: (res) => {
        // Con el interceptor, 'res' ya es directamente el array de libros
        console.log('Datos "limpios" recibidos:', res);

        // Seteamos el signal directamente
        this.bibliotecaData.set(res || []);
      },
      error: (err) => {
        console.error('Error cargando la biblioteca:', err);
      }
    });
  }
  // Filtrado reactivo
  filteredBooks = computed(() => {
    // Accedo a la propiedad 'libros'
    const libros = this.bibliotecaData();
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

  openBookDetail(libro: any) {
    // Al seleccionar el libro, el Signal en LibroService se actualiza y el modal se abre
    this.LibroService.libroSeleccionado(libro);
  }

  //Para cualquier cambio
  onLibraryChanged() {
    this.loadLibrary();
  }
}