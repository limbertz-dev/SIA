// src\lib\types\derivaciones.ts

export interface DerivacionCreate {
  id_quien_deriva: number;
  id_quien_recibe: number;
  observaciones: string | null;
}

export interface DerivacionRead {
  id_derivacion: number;
  id_incidente: number;
  id_quien_deriva: number;
  id_quien_recibe: number;
  fecha_derivacion: string; // ISO
  observaciones: string | null;
}
