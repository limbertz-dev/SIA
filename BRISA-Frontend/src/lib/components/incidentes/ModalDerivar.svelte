<!-- src/lib/components/incidentes/ModalDerivar.svelte -->
<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import { crearDerivacion } from "$lib/api/derivaciones";
  import { mockUsers } from "$lib/utils/mockUsers";
  import type { DerivacionCreate } from "$lib/types/derivaciones";

  export let caso;
  export let onClose: () => void;

  // Datos base
  let id_incidente = caso.id_incidente;
  let id_quien_deriva = Number(localStorage.getItem("id_usuario"));

  // Campos del modal
  let rolSeleccionado: string | null = null;
  let id_quien_recibe: number | null = null;
  let observaciones = "";

  let cargando = false;
  let errorMsg: string | null = null;

  // Filtrar usuarios según rol elegido
  $: usuariosFiltrados = rolSeleccionado
    ? mockUsers.filter(u => u.rol === rolSeleccionado)
    : [];

  async function enviarDerivacion() {
    errorMsg = null;

    if (!rolSeleccionado) {
      errorMsg = "Debe seleccionar un rol.";
      return;
    }

    if (!id_quien_recibe || id_quien_recibe === 0) {
      errorMsg = "Debe seleccionar un usuario receptor.";
      return;
    }

    const payload: DerivacionCreate = {
      id_quien_deriva,
      id_quien_recibe,
      observaciones
    };

    try {
      cargando = true;
      await crearDerivacion(id_incidente, payload);
      cargando = false;
      onClose();
    } catch (e: any) {
      cargando = false;
      errorMsg = e.message || "Error al derivar";
    }
  }
</script>

<Modal onClose={onClose}>

  <!-- Cerrar -->
  <button
    class="absolute top-3 right-3 text-gray-600 hover:text-black font-bold"
    on:click={onClose}
  >
    ✕
  </button>

  <h2 class="text-xl font-bold mb-4">
    Derivar Incidente – #{id_incidente}
  </h2>

  <div class="mt-4 space-y-4">

    <!-- 1. Selección de ROL -->
    <div>
      <label class="font-semibold block mb-1 text-gray-700">
        Seleccionar rol del receptor
      </label>

      <select
        bind:value={rolSeleccionado}
        class="w-full border p-2 rounded-lg text-black"
      >
        <option value={null}>Seleccione un rol</option>

        <!-- Roles únicos -->
        {#each Array.from(new Set(mockUsers.map(u => u.rol))) as rol}
          <option value={rol}>{rol}</option>
        {/each}
      </select>
    </div>

    <!-- 2. Selección del usuario receptor (filtrado por rol) -->
    {#if rolSeleccionado}
      <div>
        <label class="font-semibold block mb-1 text-gray-700">
          Seleccionar usuario receptor
        </label>

        <select
          bind:value={id_quien_recibe}
          class="w-full border p-2 rounded-lg text-black"
        >
          <option value={null}>Seleccione un usuario</option>

          {#each usuariosFiltrados as user}
            <option value={user.id_usuario}>
              {user.nombres}
            </option>
          {/each}
        </select>
      </div>
    {/if}

    <!-- Observaciones -->
    <div>
      <label class="font-semibold block mb-1 text-gray-700">Observaciones</label>
      <textarea
        bind:value={observaciones}
        class="w-full border p-2 rounded-lg text-black"
        rows="3"
        placeholder="Ingrese observaciones opcionales..."
      ></textarea>
    </div>

    <!-- Error -->
    {#if errorMsg}
      <p class="text-red-600 text-sm">{errorMsg}</p>
    {/if}

    <!-- Enviar -->
    <button
      class="mt-4 w-full bg-[#3AC0B8] text-white py-2 rounded-lg font-semibold hover:bg-[#35ada7]"
      on:click={enviarDerivacion}
      disabled={cargando}
    >
      {cargando ? "Guardando..." : "Derivar"}
    </button>

  </div>
</Modal>
