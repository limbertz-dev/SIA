// src\lib\api\detalles.ts

import type { IncidenteDetalles } from "$lib/types/detalles";
import { apiUrl } from "$lib/api/config";

export async function obtenerDetalles(id_incidente: number): Promise<IncidenteDetalles> {
  const res = await fetch(apiUrl(`/api/Incidentes/detalles/${id_incidente}`));

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Error obteniendo detalles: " + err);
  }

  return res.json();
}
