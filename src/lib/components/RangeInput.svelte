<script lang="ts">
   let { range } = $props()
</script>

<div class="range-container">
   {#if range.label}
      <label for="range-{range.label}">{range.label}</label>
   {/if}
   <input
      id="range-{range.label}"
      type="range"
      min={range.inputProps.min}
      max={range.inputProps.max}
      step={range.inputProps.step}
      value={$range}
      oninput={range.inputProps.oninput}
   />
   <output>{$range}</output>
</div>
