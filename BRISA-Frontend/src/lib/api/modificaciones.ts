// src\lib\api\modificaciones.ts
import type { IncidenteUpdate, ModificacionHistorial } from "$lib/types/modificaciones";
import { INCIDENTES_API_URL } from "$lib/api/config";

const API = INCIDENTES_API_URL;

export async function modificarIncidente(id: number, data: IncidenteUpdate) {
  const res = await fetch(`${API}/modificaciones/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Error modificando incidente: " + err);
  }

  return res.json();
}

export async function obtenerHistorial(id_incidente: number): Promise<ModificacionHistorial[]> {
  const res = await fetch(`${API}/modificaciones/${id_incidente}`);

  if (!res.ok) throw new Error("Error obteniendo historial");

  return res.json();
}
