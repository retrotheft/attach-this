<script lang="ts">
   import { hoverable } from '$lib/index.js'

   let clickCount = $state(0)
   let lastClicked = $state<string>("")

   function handleClick(elementName: string) {
      return (e: Event) => {
         clickCount++
         lastClicked = elementName
         console.log(`Clicked: ${elementName}`)
      }
   }
</script>

<main>
   <h1>Hoverable Test Suite</h1>
   <p>Testing the hoverable dollar store attachment with various elements and nested structures</p>

   <div class="container">
      <h3>Basic Hoverable Test</h3>
      <p>Simple elements that respond to hover</p>

      <div class="test-element basic" {...hoverable} onclick={handleClick('Basic Box')}>
         Basic hoverable box
      </div>

      <button class="test-element button" {...hoverable} onclick={handleClick('Button')}>
         Hoverable button
      </button>

      <div class="stats">
         <p>Currently hovering: {$hoverable ? `${$hoverable.tagName} (${$hoverable.className || 'no class'})` : "nothing"}</p>
         <p>Total clicks: {clickCount}</p>
         <p>Last clicked: {lastClicked || "nothing"}</p>
      </div>
   </div>

   <div class="container">
      <h3>Nested Hoverable Test</h3>
      <p>Testing event propagation and nested hover states</p>

      <section class="test-element nested-outer" {...hoverable} onclick={handleClick('Outer Section')}>
         Outer section (hoverable)
         <article class="nested-inner test-element" {...hoverable} onclick={handleClick('Inner Article')}>
            Inner article (also hoverable)
            <div class="nested-content test-element" {...hoverable} onclick={handleClick('Content Div')}>
               Content div (deeply nested hoverable)
            </div>
         </article>
      </section>
   </div>

   <div class="container">
      <h3>Multiple Independent Hovers</h3>
      <p>Multiple elements that can be hovered independently</p>

      <div class="grid">
         <div class="test-element grid-item" {...hoverable} onclick={handleClick('Grid Item 1')}>
            Grid Item 1
         </div>
         <div class="test-element grid-item" {...hoverable} onclick={handleClick('Grid Item 2')}>
            Grid Item 2
         </div>
         <div class="test-element grid-item" {...hoverable} onclick={handleClick('Grid Item 3')}>
            Grid Item 3
         </div>
         <div class="test-element grid-item" {...hoverable} onclick={handleClick('Grid Item 4')}>
            Grid Item 4
         </div>
      </div>
   </div>

   <div class="container">
      <h3>Reactive Store Test</h3>
      <p>Testing the store functionality and reactive updates</p>

      <div class="store-controls">
         <button onclick={() => hoverable.set(null)}>Clear hover (set null)</button>
         <button onclick={() => hoverable.update(current => current)}>Trigger update</button>
      </div>

      <div class="test-element reactive" {...hoverable} onclick={handleClick('Reactive Element')}>
         Reactive test element
         <br>
         <small>Store value: {$hoverable?.tagName || 'null'}</small>
      </div>
   </div>

   <div class="container">
      <h3>Style Classes Test</h3>
      <p>Testing automatic class application (.hovering class)</p>

      <div class="test-element fancy" {...hoverable} onclick={handleClick('Fancy Element')}>
         Fancy styled element
         <div class="hover-indicator">
            {#if $hoverable?.classList.contains('fancy')}
               🎯 Currently hovered!
            {:else}
               👋 Hover me!
            {/if}
         </div>
      </div>
   </div>
</main>

<style>
:global(body) {
background: #1a1a1a;
color: #e0e0e0;
margin: 0;
   font-family: system-ui, -apple-system, sans-serif;
}

main {
padding: 2rem;
   max-width: 800px;
   margin: 0 auto;
   background: #2a2a2a;
border-radius: 12px;
margin-top: 2rem;
box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

h1 {
   text-align: center;
color: #ffffff;
margin-bottom: 0.5rem;
}

main > p {
text-align: center;
color: #b0b0b0;
margin-bottom: 2rem;
}

.container {
border: 2px solid #444;
padding: 1rem;
   margin: 1rem 0;
   border-radius: 8px;
   background: #333;
}

.container h3 {
   margin-top: 0;
   color: #fff;
}

.container p {
color: #ccc;
}

.test-element {
margin: 0.5rem;
padding: 1rem;
border: 2px dashed #666;
border-radius: 4px;
   cursor: pointer;
   transition: all 0.2s ease;
   user-select: none;
position: relative;
}

.test-element:global(.hovering) {
   border-color: hotpink;
   background-color: #4a1a3a;
transform: scale(1.02);
box-shadow: 0 0 15px rgba(255, 105, 180, 0.3);
}

.test-element.basic {
   background: #1a2332;
   color: #64b5f6;
font-weight: 600;
border-color: #2196f3;
}

.test-element.button {
   background: #1b2e1b;
   color: #81c784;
border: 2px solid #4caf50;
font-weight: 500;
}

.test-element.nested-outer {
   background: #2e1f0a;
   color: #ffb74d;
min-height: 120px;
border-color: #ff9800;
}

.test-element.nested-inner {
   background: #2a1a2e;
   color: #ce93d8;
margin: 1rem;
min-height: 80px;
border-color: #9c27b0;
}

.test-element.nested-content {
background: #0a2e2a;
color: #80cbc4;
margin: 1rem;
min-height: 40px;
   border-color: #009688;
}

.grid {
display: grid;
   grid-template-columns: repeat(2, 1fr);
   gap: 1rem;
   margin: 1rem 0;
}

.grid-item {
   background: #3a1a2e;
   color: #f48fb1;
text-align: center;
font-weight: 500;
border-color: #e91e63;
}

.test-element.reactive {
   background: #2e1a3a;
   color: #ce93d8;
font-weight: 500;
border-color: #9c27b0;
}

.test-element.fancy {
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
font-weight: bold;
   text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
   border-color: #8e24aa;
}

.test-element.fancy:global(.hovering) {
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
box-shadow: 0 8px 16px rgba(0,0,0,0.4), 0 0 20px rgba(255, 105, 180, 0.4);
}

.hover-indicator {
   margin-top: 0.5rem;
   font-size: 1.2em;
}

.stats {
      background: #444;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
      font-family: 'Monaco', 'Menlo', monospace;
      border: 1px solid #666;
   }
   
   .stats p {
      margin: 0.25rem 0;
      color: #e0e0e0;
   }
   
   .store-controls {
      margin: 1rem 0;
      display: flex;
      gap: 1rem;
   }
   
   .store-controls button {
      padding: 0.5rem 1rem;
      border: 1px solid #666;
      border-radius: 4px;
      background: #555;
      color: #e0e0e0;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
   }
   
   .store-controls button:hover {
      background: #666;
      border-color: #888;
      transform: translateY(-1px);
   }
</style>
