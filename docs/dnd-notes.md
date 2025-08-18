# DnD Notes

## On Early getData/drop

Goal: to instantiate a page element when drag operation enters a dropzone that will create that element, and allow repositioning.

Repositioning should just be automatic anyway. The only thing that's really changing is what is being dragged around. This is easily updatable thanks to Svelte's attachment reactivity.

### Goals

- [x] get working ghost, simple text
   - [x] eliminate snap back animation
   - [x] make data reactive
- [x] pass ghost the element you want to eliminate all snapback on
   - [x] solved by just making that element a dropzone
- [x] add stop hook to library

Alternatively to stop, the wider dropzone could just treat it as a successful drop? Though that might have other ramifications depending on dataTransfer type.

Could also revert the ghost image upon leaving the wider context with dragleave.

Different dropzones could provide different contexts which would impact the overlay. Since the overlay is just coming from the data though, we need a way to react to different validation return values, or hook into it somehow.

## Contextual Dropzone attempts

- [ ] passing context from validate to dataCallback works well, but bypasses the ghost element
- [ ] could potentially communicate context via validate and dataCallback dragover hooks

I do like the cleanness of calling getData from validate with context, as this completely bypasses any state needing to be saved in the dnd library. I could use this pattern to directly manipulate the ghost element from the data side.
