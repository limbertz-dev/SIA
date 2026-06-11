// src/lib/api/derivaciones.ts

import type { DerivacionCreate, DerivacionRead } from "$lib/types/derivaciones";

const API = "http://localhost:8000/api/Incidentes"; // ajusta si tu prefijo es /api

export async function crearDerivacion(
  id_incidente: number,
  payload: DerivacionCreate
): Promise<DerivacionRead> {

  const res = await fetch(`${API}/derivaciones/${id_incidente}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error creando derivación: " + error);
  }

  return await res.json() as DerivacionRead;
}
