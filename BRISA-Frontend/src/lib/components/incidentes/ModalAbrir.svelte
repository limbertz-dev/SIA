<!-- src\lib\components\incidentes\ModalAbrir.svelte -->

<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import { modificarIncidente } from "$lib/api/modificaciones";

  export let id_incidente: number;
  export let id_usuario: number;
  export let onClose: () => void;
  export let onDone: () => void;

  let cargando = false;

  async function confirmar() {
    cargando = true;

    try {
      await modificarIncidente(id_incidente, {
        estado: "abierto",
        id_usuario_modifica: id_usuario
      });
      onDone();
      onClose();
    } catch (e) {
      console.error(e);
    }

    cargando = false;
  }
</script>

<Modal onClose={onClose}>
  <h2 class="text-xl font-bold mb-4 text-[#0B2E50]">Reabrir incidente</h2>

  <p class="mb-6">
    ¿Deseas <strong>reabrir</strong> este incidente?
  </p>

  <div class="flex justify-end gap-3">
    <button class="px-4 py-2 bg-gray-200 rounded-lg" on:click={onClose}>
      No
    </button>

    <button
      class="px-4 py-2 bg-green-600 text-white rounded-lg"
      on:click={confirmar}
      disabled={cargando}
    >
      {cargando ? "Reabriendo…" : "Sí, abrir"}
    </button>
  </div>
</Modal>
