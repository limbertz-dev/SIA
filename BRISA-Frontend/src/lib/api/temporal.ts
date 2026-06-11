// src\lib\api\temporal.ts
import { INCIDENTES_API_URL } from "$lib/api/config";

export async function getEstudiantes() {
  const res = await fetch(`${INCIDENTES_API_URL}/estudiantes-temporal`);
  if (!res.ok) throw new Error("Error al obtener estudiantes");
  return res.json();
}

export async function getProfesores() {
  const res = await fetch(`${INCIDENTES_API_URL}/profesores-temporal`);
  if (!res.ok) throw new Error("Error al obtener profesores");
  return res.json();
}

export async function getSituaciones() {
  const res = await fetch(`${INCIDENTES_API_URL}/situaciones-temporal`);
  if (!res.ok) throw new Error("Error al obtener situaciones");
  return res.json();
}
