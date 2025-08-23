import { writable } from 'svelte/store';
import { type Component } from "svelte"
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
      subscribe,
      set,
      update,

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
