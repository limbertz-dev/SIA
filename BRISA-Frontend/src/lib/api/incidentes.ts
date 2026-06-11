// src\lib\api\incidentes.ts
import type { IncidenteAPI } from "$lib/types/incidentes";

const API_URL = "http://localhost:8000/api/Incidentes";

export async function getIncidentes(): Promise<IncidenteAPI[]> {
  const res = await fetch(`${API_URL}/incidentes`);

  if (!res.ok) {
    throw new Error("Error al obtener incidentes");
  }

  return res.json();
}

export async function crearIncidente(data: any) {
  const res = await fetch(`${API_URL}/incidentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Error al crear incidente");
  }

  return res.json();
}
