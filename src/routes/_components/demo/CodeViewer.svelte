<script lang="ts">
   let { code }: { code: string } = $props()

   const hlCode = $derived(hljs.highlight(code, { language: 'svelte' }).value)
</script>

<code class="localisation-boundary">
   <pre>{@html hlCode}</pre>
</code>

<style>
   @property --gradient-angle {
     syntax: '<angle>';
     initial-value: 360deg;
     inherits: false;
   }

   code {
      --border-edges: oklch(30% 0 0);
      --border-center: oklch(58% 0 0);
      border: 1px solid var(--border-edges);
      border-image: linear-gradient(var(--gradient-angle), var(--border-edges) 0%, var(--border-center) 70%, var(--border-edges) 100%) 1;
      background-color: black;
      z-index: 2;
      padding: 1em 2em;
      width: 80ch;
      height: 32rem;
      overflow-y: auto;
      animation: rotate-gradient 25s linear infinite;
   }

   @keyframes rotate-gradient {
     to {
       --gradient-angle: 0deg;
     }
   }
</style>
