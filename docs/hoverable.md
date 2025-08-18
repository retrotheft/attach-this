# Hoverable Dollar Store

The hoverable dollar store provides a reactive way to track which element is currently being hovered, with automatic CSS class management and full Svelte store integration.

## 🎯 Features

- **Reactive Store** - Full Svelte store compatibility with `$hoverable` syntax
- **Automatic Classes** - Applies `.hovering` class to the currently hovered element
- **Event Propagation** - Correctly handles nested hoverable elements
- **Manual Control** - Programmatic control via `set()` and `update()` methods
- **TypeScript Support** - Full type safety with proper element typing

## 📦 Installation

```bash
npm install attach-this
```

## 🚀 Basic Usage

```svelte
<script>
   import { hoverable } from 'attach-this'
</script>

<!-- Spread the hoverable store on any element -->
<div {...hoverable}>
   Hover me!
</div>

<!-- Access the currently hovered element -->
<p>Hovering: {$hoverable?.tagName || 'nothing'}</p>

<style>
   /* Automatically applied when hovering */
   div:global(.hovering) {
      background: hotpink;
      transform: scale(1.05);
   }
</style>
```

## 🔧 Advanced Usage

### Multiple Elements

```svelte
<script>
   import { hoverable } from 'attach-this'
</script>

<!-- Multiple independent hoverable elements -->
<div {...hoverable}>Element 1</div>
<div {...hoverable}>Element 2</div>
<div {...hoverable}>Element 3</div>

<!-- Display current hover state -->
<p>Currently hovering: {$hoverable ? `${$hoverable.tagName} (${$hoverable.textContent})` : "nothing"}</p>
```

### Programmatic Control

```svelte
<script>
   import { hoverable } from 'attach-this'
   
   function clearHover() {
      hoverable.set(null)
   }
   
   function setSpecificElement() {
      const element = document.querySelector('.target')
      hoverable.set(element)
   }
   
   // React to hover changes
   $effect(() => {
      if ($hoverable) {
         console.log(`Now hovering: ${$hoverable.tagName}`)
      }
   })
</script>

<div {...hoverable} class="target">Target element</div>

<button onclick={clearHover}>Clear hover</button>
<button onclick={setSpecificElement}>Set target</button>
```

## 📋 API Reference

### Interface

```typescript
interface HoverableStore {
   // Store methods
   subscribe: (callback: (value: Element | null) => void) => () => void
   set: (newValue: Element | null) => void
   update: (fn: (current: Element | null) => Element | null) => void
   
   // Event handlers for spreading
   onmouseover: (e: MouseEvent) => void
   onmouseout: (e: MouseEvent) => void
   onclick: (e: MouseEvent) => void
   
   // Svelte 5 attachment
   [Symbol]: Attachment<HTMLElement>
}
```

## 🔍 Troubleshooting

**Hover state gets stuck:**
- Call `hoverable.set(null)` to clear the state
- Check for JavaScript errors preventing event handlers

**Classes not applying:**
- Verify CSS selector syntax: `.element:global(.hovering)`
- Check CSS specificity conflicts
