import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-mensaje',
  imports: [],
  templateUrl: './error-mensaje.component.html',
  standalone: true,
  styleUrl: './error-mensaje.component.scss',
})
export class ErrorMensajeComponent {
  @Input() mensaje: string = 'Este campo es obligatorio';
}
