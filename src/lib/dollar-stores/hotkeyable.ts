import { createAttachmentKey } from "svelte/attachments";

export function createHotkeyManager() {
  const hotkeys = new Map<string, { element: HTMLElement, handler: () => void }>();
  const subscribers = new Set<(value: Array<{ key: string, element: HTMLElement }>) => void>();

  function notifySubscribers(): void {
    const hotkeyList = Array.from(hotkeys.entries()).map(([key, { element }]) => ({
      key,
      element
    }));
    subscribers.forEach(callback => callback(hotkeyList));
  }

  function handleKeydown(event: KeyboardEvent): void {
    const key = formatKeyCombo(event);
    const hotkey = hotkeys.get(key);
    if (hotkey) {
      event.preventDefault();
      hotkey.handler();
    }
  }

  function formatKeyCombo(event: KeyboardEvent): string {
    const parts = [];
    if (event.metaKey || event.ctrlKey) parts.push(event.metaKey ? 'cmd' : 'ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    parts.push(event.key.toLowerCase());
    return parts.join('+');
  }

  const spreadables = {
    onclick: (e: Event) => {
      // Normal click behavior - let it bubble
    },
    [createAttachmentKey()]: (element: HTMLElement) => {
      const key = element.dataset.key;
      if (!key) return () => {};

      const handler = () => element.click();
      hotkeys.set(key, { element, handler });

      // Add global keydown listener if this is the first hotkey
      if (hotkeys.size === 1) {
        document.addEventListener('keydown', handleKeydown);
      }

      notifySubscribers();

      return () => {
        hotkeys.delete(key);
        if (hotkeys.size === 0) {
          document.removeEventListener('keydown', handleKeydown);
        }
        notifySubscribers();
      };
    }
  };

  const store = {
    subscribe: (callback: (value: Array<{ key: string, element: HTMLElement }>) => void) => {
      subscribers.add(callback);
      callback(Array.from(hotkeys.entries()).map(([key, { element }]) => ({ key, element })));
      return () => subscribers.delete(callback);
    }
  };

  return Object.assign(spreadables, store);
}
