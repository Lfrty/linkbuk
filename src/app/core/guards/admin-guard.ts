import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const sesionConPermisos = authService.sesion().esEspecial;

  if (sesionConPermisos) {
    return true;
  }

  // Si no es admin, lo mandamos al home y bloqueamos el acceso
  router.navigate(['/home']);
  return false;
};
