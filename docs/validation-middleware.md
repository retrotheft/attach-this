# Validation Middleware

Add validation logic and visual feedback to drop zones with automatic class management and comprehensive lifecycle hooks.

## 🎯 Features

- **Visual Feedback** - Automatic CSS class management for valid/invalid states
- **Validation Logic** - Flexible validation functions with success/failure handling
- **Lifecycle Hooks** - Complete control over validation events
- **Performance Optimized** - Validation caching to prevent expensive re-computations
- **Type Safety** - Full TypeScript support with proper validation typing

## 📦 Installation

```bash
npm install attach-this
```

## 🚀 Basic Usage

```svelte
<script lang="ts">
   import { createDnd } from 'attach-this'
   import { createValidationMiddleware, classes } from 'attach-this'
   
   const dnd = createDnd()
   const validation = createValidationMiddleware()
   dnd.use(validation.middleware)
   
   let lastDropped = $state("")
   
   // Validation function
   const validate = (dataCallback) => {
      const data = dataCallback()
      
      // Return undefined for invalid items
      if (data === "Forbidden Item") {
         return // Validation failed
      }
      
      // Return drop callback for valid items
      return () => {
         lastDropped = data
         console.log(`Successfully dropped: ${data}`)
         return true
      }
   }
   
   // Add visual feedback classes
   const setupClasses = classes('valid', 'invalid')
   setupClasses(validate)
   
   const allowedData = () => "Allowed Item"
   const forbiddenData = () => "Forbidden Item"
</script>

<div {@attach dnd.draggable(allowedData)}>✅ Allowed Item</div>
<div {@attach dnd.draggable(forbiddenData)}>❌ Forbidden Item</div>

<div {@attach validation.validatingDropzone(dnd, validate)}>
   Drop Zone: {lastDropped || "empty"}
</div>

<style>
   div:global(.valid) {
      background: #c8e6c9;
      border-color: #4caf50;
   }
   
   div:global(.invalid) {
      background: #ffcdd2;
      border-color: #f44336;
   }
</style>
```

## 🔧 Advanced Usage

### Complex Validation Logic

```svelte
<script>
   let inventory = $state([])
   let maxItems = 5
   
   const validate = (dataCallback) => {
      const data = dataCallback()
      
      // Multi-condition validation
      if (!data || typeof data !== 'object') return
      if (!data.type || data.type !== 'widget') return
      if (inventory.length >= maxItems) return
      if (inventory.some(item => item.id === data.id)) return
      
      return () => {
         inventory.push(data)
         return true
      }
   }
</script>
```

### Custom Validation Hooks

```svelte
<script>
   const validate = (dataCallback) => {
      const data = dataCallback()
      if (!isValid(data)) return
      
      return () => {
         performDrop(data)
         return true
      }
   }
   
   // Add custom lifecycle hooks
   validate.dragenter = (event, element) => {
      element.style.boxShadow = '0 0 20px blue'
   }
   
   validate.dragleave = (event, element) => {
      element.style.boxShadow = 'none'
   }
</script>
```

## 📋 API Reference

### `createValidationMiddleware()`

```typescript
function createValidationMiddleware(): {
   middleware: Middleware
   validatingDropzone(dnd: DndInstance, validateCallback: ValidateCallback): Attachment<HTMLElement>
}
```

### Validation Types

```typescript
type ValidateCallback = ((dataCallback: DataCallback) => DropCallback | void) & DropzoneCallback

type DropCallback = (() => boolean) & DropzoneCallback
```

### `classes()` Utility

```typescript
function classes(validClass?: string, invalidClass?: string): (validateCallback: ValidateCallback) => void
```

## 🎨 Styling Guide

```css
.dropzone:global(.valid) {
   background: #e8f5e8;
   border: 2px solid #4caf50;
   transform: scale(1.05);
}

.dropzone:global(.invalid) {
   background: #ffeaea;
   border: 2px solid #f44336;
   transform: scale(0.95);
}
```

## 🔍 Troubleshooting

**Validation not working:**
- Confirm validation middleware is added: `dnd.use(validation.middleware)`
- Check validation function returns correct values
- Use `validatingDropzone` instead of regular `dropzone`

**Classes not applying:**
- Verify `classes()` utility is called with validation function
- Check CSS selector syntax with `:global()`
