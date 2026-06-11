<!-- src/lib/components/incidentes/ModalVerSituaciones.svelte -->
<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import { onMount } from "svelte";

  import {
    getSituaciones,
    eliminarSituacion,
    actualizarSituacion
  } from "$lib/api/situaciones";

  import type { Situacion } from "$lib/types/situaciones";

  export let onClose: () => void;

  let cargando = true;
  let lista: Situacion[] = [];

  let editId: number | null = null;
  let editNombre = "";
  let editGravedad = "";

  onMount(async () => {
    lista = await getSituaciones();
    cargando = false;
  });

  function startEdit(s: Situacion) {
    editId = s.id_situacion;
    editNombre = s.nombre_situacion;
    editGravedad = s.nivel_gravedad;
  }

  function cancelEdit() {
    editId = null;
  }

  async function saveEdit(id_situacion: number) {
    const updated = await actualizarSituacion(id_situacion, {
      nombre_situacion: editNombre,
      nivel_gravedad: editGravedad
    });

    lista = lista.map(s => s.id_situacion === id_situacion ? updated : s);

    cancelEdit();
  }

  async function borrar(id_situacion: number) {
    if (!confirm("¿Eliminar situación?")) return;

    await eliminarSituacion(id_situacion);

    lista = lista.filter(s => s.id_situacion !== id_situacion);
  }
</script>

<!-- 🔵 SEGUNDA VENTANA, SIN OPCAR EL FONDO -->
<Modal onClose={onClose} noOverlay={true}>
  <h2 class="text-xl font-bold mb-6">Todas las Situaciones Registradas</h2>

  {#if cargando}
    <p>Cargando...</p>

  {:else}
    <table class="w-full text-sm border">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="p-2">ID</th>
          <th class="p-2">Área</th>
          <th class="p-2">Nombre</th>
          <th class="p-2">Gravedad</th>
          <th class="p-2 text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {#each lista as s}
          <tr class="border-b">
            <td class="p-2">{s.id_situacion}</td>
            <td class="p-2">{s.id_area}</td>

            {#if editId === s.id_situacion}
              <td class="p-2">
                <input class="border p-1 w-full" bind:value={editNombre} />
              </td>

              <td class="p-2">
                <select bind:value={editGravedad} class="border p-1 w-full">
                  <option value="leve">Leve</option>
                  <option value="grave">Grave</option>
                  <option value="muy grave">Muy Grave</option>
                </select>
              </td>

              <td class="p-2 text-center">
                <button class="text-green-600 mr-2" on:click={() => saveEdit(s.id_situacion)}>
                  Guardar
                </button>
                <button class="text-gray-600" on:click={cancelEdit}>Cancelar</button>
              </td>

            {:else}
              <td class="p-2">{s.nombre_situacion}</td>
              <td class="p-2">{s.nivel_gravedad}</td>

              <td class="p-2 text-center">
                <button class="text-blue-600 mr-2" on:click={() => startEdit(s)}>Editar</button>
                <button class="text-red-600" on:click={() => borrar(s.id_situacion)}>Borrar</button>
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
      class="px-4 py-2 border rounded-lg text-gray-700"
    >
      Cerrar
    </button>
  </div>
</Modal>
