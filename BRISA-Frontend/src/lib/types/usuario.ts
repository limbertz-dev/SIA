// src\lib\types\usuario.ts
export interface Usuario {
  id: number | null;
  usuario: string;
  nombres: string;
  rol: string;
  token: string;
}
