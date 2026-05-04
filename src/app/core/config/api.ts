// api.ts
import { environment } from '../../../environments/environment';

export const API = {
    auth: {
        login: `${environment.apiUrl}/auth/login`,
        logout: `${environment.apiUrl}/auth/logout`,
        registar: `${environment.apiUrl}/auth/registrar`,
    },

    biblioteca: {
        listar: `${environment.apiUrl}/biblioteca`,
        estadoLibro: `${environment.apiUrl}/biblioteca/estadoLibro`,
        eliminar: `${environment.apiUrl}/biblioteca/eliminar`,
    },

    libro: {
        search: `${environment.apiUrl}/libros/search`,
        detalle: `${environment.apiUrl}/libros/detalle`,
    },

    listas: {
        listar: `${environment.apiUrl}/listas/all`,
        crear: `${environment.apiUrl}/listas/new`,
    },
};