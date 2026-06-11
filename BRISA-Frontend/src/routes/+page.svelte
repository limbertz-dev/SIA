<!-- src\routes\+page.svelte -->
<script>
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  // En el lado del cliente, redirige a /login
  if (browser) {
    goto('/login');
  }
</script>

<p>Redirigiendo...</p>
