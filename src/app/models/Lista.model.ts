import { Libro } from './Libro.model';

export interface Lista {
    id: number;
    usuario_id: number;
    nombre: string;
    es_default: boolean;
    created_at?: string | null;
    updated_at?: string | null;

    libros_count?: number;
    libros?: Libro[];
}