// src\lib\stores\incidentes.ts
import { writable } from "svelte/store";
import type { IncidenteAPI } from "$lib/types/incidentes";
import { getIncidentes } from "$lib/api/incidentes";

export const incidentes = writable<IncidenteAPI[]>([]);

export async function cargarIncidentes() {
  try {
    const data = await getIncidentes();
    incidentes.set(data);
  } catch (error) {
    console.error("Error cargando incidentes:", error);
  }
}
