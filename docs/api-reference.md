# API Reference

Complete API documentation for attach-this library.

## 📦 Exports

```typescript
// Core exports
export { hoverable } from './dollar-stores/hoverable.js'
export * from './dnd/index.js'

// Main exports available
import { 
   hoverable,           // Hoverable dollar store
   createDnd,           // Create DND instance
   draggable,           // Default draggable (singleton)
   dropzone,            // Default dropzone (singleton)
   use,                 // Default middleware (singleton)
   createGhostMiddleware,      // Ghost middleware factory
   ghostMiddleware,            // Default ghost middleware
   createValidationMiddleware, // Validation middleware factory
   validationMiddleware,       // Default validation middleware
   validatingDropzone,         // Legacy validating dropzone
   classes                     // Validation classes utility
} from 'attach-this'
```

## 🎯 Hoverable Dollar Store

### Interface

```typescript
interface HoverableStore {
   // Store methods
   subscribe: (callback: (value: Element | null) => void) => () => void
   set: (newValue: Element | null) => void
   update: (fn: (current: Element | null) => Element | null) => void
   
   // Event handlers for spreading
   onmouseover: (e: MouseEvent & { currentTarget: EventTarget & Element }) => void
   onmouseout: (e: MouseEvent & { currentTarget: EventTarget & Element }) => void
   onclick: (e: MouseEvent & { currentTarget: EventTarget & Element }) => void
   
   // Svelte 5 attachment
   [Symbol]: Attachment<HTMLElement>
}
```

### Methods

#### `subscribe(callback: (value: Element | null) => void): () => void`
Subscribe to hover state changes.

**Parameters:**
- `callback` - Function called when hover state changes

**Returns:** Unsubscribe function

**Example:**
```typescript
const unsubscribe = hoverable.subscribe(element => {
   console.log('Hover changed:', element)
})
```

#### `set(newValue: Element | null): void`
Manually set the hovered element.

**Parameters:**
- `newValue` - Element to set as hovered, or null to clear

**Example:**
```typescript
hoverable.set(document.querySelector('.target'))
hoverable.set(null) // Clear hover
```

#### `update(fn: (current: Element | null) => Element | null): void`
Update the hovered element using a function.

**Parameters:**
- `fn` - Function that receives current value and returns new value

**Example:**
```typescript
hoverable.update(current => current ? null : defaultElement)
```

## 🔄 DND Core

### `createDnd(): DndInstance`
Create a new isolated DND instance.

**Returns:** DndInstance with isolated middleware and state

**Example:**
```typescript
const dnd = createDnd()
dnd.use(someMiddleware)
```

### DndInstance Interface

```typescript
interface DndInstance {
   draggable(dataCallback: DataCallback): Attachment<HTMLElement>
   dropzone(dropzoneCallback?: DropzoneCallback): Attachment<HTMLElement>
   use(middleware: Middleware): void
}
```

#### `draggable(dataCallback: DataCallback): Attachment<HTMLElement>`
Create a draggable attachment.

**Parameters:**
- `dataCallback` - Function returning data and drag event handlers

**Returns:** Svelte 5 attachment for use with `{@attach}`

**Example:**
```typescript
const itemData = () => "My Data"
itemData.dragstart = (event, element) => { /* ... */ }

// Usage: {@attach dnd.draggable(itemData)}
```

#### `dropzone(dropzoneCallback?: DropzoneCallback): Attachment<HTMLElement>`
Create a dropzone attachment.

**Parameters:**
- `dropzoneCallback` - Optional object with drop event handlers

**Returns:** Svelte 5 attachment for use with `{@attach}`

**Example:**
```typescript
const callbacks = {
   drop: (event, element) => { /* ... */ }
}

// Usage: {@attach dnd.dropzone(callbacks)}
```

#### `use(middleware: Middleware): void`
Add middleware to the DND instance.

**Parameters:**
- `middleware` - Middleware object with event handlers

**Example:**
```typescript
dnd.use(createGhostMiddleware())
dnd.use(customMiddleware)
```

### Type Definitions

#### DataCallback
```typescript
type DataCallback = (() => unknown) & {
   dragstart?: (event: DragEvent, element: HTMLElement) => void
   dragend?: (event: DragEvent, element: HTMLElement) => void
   drop?: (event: DragEvent, element: HTMLElement) => void
   stop?: (event: DragEvent, element: HTMLElement) => void
   [key: string]: any // For middleware extensions like 'ghost'
}
```

**Properties:**
- Function call returns the data being dragged
- `dragstart` - Called when drag begins
- `dragend` - Called when drag ends
- `drop` - Called on successful drop
- `stop` - Called when drop is rejected/fails
- Additional properties can be added by middleware

#### DropzoneCallback
```typescript
type DropzoneCallback = {
   dragenter?: (event: DragEvent, element: HTMLElement) => void
   dragover?: (event: DragEvent, element: HTMLElement) => void
   dragleave?: (event: DragEvent, element: HTMLElement) => void
   drop?: (event: DragEvent, element: HTMLElement) => void
}
```

**Properties:**
- `dragenter` - Called when drag enters dropzone
- `dragover` - Called continuously while hovering
- `dragleave` - Called when drag leaves dropzone
- `drop` - Called when item is dropped

#### Middleware
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

**Properties:**
- All properties are optional event handlers
- Each handler receives the event, element, and relevant callbacks
- Middleware runs before user callbacks

## 👻 Ghost Middleware

### `createGhostMiddleware(): Middleware`
Create ghost middleware for custom drag images.

**Returns:** Middleware object for use with `dnd.use()`

**Example:**
```typescript
const dnd = createDnd()
dnd.use(createGhostMiddleware())

const itemData = () => "data"
itemData.ghost = ghostElement // HTMLElement
```

### Ghost Usage Pattern

1. Create ghost element (HTMLElement)
2. Attach to data callback as `ghost` property
3. Optionally update ghost content in `dragstart`

**Example:**
```typescript
const ghost = document.createElement('div')
ghost.style.cssText = 'background: blue; color: white; padding: 0.5rem;'

const itemData = () => "My Item"
itemData.ghost = ghost
itemData.dragstart = () => {
   ghost.textContent = 'Dragging!'
}
```

## ✅ Validation Middleware

### `createValidationMiddleware()`
```typescript
function createValidationMiddleware(): {
   middleware: Middleware
   validatingDropzone(dnd: DndInstance, validateCallback: ValidateCallback): Attachment<HTMLElement>
}
```

**Returns:** Object with middleware and validating dropzone function

**Example:**
```typescript
const dnd = createDnd()
const validation = createValidationMiddleware()
dnd.use(validation.middleware)
```

#### ValidateCallback
```typescript
type ValidateCallback = ((dataCallback: DataCallback) => DropCallback | void) & DropzoneCallback
```

**Function signature:**
- Receives `dataCallback` to access dragged data
- Returns `DropCallback` for valid items, `undefined` for invalid
- Can include standard dropzone callback properties

**Example:**
```typescript
const validate = (dataCallback) => {
   const data = dataCallback()
   if (data.type !== 'allowed') return // Invalid
   
   return () => {
      console.log('Valid drop')
      return true // Success
   }
}
```

#### DropCallback
```typescript
type DropCallback = (() => boolean) & DropzoneCallback
```

**Function signature:**
- Called when valid item is dropped
- Returns boolean indicating success/failure
- Can include standard dropzone callback properties

### `classes(validClass?: string, invalidClass?: string)`
```typescript
function classes(validClass = 'valid', invalidClass = 'invalid'): 
   (validateCallback: ValidateCallback) => void
```

**Parameters:**
- `validClass` - CSS class for valid state (default: 'valid')
- `invalidClass` - CSS class for invalid state (default: 'invalid')

**Returns:** Function that adds class management to validation callback

**Example:**
```typescript
const setupClasses = classes('can-drop', 'cannot-drop')
setupClasses(validateCallback)
```

## 🔧 Legacy/Singleton Exports

For backward compatibility, singleton instances are available:

### Default DND Instance
```typescript
import { draggable, dropzone, use } from 'attach-this'

// These use a shared default instance
const itemData = () => "data"
```

⚠️ **Note:** Prefer `createDnd()` for better isolation in new projects.

### Default Middleware
```typescript
import { ghostMiddleware, validationMiddleware } from 'attach-this'

// Legacy middleware instances
use(ghostMiddleware)
use(validationMiddleware)
```

## 🎨 CSS Classes Applied

### Hoverable
- `.hovering` - Applied to currently hovered element

### Validation
- `.valid` - Applied to dropzone when dragged item is valid (customizable)
- `.invalid` - Applied to dropzone when dragged item is invalid (customizable)

## 🔍 Error Handling

The library includes built-in error handling for common scenarios:

### Attachment Cleanup
- Attachments automatically clean up event listeners when elements are removed
- No manual cleanup required

### Event Propagation
- `stopPropagation()` called automatically where appropriate
- Nested hoverable elements work correctly

### Memory Management
- Weak references used for element storage where possible
- Automatic cleanup on component unmount

## 🚀 Performance Considerations

### Validation Caching
- Validation results are cached to prevent expensive re-computation
- Cache cleared on drag end

### Event Optimization
- Minimal event listeners added
- Efficient event delegation where possible

### DOM Management
- Ghost elements added/removed efficiently
- Minimal DOM manipulation during drag operations

## 📋 TypeScript Integration

### Import Types
```typescript
import type { 
   DataCallback,
   DropzoneCallback, 
   Middleware,
   ValidateCallback,
   DropCallback,
   DndInstance,
   HoverableStore
} from 'attach-this'
```

### Type Guards
```typescript
function isValidData(data: unknown): data is ValidDataType {
   return typeof data === 'object' && data !== null && 'type' in data
}

const validate = (dataCallback: DataCallback) => {
   const data = dataCallback()
   if (!isValidData(data)) return
   
   return () => {
      // TypeScript knows data is ValidDataType here
      processValidData(data)
      return true
   }
}
```
