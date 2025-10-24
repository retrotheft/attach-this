import RangeInput from '$lib/components/RangeInput.svelte'
import { withProps } from '$lib/functions/withProps.js'
import { type Component } from 'svelte'

type InputProps = {
   type: 'range'
   min: number
   max: number
   step: number
   value: number
   oninput: (e: Event) => void
}

type Options = {
   min: number
   max: number
   step: number
   value: number
   label?: string
}

export type Range = {
   input: Component<any>
   slider: Component<any>
   inputProps: InputProps
   style: (property: string) => (element: Element) => void
   subscribe: (callback: (value: number) => void) => () => void
   set: (newValue: number) => void
   update: (fn: (current: number) => number) => void,
}

export function createRange(options: Options): Range {
   let value = $state(options.value)
   const subscribers = new Set<(value: number) => void>()

   function notifySubscribers(): void {
      subscribers.forEach(callback => callback(value))
   }

   function oninput(e: Event) {
      const target = e.target as HTMLInputElement
      value = Number(target.value)
      notifySubscribers()
   }

   const store = {
      subscribe: (callback: (value: number) => void) => {
         subscribers.add(callback)
         callback(value)
         return () => subscribers.delete(callback)
      },
      set: (newValue: number) => {
         value = newValue
         notifySubscribers()
      },
      update: (fn: (current: number) => number) => {
         value = fn(value)
         notifySubscribers()
      }
   }

   const styleFactory = (property: string) => (element: Element) => {
      if (element instanceof HTMLElement) {
         element.style.setProperty(property, String(value))
      }
   }

   return {
      ...store,
      style: styleFactory,
      get inputProps() {
         return {
            type: 'range' as const,
            min: options.min || 0,
            max: options.max || 10,
            step: options.step || 1,
            value,
            oninput
         }
      },
      get input() {
         return withProps(RangeInput, {
            range: this
         })
      },
      get slider() {
         return this.input
      },
   }
}
