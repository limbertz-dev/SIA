// src\lib\api\detalles.ts

import type { IncidenteDetalles } from "$lib/types/detalles";
import { INCIDENTES_API_URL } from "$lib/api/config";

const API = INCIDENTES_API_URL;

export async function obtenerDetalles(id_incidente: number): Promise<IncidenteDetalles> {
  const res = await fetch(`${API}/detalles/${id_incidente}`);

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Error obteniendo detalles: " + err);
  }

  return res.json();
}
