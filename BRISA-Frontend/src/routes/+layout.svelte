<!-- src\routes\+layout.svelte -->
<script>
  import "../app.css";
  import favicon from '$lib/assets/favicon.svg';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<slot />
