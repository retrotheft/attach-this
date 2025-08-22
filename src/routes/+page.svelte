<script lang="ts">
   import FeatureTab from "./_components/demo/FeatureTab.svelte";
   import CodeViewer from "./_components/demo/CodeViewer.svelte";
   import Replace from "./_components/demo/Replace.svelte";
   import Filter from "./_components/demo/Filter.svelte";
   import Hover from "./_components/demo/Hover.svelte";
   import Move from "./_components/demo/Move.svelte";
   import move from "./_content/move.txt?raw";
   import hover from "./_content/hover.txt?raw";
   import filter from "./_content/filter.txt?raw";
   import svelte from "./_scripts/svelte.js";
   import replace from "./_content/replace.txt?raw";
   import { hoverable } from "$lib/index.js";
   import { loc } from "./+page/Module.svelte";
   import Sponsored from './_components/Sponsored.svelte'

   const codeLookup: Record<string, string> = {
      move,
      hover,
      filter,
      replace,
      help: "To begin, pull out a feature tab!",
   };

   let code = $state<string>(codeLookup.help);

   $effect(() => {
      const codeKey = $hoverable?.id ?? "help";
      if ($hoverable && $hoverable.classList.contains("active"))
         code = codeLookup[codeKey];
   });

   // const code = $derived(
   //    codeLookup[$hoverable?.id ?? "help"] ?? "Not implemented yet",
   // );

   hljs.registerLanguage("svelte", svelte);

   // const loc = createReplaceStore(languages)
   $loc = "en";

   let test = $state(true)
</script>

<loc.letters>
   <main>
      <h1>attach-this</h1>
      <p>ergonomic everyday helpers for Svelte</p>
      <div id="code-viewer-container">
         <CodeViewer {code} />
         <div id="feature-tab-list">
            <FeatureTab title="move">
               <Move />
            </FeatureTab>
            <FeatureTab title="hover">
               <Hover />
            </FeatureTab>
            <FeatureTab title="filter">
               <Filter />
            </FeatureTab>
            <FeatureTab title="replace">
               <Replace />
            </FeatureTab>
         </div>
      </div>

   </main>
</loc.letters>

         <Sponsored />
<style>
   main {
      display: grid;
      position: relative;
   }

   p {
      margin-top: 0;
      margin-bottom: 3em;
      margin-left: 0.5ch;
      font-size: 1.2rem;
      font-weight: 500;
      color: #ddd;
   }

   div {
      display: grid;
      gap: 1em;
   }

   div#code-viewer-container {
      position: relative;
      min-height: 20rem;
   }

   div#feature-tab-list {
      position: absolute;
      left: -10ch;
      z-index: 1;
      display: grid;
      justify-items: start;
   }
</style>
