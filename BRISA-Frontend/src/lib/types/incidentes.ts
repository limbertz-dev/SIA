// src\lib\types\incidentes.ts
export interface IncidenteCreate {
  fecha: string;
  antecedentes: string;
  acciones_tomadas: string | null;
  seguimiento: string | null;
  estado: string;
  id_responsable: number;
  estudiantes: number[];
  profesores: number[];
  situaciones: number[];
}

export interface IncidenteAPI extends IncidenteCreate {
  id_incidente: number;
}
