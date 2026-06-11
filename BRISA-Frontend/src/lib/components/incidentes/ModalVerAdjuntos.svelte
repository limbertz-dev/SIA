<!-- src/lib/components/incidentes/ModalVerAdjuntos.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "$lib/components/ui/Modal.svelte";

  import { 
    obtenerAdjuntosPorIncidente,
    borrarAdjunto,
    descargarAdjunto
  } from "$lib/api/adjuntos";

  import type { AdjuntoRead } from "$lib/types/adjuntos";

  export let id_incidente: number;
  export let onClose: () => void = () => {};

  let adjuntos: AdjuntoRead[] = [];
  let cargando = true;

  async function cargar() {
    cargando = true;
    try {
      adjuntos = await obtenerAdjuntosPorIncidente(id_incidente);
    } catch (e) {
      console.error("Error al cargar adjuntos", e);
    }
    cargando = false;
  }

  async function borrar(id: number) {
    if (!confirm("¿Deseas borrar este archivo?")) return;

    try {
      await borrarAdjunto(id); // ← API REAL
      
      // actualizar en frontend
      adjuntos = adjuntos.filter(a => a.id_adjunto !== id);
    } catch (e) {
      alert("Error al borrar el archivo");
      console.error(e);
    }
  }

  onMount(cargar);
</script>

<Modal onClose={onClose} overlayOpacity={45}>
  <h2 class="text-2xl font-bold text-[#0B2E50] mb-4">
    Archivos Subidos – Incidente #{id_incidente}
  </h2>

  {#if cargando}
    <p>Cargando archivos...</p>
  {:else}
    {#if adjuntos.length === 0}
      <p class="text-gray-600">No hay adjuntos subidos.</p>
    {:else}

      <!-- TABLA DE ADJUNTOS -->
      <div class="w-full overflow-auto">
        <table class="w-full text-left border">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2">Nombre</th>
              <th class="p-2">Tipo</th>
              <th class="p-2">Fecha</th>
              <th class="p-2 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {#each adjuntos as adj}
              <tr class="border-b hover:bg-gray-50 transition">
                <td class="p-2">{adj.nombre_archivo}</td>
                <td class="p-2">{adj.tipo_mime}</td>
                <td class="p-2">{adj.fecha_subida.split("T")[0]}</td>

                <td class="p-2 flex gap-3 justify-center">

                  <!-- Descargar -->
                  <button
                    class="px-3 py-1 bg-blue-500 text-white rounded"
                    on:click={() => descargarAdjunto(adj.id_adjunto)}
                  >
                    ⬇️ Descargar
                  </button>

                  <!-- Eliminar -->
                  <button
                    class="px-3 py-1 bg-red-500 text-white rounded"
                    on:click={() => borrar(adj.id_adjunto)}
                  >
                    🗑️ Eliminar
                  </button>

                </td>
              </tr>
            {/each}
          </tbody>

        </table>
      </div>

    {/if}
  {/if}

  <!-- Footer -->
  <div class="flex justify-end mt-6">
    <button 
      class="px-4 py-2 bg-gray-300 rounded-lg"
      on:click={onClose}
    >
      Cerrar
    </button>
  </div>
</Modal>
