<!-- src/lib/components/incidentes/ModalModificar.svelte -->
<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import { modificarIncidente } from "$lib/api/modificaciones";
  import type { IncidenteAPI } from "$lib/types/incidentes";
  import type { IncidenteUpdate } from "$lib/types/modificaciones";

  // TIPADO CORRECTO
  export let caso: IncidenteAPI;
  export let onClose: () => void;

  let antecedentes = caso.antecedentes ?? "";
  let acciones_tomadas = caso.acciones_tomadas ?? "";
  let seguimiento = caso.seguimiento ?? "";

  const id_usuario_modifica = Number(localStorage.getItem("id_usuario"));

  async function guardarCambios() {
    const data: IncidenteUpdate = {
      antecedentes,
      acciones_tomadas,
      seguimiento,
      id_usuario_modifica
    };

    try {
      await modificarIncidente(caso.id_incidente, data);
      alert("Cambios guardados");
      onClose();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar");
    }
  }
</script>

<Modal onClose={onClose}>
  <h2 class="text-xl font-bold mb-5">Modificar Incidente</h2>

  <!-- ANTECEDENTES -->
  <div class="mb-4">
    <label class="text-sm font-semibold text-gray-700">Antecedentes</label>
    <textarea
      rows="3"
      bind:value={antecedentes}
      class="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#3AC0B8] outline-none"
    ></textarea>
  </div>

  <!-- ACCIONES TOMADAS -->
  <div class="mb-4">
    <label class="text-sm font-semibold text-gray-700">Acciones Tomadas</label>
    <textarea
      rows="3"
      bind:value={acciones_tomadas}
      class="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#3AC0B8] outline-none"
    ></textarea>
  </div>

  <!-- SEGUIMIENTO -->
  <div class="mb-4">
    <label class="text-sm font-semibold text-gray-700">Seguimiento</label>
    <textarea
      rows="3"
      bind:value={seguimiento}
      class="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-[#3AC0B8] outline-none"
    ></textarea>
  </div>

  <!-- BOTONES -->
  <div class="flex justify-end gap-3 mt-6">
    <button
      class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
      on:click={onClose}
    >
      Cancelar
    </button>

    <button
      class="px-4 py-2 rounded-lg bg-[#3AC0B8] text-white hover:bg-[#34a99f]"
      on:click={guardarCambios}
    >
      Guardar Cambios
    </button>
  </div>
</Modal>
