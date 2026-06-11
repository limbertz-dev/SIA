// src\lib\api\detalles.ts

import type { IncidenteDetalles } from "$lib/types/detalles";

const API = "http://localhost:8000/api/Incidentes";

export async function obtenerDetalles(id_incidente: number): Promise<IncidenteDetalles> {
  const res = await fetch(`${API}/detalles/${id_incidente}`);

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Error obteniendo detalles: " + err);
  }

  return res.json();
}
