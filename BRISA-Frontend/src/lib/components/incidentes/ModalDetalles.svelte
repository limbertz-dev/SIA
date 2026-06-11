<!-- src/lib/components/incidentes/ModalDetalles.svelte -->
<script lang="ts">
  import Modal from "$lib/components/ui/Modal.svelte";
  import { onMount } from "svelte";
  import { obtenerDetalles } from "$lib/api/detalles";
  import type { IncidenteDetalles } from "$lib/types/detalles";

  export let id_incidente: number;
  export let onClose: () => void;

  let detalles: IncidenteDetalles | null = null;
  let cargando = true;

  onMount(async () => {
    console.log("Cargando detalles del incidente:", id_incidente);

    try {
      const data = await obtenerDetalles(id_incidente);
      console.log("Detalles recibidos:", data);
      detalles = data;
    } catch (err) {
      console.error("Error obteniendo detalles:", err);
    }

    cargando = false;
  });
</script>

<Modal onClose={onClose} overlayOpacity={40}>
  <!-- Botón cerrar -->
  <button
    class="absolute top-3 right-3 text-gray-600 hover:text-black font-bold text-xl"
    on:click={onClose}
  >
    ✕
  </button>

  <h2 class="text-2xl font-bold text-[#0B2E50] mb-4">
    Detalles del Incidente – {id_incidente}
  </h2>

  {#if cargando}
    <p class="text-center">Cargando detalles...</p>

  {:else if detalles}
    <!-- ENCABEZADO -->
    <div class="bg-cyan-500 text-white rounded-xl p-4 mb-5">
      <p><strong>Estado:</strong> {detalles.estado}</p>
      <p><strong>Fecha:</strong> {detalles.fecha.split("T")[0]}</p>
    </div>

    <!-- CAMPOS PRINCIPALES -->
    <div class="space-y-4">
      <div>
        <h3 class="font-semibold text-[#0B2E50]">Antecedentes</h3>
        <p class="text-gray-700">{detalles.antecedentes ?? "(vacío)"}</p>
      </div>

      <div>
        <h3 class="font-semibold text-[#0B2E50]">Acciones Tomadas</h3>
        <p class="text-gray-700">{detalles.acciones_tomadas ?? "(vacío)"}</p>
      </div>

      <div>
        <h3 class="font-semibold text-[#0B2E50]">Seguimiento</h3>
        <p class="text-gray-700">{detalles.seguimiento ?? "(vacío)"}</p>
      </div>
    </div>

    <hr class="my-6" />

    <!-- ESTUDIANTES -->
    <h3 class="text-lg font-semibold text-[#0B2E50] mb-1">Estudiantes</h3>
    {#if detalles.estudiantes.length > 0}
      <ul class="list-disc ml-6 text-gray-700">
        {#each detalles.estudiantes as e}
          <li>ID estudiante: {e.id_estudiante}</li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-600 italic">Sin estudiantes asignados</p>
    {/if}

    <hr class="my-6" />

    <!-- PROFESORES -->
    <h3 class="text-lg font-semibold text-[#0B2E50] mb-1">Profesores</h3>
    {#if detalles.profesores.length > 0}
      <ul class="list-disc ml-6 text-gray-700">
        {#each detalles.profesores as p}
          <li>ID profesor: {p.id_persona}</li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-600 italic">Sin profesores asignados</p>
    {/if}

    <hr class="my-6" />

    <!-- SITUACIONES -->
    <h3 class="text-lg font-semibold text-[#0B2E50] mb-1">Situaciones</h3>
    {#if detalles.situaciones.length > 0}
      <ul class="list-disc ml-6 text-gray-700">
        {#each detalles.situaciones as s}
          <li>ID situación: {s.id_situacion}</li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-600 italic">Sin situaciones asociadas</p>
    {/if}

  {:else}
    <p class="text-red-600 text-center">Error cargando los datos.</p>
  {/if}
</Modal>
