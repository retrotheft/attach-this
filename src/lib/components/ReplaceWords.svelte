<script lang="ts">
   import { type Readable } from "svelte/store";
   import { type Snippet } from "svelte";

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
   let mutationObserver: MutationObserver | null = null;

   // Store original text content for each text node
   const originalTextMap = new WeakMap<Node, string>();

   // Get effective locale (with override support)
   const effectiveLocale = $derived.by(() => {
      const availableLocales = Object.keys(lookupTable);
      const overrideLocale = availableLocales.find(
         (loc) => booleans[loc] === true,
      );
      return overrideLocale || $locale;
   });

   // Check if we should skip processing a node
   // Check if we should skip processing a node
   function shouldSkipNode(node: Node): boolean {
      if (node.nodeType === Node.COMMENT_NODE) return true;

      if (node.nodeType === Node.ELEMENT_NODE) {
         const element = node as Element;
         // Skip nested localisation boundaries (but not our own container)
         if (element.classList.contains('localisation-boundary') && element !== container) {
            return true;
         }
      }

      // Check if this node is inside a nested localisation boundary
      let parent = node.parentElement;
      while (parent && parent !== container) {
         if (parent.classList.contains('localisation-boundary')) {
            return true;
         }
         parent = parent.parentElement;
      }

      return false;
   }

   // Capture original text and translate a text node
   function captureAndTranslateTextNode(textNode: Node): void {
      if (textNode.nodeType !== Node.TEXT_NODE) return;

      // Capture original if not already captured
      if (!originalTextMap.has(textNode)) {
         originalTextMap.set(textNode, textNode.textContent ?? "");
      }

      // Translate from original
      translateTextNode(textNode);
   }

   // Translate a single text node from its stored original (word by word)
   function translateTextNode(textNode: Node): void {
      const originalText = originalTextMap.get(textNode) ?? "";

      // Split into words, preserving whitespace
      const words = originalText.split(/(\s+)/);

      let translatedText = "";
      for (const word of words) {
         if (/^\s+$/.test(word)) {
            // Preserve whitespace as-is
            translatedText += word;
         } else {
            // Translate the word (convert to lowercase for lookup)
            const translated = lookupTable[effectiveLocale]?.[word.toLowerCase()] ?? word;
            translatedText += translated;
         }
      }

      textNode.textContent = translatedText;
   }

   // Recursively process nodes, capturing and translating text nodes
   function processNodes(nodes: NodeList | Node[]): void {
      for (const node of nodes) {
         if (shouldSkipNode(node)) continue;

         if (node.nodeType === Node.TEXT_NODE) {
            captureAndTranslateTextNode(node);
         } else if (
            node.nodeType === Node.ELEMENT_NODE ||
            node.nodeType === Node.DOCUMENT_FRAGMENT_NODE
         ) {
            // Recursively process child nodes
            processNodes(Array.from(node.childNodes));
         }
      }
   }

   // Initial scan and translation of existing DOM
   function initialScanAndTranslate(): void {
      if (!container) return;

      const start = performance.now();
      processNodes([container]);
      const end = performance.now();
      console.log("Initial word scan and translate completed in", `${end - start}ms`);
   }

   // Re-translate all captured text nodes (called on locale change)
   function retranslateAll(): void {
      if (!container) return;

      const start = performance.now();

      // Walk through all text nodes and re-translate from originals
      function walkAndTranslate(node: Node): void {
         if (shouldSkipNode(node)) return;

         if (node.nodeType === Node.TEXT_NODE) {
            if (originalTextMap.has(node)) {
               translateTextNode(node);
            }
         } else if (
            node.nodeType === Node.ELEMENT_NODE ||
            node.nodeType === Node.DOCUMENT_FRAGMENT_NODE
         ) {
            for (const child of Array.from(node.childNodes)) {
               walkAndTranslate(child);
            }
         }
      }

      walkAndTranslate(container);

      const end = performance.now();
      console.log("Re-translated all words in", `${end - start}ms`);
   }

   // Set up MutationObserver
   function setupMutationObserver(): void {
      if (!container) return;

      mutationObserver = new MutationObserver((mutations) => {
         const start = performance.now();

         for (const mutation of mutations) {
            if (mutation.type === 'childList') {
               // Process newly added nodes
               processNodes(Array.from(mutation.addedNodes));
            }
         }

         const end = performance.now();
         console.log("Processed word mutations in", `${end - start}ms`);
      });

      // Start observing
      mutationObserver.observe(container, {
         childList: true,
         subtree: true
      });

      console.log("Word MutationObserver started");
   }

   // Clean up MutationObserver
   function cleanupMutationObserver(): void {
      if (mutationObserver) {
         mutationObserver.disconnect();
         mutationObserver = null;
         console.log("Word MutationObserver stopped");
      }
   }

   // Set up observer and initial scan when container is available
   $effect(() => {
      if (!container) return;

      // Set up mutation observer
      setupMutationObserver();

      // Do initial scan and translation
      initialScanAndTranslate();

      // Cleanup on destroy
      return () => {
         cleanupMutationObserver();
      };
   });

   // Re-translate when locale changes
   $effect(() => {
      // This effect depends on effectiveLocale
      effectiveLocale;

      // Skip initial run (handled by the setup effect)
      if (!container || !mutationObserver) return;

      retranslateAll();
   });
</script>

<div bind:this={container} class="localisation-boundary">
   {@render children()}
</div>
