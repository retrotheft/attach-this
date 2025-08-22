<script lang="ts" module>
   import { createReplaceStore } from "$lib/stores/replace.js";
   import languages from "../_scripts/languages.js";

   export const loc = createReplaceStore(languages)
</script>
