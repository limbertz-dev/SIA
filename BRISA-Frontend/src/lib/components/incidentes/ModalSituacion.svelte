<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import ModalVerSituaciones from "$lib/components/incidentes/ModalVerSituaciones.svelte";
  import { crearSituacion } from "$lib/api/situaciones";

  export let onClose: () => void;

  let id_area: number | null = null;
  let nombre_situacion = "";
  let nivel_gravedad = "";

  let showVerSituaciones = false;

  async function registrarSituacion() {
    if (!id_area || !nombre_situacion.trim() || !nivel_gravedad.trim()) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      const nueva = await crearSituacion({
        id_area,
        nombre_situacion,
        nivel_gravedad
      });

      alert("Situación registrada correctamente.");
      onClose();

    } catch (err) {
      console.error(err);
      alert("Error al registrar la situación.");
    }
  }

  // 🔵 Ahora ya NO requiere ID → abre toda la tabla
  function verSituaciones() {
    showVerSituaciones = true;
  }
</script>

<!-- MODAL PRINCIPAL -->
<Modal onClose={onClose}>
  <h2 class="text-xl font-bold mb-6">Registrar Nueva Situación</h2>

  <div class="mb-4">
    <label class="block text-sm font-semibold text-gray-700 mb-1">ID Área *</label>
    <input
      type="number"
      bind:value={id_area}
      class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#3AC0B8]"
      placeholder="Ej: 1"
    />
  </div>

  <div class="mb-4">
    <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
    <input
      type="text"
      bind:value={nombre_situacion}
      class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#3AC0B8]"
      placeholder="Ej: Llanto en clase"
    />
  </div>

  <div class="mb-4">
    <label class="block text-sm font-semibold text-gray-700 mb-1">Nivel *</label>
    <select
      bind:value={nivel_gravedad}
      class="w-full border rounded-lg p-2 bg-white"
    >
      <option value="" disabled selected>Selecciona gravedad</option>
      <option value="leve">Leve</option>
      <option value="grave">Grave</option>
      <option value="muy grave">Muy Grave</option>
    </select>
  </div>

  <!-- BOTONES -->
  <div class="flex justify-between items-center mt-6">

    <!-- 🔵 BOTÓN VER TODAS LAS SITUACIONES -->
    <button
      class="px-4 py-2 rounded-lg border text-blue-700 hover:bg-blue-100"
      on:click={verSituaciones}
    >
      Ver situaciones
    </button>

    <div class="flex gap-3">
      <button class="px-4 py-2 rounded-lg border text-gray-600" on:click={onClose}>
        Cancelar
      </button>

      <button
        class="px-4 py-2 rounded-lg bg-[#3AC0B8] text-white"
        on:click={registrarSituacion}
      >
        Registrar
      </button>
    </div>

  </div>
</Modal>

<!-- MODAL SECUNDARIO (GLOBAL) -->
{#if showVerSituaciones}
  <ModalVerSituaciones
    onClose={() => (showVerSituaciones = false)}
  />
{/if}
