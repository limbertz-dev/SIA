// src\lib\types\detalles.ts
export interface EstudianteItem {
  id_estudiante: number;
}

export interface ProfesorItem {
  id_persona: number;
}

export interface SituacionItem {
  id_situacion: number;
}

export interface IncidenteDetalles {
  id_incidente: number;
  fecha: string;
  antecedentes: string | null;
  acciones_tomadas: string | null;
  seguimiento: string | null;
  estado: string;
  id_responsable: number | null;

  estudiantes: EstudianteItem[];
  profesores: ProfesorItem[];
  situaciones: SituacionItem[];
}
