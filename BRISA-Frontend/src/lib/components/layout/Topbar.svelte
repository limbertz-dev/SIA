<!-- src/lib/components/layout/Topbar.svelte -->
<script lang="ts">
  import { browser } from "$app/environment";
  import {
    obtenerNotificacionesUsuario,
    marcarNotificacionComoLeida,
    marcarTodasComoLeidas
  } from "$lib/api/notificaciones";
  import type { NotificacionRead } from "$lib/types/notificaciones";

  let nombre: string = browser
    ? (localStorage.getItem("nombres") ?? "Usuario")
    : "Usuario";
  let rol: string = browser ? (localStorage.getItem("rol") ?? "Rol") : "Rol";

  // Lista de notificaciones desde la API
  let notificaciones: NotificacionRead[] = [];
  let loadingNotis: boolean = false;
  let errorNotis: string | null = null;

  // Control del panel de notificaciones
  let showPanel: boolean = false;

  // Cantidad de no leídas (badge)
  let unreadCount: number = 0;
  $: unreadCount = notificaciones.filter((n) => !n.leido).length;

  async function cargarNotificaciones(): Promise<void> {
    if (!browser) return;

    const rawId = localStorage.getItem("id_usuario");
    if (!rawId) return;

    const idUsuario = Number(rawId);
    if (!idUsuario) return;

    loadingNotis = true;
    errorNotis = null;

    try {
      // solo_no_leidas = false, limit = 10
      notificaciones = await obtenerNotificacionesUsuario(
        idUsuario,
        false,
        10
      );
    } catch (e) {
      console.error(e);
      errorNotis = "Error al cargar notificaciones";
    } finally {
      loadingNotis = false;
    }
  }

  async function handleBellClick(): Promise<void> {
    showPanel = !showPanel;

    // Si abrimos el panel y no hay notificaciones todavía, las cargamos
    if (showPanel && notificaciones.length === 0) {
      await cargarNotificaciones();
    }
  }

  function formatFecha(fecha: string | null | undefined): string {
    if (!fecha) return "";
    const d = new Date(fecha);
    return d.toLocaleString();
  }

  // Marcar una notificación como leída
  async function handleMarcarLeida(n: NotificacionRead): Promise<void> {
    try {
      if (!browser) return;

      const rawId = localStorage.getItem("id_usuario");
      if (!rawId) return;
      const idUsuario = Number(rawId);
      if (!idUsuario) return;

      const actualizada = await marcarNotificacionComoLeida(
        n.id_notificacion,
        idUsuario
      );

      notificaciones = notificaciones.map((item) =>
        item.id_notificacion === n.id_notificacion ? actualizada : item
      );
    } catch (e) {
      console.error(e);
    }
  }

  // Marcar todas las notificaciones como leídas
  async function handleMarcarTodas(): Promise<void> {
    if (!browser) return;

    const rawId = localStorage.getItem("id_usuario");
    if (!rawId) return;
    const idUsuario = Number(rawId);
    if (!idUsuario) return;

    try {
      await marcarTodasComoLeidas(idUsuario);
      notificaciones = notificaciones.map((n) => ({ ...n, leido: true }));
    } catch (e) {
      console.error(e);
    }
  }
</script>

<div
  class="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center justify-between px-6 z-50"
>
  <input
    placeholder="Buscar estudiantes, profesores, reportes…"
    class="w-1/2 px-4 py-2 border rounded-lg bg-gray-50"
  />

  <div class="flex items-center gap-6">
    <!-- 🔔 CAMPANITA CON BADGE Y PANEL -->
    <div class="relative">
      <!-- Icono campana -->
      <div
        class="relative cursor-pointer hover:opacity-80"
        on:click={handleBellClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-7 h-7 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 
                6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 
                6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 
                3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        <!-- 🔴 BADGE ROJO -->
        {#if unreadCount > 0}
          <span
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold
                    rounded-full min-w-[1.25rem] h-5 flex items-center justify-center shadow"
          >
            {unreadCount}
          </span>
        {/if}
      </div>

      <!-- PANEL DE NOTIFICACIONES -->
      {#if showPanel}
        <div
          class="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
        >
          <div
            class="flex items-center justify-between px-3 py-2 border-b border-gray-100"
          >
            <span class="text-sm font-semibold text-gray-800">
              Notificaciones
            </span>

            {#if unreadCount > 0}
              <button
                class="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                on:click|stopPropagation={handleMarcarTodas}
              >
                Marcar todas como leídas
              </button>
            {/if}
          </div>

          <!-- Contenido -->
          <div class="max-h-80 overflow-y-auto">
            {#if loadingNotis}
              <div class="px-3 py-4 text-sm text-gray-500">
                Cargando notificaciones…
              </div>
            {:else if errorNotis}
              <div class="px-3 py-4 text-sm text-red-500">
                {errorNotis}
              </div>
            {:else if notificaciones.length === 0}
              <div class="px-3 py-4 text-sm text-gray-500">
                No tienes notificaciones.
              </div>
            {:else}
              {#each notificaciones as n}
                <div
                  class="flex items-start gap-3 px-3 py-2 hover:bg-gray-50 cursor-default"
                >
                  <!-- Punto azul si está no leída -->
                  <div class="mt-2">
                    {#if !n.leido}
                      <span
                        class="inline-block w-2 h-2 rounded-full bg-cyan-500"
                      ></span>
                    {/if}
                  </div>

                  <div class="flex-1">
                    <p
                      class={`text-sm ${
                        n.leido
                          ? "text-gray-700"
                          : "font-semibold text-gray-900"
                      }`}
                    >
                      {n.titulo}
                    </p>
                    {#if n.mensaje}
                      <p class="text-xs text-gray-500 mt-0.5">
                        {n.mensaje}
                      </p>
                    {/if}
                    <p class="text-[10px] text-gray-400 mt-0.5">
                      {formatFecha(n.fecha)}
                    </p>
                  </div>

                  {#if !n.leido}
                    <button
                      class="text-[11px] text-cyan-600 hover:text-cyan-700 hover:underline mt-1"
                      on:click|stopPropagation={() => handleMarcarLeida(n)}
                    >
                      Marcar<br />leída
                    </button>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      {/if}
    </div>

    <!-- 🧑‍💼 Perfil -->
    <div class="flex items-center gap-3">
      <div
        class="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white"
      >
        {nombre.charAt(0)}
      </div>
      <div>
        <p class="font-semibold">{nombre}</p>
        <p class="text-xs text-gray-500">{rol}</p>
      </div>
    </div>
  </div>
</div>
