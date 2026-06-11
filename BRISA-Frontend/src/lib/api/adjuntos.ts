import type { AdjuntoRead } from "$lib/types/adjuntos";

const API_URL = "http://localhost:8000/api/Incidentes";

// ===================================================
// 1️⃣ SUBIR ADJUNTO
// ===================================================
export async function subirAdjunto(
  id_incidente: number,
  archivo: File,
  subido_por: number | null = null
): Promise<AdjuntoRead> {
  
  const form = new FormData();
  form.append("archivo", archivo);

  if (subido_por !== null) {
    form.append("id_subido_por", String(subido_por));
  }

  const res = await fetch(`${API_URL}/adjuntos/${id_incidente}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Error al subir adjunto: ${await res.text()}`);
  }

  return res.json();
}


// ===================================================
// 2️⃣ LISTAR ADJUNTOS POR INCIDENTE
// ===================================================
export async function obtenerAdjuntosPorIncidente(
  id_incidente: number
): Promise<AdjuntoRead[]> {

  const res = await fetch(`${API_URL}/adjuntos/${id_incidente}`);

  if (!res.ok) {
    throw new Error("Error al obtener adjuntos");
  }

  return res.json();
}

// ===================================================
// 3️⃣ DESCARGAR ARCHIVO INDIVIDUAL
// ===================================================
export async function descargarAdjunto(id_adjunto: number): Promise<void> {
  const url = `${API_URL}/adjuntos/${id_adjunto}`;

  const res = await fetch(url);
  const blob = await res.blob();
  const contentDisposition = res.headers.get("Content-Disposition");

  let filename = "archivo";

  // Si el backend envía filename correctamente:
  if (contentDisposition && contentDisposition.includes("filename=")) {
    filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
  }

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ===================================================
// 5️⃣ BORRAR ADJUNTO INDIVIDUAL
// ===================================================
export async function borrarAdjunto(id_adjunto: number): Promise<void> {
  const res = await fetch(`${API_URL}/adjuntos/${id_adjunto}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error al eliminar adjunto");
  }
}
