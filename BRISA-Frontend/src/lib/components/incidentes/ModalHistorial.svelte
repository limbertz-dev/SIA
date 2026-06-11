<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";

  import { onMount } from "svelte";
  import { obtenerHistorial } from "$lib/api/modificaciones";
  import type { ModificacionHistorial } from "$lib/types/modificaciones";

  export let id_incidente: number;
  export let onClose: () => void;

  let historial: ModificacionHistorial[] = [];
  let cargando = true;

  onMount(async () => {
    historial = await obtenerHistorial(id_incidente);

    // Orden descendente
    historial.sort((a, b) => b.id_historial - a.id_historial);

    cargando = false;
  });

  function formato(valor: string | null) {
    return valor === null ? "(vacío)" : valor;
  }
</script>

<!-- 🟩 USANDO TU MODAL STÁNDAR -->
<Modal onClose={onClose} overlayOpacity={40}>

  <!-- HEADER -->
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-bold text-[#0B2E50]">
      Historial de Modificaciones (ID {id_incidente})
    </h3>

    <!-- BOTÓN CERRAR -->
    <button
      class="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
      on:click={onClose}
    >
      Cerrar
    </button>
  </div>

  <!-- CONTENIDO -->
  {#if cargando}
    <p>Cargando historial...</p>

  {:else if historial.length === 0}
    <p class="text-gray-600 text-sm">No hay modificaciones registradas.</p>

  {:else}
    <div class="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
      {#each historial as item}
        <div class="border-l-4 border-[#3AC0B8] pl-4 py-2 bg-gray-50 rounded">
          
          <p class="text-sm text-gray-500">
            🕒 {item.fecha_cambio} — Usuario #{item.id_usuario}
          </p>

          <p class="font-semibold mt-1">
            Campo: {item.campo_modificado}
          </p>

          <p class="text-sm mt-1">
            <span class="font-semibold text-gray-700">Antes:</span>
            {formato(item.valor_anterior)}
          </p>

          <p class="text-sm">
            <span class="font-semibold text-gray-700">Después:</span>
            <span class="text-[#0B2E50] font-bold">
              {formato(item.valor_nuevo)}
            </span>
          </p>

        </div>
      {/each}
    </div>
  {/if}

</Modal>
