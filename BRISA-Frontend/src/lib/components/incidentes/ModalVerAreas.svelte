<!-- src\lib\components\incidentes\ModalVerAreas.svelte -->
<script lang="ts">  
  import { onMount } from "svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { listaAreas } from "$lib/stores/areas";
  import { getAreas, eliminarArea, actualizarArea } from "$lib/api/areas";
  import type { Area } from "$lib/types/areas";

  export let onClose: () => void;

  let cargando = true;

  let editId: number | null = null;
  let editNombre = "";
  let editDescripcion = "";

  onMount(async () => {
    const data = await getAreas();
    listaAreas.set(data);
    cargando = false;
  });

  function startEdit(area: Area) {
    editId = area.id_area;
    editNombre = area.nombre_area;
    editDescripcion = area.descripcion;
  }

  function cancelEdit() {
    editId = null;
    editNombre = "";
    editDescripcion = "";
  }

  async function saveEdit(id_area: number) {
    try {
      const updated = await actualizarArea(id_area, {
        nombre_area: editNombre,
        descripcion: editDescripcion
      });

      listaAreas.update(items =>
        items.map(a => (a.id_area === id_area ? updated : a))
      );

      cancelEdit();

    } catch (err) {
      console.error(err);
      alert("Error al actualizar el área.");
    }
  }

  async function borrar(id_area: number) {
    if (!confirm("¿Seguro que deseas eliminar esta área?")) return;

    try {
      await eliminarArea(id_area);

      listaAreas.update(items =>
        items.filter(a => a.id_area !== id_area)
      );

    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el área.");
    }
  }
</script>

<!-- 🔥 Aquí aplicamos la solución: noOverlay={true} -->
<Modal onClose={onClose} noOverlay={true}>
  <h2 class="text-xl font-bold mb-6">Lista de Áreas Registradas</h2>

  {#if cargando}
    <p class="text-gray-500">Cargando áreas...</p>
  {:else if $listaAreas.length === 0}
    <p class="text-gray-500">No hay áreas registradas.</p>
  {:else}
    <table class="w-full border rounded-lg text-sm">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="p-2 text-left">ID</th>
          <th class="p-2 text-left">Nombre</th>
          <th class="p-2 text-left">Descripción</th>
          <th class="p-2 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>

        {#each $listaAreas as area}
          <tr class="border-b hover:bg-gray-50">

            <td class="p-2">{area.id_area}</td>

            <!-- MODO EDICIÓN -->
            {#if editId === area.id_area}
              <td class="p-2">
                <input
                  class="border p-1 w-full rounded"
                  bind:value={editNombre}
                />
              </td>
              <td class="p-2">
                <input
                  class="border p-1 w-full rounded"
                  bind:value={editDescripcion}
                />
              </td>

              <td class="p-2 text-center">
                <button
                  class="px-2 py-1 text-green-600 hover:underline mr-2"
                  on:click={() => saveEdit(area.id_area)}
                >
                  Guardar
                </button>
                <button
                  class="px-2 py-1 text-gray-600 hover:underline"
                  on:click={cancelEdit}
                >
                  Cancelar
                </button>
              </td>

            {:else}
            <!-- MODO NORMAL -->
              <td class="p-2 font-semibold">{area.nombre_area}</td>
              <td class="p-2">{area.descripcion}</td>

              <td class="p-2 text-center">
                <button
                  class="px-2 py-1 text-blue-600 hover:underline mr-2"
                  on:click={() => startEdit(area)}
                >
                  Editar
                </button>
                <button
                  class="px-2 py-1 text-red-600 hover:underline"
                  on:click={() => borrar(area.id_area)}
                >
                  Borrar
                </button>
              </td>
            {/if}
          </tr>
        {/each}

      </tbody>
    </table>
  {/if}

  <div class="flex justify-end mt-6">
    <button
      on:click={onClose}
      class="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
    >
      Cerrar
    </button>
  </div>
</Modal>
