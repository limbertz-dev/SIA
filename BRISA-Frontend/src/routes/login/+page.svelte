<!-- src\routes\login\+page.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { usuarioActual } from "$lib/stores/usuario";
  import { mockUsers } from "$lib/utils/mockUsers";

  let usuario = "";
  let password = "";
  let recordar = false;
  let error = "";

  async function iniciarSesion() {
    error = "";

    if (!usuario || !password) {
      error = "Debes ingresar usuario y contraseña.";
      return;
    }

    const user = mockUsers.find(
      u => u.usuario === usuario && u.password === password
    );

    if (!user) {
      error = "Usuario o contraseña incorrectos.";
      return;
    }

    const token = btoa(`${usuario}:${Date.now()}`);

    localStorage.setItem("token", token);
    localStorage.setItem("id_usuario", String(user.id_usuario));
    localStorage.setItem("usuario", user.usuario);
    localStorage.setItem("nombres", user.nombres);
    localStorage.setItem("rol", user.rol);

    usuarioActual.set({
      id: user.id_usuario,
      usuario: user.usuario,
      nombres: user.nombres,
      rol: user.rol,
      token
    });

    goto("/incidentes");
  }
</script>

<!-- CONTENEDOR PRINCIPAL -->
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#024b7c] to-[#00a5b3] p-6">

  <!-- TARJETA -->
  <div class="bg-white w-full max-w-sm p-8 rounded-2xl shadow-xl">

    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>

    {#if error}
      <p class="text-red-500 text-sm mb-4">{error}</p>
    {/if}

    <!-- INPUT USUARIO -->
    <label class="block text-sm font-medium text-gray-700">Usuario</label>
    <input
      bind:value={usuario}
      placeholder="Ingresa tu usuario"
      class="w-full mt-1 mb-4 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
    />

    <!-- INPUT CONTRASEÑA -->
    <label class="block text-sm font-medium text-gray-700">Contraseña</label>
    <input
      bind:value={password}
      type="password"
      placeholder="Ingresa tu contraseña"
      class="w-full mt-1 mb-4 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none"
    />

    <div class="flex items-center gap-2 mb-6">
      <input type="checkbox" bind:checked={recordar} class="h-4 w-4 text-cyan-600" />
      <span class="text-sm text-gray-700">Recordarme</span>
    </div>

    <!-- BOTÓN -->
    <button
      on:click={iniciarSesion}
      class="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-semibold transition"
    >
      Iniciar Sesión
    </button>

  </div>
</div>
