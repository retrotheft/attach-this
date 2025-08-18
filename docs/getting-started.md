# Getting Started

Welcome to attach-this! This guide will help you get up and running with ergonomic everyday helpers for Svelte 5.

## 📦 Installation

```bash
npm install attach-this
```

**Requirements:**
- Svelte 5.0 or higher
- TypeScript 5.0+ (recommended)

## 🚀 Quick Start

### 1. Basic Hoverable

```svelte
<script>
   import { hoverable } from 'attach-this'
</script>

<div {...hoverable}>
   Hover me! Currently hovering: {$hoverable?.tagName || 'nothing'}
</div>

<style>
   div:global(.hovering) {
      background: hotpink;
      transform: scale(1.05);
   }
</style>
```

### 2. Basic Drag & Drop

```svelte
<script>
   import { createDnd } from 'attach-this'
   
   const dnd = createDnd()
   
   let dropCount = $state(0)
   
   const itemData = () => "Hello World"
   itemData.drop = () => {
      dropCount++
      console.log("Item dropped!")
   }
</script>

<div {@attach dnd.draggable(itemData)}>
   Drag me!
</div>

<div {@attach dnd.dropzone()}>
   Drop here (drops: {dropCount})
</div>
```

### 3. Drag & Drop with Ghost

```svelte
<script>
   import { createDnd } from 'attach-this'
   import { createGhostMiddleware } from 'attach-this'
   
   const dnd = createDnd()
   dnd.use(createGhostMiddleware())
   
   // Create custom ghost
   const ghost = document.createElement('div')
   ghost.style.cssText = `
      background: #ff5722;
      color: white;
      padding: 0.5rem;
      border-radius: 4px;
   `
   
   const itemData = () => "Ghost Item"
   itemData.ghost = ghost
   itemData.dragstart = () => {
      ghost.textContent = '👻 Dragging!'
   }
</script>

<div {@attach dnd.draggable(itemData)}>
   Drag me (with ghost) 👻
</div>
```

### 4. Validation with Visual Feedback

```svelte
<script>
   import { createDnd } from 'attach-this'
   import { createValidationMiddleware, classes } from 'attach-this'
   
   const dnd = createDnd()
   const validation = createValidationMiddleware()
   dnd.use(validation.middleware)
   
   const validate = (dataCallback) => {
      const data = dataCallback()
      if (data === "forbidden") return // Invalid
      
      return () => {
         console.log(`Dropped: ${data}`)
         return true
      }
   }
   
   // Add visual classes
   const setupClasses = classes('valid', 'invalid')
   setupClasses(validate)
   
   const allowedData = () => "allowed"
   const forbiddenData = () => "forbidden"
</script>

<div {@attach dnd.draggable(allowedData)}>✅ Allowed</div>
<div {@attach dnd.draggable(forbiddenData)}>❌ Forbidden</div>

<div {@attach validation.validatingDropzone(dnd, validate)}>
   Smart Drop Zone
</div>

<style>
   div:global(.valid) {
      background: #c8e6c9;
      border: 2px solid #4caf50;
   }
   
   div:global(.invalid) {
      background: #ffcdd2;
      border: 2px solid #f44336;
   }
</style>
```

## 🎯 Key Concepts

### Attachments vs Actions

attach-this uses Svelte 5's new attachment system instead of actions:

```svelte
<!-- ❌ Old Svelte 4 action syntax -->
<div use:someAction={params}>Content</div>

<!-- ✅ New Svelte 5 attachment syntax -->
<div {@attach someAttachment}>Content</div>
<div {...spreadableAttachment}>Content</div>
```

### Dollar Store Pattern

The hoverable export is both a store and an attachment:

```svelte
<script>
   import { hoverable } from 'attach-this'
   
   // Use as store
   $effect(() => {
      console.log('Hovering:', $hoverable)
   })
   
   // Use as attachment
</script>

<div {...hoverable}>Hover me</div>
```

### Isolated DND Instances

Create separate DND contexts for different parts of your app:

```svelte
<script>
   const filesDnd = createDnd()
   const tasksDnd = createDnd()
   
   // They don't interfere with each other
</script>
```

### Middleware Composition

Build complex functionality by combining middleware:

```svelte
<script>
   const dnd = createDnd()
   dnd.use(createGhostMiddleware())      // Add ghosts
   dnd.use(validation.middleware)        // Add validation
   dnd.use(customLoggingMiddleware)      // Add logging
</script>
```

## 🛠️ Common Patterns

### Reactive Data

```svelte
<script>
   let items = $state(['Apple', 'Banana', 'Cherry'])
   let selectedIndex = $state(0)
   
   // Data callback can be reactive
   const itemData = () => items[selectedIndex]
</script>

{#each items as item, index}
   <div 
      {@attach dnd.draggable(itemData)}
      onclick={() => selectedIndex = index}
      class:selected={selectedIndex === index}
   >
      {item}
   </div>
{/each}
```

### Conditional Behavior

```svelte
<script>
   let isAdminMode = $state(false)
   
   const validate = (dataCallback) => {
      const data = dataCallback()
      
      // Admin can drop anything
      if (isAdminMode) {
         return () => {
            handleAdminDrop(data)
            return true
         }
      }
      
      // Regular validation
      if (data.type !== 'allowed') return
      
      return () => {
         handleRegularDrop(data)
         return true
      }
   }
</script>
```

### Nested Hovers

```svelte
<script>
   import { hoverable } from 'attach-this'
</script>

<!-- Event propagation handled automatically -->
<section {...hoverable} class="outer">
   Outer
   <article {...hoverable} class="inner">
      Inner (stops propagation)
   </article>
</section>

<style>
   .outer:global(.hovering) { border: 2px solid blue; }
   .inner:global(.hovering) { border: 2px solid red; }
</style>
```

## 🎨 Styling Best Practices

### Use :global() for Automatic Classes

```css
/* For hoverable */
.element:global(.hovering) {
   background: hotpink;
}

/* For validation */
.dropzone:global(.valid) {
   border-color: green;
}
.dropzone:global(.invalid) {
   border-color: red;
}
```

### Transitions and Animations

```css
.draggable {
   cursor: grab;
   transition: all 0.2s ease;
}

.draggable:active {
   cursor: grabbing;
   transform: scale(0.95);
}

.dropzone:global(.valid) {
   background: #e8f5e8;
   transform: scale(1.05);
   transition: all 0.3s ease;
}
```

### Ghost Element Styling

```javascript
const ghost = document.createElement('div')
ghost.style.cssText = `
   background: linear-gradient(45deg, #667eea, #764ba2);
   color: white;
   padding: 1rem;
   border-radius: 8px;
   box-shadow: 0 8px 25px rgba(0,0,0,0.3);
   font-weight: 600;
   pointer-events: none;
   z-index: 9999;
`
```

## 🚨 Common Pitfalls

### 1. Creating Ghosts in Reactive Statements

```svelte
<script>
   // ❌ Don't do this - creates new ghost every time
   $: {
      const ghost = document.createElement('div')
      itemData.ghost = ghost
   }
   
   // ✅ Do this - create once, update content
   const ghost = document.createElement('div')
   itemData.ghost = ghost
   
   itemData.dragstart = () => {
      ghost.textContent = data.name // Update content
   }
</script>
```

### 2. Forgetting to Add Middleware

```svelte
<script>
   const dnd = createDnd()
   // ❌ Forgot to add ghost middleware
   
   const itemData = () => "data"
   itemData.ghost = ghostElement // Won't work!
   
   // ✅ Add middleware first
   dnd.use(createGhostMiddleware())
</script>
```

### 3. Using Regular Dropzone with Validation

```svelte
<script>
   // ❌ Won't validate
   <div {@attach dnd.dropzone(callbacks)}>Drop here</div>
   
   // ✅ Use validating dropzone
   <div {@attach validation.validatingDropzone(dnd, validate)}>Drop here</div>
</script>
```

### 4. Incorrect CSS Selector Syntax

```css
/* ❌ Wrong - missing :global() */
.element.hovering {
   background: red;
}

/* ✅ Correct - with :global() */
.element:global(.hovering) {
   background: red;
}
```

## 🔧 TypeScript Setup

### Basic Types

```typescript
import type { 
   DataCallback, 
   DropzoneCallback, 
   ValidateCallback 
} from 'attach-this'

interface MyData {
   id: number
   name: string
   type: 'widget' | 'tool'
}

const itemData: DataCallback = () => ({
   id: 1,
   name: 'Widget',
   type: 'widget'
} as MyData)
```

### Validation with Types

```typescript
const validate: ValidateCallback = (dataCallback) => {
   const data = dataCallback() as MyData
   
   if (data.type !== 'widget') return
   
   return () => {
      console.log(`Dropped widget: ${data.name}`)
      return true
   }
}
```

## 📚 Next Steps

Now that you have the basics, explore:

- **[Hoverable Documentation](./hoverable.md)** - Complete hoverable guide
- **[DND Core Documentation](./dnd-core.md)** - Advanced drag & drop patterns
- **[Ghost Middleware](./ghost-middleware.md)** - Custom drag images
- **[Validation Middleware](./validation-middleware.md)** - Drop zone validation
- **[API Reference](./api-reference.md)** - Complete API documentation

## 🤝 Getting Help

- **GitHub Issues** - Report bugs or request features
- **Discussions** - Ask questions and share ideas
- **Examples** - Check out the test routes in the repository

Happy coding! 🎉
