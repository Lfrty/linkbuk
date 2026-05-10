import { environment } from '../../../environments/environment';

export const API_URL = {
    auth: {
        login: `${environment.apiUrl}/auth/login`,
        logout: `${environment.apiUrl}/auth/logout`,
        registar: `${environment.apiUrl}/auth/registrar`,
    },

    user: {
        getUser: `${environment.apiUrl}/user`,
        updateUser: `${environment.apiUrl}/user`,
    },

    biblioteca: {
        listar: `${environment.apiUrl}/biblioteca`,
        estadoLibro: `${environment.apiUrl}/biblioteca/nuevo`,
        eliminar: `${environment.apiUrl}/biblioteca/eliminar`,
    },

    libro: {
        search: `${environment.apiUrl}/libros/search`,
        detalle: `${environment.apiUrl}/libros/detalle`,
    },

    listas: {
        addLibro: (id: number) => `${environment.apiUrl}/listas/${id}/addLibro`,
        listar: `${environment.apiUrl}/listas/all`,
        crear: `${environment.apiUrl}/listas/new`,
        actualizar: (id: number) => `${environment.apiUrl}/listas/${id}`,
        eliminar: (id: number) => `${environment.apiUrl}/listas/${id}/`,
        eliminarLibro: (id: number, idLibro: number) => `${environment.apiUrl}/listas/${id}/libros/${idLibro}`
    },

    admin: {
        listarUsuarios: `${environment.apiUrl}/admin/usuarios/all`,
        obtenerUsuario: (id: number) => `${environment.apiUrl}/admin/usuarios/${id}`,
        crearUsuario: `${environment.apiUrl}/admin/usuarios`,
        actualizarUsuario: `${environment.apiUrl}/admin/usuarios/edit`,
        eliminarUsuario: (id: number) => `${environment.apiUrl}/admin/usuarios/borrar/${id}`,
        destruirUsuario: (id: number) => `${environment.apiUrl}/admin/usuarios/destruir/${id}`
    }
};