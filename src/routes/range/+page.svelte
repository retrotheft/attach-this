<script lang="ts">
   import { createRange } from '$lib/dollar-stores/range.svelte.js'

   const volume = createRange({
      min: 0,
      max: 100,
      step: 1,
      value: 50,
      label: 'volume'
   })
</script>

<main>
   <volume.input />
   <volume.slider />

   <!-- Custom input -->
   <input {...volume.inputProps} />
   <span>{$volume}%</span>

   <!-- CSS variable attachment -->
   <div style="opacity: calc(var(--volume) / 100)" {@attach volume.style('--volume')}>
      Fading based on volume
   </div>
</main>
