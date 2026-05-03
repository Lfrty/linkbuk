import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Libro } from '../../models/Libro.model';

@Component({
  selector: 'app-libro-card',
  standalone: true,
  templateUrl: './libro-card.component.html'
})
export class LibroCardComponent {
  // Un solo input para todo el objeto
  @Input({ required: true }) libro!: Libro;

  // Evento para avisar al padre que queremos abrir el detalle
  @Output() cardClick = new EventEmitter<void>();
}