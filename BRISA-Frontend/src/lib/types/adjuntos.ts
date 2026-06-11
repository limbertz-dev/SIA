// src\lib\types\adjuntos.ts

export interface AdjuntoRead {
  id_adjunto: number;
  id_incidente: number;
  nombre_archivo: string | null;
  ruta: string | null;
  tipo_mime: string | null;
  id_subido_por: number | null;
  fecha_subida: string;   // ISO string desde Python
}
