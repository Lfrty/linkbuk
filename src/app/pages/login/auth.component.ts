import { Component, EventEmitter, Output, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

export type AuthMode = 'login' | 'registro';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  // Inyección moderna
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @Output() close = new EventEmitter<void>();
  @Input() initialMode: AuthMode = 'login';

  mode: AuthMode = 'login';

  // Propiedades del formulario
  nombre = '';
  email = '';
  password = '';

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
    this.password = '';
  }

  handleSubmit(): void {
    if (!this.email || !this.password || (!this.isLogin && !this.nombre)) {
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
    const credenciales = { email: this.email, password: this.password };

    this.authService.login(credenciales).subscribe({
      next: () => {
        this.onClose();
        // Redirige la ruta
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en login:', err);
      }
    });
  }

  private register(): void {
    const datos = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
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