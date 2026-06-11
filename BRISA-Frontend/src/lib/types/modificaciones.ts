// src\lib\types\modificaciones.ts
export interface IncidenteUpdate {
  antecedentes?: string;
  acciones_tomadas?: string;
  seguimiento?: string;
  estado?: string; 
  id_usuario_modifica: number;
}

export interface ModificacionHistorial {
  id_historial: number;
  id_incidente: number;
  id_usuario: number;
  fecha_cambio: string;
  campo_modificado: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
}
