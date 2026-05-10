import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaService } from '../../../core/services/lista.service';
import { Lista } from '../../../models/Lista.model';

@Component({
  selector: 'app-modal-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-lista.component.html',
})
export class ModalListaComponent {
  private listaService = inject(ListaService);

  @Input() set lista(value: Lista | null) {
    this._lista = value;
    this.nombre = value ? value.nombre : '';
  }
  get lista() { return this._lista; }
  private _lista: Lista | null = null;

  @Output() closed = new EventEmitter<void>();

  nombre = '';

  guardar() {
    if (!this.nombre.trim()) return;

    const request = this.lista
      ? this.listaService.updateLista(this.lista.id, this.nombre) // Si existe lista, actualizamos
      : this.listaService.crearLista(this.nombre);

    request.subscribe(() => {
      this.listaService.getListas();
      this.close();
    });
  }

  quitarLibro(libroId: number) {
    if (!this.lista) return;
    this.listaService.quitarLibro(this.lista.id, libroId).subscribe({
      next: () => {
        if (this.lista) {
          this.lista.libros = this.lista.libros?.filter(l => l.id !== libroId);
          this.listaService.getListas();
        }
      }
    });
  }

  close() {
    this.closed.emit();
  }
}