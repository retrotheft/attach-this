import ReplaceTextNodes from "$lib/components/ReplaceTextNodes.svelte";
import ReplaceLetters from "$lib/components/ReplaceLetters.svelte";
import { writable } from 'svelte/store';
import { type Component } from "svelte"
import ReplaceWords from "$lib/components/ReplaceWords.svelte";
import ReplaceAny from "$lib/components/ReplaceAny.svelte";

export function withProps(Component: Component<any>, defaultProps: Record<string, any>) {
   return function ($$anchor: any, $$props: any) {
      const mergedProps = { ...defaultProps, ...$$props };
      return Component($$anchor, mergedProps);
   };
}

export function createReplaceStore(lookupTable: Record<string, Record<string, string>>) {
   const { subscribe, set, update } = writable('en');

   return {
      // Store methods
      subscribe,
      set,
      update,

      // Component getter with injected props - now reactive!
      // get text() {
      //    return withProps(ReplaceTextNodes, { lookupTable, locale: { subscribe } });
      // },

      // get words() {
      //    return withProps(ReplaceWords, { lookupTable, locale: { subscribe } });
      // },

      // get letters() {
      //    return withProps(ReplaceLetters, { lookupTable, locale: { subscribe } })
      // }

      get text() {
         return withProps(ReplaceAny, { lookupTable, locale: { subscribe }, strategy: 'textNodes' });
      },
      get words() {
         return withProps(ReplaceAny, { lookupTable, locale: { subscribe }, strategy: 'words' });
      },
      get letters() {
         return withProps(ReplaceAny, { lookupTable, locale: { subscribe }, strategy: 'letters' });
      }
   };
}
