import { createAttachmentKey, type Attachment } from 'svelte/attachments';

interface StoreContract<T> {
  subscribe: (callback: (value: T) => void) => () => void;
  set: (newValue: T) => void;
  update: (fn: (current: T) => T) => void;
}

type HoverEvent = MouseEvent & {
  currentTarget: EventTarget & Element;
};

type DollarStoreAttachment = {
  onmouseover: (e: HoverEvent) => void;
  onmouseout: (e: HoverEvent) => void;
  onclick: (e: HoverEvent) => void;
  [key: symbol]: Attachment;
} & StoreContract<Element | null>;


function createHoverable(): DollarStoreAttachment {
  let focusedElement: Element | null = null;
  const subscribers = new Set<(value: Element | null) => void>();

  function notifySubscribers(): void {
    subscribers.forEach(callback => callback(focusedElement));
  }

  function changeHover(event: HoverEvent, bool: boolean): void {
    event.stopPropagation();
    focusedElement = bool ? event.currentTarget : null;
    notifySubscribers();
  }

  function checkFocus(element: Element): (() => void) {
    const callback = (focused: Element | null) => {
      element.classList.toggle('hovering', focused === element);
    };
    subscribers.add(callback);
    callback(focusedElement);
    return () => subscribers.delete(callback);
  }

  const spreadables = {
    onmouseover: (e: HoverEvent) => changeHover(e, true),
    onmouseout: (e: HoverEvent) => changeHover(e, false),
    onclick: (e: HoverEvent) => { e.stopPropagation(); },
    [createAttachmentKey()]: checkFocus
  } as DollarStoreAttachment;

  const store: StoreContract<Element | null> = {
    subscribe: (callback: (value: Element | null) => void) => {
      subscribers.add(callback);
      callback(focusedElement);
      return () => subscribers.delete(callback);
    },
    set: (newValue: Element | null) => {
      focusedElement = newValue;
      notifySubscribers();
    },
    update: (fn: (current: Element | null) => Element | null) => {
      focusedElement = fn(focusedElement);
      notifySubscribers();
    }
  };

  const { entries, defineProperty } = Object;
  for (const [key, value] of entries(store)) {
    defineProperty(spreadables, key, { value });
  }

  return spreadables;
}

export default createHoverable();
