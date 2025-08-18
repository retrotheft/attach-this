# Ghost Middleware

Create custom drag images that follow the cursor during drag operations, providing smooth, interactive drag experiences.

## 🎯 Features

- **Custom Elements** - Use any DOM element as a ghost
- **Dynamic Content** - Update ghost content during drag operations
- **Automatic Positioning** - Ghost follows cursor with configurable offset
- **No Default Ghost** - Completely replaces the browser's default drag image
- **Performance Optimized** - Efficient cursor tracking with minimal overhead

## 📦 Installation

```bash
npm install attach-this
```

## 🚀 Basic Usage

```svelte
<script lang="ts">
   import { createDnd } from 'attach-this'
   import { createGhostMiddleware } from 'attach-this'
   
   const dnd = createDnd()
   dnd.use(createGhostMiddleware())
   
   // Create a custom ghost element
   const ghost = document.createElement('div')
   ghost.textContent = '👻 Dragging!'
   ghost.style.cssText = `
      background: #ff5722;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-weight: bold;
   `
   
   const itemData = () => "Ghost Item"
   itemData.ghost = ghost  // Attach ghost to data callback
   
   itemData.dragstart = (event, element) => {
      ghost.textContent = '👻 Now dragging!'
   }
</script>

<div {@attach dnd.draggable(itemData)}>
   Drag me (with custom ghost) 👻
</div>

<div {@attach dnd.dropzone()}>
   Drop here
</div>
```

## 🔧 Advanced Usage

### Dynamic Ghost Content

```svelte
<script>
   import { createDnd } from 'attach-this'
   import { createGhostMiddleware } from 'attach-this'
   
   const dnd = createDnd()
   dnd.use(createGhostMiddleware())
   
   let dragCount = $state(0)
   
   // Create ghost with dynamic content
   const ghost = document.createElement('div')
   ghost.style.cssText = `
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      font-family: system-ui;
      font-weight: 600;
   `
   
   const itemData = () => ({ name: "Dynamic Item", count: dragCount })
   itemData.ghost = ghost
   
   itemData.dragstart = (event, element) => {
      dragCount++
      const data = itemData()
      ghost.innerHTML = `
         <div>📦 ${data.name}</div>
         <div style="font-size: 0.8em; opacity: 0.8;">
            Drag #${data.count}
         </div>
      `
   }
</script>

<div {@attach dnd.draggable(itemData)}>
   Dynamic Ghost Item (dragged {dragCount} times)
</div>
```

### Reactive Ghost Updates

```svelte
<script>
   import { createDnd } from 'attach-this'
   import { createGhostMiddleware } from 'attach-this'
   
   const dnd = createDnd()
   dnd.use(createGhostMiddleware())
   
   let items = $state(['Apple', 'Banana', 'Cherry'])
   let selectedIndex = $state(0)
   
   const ghost = document.createElement('div')
   ghost.style.cssText = `
      background: #4caf50;
      color: white;
      padding: 0.75rem;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
   `
   
   const itemData = () => items[selectedIndex]
   itemData.ghost = ghost
   
   itemData.dragstart = () => {
      ghost.textContent = `🍎 ${itemData()}`
   }
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

### Multiple Ghost Types

```svelte
<script>
   import { createDnd } from 'attach-this'
   import { createGhostMiddleware } from 'attach-this'
   
   const dnd = createDnd()
   dnd.use(createGhostMiddleware())
   
   // Different ghost styles for different item types
   function createFileGhost(filename) {
      const ghost = document.createElement('div')
      ghost.style.cssText = `
         background: #2196f3;
         color: white;
         padding: 0.5rem 1rem;
         border-radius: 4px;
         display: flex;
         align-items: center;
         gap: 0.5rem;
      `
      ghost.innerHTML = `📄 ${filename}`
      return ghost
   }
   
   function createFolderGhost(foldername) {
      const ghost = document.createElement('div')
      ghost.style.cssText = `
         background: #ff9800;
         color: white;
         padding: 0.5rem 1rem;
         border-radius: 4px;
         display: flex;
         align-items: center;
         gap: 0.5rem;
      `
      ghost.innerHTML = `📁 ${foldername}`
      return ghost
   }
   
   const fileData = () => "document.pdf"
   fileData.ghost = createFileGhost("document.pdf")
   
   const folderData = () => "My Folder"
   folderData.ghost = createFolderGhost("My Folder")
</script>

<div {@attach dnd.draggable(fileData)}>📄 document.pdf</div>
<div {@attach dnd.draggable(folderData)}>📁 My Folder</div>
```

### Context-Aware Ghosts

```svelte
<script>
   import { createDnd } from 'attach-this'
   import { createGhostMiddleware } from 'attach-this'
   
   const dnd = createDnd()
   dnd.use(createGhostMiddleware())
   
   let currentContext = $state('normal')
   
   const ghost = document.createElement('div')
   ghost.style.cssText = `
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-weight: 600;
      transition: all 0.2s ease;
   `
   
   const itemData = () => "Context Item"
   itemData.ghost = ghost
   
   itemData.dragstart = () => {
      if (currentContext === 'danger') {
         ghost.style.background = '#f44336'
         ghost.style.color = 'white'
         ghost.textContent = '⚠️ Danger Zone!'
      } else {
         ghost.style.background = '#4caf50'
         ghost.style.color = 'white'
         ghost.textContent = '✅ Safe to drop'
      }
   }
</script>

<button onclick={() => currentContext = currentContext === 'normal' ? 'danger' : 'normal'}>
   Toggle Context: {currentContext}
</button>

<div {@attach dnd.draggable(itemData)}>
   Context-aware item
</div>
```

## 📋 API Reference

### `createGhostMiddleware(): Middleware`

Creates ghost middleware that can be added to a DND instance.

```typescript
function createGhostMiddleware(): Middleware
```

### Usage Pattern

```typescript
// 1. Create DND instance
const dnd = createDnd()

// 2. Add ghost middleware
dnd.use(createGhostMiddleware())

// 3. Attach ghost to data callback
const itemData = () => "data"
itemData.ghost = ghostElement // HTMLElement

// 4. Optional: Update ghost on drag events
itemData.dragstart = (event, element) => {
   ghostElement.textContent = "Updated content"
}
```

### Ghost Element Requirements

The ghost element should be a standard DOM element:

```javascript
// Create ghost element
const ghost = document.createElement('div')

// Style it (required for visibility)
ghost.style.cssText = `
   background: #333;
   color: white;
   padding: 0.5rem;
   border-radius: 4px;
   pointer-events: none;  /* Important for positioning */
   z-index: 9999;         /* Ensure it appears on top */
`

// Attach to data callback
itemData.ghost = ghost
```

## 🎨 Styling Guide

### Basic Ghost Styles

```css
.ghost-element {
   background: linear-gradient(45deg, #667eea, #764ba2);
   color: white;
   padding: 1rem;
   border-radius: 8px;
   box-shadow: 0 8px 25px rgba(0,0,0,0.3);
   font-weight: 600;
   pointer-events: none;
   z-index: 9999;
   white-space: nowrap;
}
```

### Animated Ghosts

```css
.ghost-element {
   animation: ghostFloat 0.3s ease-out;
   transform-origin: center;
}

@keyframes ghostFloat {
   0% {
      transform: scale(0.8) rotate(-5deg);
      opacity: 0.8;
   }
   100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
   }
}
```

### Responsive Ghosts

```css
.ghost-element {
   font-size: clamp(0.8rem, 2vw, 1.2rem);
   padding: clamp(0.5rem, 1vw, 1rem);
   max-width: 200px;
   overflow: hidden;
   text-overflow: ellipsis;
}
```

## 🚀 Performance Tips

### Reuse Ghost Elements

```svelte
<script>
   // ✅ Good - create ghost once and reuse
   const ghost = document.createElement('div')
   ghost.style.cssText = 'background: blue; color: white; padding: 0.5rem;'
   
   const itemData = () => data
   itemData.ghost = ghost
   
   itemData.dragstart = () => {
      ghost.textContent = data.name // Update content on drag
   }
   
   // ❌ Avoid - creating new ghosts on every render
   $: {
      const newGhost = document.createElement('div') // Created every time
      itemData.ghost = newGhost
   }
</script>
```

### Efficient Updates

```svelte
<script>
   // ✅ Good - minimal DOM updates
   itemData.dragstart = () => {
      ghost.textContent = data.name
      ghost.className = `ghost ${data.type}`
   }
   
   // ❌ Avoid - complex DOM manipulation during drag
   itemData.dragstart = () => {
      ghost.innerHTML = '' // Clears everything
      const span = document.createElement('span')
      span.textContent = data.name
      ghost.appendChild(span) // Expensive
   }
</script>
```

## 🔍 Troubleshooting

### Common Issues

**Ghost not appearing:**
- Ensure ghost element is attached: `itemData.ghost = ghostElement`
- Verify ghost middleware is added: `dnd.use(createGhostMiddleware())`
- Check ghost element has proper styling (background, padding, etc.)

**Ghost positioning issues:**
- Ghost automatically positioned at cursor + 10px offset
- Ensure ghost has `pointer-events: none` for proper cursor tracking
- Check z-index is high enough (9999 recommended)

**Ghost not updating:**
- Update ghost content in `dragstart` callback
- Avoid expensive DOM operations during drag
- Use `textContent` instead of `innerHTML` when possible

### Debug Helper

```svelte
<script>
   const debugGhost = document.createElement('div')
   debugGhost.style.cssText = `
      background: red;
      color: white;
      padding: 1rem;
      border: 2px solid yellow;
   `
   debugGhost.textContent = 'DEBUG GHOST'
   
   const itemData = () => "Debug Item"
   itemData.ghost = debugGhost
   
   itemData.dragstart = (event, element) => {
      console.log('Ghost middleware active:', !!debugGhost)
      console.log('Ghost element:', debugGhost)
   }
</script>
```
