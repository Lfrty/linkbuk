export interface Usuario {
    id: number;
    nombre: string;
    password: string;
    email: string;
    biografia: string;
    ubicacion: string;
    foto_perfil: string;
    permitir_desconocidos: boolean;
    id_rol: number;
    eliminado: Date;
}