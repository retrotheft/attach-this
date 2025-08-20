<script lang="ts">
   let { code }: { code: string } = $props()

   const hlCode = $derived(hljs.highlight(code, { language: 'svelte' }).value)
</script>

<code>
   <pre>{@html hlCode}</pre>
</code>

<style>
   code {
      border: 1px solid grey;
      background-color: black;
      z-index: 2;
      padding: 1em 2em;
      width: 80ch;
      height: 32rem;
      overflow-y: auto;
   }
</style>
