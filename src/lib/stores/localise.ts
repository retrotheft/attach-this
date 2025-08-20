import LocalisedText from "$lib/components/LocalisedText.svelte";
import { writable } from 'svelte/store';
import { type Component } from "svelte"

export function withProps(Component: Component<any>, defaultProps: Record<string, any>) {
   return function ($$anchor: any, $$props: any) {
      const mergedProps = { ...defaultProps, ...$$props };
      return Component($$anchor, mergedProps);
   };
}


export function createLocalisationStore(lookupTable: Record<string, Record<string, string>>) {
  const { subscribe, set, update } = writable('en');

  return {
    // Store methods
    subscribe,
    set,
    update,

    // Component getter with injected props - now reactive!
    get text() {
      return withProps(LocalisedText, { lookupTable, locale: { subscribe } });
    }
  };
}
