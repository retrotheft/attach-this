<script lang="ts" module>
   import { type Snippet } from "svelte";

   export function extract(children: Snippet): string[] {
      let result: Node | DocumentFragment | null = null;
      // @ts-expect-error Not sure how to fix this yet.
      children({ before: (nodeOrFragment) => (result = nodeOrFragment) });

      if (!result) {
         return [];
      }
      return result
   }

   function removeWhitespaceNodes(fragment) {
      const walker = document.createTreeWalker(
         fragment,
         NodeFilter.SHOW_TEXT,
         null,
         false,
      );

      const nodesToRemove = [];
      let node;

      while ((node = walker.nextNode())) {
         // Check if this text node contains only whitespace
         if (/^\\s*$/.test(node.textContent)) {
            // Check if this whitespace is between block elements or at start/end
            const parent = node.parentNode;
            const prevSibling = node.previousSibling;
            const nextSibling = node.nextSibling;

            // Remove if:
            // 1. It's between two element nodes (not inline text)
            // 2. It's at the start or end of a parent element
            // 3. The parent is a block-level element
            if (
               (!prevSibling || prevSibling.nodeType === Node.ELEMENT_NODE) &&
               (!nextSibling || nextSibling.nodeType === Node.ELEMENT_NODE)
            ) {
               nodesToRemove.push(node);
            }
            // Also remove if parent is a known block element and this is just formatting
            else if (isBlockElement(parent)) {
               nodesToRemove.push(node);
            }
         }
      }

      // Remove the nodes (done separately to avoid interfering with tree walker)
      nodesToRemove.forEach((node) => {
         if (node.parentNode) {
            node.parentNode.removeChild(node);
         }
      });

      return fragment;
   }

   function isBlockElement(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;

      const blockElements = new Set([
         "div",
         "p",
         "h1",
         "h2",
         "h3",
         "h4",
         "h5",
         "h6",
         "ul",
         "ol",
         "li",
         "section",
         "article",
         "header",
         "footer",
         "main",
         "nav",
         "aside",
         "blockquote",
      ]);

      return blockElements.has(element.tagName.toLowerCase());
   }
</script>

<script lang="ts">
   let { children }: { children: Snippet } = $props()

   let template = $state<HTMLTemplateElement>()

   const fragment = extract(children)
   console.log(fragment)

   const cleanFragment = removeWhitespaceNodes(fragment)

   function appendFragment(div: HTMLDivElement) {
      div.appendChild(cleanFragment)
      console.log(cleanFragment)
   }
</script>

<div use:appendFragment></div>

<style>
   div {
      display: contents;
   }
</style>
