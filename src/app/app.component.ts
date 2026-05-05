import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LibroService } from './core/services/libro.service';
import { Header } from "./shared/header/header.component";
import { Footer } from "./shared/footer/footer.component";
import { LibroDetalleComponent } from './components/libro-detalle/libro-detalle.component';
import { BibliotecaService } from './core/services/biblioteca.service';
import { AuthMode } from './pages/login/auth.component';
import { AuthComponent } from './pages/login/auth.component';
import { AuthService } from './core/services/auth.service';
import { EstadoLectura } from './models/Libro.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, LibroDetalleComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App implements OnInit {
  protected readonly title = signal('linkbuk');

  public authService = inject(AuthService);
  public libroService = inject(LibroService);
  private bibliotecaService = inject(BibliotecaService);
  mostrarAuth = signal(false);
  modoInicialAuth = signal<AuthMode>('login');

  ngOnInit() {
    // Sincronizar sesión al cargar la app
    // Si hay token en localStorage, asegurar que el AuthService lo conoce
    const token = localStorage.getItem('token');
    const usuarioJson = localStorage.getItem('usuario');

    if (token && usuarioJson) {
      try {
        const usuario = JSON.parse(usuarioJson);
        // El AuthService ya debería tener esto en su signal privado _usuario
        // pero nos aseguramos que está actualizado
        console.log('Sesión recuperada desde localStorage:', usuario);
      } catch (e) {
        console.error('Error recuperando sesión:', e);
        // Si hay error, limpiar
        this.authService.onError401();
      }
    }
  }

  abrirRegistro() {
    this.modoInicialAuth.set('registro');
    this.mostrarAuth.set(true);
  }

  abrirLogin() {
    this.modoInicialAuth.set('login');
    this.mostrarAuth.set(true);
  }

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
          console.error('Error al conectar con la base de datos', err);
          // Aquí podrías hacer un rollback de la actualización optimista
        }
      });
  }
}