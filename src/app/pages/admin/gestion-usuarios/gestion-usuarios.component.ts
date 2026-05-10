import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../core/services/admin-user-service';
import { Usuario } from '../../../models/Usuario.model';
import { ToastService } from '../../../core/services/toast-service';
import { PerfilComponent } from '../../perfil/perfil.component';

@Component({
  selector: 'app-gestion-usuarios',
  imports: [FormsModule, PerfilComponent],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.scss',
})
export class GestionUsuariosComponent implements OnInit {
  private toastService = inject(ToastService);
  private adminService = inject(AdminUserService);

  protected filtro = signal<string>('');
  protected usuarios = signal<Usuario[]>([]);

  usuarioSeleccionado = signal<Partial<Usuario> | null>(null);
  modoEdicion = signal<boolean>(false);

  // Variables de paginación
  protected paginaActual = signal<number>(1);
  protected usuariosPorPagina: number = 5;

  // Filtrado
  protected usuariosFiltrados = computed(() => {
    const query = this.filtro().toLowerCase();
    return this.usuarios().filter(u =>
      u.nombre.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  // Paginación
  protected totalPaginas = computed(() => Math.ceil(this.usuariosFiltrados().length / this.usuariosPorPagina));

  protected usuariosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.usuariosPorPagina;
    const fin = inicio + this.usuariosPorPagina;
    return this.usuariosFiltrados().slice(inicio, fin);
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  protected cargarUsuarios(): void {
    this.adminService.obtenerPerfiles().subscribe(res => {
      this.usuarios.set(res.data);
    });
  }

  // --- Acciones ---

  protected cambiarPagina(nueva: number) {
    if (nueva >= 1 && nueva <= this.totalPaginas()) {
      this.paginaActual.set(nueva);
    }
  }

  protected editar(id: number) {
    const user = this.usuarios().find(u => u.id === id);
    if (user) {
      this.usuarioSeleccionado.set({ ...user });
      this.modoEdicion.set(true);
    }
  }

  nuevoUsuario() {
    this.usuarioSeleccionado.set({ nombre: '', email: '' });
    this.modoEdicion.set(false);
  }

  handleSave(datos: Usuario | null) {
    if (!datos) return;
    const peticion = this.modoEdicion()
      ? this.adminService.actualizarPerfil(datos)
      : this.adminService.crearUsuario(datos as Usuario);

    peticion.subscribe({
      next: () => {
        this.cargarUsuarios(); // Refresca la lista
        this.usuarioSeleccionado.set(null);
      },
      error: (err) => {
        console.error("Error en la operación", err);
      }
    });
  }

  protected eliminar(id: number) {
    // Llamada a tu servicio DELETE
    console.log('Eliminando usuario:', id);
  }

  protected restaurar(id: number) {
    // Llamada a tu servicio para restaurar (Soft Delete)
    console.log('Restaurando usuario:', id);
  }

}
