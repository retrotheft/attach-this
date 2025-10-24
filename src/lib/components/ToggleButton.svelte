<script lang="ts">
   import { type Toggle } from '$lib/dollar-stores/toggle.svelte.js'

   let { toggle }: { toggle: Toggle } = $props()

   $effect(() => {
      console.log(toggle.verb)
   })
</script>

<button onclick={toggle.switch}>{toggle.verb}</button>
