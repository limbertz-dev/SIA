<!-- src/lib/components/incidentes/IncidentesCards.svelte -->
<script lang="ts">
  import AppShell from "$lib/components/layout/AppShell.svelte";
  import FiltrosIncidentes from "$lib/components/incidentes/FiltrosIncidentes.svelte";

  import ModalDetalles from "$lib/components/incidentes/ModalDetalles.svelte";
  import ModalAtender from "$lib/components/incidentes/ModalAtender.svelte";
  import ModalModificar from "$lib/components/incidentes/ModalModificar.svelte";
  import ModalDerivar from "$lib/components/incidentes/ModalDerivar.svelte";
  import ModalCerrar from "$lib/components/incidentes/ModalCerrar.svelte";
  import ModalRegistrar from "$lib/components/incidentes/ModalRegistrar.svelte";
  import ModalAreas from "$lib/components/incidentes/ModalAreas.svelte";
  import ModalSituacion from "$lib/components/incidentes/ModalSituacion.svelte";
  import ModalHistorial from "$lib/components/incidentes/ModalHistorial.svelte";
  import ModalSeguimiento from "$lib/components/incidentes/ModalSeguimiento.svelte";
  import ModalAdjuntos from "./ModalAdjuntos.svelte";
  import ModalAbrir from "./ModalAbrir.svelte";

  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { incidentes, cargarIncidentes } from "$lib/stores/incidentes";
  import { obtenerDetalles } from "$lib/api/detalles";

  import type { IncidenteAPI } from "$lib/types/incidentes";
  import type { EstudianteItem } from "$lib/types/detalles";

  type ModalType =
    | "area" | "situacion" | "registrar" | "detalles"
    | "atender" | "seguimiento" | "modificar" | "historial"
    | "adjuntos" | "derivar" | "cerrar" | "abrir" | null;

  let modal: ModalType = null;
  let incidenteSeleccionado: IncidenteAPI | null = null;

  let usuarioActual: number | null = null;

  // filtros que vienen del componente FiltrosIncidentes
  let search = "";
  let estado = "todos";
  let gestion = "todas";

  // Mapa: id_incidente -> [id_estudiante, id_estudiante, ...]
  let mapaEstudiantes: Record<number, number[]> = {};

  // ---- Helper: parsear search → lista de IDs numéricos ----
  const parseIdsFromSearch = (text: string): number[] => {
    return text
      .split(",") // separa por coma
      .map((t) => t.trim()) // quita espacios
      .filter((t) => t !== "" && /^[0-9]+$/.test(t)) // solo dígitos
      .map((t) => Number(t)); // a número
  };

  // ---- Cargar incidentes + detalles (estudiantes) ----
  onMount(async () => {
    const id = localStorage.getItem("id_usuario");
    usuarioActual = id ? Number(id) : null;

    // 1) Cargamos la lista base
    await cargarIncidentes();

    // 2) Leemos la lista actual del store
    const lista = get(incidentes) as IncidenteAPI[];
    console.log("Incidentes cargados:", lista);

    // 3) Para cada incidente, pedimos sus detalles (como en ModalDetalles)
    const promesas = lista.map(async (inc) => {
      try {
        const detalles = await obtenerDetalles(inc.id_incidente);
        const estudiantes: EstudianteItem[] = detalles.estudiantes ?? [];
        mapaEstudiantes[inc.id_incidente] = estudiantes.map(
          (e) => e.id_estudiante
        );
      } catch (error) {
        console.error(
          "Error obteniendo detalles para incidente",
          inc.id_incidente,
          error
        );
        mapaEstudiantes[inc.id_incidente] = [];
      }
    });

    await Promise.all(promesas);
  });

  // ---- Lista ordenada + filtrada ----
  $: listaFiltrada = [...$incidentes]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .filter((inc) => {
      // filtro por estado
      const estadoReal = inc.estado?.toLowerCase() || "";
      const esDerivadoParaMi = 
        estadoReal === "derivado" && inc.id_responsable === usuarioActual;

      const estadoParaFiltrar = esDerivadoParaMi ? "abierto" : estadoReal;

      const coincideEstado =
        estado === "todos"
          ? true
          : estadoParaFiltrar === estado.toLowerCase();

      // filtro por ID(s) de estudiante
      const idsBuscados = parseIdsFromSearch(search);
      let coincideAlumno: boolean;
      if (idsBuscados.length === 0) {
        coincideAlumno = true;
      } else {
        const idsEst = mapaEstudiantes[inc.id_incidente] ?? [];
        coincideAlumno = idsEst.some((id) => idsBuscados.includes(id));
      }

      // filtro por gestión (año)
      const coincideGestion =
        gestion === "todas" || gestion === "todas"
          ? true
          : inc.fecha.startsWith(gestion); // "2024-03-15T..." → empieza con "2024"

      return coincideEstado && coincideAlumno && coincideGestion;
    });

  function abrir(m: ModalType, inc: IncidenteAPI | null = null) {
    modal = m;
    incidenteSeleccionado = inc;
  }

  function cerrar() {
    modal = null;
    incidenteSeleccionado = null;
    cargarIncidentes();
  }

  // handler del evento que dispara FiltrosIncidentes
  function manejarFiltros(
    event: CustomEvent<{ search: string; estado: string; gestion: string }>
  ) {
    search = event.detail.search;
    estado = event.detail.estado;
    gestion = event.detail.gestion; // ← recibimos el nuevo filtro
  }

  // Helper: clases por estado (para la burbuja de color)
  const clasesEstado = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "abierto":
        return "bg-green-100 text-green-800 border-green-300";
      case "derivado":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "cerrado":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  // Helper: mostrar con primera letra en mayúscula
  const formatearEstado = (estado?: string) => {
    if (!estado) return "";
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  };

  const estadoVisual = (inc: IncidenteAPI): string => {
    if (
      inc.estado?.toLowerCase() === "derivado" &&
      inc.id_responsable === usuarioActual
    ) {
      return "abierto"; // ← ¡Para mí ya está abierto!
    }
    return inc.estado?.toLowerCase() || "";
  };

  // Opcional: también para formatear bonito
  const formatearEstadoVisual = (inc: IncidenteAPI): string => {
    const estado = estadoVisual(inc);
    if (!estado) return "";
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };
</script>

<AppShell>

  <!-- HEADER -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-[#0B2E50]">Seguimiento de Incidentes Estudiantiles</h1>
      <p class="text-gray-600">Gestión de casos y seguimiento institucional</p>
    </div>

    <div class="flex gap-2">
      <button class="px-4 py-2 rounded-lg bg-[#3AC0B8] text-white"
        on:click={() => abrir("area")}>
        + Areas
      </button>

      <button class="px-4 py-2 rounded-lg bg-[#3AC0B8] text-white"
        on:click={() => abrir("situacion")}>
        + Crear Situacion
      </button>

      <button class="px-4 py-2 rounded-lg bg-[#3AC0B8] text-white"
        on:click={() => abrir("registrar")}>
        + Nuevo Incidente
      </button>
    </div>
  </div>

  <!-- 🔎 Filtros conectados -->
  <FiltrosIncidentes on:change={manejarFiltros} />

  <!-- LISTA -->
  <div class="space-y-6 mt-4">
    {#each listaFiltrada as inc}

      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition">

        <!-- ENCABEZADO -->
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-semibold text-[#0B2E50]">
            INC-{inc.id_incidente} — {inc.fecha.split("T")[0]}
          </h2>

          <span class={`px-3 py-1 rounded-full text-xs font-semibold border ${clasesEstado(estadoVisual(inc))}`}>
            {formatearEstadoVisual(inc)}
          </span>
        </div>

        <!-- DESCRIPCION -->
        <div class="mb-4">
          <p class="text-sm font-semibold text-gray-800 mb-1">Antecedentes:</p>
          <p class="text-gray-600">
            {inc.antecedentes || "Sin antecedentes registrados"}
          </p>
        </div>

        <!-- GRID -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
          <div>
            <p class="text-gray-500">Fecha</p>
            <p class="text-[#0B2E50] font-semibold">
              {inc.fecha.split("T")[0]}
            </p>
          </div>

          <div>
            <p class="text-gray-500">Hora</p>
            <p class="text-[#0B2E50] font-semibold">
              {inc.fecha.split("T")[1].slice(0,5)}
            </p>
          </div>

          <div>
            <p class="text-gray-500">Acciones Tomadas</p>
            <p class="text-[#0B2E50]">
              {inc.acciones_tomadas || "—"}
            </p>
          </div>

          <div>
            <p class="text-gray-500">Seguimiento</p>
            <p class="text-[#0B2E50]">
              {inc.seguimiento || "—"}
            </p>
          </div>

          <div>
            <p class="text-gray-500">Responsable</p>
            <p class="text-[#0B2E50] font-semibold">
              {inc.id_responsable}
            </p>
          </div>
        </div>

        <!-- BOTONES -->
        <div class="flex gap-2 mt-5 pt-4">

          <!-- SIEMPRE PERMITIDO -->
          <button
            class="px-4 py-1.5 rounded-lg bg-white border border-[#3AC0B8] text-[#0B2E50]"
            on:click={() => abrir("detalles", inc)}
          >
            Ver Detalles
          </button>

          {#if usuarioActual === inc.id_responsable}
            {#if ['abierto', 'derivado'].includes(estadoVisual(inc))}
              <!-- RESPONSABLE + ABIERTO/DERIVADO → TODAS LAS ACCIONES -->

              <button
                class="px-4 py-1.5 rounded-lg bg-[#7A95D9]/20 border border-[#7A95D9] text-[#0B2E50]"
                on:click={() => abrir("historial", inc)}
              >
                Ver Historial
              </button>

              <button
                class="px-4 py-1.5 rounded-lg bg-[#3AC0B8] text-white"
                on:click={() => abrir("atender", inc)}
              >
                Atender
              </button>

              <button
                class="px-4 py-1.5 rounded-lg bg-[#5091AA] text-white"
                on:click={() => abrir("seguimiento", inc)}
              >
                Seguimiento
              </button>

              <button
                class="px-4 py-1.5 rounded-lg bg-[#7A95D9]/20 border border-[#7A95D9] text-[#0B2E50]"
                on:click={() => abrir("modificar", inc)}
              >
                Modificar
              </button>

              <button
                class="px-4 py-1.5 rounded-lg bg-[#7A95D9]/20 border border-[#7A95D9] text-[#0B2E50]"
                on:click={() => abrir("adjuntos", inc)}
              >
                Adjuntos
              </button>

              <button
                class="px-4 py-1.5 rounded-lg bg-[#27C5DA]/20 border border-[#27C5DA] text-[#0B2E50]"
                on:click={() => abrir("derivar", inc)}
              >
                Derivar
              </button>

              <button
                class="px-4 py-1.5 rounded-lg bg-[#EF5C52]/20 border border-[#EF5C52] text-[#B83227]"
                on:click={() => abrir("cerrar", inc)}
              >
                Cerrar
              </button>

            {:else if estadoVisual(inc) === "cerrado"}
              <!-- RESPONSABLE + CERRADO → HISTORIAL + ABRIR -->

              <button
                class="px-4 py-1.5 rounded-lg bg-[#7A95D9]/20 border border-[#7A95D9] text-[#0B2E50]"
                on:click={() => abrir("historial", inc)}
              >
                Ver Historial
              </button>

              <button
                class="px-4 py-1.5 rounded-lg bg-green-200 border border-green-600 text-green-800"
                on:click={() => abrir("abrir", inc)}
              >
                Abrir
              </button>

            {:else}
              <!-- RESPONSABLE en algún otro estado raro → solo historial -->
              <button
                class="px-4 py-1.5 rounded-lg bg-[#7A95D9]/20 border border-[#7A95D9] text-[#0B2E50]"
                on:click={() => abrir("historial", inc)}
              >
                Ver Historial
              </button>
            {/if}

          {:else}
            <!-- NO ES RESPONSABLE → SOLO HISTORIAL EXTRA -->
            <button
              class="px-4 py-1.5 rounded-lg bg-[#7A95D9]/20 border border-[#7A95D9] text-[#0B2E50]"
              on:click={() => abrir("historial", inc)}
            >
              Ver Historial
            </button>
          {/if}

        </div>

      </div>
    {/each}
  </div>

  <!-- MODALES -->

  {#if modal === "area"}
    <ModalAreas onClose={cerrar} />
  {/if}

  {#if modal === "situacion"}
    <ModalSituacion onClose={cerrar} />
  {/if}

  {#if modal === "registrar"}
    <ModalRegistrar onClose={cerrar} />
  {/if}

  {#if modal === "detalles" && incidenteSeleccionado}
    <ModalDetalles
      id_incidente={incidenteSeleccionado.id_incidente}
      onClose={cerrar}
    />
  {/if}

  {#if modal === "atender" && incidenteSeleccionado}
    <ModalAtender 
      caso={incidenteSeleccionado}
      onClose={cerrar}
    />
  {/if}

  {#if modal === "seguimiento" && incidenteSeleccionado}
    <ModalSeguimiento 
      caso={incidenteSeleccionado}
      onClose={cerrar}
    />
  {/if}

  {#if modal === "modificar" && incidenteSeleccionado}
    <ModalModificar 
      caso={incidenteSeleccionado}
      onClose={cerrar}
    />
  {/if}

  {#if modal === "derivar" && incidenteSeleccionado}
    <ModalDerivar 
      caso={incidenteSeleccionado}
      onClose={cerrar}
    />
  {/if}

  {#if modal === "cerrar" && incidenteSeleccionado}
    <ModalCerrar
      id_incidente={incidenteSeleccionado.id_incidente}
      id_usuario={usuarioActual ?? 0}
      onClose={cerrar}
      onDone={cargarIncidentes}
    />
  {/if}

  {#if modal === "abrir" && incidenteSeleccionado}
    <ModalAbrir
      id_incidente={incidenteSeleccionado.id_incidente}
      id_usuario={usuarioActual ?? 0}
      onClose={cerrar}
      onDone={cargarIncidentes}
    />
  {/if}

  {#if modal === "historial" && incidenteSeleccionado}
    <ModalHistorial
      id_incidente={incidenteSeleccionado.id_incidente}
      onClose={cerrar}
    />
  {/if}

  {#if modal === "adjuntos" && incidenteSeleccionado}
    <ModalAdjuntos
      id_incidente={incidenteSeleccionado.id_incidente}
      onClose={cerrar}
    />
  {/if}

</AppShell>
