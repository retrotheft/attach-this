declare global {
   var hljs: {
      registerLanguage(name: string, script: (hljs: any) => { subLanguage: string; contains: any[]; }): void,
      highlight(code: string, options: Record<string, any>): void
      highlightAll(): void;
      highlightElement(element: Element): void;
   };
}

export { };
