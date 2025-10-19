# Attach This

A collection of ergonomic everyday helpers for Svelte 5. ✨

## Installation

```bash
npm install attach-this
```

## Philosophy

These lightweight, easy to use helpers combine spreadable event handlers and attachments with reactive stores. Each one follows the same pattern and can be:

- **Spread** onto elements: `<div {...helper}>`
- **Subscribed to** as Svelte stores: `$helper`

The store properties are added using `Object.defineProperty`, which means that spread will not enumerate over them so they don't get added to elements; only the event listeners and the attachments do.

## Movable

Easily makes elements movable and tracks z-indexes to keep recent items on top. You can spread the event listeners and attachment onto the element with `{...movable}` and then access the current state with `$movable`.

### Usage

```svelte
<script>
   import { movable } from 'attach-this'
</script>

<div {...movable}>
   <!-- $movable is either null or { activeElement, x, y } -->
</div>
```

## Hoverable

Tracks which element is currently being hovered and automatically applies a `hovering` CSS class. Also prevents parents of hovered children from also being in a hover state.

### Usage

```svelte
<script>
   import { hoverable } from 'attach-this'
</script>

<div {...hoverable}>
   <!-- $hoverable contains the currently hovered element or null -->
</div>

<style>
   .hovering {
      background-color: #f0f0f0;
      transform: scale(1.02);
   }
</style>
```

## Filter

**Filter must be created by passing the array you wish to filter to `createFilter`. The array should contain objects with string keys.**

Filters a given array using inputs whose name match the array elements' keys. First, create the store with `createFilter` and then spread it onto inputs, and access the filtered array with $ syntax.

### Usage

```svelte
<script>
   import { createFilter } from 'attach-this'

   const records = [
      { name: "Alice", age: 32 },
      { name: "Bob", age: 40 },
      { name: "Charlie", age: 18 },
      { name: "Dana", age: 21 },
      { name: "Eddie", age: 27 }
   ];

   const filter = createFilter(records)
</script>

<input {...filter} name="name" type="text" placeholder="Filter by name" />
<input {...filter} name="age" type="number" placeholder="Filter by age" />

<ul>
   {#each $filter as record}
      <li>{record.name} is {record.age}</li>
   {/each}
</ul>
```

## Validate

Validates any `StandardSchemaV1` schema.

### Usage

```svelte
<script>
   import { validate } from "attach-this"
   import { z } from 'zod' // any StandardSchemaV1 will do!

   const personSchema = z.object({
      name: z.string().min(1, "Name cannot be empty").trim(),
      age: z.number()
         .int()
         .min(0, "Age cannot be negative")
         .max(150, "Age cannot exceed 150")
   })

   const data = $state({
      name: '',
      age: 0
   })

   const validator = validate(personSchema)
</script>

<form {@attach validator(data)} {onsubmit}>
   <!-- inputs must be wrapped in divs because
        <input> can't have pseudo-elements -->
   <div>
      <label for="name">Name</label>
      <input name="name" type="text" bind:value={data.name} />
   </div>
   <div>
      <label for="age">Age</label>
      <input name="age" type="number" bind:value={data.age} />
   </div>
   <button type="submit">Add Person</button>
</form>

<style>
   /* access error messages on pseudo-elements */
   div[data-error]::before, div[data-error]::after {
      content: attr(data-error);
   }

   /*
   you may need to wrap those selectors
   with :global() since they won't be
   present at compile time.

   Alternatively, put the css in an external file.
   */
</style>
```

## Replace

Dynamic text replacement system that can swap out content based on lookup tables and locales. Can replace by letter, word or text node.

### Usage

```svelte
<script>
   import { createReplaceStore } from 'attach-this'

   const lookupTable = {
      en: {
         welcome_text: "Welcome",
         greeting_message: "How are you today?",
      },
      fr: {
         welcome_text: "Bienvenue",
         greeting_message: "Comment allez-vous aujourd'hui?",
      }
   }

   const replace = createReplaceStore(lookupTable)

   $replace = 'en' // Set current locale
</script>

<replace.text>
   <h2>welcome_text</h2>
   <p>greeting_message</p>
</replace.text>

<!-- Force specific locale -->
<replace.text fr>
   <h2>welcome_text</h2>
   <p>greeting_message</p>
</replace.text>
```
