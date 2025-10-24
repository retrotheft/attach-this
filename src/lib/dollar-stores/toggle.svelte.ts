import ToggleButton from '$lib/components/ToggleButton.svelte'
import { withProps } from '$lib/functions/withProps.js'
import { type Component } from 'svelte'

export type Toggle = {
   button: Component<any>
   class: (cls: string) => (element: Element) => void,
   style: (property: string) => (element: Element) => void
   verb: string,
   onclick: { onclick: () => void },
   switch: () => void
   subscribe: (callback: (value: boolean) => void) => () => void;
   set: (newValue: boolean) => void;
   update: (fn: (current: boolean) => boolean) => void;
}

export function createToggle(trueVerb: string, falseVerb: string, isTrue = false): Toggle {
   let value = $state(isTrue);
   const verb = $derived(value ? trueVerb : falseVerb)
   const subscribers = new Set<(value: boolean) => void>()

   function notifySubscribers(): void {
     subscribers.forEach(callback => callback(value));
   }

   function onclick() {
      value = !value
      notifySubscribers()
   }

   const store = {
      subscribe: (callback: (value: boolean) => void) => {
         subscribers.add(callback)
         callback(value)
         return () => subscribers.delete(callback)
      },
      set: (newValue: boolean) => {
         value = newValue
         notifySubscribers()
      },
      update: (fn: (currentValue: boolean) => boolean) => {
         value = fn(value)
         notifySubscribers()
      }
   }

   const classFactory = (cls: string) => (element: Element) => {
      value ? element.classList.add(cls) : element.classList.remove(cls)
   }

   const styleFactory = (property: string) => (element: Element) => {
      if (element instanceof HTMLElement) {
         element.style.setProperty(property, String(value))
      }
   }

   return {
      ...store,
      class: classFactory,
      style: styleFactory,
      switch: onclick,
      onclick: { onclick },
      get verb() { return verb },
      get button() {
         return withProps(ToggleButton, { toggle: this })
      },
   }
}
