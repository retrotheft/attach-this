import { createAttachmentKey, type Attachment } from 'svelte/attachments';

interface StoreContract<T> {
  subscribe: (callback: (value: T) => void) => () => void;
  set: (newValue: T) => void;
  update: (fn: (current: T) => T) => void;
}

type MovableState = {
  isDragging: boolean;
  element: Element | null;
  startX: number;
  startY: number;
  elementStartX: number;
  elementStartY: number;
  // Z-index management
  elements: Element[];
  activeElement: Element | null;
};

type DragEvent = MouseEvent & {
  currentTarget: EventTarget & Element;
};

type DollarStoreAttachment = {
  onmousedown: (e: DragEvent) => void;
  [key: symbol]: Attachment;
} & StoreContract<MovableState>;

export function createMovable(): DollarStoreAttachment {
  let movableState: MovableState = {
    isDragging: false,
    element: null,
    startX: 0,
    startY: 0,
    elementStartX: 0,
    elementStartY: 0,
    elements: [],
    activeElement: null
  };

  const subscribers = new Set<(value: MovableState) => void>();

  function notifySubscribers(): void {
    subscribers.forEach(callback => callback(movableState));
  }

  function getZIndex(element: Element): number {
    return movableState.elements.indexOf(element);
  }

  function isActive(element: Element): boolean {
    return movableState.activeElement === element;
  }

  function isInactive(element: Element): boolean {
    const zIndex = getZIndex(element);
    return zIndex !== -1 && zIndex < movableState.elements.length - 1;
  }

  function bringToFront(element: Element): void {
    movableState.elements = movableState.elements.filter(el => el !== element);
    movableState.elements.push(element);
    movableState.activeElement = element;

    // Update z-index styles
    updateZIndexes();
    notifySubscribers();
  }

  function addElement(element: Element): void {
    if (!movableState.elements.includes(element)) {
      movableState.elements.push(element);
      movableState.activeElement = element;
      updateZIndexes();
      notifySubscribers();
    }
  }

  function removeElement(element: Element): void {
    movableState.elements = movableState.elements.filter(el => el !== element);
    if (movableState.activeElement === element) {
      movableState.activeElement = movableState.elements[movableState.elements.length - 1] || null;
    }
    updateZIndexes();
    notifySubscribers();
  }

  function updateZIndexes(): void {
    movableState.elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.zIndex = (index + 100).toString(); // Start from 100 to avoid conflicts

      // Add/remove visual classes based on state
      htmlElement.classList.toggle('movable-active', isActive(element));
      htmlElement.classList.toggle('movable-inactive', isInactive(element));
    });
  }

  function handleMouseDown(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const element = event.currentTarget as HTMLElement;
    const computedStyle = getComputedStyle(element);

    // Bring to front when clicked
    bringToFront(element);

    movableState = {
      ...movableState,
      isDragging: true,
      element,
      startX: event.clientX,
      startY: event.clientY,
      elementStartX: parseInt(computedStyle.left) || 0,
      elementStartY: parseInt(computedStyle.top) || 0
    };

    notifySubscribers();

    // Add global mouse listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent): void {
    if (!movableState.isDragging || !movableState.element) return;

    const deltaX = event.clientX - movableState.startX;
    const deltaY = event.clientY - movableState.startY;

    const newX = movableState.elementStartX + deltaX;
    const newY = movableState.elementStartY + deltaY;

    const element = movableState.element as HTMLElement;
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;

    // Ensure the dragged element stays on top during drag
    element.style.zIndex = '9999';
  }

  function handleMouseUp(): void {
    if (!movableState.isDragging) return;

    // Reset z-index to managed value
    if (movableState.element) {
      updateZIndexes();
    }

    movableState = {
      ...movableState,
      isDragging: false
    };

    notifySubscribers();

    // Remove global mouse listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  function setupMovable(element: Element): (() => void) {
    const htmlElement = element as HTMLElement;

    // Set initial styles to make element movable
    htmlElement.style.cursor = 'move';
    htmlElement.style.userSelect = 'none';
    htmlElement.style.position = 'absolute';

    // Store initial position if not already set
    if (!htmlElement.style.left && !htmlElement.style.top) {
      const rect = htmlElement.getBoundingClientRect();
      const parent = htmlElement.offsetParent || document.body;
      const parentRect = parent.getBoundingClientRect();

      htmlElement.style.left = `${rect.left - parentRect.left}px`;
      htmlElement.style.top = `${rect.top - parentRect.top}px`;
    }

    // Add element to z-index management
    addElement(element);

    // Add dragging class when dragging starts/stops
    const callback = (state: MovableState) => {
      htmlElement.classList.toggle('dragging', state.isDragging && state.element === element);
    };

    subscribers.add(callback);
    callback(movableState);

    return () => {
      subscribers.delete(callback);
      removeElement(element);

      // Cleanup if this element is currently being dragged
      if (movableState.element === element && movableState.isDragging) {
        handleMouseUp();
      }
    };
  }

  const spreadables = {
    onmousedown: handleMouseDown,
    [createAttachmentKey()]: setupMovable
  } as DollarStoreAttachment;

  const store: StoreContract<MovableState> = {
    subscribe: (callback: (value: MovableState) => void) => {
      subscribers.add(callback);
      callback(movableState);
      return () => subscribers.delete(callback);
    },
    set: (newValue: MovableState) => {
      movableState = newValue;
      notifySubscribers();
    },
    update: (fn: (current: MovableState) => MovableState) => {
      movableState = fn(movableState);
      notifySubscribers();
    }
  };

  const { entries, defineProperty } = Object;
  for (const [key, value] of entries(store)) {
    defineProperty(spreadables, key, { value });
  }

  // Add helper methods for z-index management
  defineProperty(spreadables, 'getZIndex', { value: getZIndex });
  defineProperty(spreadables, 'isActive', { value: isActive });
  defineProperty(spreadables, 'isInactive', { value: isInactive });
  defineProperty(spreadables, 'bringToFront', { value: bringToFront });

  return spreadables;
}

export const movable = createMovable();

// CSS classes that you can style in your component:
/*
.movable-active {
  // Style for the currently active/top element
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #007acc;
}

.movable-inactive {
  // Style for inactive elements
  opacity: 0.8;
}

.dragging {
  // Style for element being dragged
  cursor: grabbing !important;
  transform: rotate(1deg);
  transition: none;
}
*/
