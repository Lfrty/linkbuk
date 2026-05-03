import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from '../../models/Libro.model';

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libro-detalle.component.html'
})
export class LibroDetalleComponent {
  @Input({ required: true }) libro!: Libro | null;
  @Output() cerrar = new EventEmitter<void>();

  // Emitimos el cambio para que el componente padre lo guarde en la BD
  @Output() actualizarEstado = new EventEmitter<{ work_key: string, nuevoEstado: 'pendiente' | 'leyendo' | 'leido' }>();

  cambiarEstado(nuevo: 'pendiente' | 'leyendo' | 'leido') {
    if (this.libro) {
      this.actualizarEstado.emit({
        work_key: this.libro.work_key,
        nuevoEstado: nuevo
      });
    }
  }
}