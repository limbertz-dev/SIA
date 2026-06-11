<!-- src\lib\components\incidentes\ModalAdjuntos.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import Modal from "$lib/components/ui/Modal.svelte";

  import { subirAdjunto } from "$lib/api/adjuntos";
  import ModalVerAdjuntos from "./ModalVerAdjuntos.svelte";

  export let id_incidente: number;
  export let onClose: () => void = () => {};

  let archivo: File | null = null;
  let cargando = false;
  let verAdjuntos = false;

  let id_subido_por: number | null = null;

  onMount(() => {
    const id_usuario = localStorage.getItem("id_usuario");
    id_subido_por = id_usuario ? Number(id_usuario) : null;
  });

  async function subir() {
    if (!archivo) {
      alert("Selecciona un archivo primero.");
      return;
    }

    cargando = true;
    try {
      await subirAdjunto(id_incidente, archivo, id_subido_por);
      alert("Archivo subido correctamente");
      archivo = null;
    } catch (e) {
      console.error(e);
      alert("Error al subir el archivo");
    } finally {
      cargando = false;
    }
  }
</script>

<Modal onClose={onClose} overlayOpacity={45}>
  <h2 class="text-2xl font-bold text-[#0B2E50] mb-4">
    Adjuntos del Incidente #{id_incidente}
  </h2>

  <div class="flex flex-col gap-4">

    <!-- Selector -->
    <div>
      <label class="font-semibold text-[#0B2E50]">Selecciona un archivo:</label>
      <input 
        type="file"
        class="mt-2 block w-full p-2 border rounded"
        on:change={(e: any) => archivo = e.target.files[0]}
      />
    </div>

    {#if archivo}
      <p class="text-sm text-gray-600">
        Archivo seleccionado: <strong>{archivo.name}</strong>
      </p>
    {/if}

    <!-- Botones -->
    <div class="flex justify-between mt-4">

      <button
        class="px-4 py-2 rounded-lg bg-[#0B2E50] text-white"
        on:click={() => verAdjuntos = true}
      >
        📂 Ver Adjuntos Subidos
      </button>

      <div class="flex gap-3">

        <button
          class="px-4 py-2 rounded-lg bg-gray-300 text-gray-800"
          on:click={onClose}
        >
          Cerrar
        </button>

        <button
          class="px-4 py-2 rounded-lg bg-[#3AC0B8] text-white"
          disabled={cargando}
          on:click={subir}
        >
          {#if cargando}
            Subiendo...
          {:else}
            Subir
          {/if}
        </button>

      </div>
    </div>

  </div>
</Modal>

<!-- Modal secundario -->
{#if verAdjuntos}
  <ModalVerAdjuntos 
    id_incidente={id_incidente}
    onClose={() => verAdjuntos = false}
  />
{/if}
