import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

export type AuthMode = 'login' | 'registro';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})

export class AuthComponent {
  @Output() close = new EventEmitter<void>();
  @Input() initialMode: AuthMode = 'login';

  mode: AuthMode = 'login';

  // Propiedades del formulario
  nombre = '';
  email = '';
  password = '';


  get isLogin(): boolean {
    return this.mode === 'login';
  }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.mode = this.initialMode;
  }

  onClose(): void {
    console.log("Onclose emitido");
    this.close.emit();
  }

  toggleMode(): void {
    this.mode = this.isLogin ? 'registro' : 'login';
    // Limpieza de campo al cambiar de modo
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