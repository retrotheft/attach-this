# DND Core

A modular drag and drop system built on Svelte 5 attachments, designed for flexibility and type safety with middleware support.

## 🎯 Features

- **Isolated Instances** - Create multiple independent DND contexts
- **Middleware System** - Extensible architecture for custom functionality
- **Type Safety** - Full TypeScript support with proper event typing
- **Event Lifecycle** - Complete control over drag and drop events
- **Performance** - Efficient event handling and cleanup

## 📦 Installation

```bash
npm install attach-this
```

## 🚀 Basic Usage

```svelte
<script lang="ts">
   import { createDnd } from 'attach-this'
   
   // Create an isolated DND instance
   const dnd = createDnd()
   
   let dropCount = $state(0)
   let lastDropped = $state("")
   
   // Data callback - defines what gets dragged
   const itemData = () => "My Item Data"
   itemData.drop = (event, element) => {
      dropCount++
      console.log("Item was successfully dropped!")
   }
   itemData.stop = (event, element) => {
      console.log("Drop was rejected or failed")
   }
   
   // Dropzone callback - handles drop events
   const dropzoneCallbacks = {
      drop: (event, element) => {
         lastDropped = itemData()
         console.log("Dropzone received item")
      }
   }
</script>

<div {@attach dnd.draggable(itemData)}>
   Drag me!
</div>

<div {@attach dnd.dropzone(dropzoneCallbacks)}>
   Drop here: {lastDropped || "empty"}
</div>

<p>Total drops: {dropCount}</p>
```

## 🔧 Advanced Usage

### Data Callbacks

Data callbacks define what gets dragged and handle drag lifecycle events:

```svelte
<script>
   const itemData = () => ({ id: 123, name: "Widget", type: "component" })
   
   itemData.dragstart = (event, element) => {
      element.style.opacity = "0.5"
      console.log("Started dragging")
   }
   
   itemData.dragend = (event, element) => {
      element.style.opacity = "1"
      console.log("Finished dragging")
   }
   
   itemData.drop = (event, element) => {
      console.log("Successfully dropped!")
      // Called when drop is successful
   }
   
   itemData.stop = (event, element) => {
      console.log("Drop was prevented or failed")
      // Called when drop is rejected or fails
   }
</script>
```

### Dropzone Callbacks

```svelte
<script>
   const dropzoneCallbacks = {
      dragenter: (event, element) => {
         element.classList.add('drag-over')
         console.log("Item entered dropzone")
      },
      
      dragover: (event, element) => {
         // Called continuously while hovering
      },
      
      dragleave: (event, element) => {
         element.classList.remove('drag-over')
         console.log("Item left dropzone")
      },
      
      drop: (event, element) => {
         element.classList.remove('drag-over')
         console.log("Item dropped in zone")
      }
   }
</script>
```

### Multiple Independent Instances

```svelte
<script>
   import { createDnd } from 'attach-this'
   
   // Create separate instances for different contexts
   const filesDnd = createDnd()
   const tasksDnd = createDnd()
   
   const fileData = () => ({ type: 'file', name: 'document.pdf' })
   const taskData = () => ({ type: 'task', title: 'Review code' })
</script>

<!-- Files context -->
<div {@attach filesDnd.draggable(fileData)}>📄 document.pdf</div>
<div {@attach filesDnd.dropzone()}>📁 Files folder</div>

<!-- Tasks context -->
<div {@attach tasksDnd.draggable(taskData)}>📋 Review code</div>
<div {@attach tasksDnd.dropzone()}>📋 Task board</div>
```

### Middleware System

```svelte
<script>
   import { createDnd } from 'attach-this'
   import { createGhostMiddleware } from 'attach-this'
   
   const dnd = createDnd()
   
   // Add middleware to the instance
   dnd.use(createGhostMiddleware())
   
   // Create custom middleware
   const loggingMiddleware = {
      dragstart: (event, element, dataCallback) => {
         console.log('Middleware: drag started', dataCallback())
      },
      drop: (event, element, dropzoneCallback, dataCallback) => {
         console.log('Middleware: processing drop', dataCallback())
      }
   }
   
   dnd.use(loggingMiddleware)
</script>
```

## 📋 API Reference

### `createDnd(): DndInstance`

Creates a new isolated DND instance.

```typescript
interface DndInstance {
   draggable(dataCallback: DataCallback): Attachment<HTMLElement>
   dropzone(dropzoneCallback?: DropzoneCallback): Attachment<HTMLElement>
   use(middleware: Middleware): void
}
```

### Data Callback

```typescript
type DataCallback = (() => unknown) & {
   dragstart?: (event: DragEvent, element: HTMLElement) => void
   dragend?: (event: DragEvent, element: HTMLElement) => void
   drop?: (event: DragEvent, element: HTMLElement) => void
   stop?: (event: DragEvent, element: HTMLElement) => void
   [key: string]: any // For middleware extensions
}
```

### Dropzone Callback

```typescript
type DropzoneCallback = {
   dragenter?: (event: DragEvent, element: HTMLElement) => void
   dragover?: (event: DragEvent, element: HTMLElement) => void
   dragleave?: (event: DragEvent, element: HTMLElement) => void
   drop?: (event: DragEvent, element: HTMLElement) => void
}
```

### Middleware

```typescript
type Middleware = {
   dragstart?: (event: DragEvent, element: HTMLElement, dataCallback: DataCallback) => void
   dragend?: (event: DragEvent, element: HTMLElement, dataCallback: DataCallback) => void
   dragenter?: (event: DragEvent, element: HTMLElement, dropzoneCallback: DropzoneCallback | undefined, dataCallback: DataCallback) => void
   dragover?: (event: DragEvent, element: HTMLElement, dropzoneCallback: DropzoneCallback | undefined, dataCallback: DataCallback) => void
   dragleave?: (event: DragEvent, element: HTMLElement, dropzoneCallback: DropzoneCallback | undefined, dataCallback: DataCallback) => void
   drop?: (event: DragEvent, element: HTMLElement, dropzoneCallback: DropzoneCallback | undefined, dataCallback: DataCallback) => void
}
```

## 🎨 Styling Guide

```css
/* Draggable elements */
.draggable {
   cursor: grab;
   user-select: none;
   transition: all 0.2s ease;
}

.draggable:active {
   cursor: grabbing;
   transform: scale(0.95);
}

/* Dropzone states */
.dropzone {
   border: 2px dashed #ccc;
   transition: all 0.3s ease;
}

.dropzone.drag-over {
   border-color: #4caf50;
   background: #e8f5e8;
   transform: scale(1.02);
}
```

## 🔍 Troubleshooting

**Drag not working:**
- Ensure element has `draggable="true"` (automatically set by library)
- Check that data callback is properly attached
- Verify no other event listeners are preventing drag

**Drop not triggering:**
- Confirm `preventDefault()` is called in `dragover` (automatically handled)
- Check dropzone callback is properly attached
- Ensure drop area is large enough and properly positioned
