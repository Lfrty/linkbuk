import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaService } from '../../../core/services/lista.service';
import { ModalListaComponent } from '../modal-lista/modal-lista.component';
import { Lista } from '../../../models/Lista.model';

@Component({
  selector: 'app-listas',
  standalone: true,
  imports: [CommonModule, ModalListaComponent],
  templateUrl: './listas.component.html',
})
export class ListasComponent implements OnInit {
  listaService = inject(ListaService);

  mostrarModal = false;
  listaParaEditar = signal<Lista | null>(null);

  ngOnInit(): void {
    this.listaService.getListas();
  }

  verDetalle(lista: Lista) {
    this.listaParaEditar.set(lista);
    this.mostrarModal = true;
  }

  abrirModalCrear() {
    this.listaParaEditar.set(null);
    this.mostrarModal = true;
  }

  editarLista(lista: Lista, event: Event) {
    event.stopPropagation();
    this.listaParaEditar.set(lista);
    this.mostrarModal = true;
  }

  eliminarLista(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('¿Seguro que quieres borrar esta lista?')) {
      this.listaService.eliminarLista(id).subscribe(() => {
        this.listaService.getListas();
      });
    }
  }

  onModalClose() {
    this.mostrarModal = false;
    this.listaParaEditar.set(null);
  }
}