<script lang="ts">
   import { validate } from '$lib/index.js'
   import { z } from 'zod'

   const personSchema = z.object({
      name: z.string().min(1, "Name cannot be empty").trim(),
      age: z.number().int().min(0, "Age cannot be negative").max(150, "Age cannot exceed 150")
   })

   type PersonSchema = z.infer<typeof personSchema>

   const data = $state<PersonSchema>({
      name: '',
      age: 0
   })

   const validator = validate(personSchema)

   async function onsubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
      event.preventDefault()
      const form = event.currentTarget
      if (form.dataset.valid === 'true') {
         console.log("Success:", $state.snapshot(data))
      }
   }
</script>

<form {@attach validator(data)} {onsubmit}>
   <div>
      <label for="name">Name</label>
      <input name="name" type="text" bind:value={data.name} onmousedown={(e) => e.stopPropagation()} />
   </div>
   <div>
      <label for="age">Age</label>
      <input name="age" type="number" bind:value={data.age} onmousedown={(e) => e.stopPropagation()} />
   </div>
   <button type="submit">Add Person</button>
</form>

<style>
   div {
      display: grid;
      gap: 0.25em;
      margin-bottom: 2em;
      position: relative;
   }

   form {
      display: inline-grid;
      padding: 1em;
      background-color: rgba(0,0,0,0.75);
   }

   input {
      min-width: 20ch;
   }

   :global(div[data-error]::after) {
      content: attr(data-error);
      position: absolute;
      top: 100%;
      left: 0;
      display: block;
      color: lightcoral;
      font-size: 0.75rem;
      margin-top: 0.25em;
   }

   :global(div[data-error]) input {
      background-color: lightcoral;
   }
</style>
