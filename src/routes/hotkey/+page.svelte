<script>
   import { createHotkeyManager } from "$lib/dollar-stores/hotkeyable.js";

  const hotkey = createHotkeyManager();
</script>

<button {...hotkey} data-key="cmd+s">Save</button>
<button {...hotkey} data-key="cmd+n">New</button>
<button {...hotkey} data-key="/">Search</button>

<!-- Show hotkey hints -->
<div class="hotkey-display">
  {#each $hotkey as { key, element }}
    <span class="hotkey-hint">
      {element.textContent}: <kbd>{key}</kbd>
    </span>
  {/each}
</div>
