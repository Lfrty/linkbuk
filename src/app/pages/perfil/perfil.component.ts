import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent {
  auth = inject(AuthService);

  // Cargamos los datos actuales del signal de usuario
  nombre = signal(this.auth.usuarioActual()?.nombre || '');
  biografia = signal(this.auth.usuarioActual()?.biografia || '');
  ubicacion = signal(this.auth.usuarioActual()?.ubicacion || '');

  // Estado de la carga
  cargando = signal(false);
  mensaje = signal('');

  guardarCambios() {
    this.cargando.set(true);
    const datosEditados = {
      nombre: this.nombre(),
      biografia: this.biografia(),
      ubicacion: this.ubicacion()
    };

    this.auth.updateProfile(datosEditados).subscribe({
      next: () => {
        this.mensaje.set('¡Perfil actualizado!');
        this.cargando.set(false);
      },
      error: (err) => {
        this.mensaje.set('Error al guardar los datos');
        this.cargando.set(false);
      }
    });
  }
}