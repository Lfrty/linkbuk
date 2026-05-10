import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const estaLogueado = authService.sesion().estaLogueado;
    const tieneToken = !!localStorage.getItem('token');

    // Flag de direcciones 
    const esInvitado = route.data?.['esInvitado'] === true;

    // Si el usuario tiene token en localStorage pero el signal es false, confiamos en el token
    const estaAutenticado = estaLogueado || tieneToken;

    // Si el usuario va a loguearse
    if (esInvitado) {
        // Si ya está logueado no le permite acceder de nuevo y lo devuelve a home
        if (estaAutenticado) {
            router.navigate(['/home']);
            return false;
        }
        // Si no lo está le da acceso a login/Register.. 
        return true;
    }

    // Si está autenticado le da acceso
    if (estaAutenticado) {        
        return true;
    }

    // Si no está autenticado lo devuelve a inicio
    console.warn('Acceso denegado: Se requiere inicio de sesión');
    router.navigate(['/']);
    return false;
};