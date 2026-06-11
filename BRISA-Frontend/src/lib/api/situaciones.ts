// src/lib/api/situaciones.ts

const API_URL = "http://localhost:8000/api/Incidentes";

// GET — listar situaciones
export async function getSituaciones() {
  const res = await fetch(`${API_URL}/situaciones`);
  if (!res.ok) throw new Error("Error al obtener situaciones");
  return res.json();
}

// POST — crear situación
export async function crearSituacion(data: any) {
  const res = await fetch(`${API_URL}/situaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Error al crear situación");
  return res.json();
}

// PUT — actualizar situación
export async function actualizarSituacion(id_situacion: number, data: any) {
  const res = await fetch(`${API_URL}/situaciones/${id_situacion}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Error al actualizar situación");
  return res.json();
}

// DELETE — borrar situación
export async function eliminarSituacion(id_situacion: number) {
  const res = await fetch(`${API_URL}/situaciones/${id_situacion}`, {
    method: "DELETE"
  });

  if (!res.ok) throw new Error("Error al eliminar situación");
  return res.json();
}
