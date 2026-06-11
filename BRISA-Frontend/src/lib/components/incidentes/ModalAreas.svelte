<!-- src\lib\components\incidentes\ModalAreas.svelte -->

<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import { crearArea, getAreas } from "$lib/api/areas";
  import ModalVerAreas from "$lib/components/incidentes/ModalVerAreas.svelte";
  import { listaAreas } from "$lib/stores/areas";

  export let onClose: () => void;

  let nombre_area = "";
  let descripcion = "";
  let showVerAreas = false;

  // REGISTRAR ÁREA Y ACTUALIZAR STORE
  async function registrarArea() {
    if (!nombre_area.trim()) {
      alert("El nombre del área es obligatorio.");
      return;
    }

    try {
      const nuevaArea = await crearArea({
        nombre_area,
        descripcion
      });

      // 🔥 Actualizar store global
      listaAreas.update((items) => [...items, nuevaArea]);

      alert("Área registrada correctamente.");
      nombre_area = "";
      descripcion = "";

      onClose();
    } catch (error) {
      console.error("Error al registrar el área:", error);
      alert("No se pudo registrar el área.");
    }
  }

  function verAreas() {
    showVerAreas = true;
  }
</script>


<Modal onClose={onClose}>
  <h2 class="text-xl font-bold mb-6">Registrar Nueva Área</h2>

  <!-- CAMPOS -->
  <div class="mb-4">
    <label class="block text-sm font-semibold text-gray-700 mb-1">
      Nombre del Área *
    </label>
    <input
      type="text"
      bind:value={nombre_area}
      class="w-full border rounded-lg p-2"
    />
  </div>

  <div class="mb-4">
    <label class="block text-sm font-semibold text-gray-700 mb-1">
      Descripción
    </label>
    <textarea
      bind:value={descripcion}
      class="w-full border rounded-lg p-3"
    ></textarea>
  </div>

  <!-- BOTONES -->
  <div class="flex justify-between items-center mt-6">

    <!-- BOTÓN VER ÁREAS -->
    <button
      class="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
      on:click={verAreas}
    >
      Ver áreas
    </button>

    <div class="flex gap-3">
      <button
        class="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
        on:click={onClose}
      >
        Cancelar
      </button>

      <button
        class="px-4 py-2 rounded-lg bg-[#3AC0B8] text-white hover:bg-[#34a99f]"
        on:click={registrarArea}
      >
        Registrar Área
      </button>
    </div>

  </div>
</Modal>

<!-- MODAL VER ÁREAS -->
{#if showVerAreas}
  <ModalVerAreas onClose={() => (showVerAreas = false)} />
{/if}
