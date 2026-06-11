// src\lib\types\notificaciones.ts

export interface NotificacionBase {
  titulo: string;
  mensaje: string;
  id_incidente?: number | null;
  id_derivacion?: number | null;
}

export interface NotificacionCreate extends NotificacionBase {
  id_usuario: number;  // usuario que recibirá la notificación
}

export interface NotificacionRead extends NotificacionBase {
  id_notificacion: number;
  id_usuario: number;
  leido: boolean;
  fecha: string; // ISO (Date convertida en string)
}
