import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const estaLogueado = authService.sesion().estaLogueado;
    const tieneToken = !!localStorage.getItem('token');

    // Flag de direcciones 
    const redireccionPorLogueado = route.data?.['redireccionPorLogueado'] === true;

    // Si el usuario tiene token en localStorage pero el signal es false, confiamos en el token
    const estaAutenticado = estaLogueado || tieneToken;

    if (redireccionPorLogueado) {
        if (estaAutenticado) {
            router.navigate(['/home']);
            return false;
        }
        return true;
    }

    if (estaAutenticado) {
        return true;
    }

    console.warn('Acceso denegado: Se requiere inicio de sesión');
    router.navigate(['/']);
    return false;
};