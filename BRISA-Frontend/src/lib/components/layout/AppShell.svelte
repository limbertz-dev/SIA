<!-- src/lib/components/layout/AppShell.svelte -->
<script>
  import Sidebar from "./Sidebar.svelte";
  import Topbar from "./Topbar.svelte";
</script>

<div class="flex bg-[#F3F6FA] min-h-screen">

  <!-- Sidebar fijo -->
  <Sidebar />

  <!-- Contenido -->
  <div class="flex-1 flex flex-col ml-64">

    <!-- Topbar fijo -->
    <Topbar />

    <!-- Contenido con margen top para no tapar -->
    <main class="pt-20 px-6 pb-10">
      <slot />
    </main>

  </div>
</div>
