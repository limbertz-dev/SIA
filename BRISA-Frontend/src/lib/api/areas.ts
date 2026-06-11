// src\lib\api\areas.ts
import { apiUrl } from "$lib/api/config";

export async function getAreas() {
  const res = await fetch(apiUrl("/api/Incidentes/areas"));
  if (!res.ok) throw new Error("Error al obtener áreas");
  return res.json();
}

export async function crearArea(data: any) {
  const res = await fetch(apiUrl("/api/Incidentes/areas"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al crear área");
  return res.json();
}

export async function actualizarArea(id_area: number, data: any) {
  const res = await fetch(apiUrl(`/api/Incidentes/areas/${id_area}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al actualizar área");
  return res.json();
}

export async function eliminarArea(id_area: number) {
  const res = await fetch(apiUrl(`/api/Incidentes/areas/${id_area}`), {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Error al eliminar área");
  return res.json();
}
