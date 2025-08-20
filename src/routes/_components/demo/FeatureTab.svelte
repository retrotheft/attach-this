<script lang="ts">
   import { movable } from '$lib/index.js'
   import { hoverable } from "$lib/index.js";
   import { type Snippet } from 'svelte'

   let { children, title }: { children: Snippet, title: string } = $props()

   let active = $state(false)

   function detectPull(element: HTMLDivElement) {
      const grandparent = element.parentNode?.parentNode as HTMLElement;

      const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
            if (entry.intersectionRatio === 0) {
               active = true;
            } else if (active && entry.intersectionRatio > 0.75) {
               active = false;
            }
         });
      }, {
         root: grandparent,
         threshold: [0, 0.75, 1]
      });

      observer.observe(element);

      return {
         destroy() {
            observer.disconnect();
         }
      };
   }
</script>

<div class:active id={title} class={`interactive movable hoverable`} {...hoverable} {...movable} {@attach detectPull}>
   <h2>{title}</h2>
   {#if active}
      {@render children?.()}
   {/if}
</div>
