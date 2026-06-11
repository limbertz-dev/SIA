<!-- src/lib/components/ui/Modal.svelte -->
<script lang="ts">
  export let onClose: () => void = () => {};
  export let noOverlay: boolean = false;

  // 🟩 nueva propiedad
  export let overlayOpacity: number = 40; // entre 0 y 100
</script>

<div
  class="fixed inset-0 z-[60] flex items-center justify-center"
  on:click={(e) => {
    if (e.target === e.currentTarget) onClose();
  }}
>

  <!-- OVERLAY (dinámico) -->
  {#if !noOverlay}
    <div 
      class="absolute inset-0" 
      style="background: rgba(0,0,0,{overlayOpacity}%)">
    </div>
  {/if}

  <!-- CONTENEDOR DEL MODAL -->
  <div
    class="relative bg-white rounded-xl shadow-xl w-full max-w-3xl animate-fadeIn z-[70]"
    style="
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    "
  >
    <!-- SCROLL INTERNO -->
    <div
      style="
        overflow-y: auto;
        padding: 1.5rem;
        flex-grow: 1;
      "
    >
      <slot />
    </div>
  </div>
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
</style>
