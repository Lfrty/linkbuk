import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

// Definimos los modos posibles para mayor claridad
type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth', // Actualizado de app-login a app-auth
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  @Output() close = new EventEmitter<void>();

  // Usamos el tipo AuthMode para que el código sea más descriptivo
  mode: AuthMode = 'login';

  // Propiedades del formulario
  nombre = '';
  email = '';
  password = '';

  // Helper para el HTML (así no tienes que cambiar todo el isLogin del template)
  get isLogin(): boolean {
    return this.mode === 'login';
  }

  constructor(private authService: AuthService, private router: Router) { }

  onClose(): void {
    this.close.emit();
  }

  toggleMode(): void {
    this.mode = this.isLogin ? 'register' : 'login';
    // Limpiamos los campos al cambiar para evitar que el password se quede ahí
    this.password = '';
  }

  handleSubmit(): void {
    // Validación básica antes de enviar
    if (!this.email || !this.password || !this.isLogin && !this.nombre) {
      console.warn('Formulario incompleto');
      return;
    }

    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  private login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso');
        this.onClose();
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Error en login:', err)
    });
  }

  private register(): void {
    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registro exitoso');
        this.onClose();
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Error en registro:', err)
    });
  }
}