import { createAttachmentKey } from "svelte/attachments";

export function createFilter<T extends Record<string, any>>(items: T[]) {
  const columnFilters = new Map<string, string>();
  const subscribers = new Set<(value: T[]) => void>();

  function getFilteredItems(): T[] {
    let result = items;

    for (const [fieldName, filterValue] of columnFilters) {
      if (!filterValue) continue;

      const terms = filterValue.split(',').map(t => t.trim().toLowerCase());
      result = result.filter(item => {
        const fieldValue = item[fieldName]?.toString().toLowerCase() || '';
        return terms.some(term => term && fieldValue.includes(term));
      });
    }

    return result;
  }

  function notifySubscribers(): void {
    subscribers.forEach(callback => callback(getFilteredItems()));
  }

  const spreadables = {
    oninput: (e: Event) => {
      const element = e.target as HTMLInputElement;
      const fieldName = element.name;
      if (!fieldName) return;

      columnFilters.set(fieldName, element.value);
      notifySubscribers();
    },
    [createAttachmentKey()]: (element: HTMLInputElement) => {
      // Could add visual feedback here
      return () => {};
    }
  };

  const store = {
    subscribe: (callback: (value: T[]) => void) => {
      subscribers.add(callback);
      callback(getFilteredItems());
      return () => subscribers.delete(callback);
    }
  };

  return Object.assign(spreadables, store);
}
