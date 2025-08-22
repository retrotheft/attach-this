import { type Readable } from "svelte/store";

export type LookupTable = Record<string, Record<string, string>>;

export interface ReplaceUtilityOptions {
   container: HTMLElement;
   lookupTable: LookupTable;
   effectiveLocale: string;
   translateFunction: (textNode: Node, originalText: string, lookupTable: LookupTable, locale: string) => void;
   logPrefix?: string;
   originalTextMap: WeakMap<Node, string>; // Pass in the map from component
}

export class ReplaceUtility {
   private container: HTMLElement;
   private lookupTable: LookupTable;
   private effectiveLocale: string;
   private translateFunction: (textNode: Node, originalText: string, lookupTable: LookupTable, locale: string) => void;
   private logPrefix: string;
   private mutationObserver: MutationObserver | null = null;
   private originalTextMap: WeakMap<Node, string>; // Use the passed-in map

   constructor(options: ReplaceUtilityOptions) {
      this.container = options.container;
      this.lookupTable = options.lookupTable;
      this.effectiveLocale = options.effectiveLocale;
      this.translateFunction = options.translateFunction;
      this.logPrefix = options.logPrefix || "Replace";
      this.originalTextMap = options.originalTextMap;
   }

   updateConfig(lookupTable: LookupTable, effectiveLocale: string): void {
      this.lookupTable = lookupTable;
      this.effectiveLocale = effectiveLocale;
   }

   private shouldSkipNode(node: Node): boolean {
      if (node.nodeType === Node.COMMENT_NODE) return true;

      if (node.nodeType === Node.ELEMENT_NODE) {
         const element = node as Element;
         if (element.classList.contains('localisation-boundary') && element !== this.container) {
            return true;
         }
      }

      // need this for mutation observer changes, but breaks overrides
      let parent = node.parentElement;
      // while (parent && parent !== this.container) {
      //   if (parent.classList.contains('localisation-boundary')) {
      //      console.log("Parent boundary found")
      //     return true;
      //   }
      //   parent = parent.parentElement;
      // }

      return false;
   }

   private captureAndTranslateTextNode(textNode: Node): void {
      if (textNode.nodeType !== Node.TEXT_NODE) return;

      if (!this.originalTextMap.has(textNode)) {
         this.originalTextMap.set(textNode, textNode.textContent ?? "");
      }

      this.translateTextNode(textNode);
   }

   private translateTextNode(textNode: Node): void {
      const originalText = this.originalTextMap.get(textNode) ?? "";
      this.translateFunction(textNode, originalText, this.lookupTable, this.effectiveLocale);
   }

   private processNodes(nodes: NodeList | Node[]): void {
      for (const node of nodes) {
         if (this.shouldSkipNode(node)) continue;

         if (node.nodeType === Node.TEXT_NODE) {
            this.captureAndTranslateTextNode(node);
         } else if (
            node.nodeType === Node.ELEMENT_NODE ||
            node.nodeType === Node.DOCUMENT_FRAGMENT_NODE
         ) {
            this.processNodes(Array.from(node.childNodes));
         }
      }
   }

   initialScanAndTranslate(): void {
      if (!this.container) return;

      this.processNodes([this.container]);
   }

   retranslateAll(): void {
      if (!this.container) return;

      const walkAndTranslate = (node: Node): void => {
         if (this.shouldSkipNode(node)) return;

         if (node.nodeType === Node.TEXT_NODE) {
            if (this.originalTextMap.has(node)) {
               this.translateTextNode(node);
            }
         } else if (
            node.nodeType === Node.ELEMENT_NODE ||
            node.nodeType === Node.DOCUMENT_FRAGMENT_NODE
         ) {
            for (const child of Array.from(node.childNodes)) {
               walkAndTranslate(child);
            }
         }
      };

      walkAndTranslate(this.container);
   }

   setupMutationObserver(): void {
      if (!this.container) return;

      this.mutationObserver = new MutationObserver((mutations) => {
         for (const mutation of mutations) {
            if ((mutation.target as Element).classList.contains("localisation-boundary")) return
            if (mutation.type === 'childList') {
               this.processNodes(Array.from(mutation.addedNodes));
            }
         }
      });

      this.mutationObserver.observe(this.container, {
         childList: true,
         subtree: true
      });

   }

   cleanupMutationObserver(): void {
      if (this.mutationObserver) {
         this.mutationObserver.disconnect();
         this.mutationObserver = null;
      }
   }
}

// Helper function to get effective locale
export function getEffectiveLocale(
   lookupTable: LookupTable,
   localeValue: string,
   booleans: Record<string, any>
): string {
   const availableLocales = Object.keys(lookupTable);
   const overrideLocale = availableLocales.find(
      (loc) => booleans[loc] === true,
   );
   return overrideLocale || localeValue;
}

// Translation strategies - exact copies from original files
export const translateStrategies = {
   letters: (textNode: Node, originalText: string, lookupTable: LookupTable, locale: string): void => {
      let translatedText = "";
      for (const char of originalText) {
         const translated = lookupTable[locale]?.[char.toLowerCase()] ?? char;
         translatedText += translated;
      }
      textNode.textContent = translatedText;
   },

   textNodes: (textNode: Node, originalText: string, lookupTable: LookupTable, locale: string): void => {
      if (!originalText.trim()) {
         return;
      }

      const trimmedText = originalText.trim();
      const translated = lookupTable[locale]?.[trimmedText.toLowerCase()] ?? originalText;
      textNode.textContent = translated;
   },

   words: (textNode: Node, originalText: string, lookupTable: LookupTable, locale: string): void => {
      const words = originalText.split(/(\s+)/);

      let translatedText = "";
      for (const word of words) {
         if (/^\s+$/.test(word)) {
            translatedText += word;
         } else {
            const translated = lookupTable[locale]?.[word.toLowerCase()] ?? word;
            translatedText += translated;
         }
      }

      textNode.textContent = translatedText;
   }
};
