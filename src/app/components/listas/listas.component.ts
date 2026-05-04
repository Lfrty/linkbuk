import { Component, OnInit } from '@angular/core';
import { ListaService } from '../../core/services/lista.service';

@Component({
  selector: 'app-listas',
  imports: [],
  templateUrl: './listas.component.html',
  styleUrl: './listas.component.scss',
})
export class ListasComponent implements OnInit {
  listas: any[] = [];

  constructor(private listaService: ListaService) { }

  ngOnInit(): void {
    this.cargarListas();
  }

  cargarListas() {
    this.listaService.getListas().subscribe(response => {
      this.listas = response.data;
    });
  }

  borrar(id: number) {
    this.listaService.eliminarLista(id).subscribe({
      next: () => {
        // Actualizamos la lista localmente para que desaparezca de la vista
        this.listas = this.listas.filter(l => l.id !== id);
      },
      error: (err) => {
        console.error('Error al borrar:', err.error.message);
        // Aquí podrías mostrar una alerta al usuario
      }
    });
  }
}
