<script lang="ts">
   import { createLocalisationStore } from "$lib/stores/localise.js";

   const lookupTable = {
      en: {
         welcome_text: "Welcome",
         greeting_message: "How are you today?",
      },
      fr: {
         welcome_text: "Bienvenue",
         greeting_message: "Comment allez-vous aujourd'hui?",
      }
   }

   const loc = createLocalisationStore(lookupTable)

   $loc = 'en'
</script>

<loc.text>
   <h2>welcome_text</h2>
   <p>greeting_message</p>
</loc.text>

<loc.text en>
   <h2>welcome_text</h2>
   <p>greeting_message</p>
</loc.text>

<loc.text fr>
   <h2>welcome_text</h2>
   <p>greeting_message</p>
</loc.text>

<button onclick={() => $loc = 'en'}>English</button>
<button onclick={() => $loc = 'fr'}>French</button>
