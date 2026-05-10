import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/Usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { ErrorMensajeComponent } from '../../shared/components/error-mensaje/error-mensaje.component';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, ErrorMensajeComponent],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);
  public perfil: Usuario | null = null;
  public submitted = false;

  ngOnInit() {
    this.usuarioService.obtenerPerfil().subscribe({
      next: (user) => {
        this.perfil = user.data;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  handleSubmit() {
    console.log("Entra a submit");
    this.submitted = true;
    if (!this.perfil?.nombre || !this.perfil?.email) {
      console.warn("Formulario inválido");
      return;
    }

    this.usuarioService.guardarPerfil(this.perfil).subscribe({
      next: (res) => {
        this.toastService.mostrar("Perfil  actualizado", "ok");
        console.log("Perfil actualizado:", res.message);
      },
      error: (err) => {
        this.toastService.mostrar("Error al actualizar", "error");
        console.error("Error al actualizar:", err);
      }
    });


  }
}