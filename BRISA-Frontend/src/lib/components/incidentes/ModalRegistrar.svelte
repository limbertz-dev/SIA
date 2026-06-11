<!-- src\lib\components\incidentes\ModalRegistrar.svelte -->
<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import ModalSituacion from "$lib/components/incidentes/ModalSituacion.svelte";
  import { crearIncidente } from "$lib/api/incidentes";

  // APIs reales temporales
  import {
    getEstudiantes,
    getProfesores,
    getSituaciones
  } from "$lib/api/temporal";

  // Tipos
  import type {
    EstudianteTemporal,
    ProfesorTemporal,
    SituacionTemporal
  } from "$lib/types/temporal";

  import { onMount } from "svelte";

  export let onClose: () => void;

    //  DATOS DESDE LA BASE REAL

  let estudiantesBD: EstudianteTemporal[] = [];
  let profesoresBD: ProfesorTemporal[] = [];
  let situacionesBD: SituacionTemporal[] = [];

    //  CARGAR DATOS REALES

  onMount(async () => {
    try {
      estudiantesBD = await getEstudiantes();
      profesoresBD = await getProfesores();
      situacionesBD = await getSituaciones();
    } catch (e) {
      console.error("❌ Error cargando datos temporales:", e);
    }
  });


    //  CAMPOS

  let antecedentes = "";
  let acciones_tomadas: string | null = null;
  let seguimiento: string | null = null;
  let estado = "abierto";
  let atender = false;

  /* búsqueda */
  let searchEst = "";
  let searchProf = "";
  let searchSit = "";

  /* selección */
  let estudiantesSeleccionados: EstudianteTemporal[] = [];
  let profesoresSeleccionados: ProfesorTemporal[] = [];
  let situacionesSeleccionadas: SituacionTemporal[] = [];

    //  AGREGAR / QUITAR

  function addEstudiante(est: EstudianteTemporal) {
    if (!estudiantesSeleccionados.find(e => e.id === est.id)) {
      estudiantesSeleccionados = [...estudiantesSeleccionados, est];
    }
  }

  function removeEstudiante(id: number) {
    estudiantesSeleccionados =
      estudiantesSeleccionados.filter(e => e.id !== id);
  }

  function addProfesor(p: ProfesorTemporal) {
    if (!profesoresSeleccionados.find(e => e.id === p.id)) {
      profesoresSeleccionados = [...profesoresSeleccionados, p];
    }
  }

  function removeProfesor(id: number) {
    profesoresSeleccionados =
      profesoresSeleccionados.filter(p => p.id !== id);
  }

  function addSituacion(s: SituacionTemporal) {
    if (!situacionesSeleccionadas.find(e => e.id === s.id)) {
      situacionesSeleccionadas = [...situacionesSeleccionadas, s];
    }
  }

  function removeSituacion(id: number) {
    situacionesSeleccionadas =
      situacionesSeleccionadas.filter(s => s.id !== id);
  }


//  CREAR INCIDENTE (POST REAL)

  async function registrarIncidente() {
    const data = {
      fecha: new Date().toISOString(),
      antecedentes,
      acciones_tomadas: atender ? acciones_tomadas : null,
      seguimiento,
      estado,
      id_responsable: Number(localStorage.getItem("id_usuario")),
      estudiantes: estudiantesSeleccionados.map(e => e.id),
      profesores: profesoresSeleccionados.map(p => p.id),
      situaciones: situacionesSeleccionadas.map(s => s.id)
    };

    try {
      const res = await crearIncidente(data);
      alert("✔ Incidente registrado correctamente");
      console.log("Incidente creado:", res);
      onClose();
    } catch (e) {
      console.error("❌ Error al crear incidente:", e);
      alert("No se pudo registrar el incidente");
    }
  }


    //  RECARGAR SITUACIONES

  let showCrearSituacion = false;

  function recargarSituaciones() {
    situacionesBD = [...situacionesBD];
  }
</script>

<Modal onClose={onClose}>
  <div style="max-height: 80vh; overflow-y: auto; padding-right: 6px;">

    <!-- HEADER -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Registrar Incidente</h2>

      <button
        on:click={onClose}
        class="text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        ×
      </button>
    </div>

    <!-- Antecedentes -->
    <label class="font-semibold text-sm">Antecedentes *</label>
    <textarea bind:value={antecedentes} rows="3"
      class="w-full border rounded p-2 mb-4"></textarea>

    <!-- Estudiantes -->
    <h3 class="font-semibold mb-1">Estudiantes involucrados (opcional)</h3>
    <input class="w-full border rounded p-2 mb-2"
      placeholder="Buscar estudiante..."
      bind:value={searchEst} />

    <div class="border rounded p-2 mb-2 max-h-28 overflow-auto bg-gray-50">
      {#each estudiantesBD.filter(e => e.nombre.toLowerCase().includes(searchEst.toLowerCase())) as est}
        <div class="flex justify-between items-center mb-1">
          <span>{est.nombre}</span>
          <button class="text-blue-600" on:click={() => addEstudiante(est)}>Añadir</button>
        </div>
      {/each}
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
      {#each estudiantesSeleccionados as est}
        <span class="px-2 py-1 bg-blue-100 rounded-full text-sm">
          {est.nombre}
          <button class="ml-1 text-red-600" on:click={() => removeEstudiante(est.id)}>×</button>
        </span>
      {/each}
    </div>

    <!-- Profesores -->
    <h3 class="font-semibold mb-1">Profesores involucrados (opcional)</h3>

    <input class="w-full border rounded p-2 mb-2"
      placeholder="Buscar profesor..."
      bind:value={searchProf} />

    <div class="border rounded p-2 mb-2 max-h-28 overflow-auto bg-gray-50">
      {#each profesoresBD.filter(p => p.nombre.toLowerCase().includes(searchProf.toLowerCase())) as p}
        <div class="flex justify-between items-center mb-1">
          <span>{p.nombre}</span>
          <button class="text-blue-600" on:click={() => addProfesor(p)}>Añadir</button>
        </div>
      {/each}
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
      {#each profesoresSeleccionados as p}
        <span class="px-2 py-1 bg-green-100 rounded-full text-sm">
          {p.nombre}
          <button class="ml-1 text-red-600" on:click={() => removeProfesor(p.id)}>×</button>
        </span>
      {/each}
    </div>

    <!-- Situaciones -->
    <h3 class="font-semibold mb-1">Situaciones detectadas *</h3>

    <input class="w-full border rounded p-2 mb-2"
      placeholder="Buscar situación..."
      bind:value={searchSit} />

    <div class="border rounded p-2 mb-2 max-h-32 overflow-auto bg-gray-50">
      {#each situacionesBD.filter(s => s.nombre.toLowerCase().includes(searchSit.toLowerCase())) as s}
        <div class="flex justify-between items-center mb-1">
          <span>{s.nombre} ({s.nivel})</span>
          <button class="text-blue-600" on:click={() => addSituacion(s)}>Añadir</button>
        </div>
      {/each}
    </div>

    <div class="flex flex-wrap gap-2 mb-4">
      {#each situacionesSeleccionadas as s}
        <span class="px-2 py-1 bg-purple-100 rounded-full text-sm">
          {s.nombre}
          <button class="ml-1 text-red-600" on:click={() => removeSituacion(s.id)}>×</button>
        </span>
      {/each}
    </div>

    <button class="text-blue-700 underline mb-4"
      on:click={() => showCrearSituacion = true}>
      + Crear nueva situación
    </button>

    <!-- Atender -->
    <label class="flex items-center gap-2 mb-2">
      <input type="checkbox" bind:checked={atender} />
      Atender el caso ahora
    </label>

    {#if atender}
      <label class="font-semibold">Acciones tomadas</label>
      <textarea bind:value={acciones_tomadas}
        class="w-full border rounded p-2 mb-4" rows="3"></textarea>
    {/if}

    <!-- Botones -->
    <div class="flex justify-end gap-3">
      <button class="px-4 py-2 border rounded" on:click={onClose}>Cancelar</button>

      <button
        class="px-4 py-2 bg-[#3AC0B8] text-white rounded"
        on:click={registrarIncidente}
      >
        Registrar Incidente
      </button>
    </div>

  </div>
</Modal>

{#if showCrearSituacion}
  <ModalSituacion
    onClose={() => {
      showCrearSituacion = false;
      recargarSituaciones();
    }}
  />
{/if}
