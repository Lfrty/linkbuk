import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from '../../../models/Libro.model';
import { ListaService } from '../../../core/services/lista.service';

@Component({
  selector: 'app-libro-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './libro-detalle.component.html'
})
export class LibroDetalleComponent implements OnInit {

  /**
   * INPUTS
   */
  // Recibe los datos del Libro a mostrar
  @Input({ required: true }) libro!: Libro | null;

  // Recibe una señal de si hay alguien logueado
  @Input() estaLogueado: boolean = false;


  /**
   * OUTPUTS
   */

  // Emite que se va a cerrar el modal
  @Output() cerrar = new EventEmitter<void>();

  // Indica que se va a modificar el estado de un libro mostrado
  @Output() actualizarEstado = new EventEmitter<{ libroId: number, nuevoEstado: string }>();

  // Evento para lanzar modal de registro
  @Output() solicitarRegistro = new EventEmitter<void>();

  //Acceso a Listas
  public listaService = inject(ListaService);

  // Signal para trackear qué listas contienen
  private listasConLibro = signal<Set<number>>(new Set());

  ngOnInit() {
    if (this.estaLogueado) {
      this.listaService.getListas();
      this.actualizarListasConLibro();
    }
  }

  // Detectar cambios en el libro y actualizar las listas
  ngOnChanges() {
    this.actualizarListasConLibro();
  }

  private actualizarListasConLibro() {
    if (this.libro) {
      const listaIds = new Set<number>();
      this.listaService.listas().forEach(lista => {
        if (lista.libros?.some(l => l.id === this.libro?.id)) {
          listaIds.add(lista.id);
        }
      });
      this.listasConLibro.set(listaIds);
    }
  }

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

  toggleLibroEnLista(listaId: number) {
    const listasActuales = this.listasConLibro();
    const estaEnLista = listasActuales.has(listaId);

    // 1. Actualización optimista - cambiar inmediatamente el checkbox
    if (estaEnLista) {
      listasActuales.delete(listaId);
    } else {
      listasActuales.add(listaId);
    }
    this.listasConLibro.set(new Set(listasActuales));

    // 2. Luego hacer la petición al backend
    this.listaService.addLibro(listaId, this.libro!.id).subscribe({
      next: () => {
        // Refresca las listas desde el servidor para confirmar
        this.listaService.getListas();
      },
      error: (err) => {
        console.error('Error al añadir libro a lista:', err);
        // Rollback de la actualización optimista
        if (estaEnLista) {
          listasActuales.add(listaId);
        } else {
          listasActuales.delete(listaId);
        }
        this.listasConLibro.set(new Set(listasActuales));
      }
    });
  }

  estaEnLista(listaId: number): boolean {
    return this.listasConLibro().has(listaId);
  }
}