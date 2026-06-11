// src/stores/usuario.ts
import { writable } from "svelte/store";
import type { Usuario } from "$lib/types/usuario";

export const usuarioActual = writable<Usuario>({
  id: null,
  usuario: "",
  nombres: "",
  rol: "",
  token: ""
});

export function logout() {
  usuarioActual.set({
    id: null,
    usuario: "",
    nombres: "",
    rol: "",
    token: ""
  });

  localStorage.removeItem("token");
  localStorage.removeItem("id_usuario");
  localStorage.removeItem("usuario");
  localStorage.removeItem("nombres");
  localStorage.removeItem("rol");

  window.location.href = "/login";
}
