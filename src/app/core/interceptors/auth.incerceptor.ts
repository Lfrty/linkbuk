import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../../models/Api-response.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const authService = inject(AuthService);

    let request = req;
    if (token) {
        const cleanToken = token.replace(/['"]+/g, '');
        request = req.clone({
            setHeaders: { Authorization: `Bearer ${cleanToken}` }
        });
    }

    return next(request).pipe(
        // Manejo de respuestas (200 0 201)
        // Devuelve el objeto directamente 
        map(event => {
            if (event instanceof HttpResponse && event.body) {
                const body = event.body as ApiResponse<any>;
                const isNormalized = body && typeof body.ok !== 'undefined';

                return event.clone({
                    body: {
                        ok: isNormalized ? body.ok : true,
                        message: isNormalized ? body.message : 'Operación exitosa',
                        data: isNormalized ? body.data : body,
                        errors: isNormalized ? body.errors : null
                    }
                });
            }
            return event;
        }),
        // Manejo de errores (handler)
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                console.warn('401 detectado: Token inválido o caducado');
            }
            return throwError(() => error);
        })
    );
};