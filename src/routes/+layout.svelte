<script>
  import 'chota'
  import LeftPane from '$lib/LeftPane.svelte'
  import './app.css'
  import { SvelteToast } from '@zerodevx/svelte-toast'

  const options = {}
</script>

<svelte:head>
  <title>Freenit</title>
  <meta name="Freenit" content="Freenit base for Svelte" />
</svelte:head>

<SvelteToast {options} />
<section class="root">
  <LeftPane />
  <div class="main">
    <slot />
  </div>
</section>

<style>
  .root {
    height: 100vh;
    display: flex;
    align-items: stretch;
    justify-content: center;
  }

  .main {
    width: 100%;
  }
</style>
