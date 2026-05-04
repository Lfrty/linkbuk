import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LibroService } from './core/services/libro.service';
import { Header } from "./shared/header/header.component";
import { Footer } from "./shared/footer/footer.component";
import { LibroDetalleComponent } from './components/libro-detalle/libro-detalle.component';
import { BibliotecaService } from './core/services/biblioteca.service';
import { AuthMode } from './pages/login/auth.component';
import { AuthComponent } from './pages/login/auth.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, LibroDetalleComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected readonly title = signal('linkbuk');

  public libroService = inject(LibroService);
  private bibliotecaService = inject(BibliotecaService);
  mostrarAuth = signal(false);
  modoInicialAuth = signal<AuthMode>('login');

  abrirRegistro() {
    this.modoInicialAuth.set('registro');
    this.mostrarAuth.set(true);
  }

  manejarCambioEstado(event: { libroId: number, nuevoEstado: string }) {
    this.bibliotecaService.updateEstadoLibro(event.libroId, event.nuevoEstado)
      .subscribe({
        next: (res) => {
          if (res.libro) {
            this.libroService.libroSeleccionado(res.libro);
          }
        },
        error: (err) => {
          console.error('Error al conectar con la base de datos ⚠️', err);
        }
      });

  }
}
