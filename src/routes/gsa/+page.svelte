<script lang="ts">
   import { createReplaceStore } from "$lib/stores/replace.js";
   import languages from '../_scripts/languages.js'

   const loc = createReplaceStore(languages)

   $loc = 'en'
</script>

<loc.letters>
   Hello there
</loc.letters>

<loc.letters en>
   <button onclick={() => $loc = 'en'}>English</button>
</loc.letters>

<loc.letters gsa>
   <button onclick={() => $loc = 'gsa'}>GSA</button>
</loc.letters>
