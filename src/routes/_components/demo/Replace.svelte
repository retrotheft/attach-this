<script lang="ts">
   import { loc } from "../../+page/Module.svelte";
</script>

<p>Replaces all text using a given lookup table, and reacts dynamically to new changes.</p>

<div>
   <loc.letters en>
      <button onclick={() => $loc = 'en'}>English</button>
   </loc.letters>
   <loc.letters gsa>
      <button onclick={() => $loc = 'gsa'}>gsa</button>
   </loc.letters>
</div>

<p>Works on individual letters, words or entire text nodes, and allows you to set boundaries and local overrides.</p>

<style>
   div {
      display: flex;
      justify-content: space-evenly;
   }
</style>
