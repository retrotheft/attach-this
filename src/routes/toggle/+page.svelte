<script lang="ts">
   import { createToggle } from '$lib/dollar-stores/toggle.svelte.js'

   const isPaused = createToggle('Play', 'Pause')
</script>

<main>
   <isPaused.button />

   <button style="color: red;" {...isPaused.onclick}>{isPaused.verb}</button>

   <div {@attach isPaused.class('paused')}>{$isPaused}</div>
   <div class:paused={$isPaused}>{$isPaused}</div>
</main>
