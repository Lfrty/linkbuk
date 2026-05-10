import { Component, inject, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/Usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { ErrorMensajeComponent } from '../../shared/components/error-mensaje/error-mensaje.component';
import { ToastService } from '../../core/services/toast-service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, ErrorMensajeComponent],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  protected authService = inject(AuthService);

  public perfil: Usuario | undefined = undefined;
  protected submitted = false;

  @Input() isAdminMode: boolean = false; // Muestra campos de Admin
  @Input() isEditMode: boolean = true;
  @Output() save = new EventEmitter<Usuario>();

  @Input() set perfilInput(value: any) {
    if (value) {
      this.perfil = value;
    }
  }

  ngOnInit() {
    if (!this.perfil) {
      this.cargarMiPropioPerfil();
    }
  }

  private cargarMiPropioPerfil() {
    this.usuarioService.obtenerPerfil().subscribe({
      next: (user) => {
        if (!this.perfil) {
          this.perfil = user.data;
        }
      },
      error: (error) => console.log(error)
    });
  }

  handleSubmit() {
    this.save.emit(this.perfil);
  }
}