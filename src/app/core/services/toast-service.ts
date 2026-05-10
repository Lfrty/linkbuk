import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastData } from '../../models/Toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  // Objeto Toast a replicar
  private toastSubject = new BehaviorSubject<ToastData>({
    mensaje: '',
    tipo: 'info',
    visible: false
  });

  // El suscrito solo puede ver los cambios de estados
  toastState$ = this.toastSubject.asObservable();

  mostrar(mensaje: string, tipo: 'ok' | 'error' | 'info' = 'info') {
    this.toastSubject.next({ mensaje, tipo, visible: true });

    setTimeout(() => {
      this.ocultar();
    }, 2000);
  }

  ocultar() {
    this.toastSubject.next({ ...this.toastSubject.value, visible: false });
  }

}
