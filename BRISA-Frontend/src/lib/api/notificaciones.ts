// src/lib/api/notificaciones.ts

import type {
  NotificacionCreate,
  NotificacionRead,
} from "$lib/types/notificaciones";

// Prefijo base del router de incidentes
const API = "http://localhost:8000/api/Incidentes";

/**
 * Crear una nueva notificación.
 *
 * POST /api/Incidentes/notificaciones
 */
export async function crearNotificacion(
  payload: NotificacionCreate
): Promise<NotificacionRead> {
  const res = await fetch(`${API}/notificaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error creando notificación: " + error);
  }

  return (await res.json()) as NotificacionRead;
}

/**
 * Obtener una notificación por ID.
 *
 * GET /api/Incidentes/notificaciones/{id_notificacion}
 */
export async function obtenerNotificacion(
  id_notificacion: number
): Promise<NotificacionRead> {
  const res = await fetch(`${API}/notificaciones/${id_notificacion}`);

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error obteniendo notificación: " + error);
  }

  return (await res.json()) as NotificacionRead;
}

/**
 * Listar notificaciones de un usuario.
 *
 * Backend:
 *   GET /api/Incidentes/notificaciones/{id_usuario}?solo_no_leidas=&limit=
 */
export async function obtenerNotificacionesUsuario(
  id_usuario: number,
  solo_no_leidas: boolean = false,
  limit?: number
): Promise<NotificacionRead[]> {
  const params = new URLSearchParams();
  params.append("solo_no_leidas", String(solo_no_leidas));
  if (limit !== undefined) {
    params.append("limit", String(limit));
  }

  const url = `${API}/notificaciones/${id_usuario}?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error obteniendo notificaciones: " + error);
  }

  return (await res.json()) as NotificacionRead[];
}

/**
 * Marcar una notificación como leída.
 *
 * Backend:
 *   PATCH /api/Incidentes/notificaciones/{id_notificacion}/leer?id_usuario=10
 */
export async function marcarNotificacionComoLeida(
  id_notificacion: number,
  id_usuario: number
): Promise<NotificacionRead> {
  const params = new URLSearchParams();
  params.append("id_usuario", String(id_usuario));

  const res = await fetch(
    `${API}/notificaciones/${id_notificacion}/leer?${params.toString()}`,
    {
      method: "PATCH",
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Error marcando notificación como leída: " + error);
  }

  return (await res.json()) as NotificacionRead;
}

/**
 * Marcar todas las notificaciones de un usuario como leídas.
 *
 * Backend:
 *   PATCH /api/Incidentes/notificaciones/{id_usuario}/leer-todas
 *   -> { "mensaje": "...", "cantidad": number }
 */
export async function marcarTodasComoLeidas(
  id_usuario: number
): Promise<number> {
  const res = await fetch(`${API}/notificaciones/${id_usuario}/leer-todas`, {
    method: "PATCH",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(
      "Error marcando todas las notificaciones como leídas: " + error
    );
  }

  const data = (await res.json()) as { mensaje: string; cantidad: number };
  return data.cantidad;
}
