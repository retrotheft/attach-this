<script lang="ts">
   import { createFilter } from '$lib/index.js'

   const records = [
      { name: "Alice", age: 32 },
      { name: "Bob", age: 40 },
      { name: "Charlie", age: 18 },
      { name: "Dana", age: 21 },
      { name: "Eddie", age: 27 }
   ];

   const filter = createFilter(records)
</script>

<p>Easily filter any array with any input. Just match the input name to the array element key! Try it below:</p>

<table>
   <thead>
      <tr>
         <th>
            Name
         </th>
         <th>
            Age
         </th>
      </tr>
      <tr>
         <th>
            <input {...filter} name="name" onmousedown={(e) => e.stopPropagation()} />
         </th>
         <th>
            <input {...filter} name="age" onmousedown={(e) => e.stopPropagation()} />
         </th>
      </tr>
   </thead>
   <tbody>
      {#each $filter as record}
         <tr>
            <td>
               {record.name}
            </td>
            <td>
               {record.age}
            </td>
         </tr>
      {/each}
   </tbody>
</table>

<style>
   table {
      text-align: center;
   }

   input {
      max-width: 10ch;
   }
</style>
