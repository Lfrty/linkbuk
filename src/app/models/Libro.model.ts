export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  portada?: string;
  work_key: string;
  anyo_publicacion?: number;
  paginas?: number;
  descripcion?: string;

  // Propiedad de API con detalles respecto al usuario
  pivot?: {
    user_id: number;
    libro_id: number;
    estado_lectura: 'pendiente' | 'leyendo' | 'leido';
  };
}