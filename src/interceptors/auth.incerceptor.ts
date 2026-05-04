import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const router = inject(Router);

    let request = req;
    if (token) {
        request = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    return next(request).pipe(
        // Manejo de respuestas (200 0 201)
        // Devuelve el objeto directamente 
        map(event => {
            if (event instanceof HttpResponse && event.body) {
                const body = event.body as any;
                if (body && body.hasOwnProperty('data')) {
                    return event.clone({ body: body.data });
                }
            }
            return event;
        }),
        // Manejo de errores (handler)
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                console.warn('Sesión caducada o inválida. Redirige a Home');

                // Limpiar el token caducado para que no estorbe
                localStorage.removeItem('token');

                //Redirige a home, por defecto vacío 
                router.navigate(['/']);
            }
            return throwError(() => error);
        })
    );
};