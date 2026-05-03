import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    console.log('🚀 Interceptor capturando petición a:', req.url);

    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(authReq);
    }

    return next(req);
};