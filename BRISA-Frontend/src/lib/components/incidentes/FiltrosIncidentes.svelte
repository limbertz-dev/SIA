<!-- src/lib/components/incidentes/FiltrosIncidentes.svelte -->
<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let search = "";
  let estado = "todos";
  let gestion = "todas";

  // Cada vez que cambia algo, avisamos al padre
  $: dispatch("change", { search, estado, gestion });
</script>


<div class="p-6 rounded-xl bg-white shadow-md border border-gray-200 mb-6">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    
    <!-- Buscar por ID estudiante -->
    <div>
      <label class="text-sm font-medium text-[#0B2E50]">
        Buscar por ID de estudiante
      </label>
      <input
        class="w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27C5DA]"
        placeholder="Ej: 1, 2, 15…"
        bind:value={search}
      />
    </div>

    <!-- Estado -->
    <div>
      <label class="text-sm font-medium text-[#0B2E50]">Filtrar por estado</label>
      <select
        class="w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27C5DA]"
        bind:value={estado}
      >
        <option value="todos">Todos los estados</option>
        <option value="abierto">Abierto</option>
        <option value="derivado">Derivado</option>
        <option value="cerrado">Cerrado</option>
      </select>
    </div>

    <!-- NUEVO: Gestión / Año -->
    <div>
      <label class="text-sm font-medium text-[#0B2E50]">Filtrar por gestión</label>
      <select
        class="w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27C5DA]"
        bind:value={gestion}
      >
        <option value="todas">Todas las gestiones</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>
    </div>

  </div>
</div>
