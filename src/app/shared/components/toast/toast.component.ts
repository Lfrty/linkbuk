import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';
import { ToastData } from '../../../models/Toast.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  state: ToastData = { mensaje: '', tipo: 'info', visible: false };

  constructor(private toastService: ToastService) {
    this.toastService.toastState$.subscribe(s => this.state = s);
  }

  getTipoClase(tipo: string) {
    return tipo;
  }
}
