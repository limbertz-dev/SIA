// src\lib\types\situaciones.ts
export interface Situacion {
  id_situacion: number;
  id_area: number;
  nombre_situacion: string;
  nivel_gravedad: "leve" | "grave" | "muy grave";
}

export interface CrearSituacionDTO {
  id_area: number;
  nombre_situacion: string;
  nivel_gravedad: string;
}
