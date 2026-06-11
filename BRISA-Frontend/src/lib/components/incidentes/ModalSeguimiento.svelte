<!-- src/lib/components/incidentes/ModalSeguimiento.svelte -->
<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import { modificarIncidente } from "$lib/api/modificaciones";
  import type { IncidenteAPI } from "$lib/types/incidentes";
  import type { IncidenteUpdate } from "$lib/types/modificaciones";

  export let caso: IncidenteAPI;
  export let onClose: () => void;

  let nuevoSeguimiento = caso.seguimiento ?? "";

  // igual que en tus otros modales
  const id_usuario_modifica = Number(localStorage.getItem("id_usuario"));

  async function guardarSeguimiento() {
    if (!nuevoSeguimiento.trim()) {
      alert("Debe escribir el seguimiento.");
      return;
    }

    const data: IncidenteUpdate = {
      seguimiento: nuevoSeguimiento,
      id_usuario_modifica
    };

    try {
      await modificarIncidente(caso.id_incidente, data);
      alert("Seguimiento actualizado.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar seguimiento.");
    }
  }
</script>

<Modal onClose={onClose}>

  <h2 class="text-xl font-bold mb-4">
    Modificar Seguimiento del Incidente
  </h2>

    <div class="bg-gray-50 border rounded-xl p-4 mb-5">
      <p class="font-semibold text-[#0B2E50]">
        INC-{caso.id_incidente} — {caso.fecha.split("T")[0]}
      </p>
    </div>

  <div class="mb-5">
    <label class="text-sm font-semibold text-gray-700">Seguimiento</label>

    <textarea
      bind:value={nuevoSeguimiento}
      rows="4"
      placeholder="Escriba el seguimiento..."
      class="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#3AC0B8] outline-none"
    ></textarea>
  </div>

  <div class="flex justify-end mt-6 gap-3">
    <button
      class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
      on:click={onClose}
    >
      Cancelar
    </button>

    <button
      class="px-4 py-2 rounded-lg bg-[#3AC0B8] text-white hover:bg-[#34a99f]"
      on:click={guardarSeguimiento}
    >
      Guardar Seguimiento
    </button>
  </div>

</Modal>
