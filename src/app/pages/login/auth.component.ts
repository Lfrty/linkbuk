import { Component, EventEmitter, Output, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { ErrorMensajeComponent } from '../../shared/components/error-mensaje/error-mensaje.component';

export type AuthMode = 'login' | 'registro';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, ErrorMensajeComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  // Inyección moderna
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  @Output() close = new EventEmitter<void>();
  @Input() initialMode: AuthMode = 'login';

  mode: AuthMode = 'login';
  protected submitted = false;

  protected registerData = {
    nombre: '',
    email: '',
    password: ''
  };

  ngOnInit() {
    const routeMode = this.route.snapshot.data['initialMode'] as AuthMode | undefined;
    this.mode = routeMode ?? this.initialMode;
  }

  get isLogin(): boolean {
    return this.mode === 'login';
  }

  onClose(): void {
    this.close.emit();
  }

  toggleMode(): void {
    this.mode = this.isLogin ? 'registro' : 'login';
    this.submitted = false;
    this.registerData = { nombre: '', email: '', password: '' };
  }

  handleSubmit(): void {
    if (!this.registerData.email || !this.registerData.password || (!this.isLogin && !this.registerData.nombre)) {
      this.submitted = true;
      return;
    }

    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  private login(): void {
    // Enviamos el objeto con las claves que espera el backend
    const credenciales = { email: this.registerData.email, password: this.registerData.password };

    this.authService.login(credenciales).subscribe({
      next: () => {
        this.onClose();
        this.toast.mostrar('¡Bienvenido de nuevo! ☕', 'ok');
        if (this.authService.sesion().esEspecial) {
          this.router.navigate(['/admin/home']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.toast.mostrar('Credenciales incorrectas', 'error');
        console.error('Error en login:', err);
      }
    });
  }

  private register(): void {
    const datos = {
      nombre: this.registerData.nombre,
      email: this.registerData.email,
      password: this.registerData.password
    };

    this.authService.registro(datos).subscribe({
      next: () => {
        this.onClose();
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Error en registro:', err)
    });
  }
}