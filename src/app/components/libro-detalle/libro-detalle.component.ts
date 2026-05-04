import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from '../../models/Libro.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libro-detalle.component.html'
})
export class LibroDetalleComponent {
  public authService = inject(AuthService);

  @Input({ required: true }) libro!: Libro | null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizarEstado = new EventEmitter<{ libroId: number, nuevoEstado: string }>();

  // evento para lanzar modal de registro
  @Output() solicitarRegistro = new EventEmitter<void>();

  openRegistro() {
    this.solicitarRegistro.emit();
  }

  cambiarEstado(nuevo: 'pendiente' | 'leyendo' | 'leido') {

    console.log("Lando petición desde libro-detalle");
    if (this.libro && this.libro.id) {

      this.actualizarEstado.emit({
        libroId: this.libro.id,
        nuevoEstado: nuevo
      });
    }
  }
}