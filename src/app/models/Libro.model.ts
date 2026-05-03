export interface Libro {
  id?: number;                  // ID BD
  work_key: string;             // ID de OpenLibrary
  titulo: string;
  autor: string;
  anyo_publicacion?: number;
  descripcion?: string;
  portada?: string;
  paginas?: number;
  estado?: 'pendiente' | 'leyendo' | 'leido';
  puntuacion_personal?: number;
}