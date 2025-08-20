<script lang="ts" module>
   import { type Snippet } from "svelte";

   export function extract(children: Snippet): string[] {
      let result: Node | DocumentFragment | null = null;
      // @ts-expect-error Not sure how to fix this yet.
      children({ before: (nodeOrFragment) => (result = nodeOrFragment) });

      if (!result) {
         return [];
      }

      const node = result as Node;
      const textKeys: string[] = [];

      function extractTextFromNode(n: Node): void {
         if (n.nodeType === Node.TEXT_NODE) {
            const textContent = n.textContent ?? "";
            const keys = textContent
               .trim()
               .split(/\s+/)
               .filter((key) => key.length > 0);
            textKeys.push(...keys);
         } else if (
            n.nodeType === Node.ELEMENT_NODE ||
            n.nodeType === Node.DOCUMENT_FRAGMENT_NODE
         ) {
            // Recursively extract from all child nodes
            for (const child of n.childNodes) {
               extractTextFromNode(child);
            }
         }
      }

      extractTextFromNode(node);
      return textKeys;
   }
</script>

<script lang="ts">
   import { type Readable } from "svelte/store";

   let {
      lookupTable,
      locale,
      children,
      ...booleans
   }: {
      lookupTable: Record<string, Record<string, string>>;
      locale: Readable<string>;
      children: Snippet;
      [key: string]: any;
   } = $props();

   let container: HTMLElement;

   // Get effective locale (with override support)
   const effectiveLocale = $derived.by(() => {
      const availableLocales = Object.keys(lookupTable);
      const overrideLocale = availableLocales.find(
         (loc) => booleans[loc] === true,
      );
      return overrideLocale || $locale;
   });

   // Extract and translate text whenever locale changes
   $effect(() => {
      if (!container) return;

      const textKeys = extract(children);
      const translations = textKeys.map(
         (key) => lookupTable[effectiveLocale]?.[key] ?? key,
      );

      // Replace text in DOM
      let keyIndex = 0;
      function replaceTextInNode(node: Node): void {
         if (node.nodeType === Node.TEXT_NODE) {
            const textContent = node.textContent ?? "";
            const keys = textContent
               .trim()
               .split(/\s+/)
               .filter((key) => key.length > 0);

            if (keys.length > 0 && keyIndex < translations.length) {
               node.textContent = translations[keyIndex];
               keyIndex++;
            }
         } else {
            for (const child of Array.from(node.childNodes)) {
               replaceTextInNode(child);
            }
         }
      }

      replaceTextInNode(container);
   });
</script>

<div bind:this={container}>
   {@render children()}
</div>
