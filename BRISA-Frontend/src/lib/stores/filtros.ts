// src/lib/stores/filtros.ts
import { writable } from "svelte/store";

/// Búsqueda global de incidentes (ej: ID de alumno)
export const filtroIncidentesGlobal = writable("");
