// src\lib\api\temporal.ts
const API = "http://localhost:8000/api";

export async function getEstudiantes() {
  const res = await fetch(`${API}/Incidentes/estudiantes-temporal`);
  if (!res.ok) throw new Error("Error al obtener estudiantes");
  return res.json();
}

export async function getProfesores() {
  const res = await fetch(`${API}/Incidentes/profesores-temporal`);
  if (!res.ok) throw new Error("Error al obtener profesores");
  return res.json();
}

export async function getSituaciones() {
  const res = await fetch(`${API}/Incidentes/situaciones-temporal`);
  if (!res.ok) throw new Error("Error al obtener situaciones");
  return res.json();
}
