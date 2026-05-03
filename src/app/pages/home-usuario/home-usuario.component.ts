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
  standalone: true, // Asegúrate de que sea standalone si no usas módulos
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
    private BibliotecaService: BibliotecaService, // Para los datos de BD
    public LibroService: LibroService,      // Público para usarlo en el HTML
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadLibrary();
  }

  loadLibrary() {
    console.log('1. Llamando al servicio...');
    this.BibliotecaService.getBibliotecaUsuario().subscribe({
      next: (res) => {
        console.log('2. Respuesta recibida:', res); // Si llegas aquí, el interceptor está bien

        // Quitamos el res.ok y probamos con lo que venga
        const data = res.data || res;
        this.bibliotecaData.set(data);

        console.log('3. Signal actualizado con:', this.bibliotecaData());
      },
      error: (err) => {
        console.error('❌ Error en la suscripción:', err);
      }
    });
  }
  // Filtrado reactivo
  filteredBooks = computed(() => {
    // Accedemos a la propiedad 'libros' que viene de tu relación with('libros') de Laravel
    const libros = this.bibliotecaData()?.libros || [];
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
    this.LibroService.selectBook(libro);
  }

  onLibraryChanged() {
    // Si el hijo (detalle) avisa de un cambio (borrado o cambio de estado), recargamos
    this.loadLibrary();
  }
}