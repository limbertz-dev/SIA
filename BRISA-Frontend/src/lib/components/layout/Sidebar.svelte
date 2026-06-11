<script lang="ts">
  import { goto } from "$app/navigation";

  let ruta = "/incidentes";
</script>

<!-- SIDEBAR FIJO -->
<div class="w-64 bg-[#0B2E4F] text-white flex flex-col fixed top-0 left-0 h-screen shadow-xl">

  <!-- LOGO -->
  <div class="flex items-center gap-3 px-6 py-5 border-b border-white/10">
    <div class="bg-cyan-400/30 p-2 rounded-lg">
      🎓
    </div>
    <div>
      <p class="font-semibold text-sm">BRISA</p>
      <p class="text-xs opacity-70">Sistema Escolar</p>
    </div>
  </div>

  <!-- MENÚ -->
  <nav class="flex-1 overflow-y-auto mt-4 px-3 space-y-1">

    <button class="w-full text-left px-4 py-2.5 rounded-lg text-sm opacity-90 hover:bg-white/10 hover:opacity-100 transition">
      Dashboard
    </button>

    <button class="w-full text-left px-4 py-2.5 rounded-lg text-sm opacity-90 hover:bg-white/10 hover:opacity-100 transition">
      Usuarios y Roles
    </button>

    <button class="w-full text-left px-4 py-2.5 rounded-lg text-sm opacity-90 hover:bg-white/10 hover:opacity-100 transition">
      Estudiantes
    </button>

    <button class="w-full text-left px-4 py-2.5 rounded-lg text-sm opacity-90 hover:bg-white/10 hover:opacity-100 transition">
      Profesores
    </button>

    <button class="w-full text-left px-4 py-2.5 rounded-lg text-sm opacity-90 hover:bg-white/10 hover:opacity-100 transition">
      Cursos
    </button>

    <button class="w-full text-left px-4 py-2.5 rounded-lg text-sm opacity-90 hover:bg-white/10 hover:opacity-100 transition">
      Administrativos
    </button>

    <!-- ACTIVO -->
    <button
      class="w-full text-left px-4 py-2.5 rounded-lg text-sm bg-[#20C7DF] text-[#0B2E4F] font-semibold shadow"
      on:click={() => goto("/incidentes")}
    >
      Incidentes
    </button>

    <button class="w-full text-left px-4 py-2.5 rounded-lg text-sm opacity-90 hover:bg-white/10 hover:opacity-100 transition">
      Esquelas
    </button>

    <button class="w-full text-left px-4 py-2.5 rounded-lg text-sm opacity-90 hover:bg-white/10 hover:opacity-100 transition">
      Reportes
    </button>

    <button class="w-full text-left px-4 py-2.5 rounded-lg text-sm opacity-90 hover:bg-white/10 hover:opacity-100 transition">
      Administración
    </button>

  </nav>

  <!-- CERRAR SESIÓN -->
  <div class="p-4 border-t border-white/10">
  <button 
    class="w-full border border-white/20 text-white py-2.5 rounded-xl 
           hover:bg-white/10 transition"
  >
    Cerrar Sesión
  </button>
</div>



</div>
