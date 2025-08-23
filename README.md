# Attach This

A collection of ergonomic everyday helpers for Svelte.

## Movable

Easily makes elements movable and tracks z-indexes to keep recent items on top. You can spread the event listeners and attachment onto the element with `{...movable}` and then access the current state with `$movable`.

### Usage

```svelte
<script>
   import { movable } from 'attach-this'
</script>

<div {...movable}>
   <!-- $movable is either null or { element, x, y } -->
</div>
```

## Hoverable
