<!-- src/lib/components/incidentes/ModalAtender.svelte -->
<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import { modificarIncidente } from "$lib/api/modificaciones";
  import type { IncidenteAPI } from "$lib/types/incidentes";
  import type { IncidenteUpdate } from "$lib/types/modificaciones";

  export let caso: IncidenteAPI;
  export let onClose: () => void;

  // Acciones actuales (si tiene), y si no, vacío
  let observacion = caso.acciones_tomadas ?? "";

  const id_usuario_modifica = Number(localStorage.getItem("id_usuario"));

  async function guardar() {
    if (!observacion.trim()) {
      alert("Debe escribir una acción o seguimiento.");
      return;
    }

    const data: IncidenteUpdate = {
      acciones_tomadas: observacion,
      id_usuario_modifica
    };

    try {
      await modificarIncidente(caso.id_incidente, data);
      alert("Seguimiento guardado correctamente.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el seguimiento.");
    }
  }
</script>

<Modal onClose={onClose}>

  <h2 class="text-xl font-bold mb-4">
    Agregar Seguimiento
  </h2>

  <!-- INFO del incidente SIN studentName NI description -->
  <div class="bg-gray-50 border rounded-xl p-4 mb-5">
    <p class="font-semibold text-[#0B2E50]">
      INC-{caso.id_incidente} — {caso.fecha.split("T")[0]}
    </p>
  </div>

  <!-- SOLO ACCIONES A TOMAR -->
  <div class="mb-5">
    <label class="text-sm font-semibold text-gray-700">
      Acciones a Tomar
    </label>

    <textarea
      bind:value={observacion}
      rows="4"
      placeholder="Agregue las acciones a Tomar..."
      class="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#3AC0B8] outline-none"
    ></textarea>
  </div>

  <div class="flex justify-end gap-3 mt-4">
    <button
      class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
      on:click={onClose}
    >
      Cancelar
    </button>

    <button
      class="px-4 py-2 rounded-lg bg-[#3AC0B8] text-white hover:bg-[#34a99f]"
      on:click={guardar}
    >
      Guardar Decisión
    </button>
  </div>

</Modal>
