<script lang="ts">
   import { type Readable } from "svelte/store";
   import { type Snippet } from "svelte";
   import { ReplaceUtility, getEffectiveLocale, translateStrategies } from '$lib/utils/replace-utilities.js';

   let {
      lookupTable,
      locale,
      strategy = 'words',
      children,
      ...booleans
   }: {
      lookupTable: Record<string, Record<string, string>>;
      locale: Readable<string>;
      strategy?: 'letters' | 'textNodes' | 'words';
      children: Snippet;
      [key: string]: any;
   } = $props();

   let container: HTMLElement;
   let replaceUtility: ReplaceUtility | null = null;

   // Store original text content for each text node - this persists across effect runs!
   const originalTextMap = new WeakMap<Node, string>();

   // Get effective locale (with override support)
   const effectiveLocale = $derived.by(() => {
      return getEffectiveLocale(lookupTable, $locale, booleans);
   });

   // Set up utility and initial scan when container is available
   $effect(() => {
      if (!container) return;

      console.log("Replace Any setup effect", {...booleans})

      replaceUtility = new ReplaceUtility({
         container,
         lookupTable,
         effectiveLocale,
         translateFunction: translateStrategies[strategy],
         logPrefix: strategy.charAt(0).toUpperCase() + strategy.slice(1),
         originalTextMap // Pass the persistent map
      });

      replaceUtility.setupMutationObserver();
      replaceUtility.initialScanAndTranslate();

      return () => {
         if (replaceUtility) {
            replaceUtility.cleanupMutationObserver();
         }
      };
   });

   // Re-translate when locale changes
   $effect(() => {
      // This effect depends on effectiveLocale
      effectiveLocale;
      console.log("Replace Any re-translate effect", {...booleans})

      // Skip initial run (handled by the setup effect)
      if (!replaceUtility || !container) return;

      replaceUtility.updateConfig(lookupTable, effectiveLocale);
      replaceUtility.retranslateAll();
   });
</script>

<div bind:this={container} class="localisation-boundary">
   {@render children()}
</div>
