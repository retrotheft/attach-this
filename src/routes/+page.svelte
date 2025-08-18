<script>
   import { hoverable } from '$lib/index.js'
   
   let dragCount = $state(0)
   let dropCount = $state(0)
   let lastDropped = $state("")
   
   // Demo data for interactive examples
   const demoData = () => "Demo Item"
   
   // Simulate drag/drop for demo purposes
   function simulateDrop() {
      dropCount++
      lastDropped = "Demo Item"
   }
</script>

<svelte:head>
   <title>attach-this - Ergonomic Svelte 5 Utilities</title>
   <meta name="description" content="Ergonomic everyday helpers for Svelte 5. Built on the powerful attachment system with zero dependencies." />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
   <div class="container">
      <div class="hero-content">
         <h1>attach-this</h1>
         <p>Ergonomic everyday helpers for Svelte 5. Built on the powerful attachment system with zero dependencies.</p>
         <div class="cta-buttons">
            <a href="#installation" class="btn btn-primary">
               🚀 Get Started
            </a>
            <a href="/hoverable" class="btn btn-secondary">
               📚 View Demos
            </a>
         </div>
      </div>
   </div>
</section>

<!-- Features Section -->
<section id="features" class="features">
   <div class="container">
      <h2>Why attach-this?</h2>
      <div class="features-grid">
         <div class="feature-card">
            <span class="feature-icon">🎯</span>
            <h3>Hoverable Dollar Store</h3>
            <p>Reactive hover state management with automatic CSS class application. Track which element is hovered with full store integration.</p>
            <div class="feature-demo">
               <div class="demo-hoverable" {...hoverable}>
                  {#if $hoverable}
                     🎯 Currently hovering!
                  {:else}
                     Hover me! (.hovering class applied)
                  {/if}
               </div>
            </div>
            <a href="/hoverable" class="demo-link">Try Interactive Demo →</a>
         </div>

         <div class="feature-card">
            <span class="feature-icon">🔄</span>
            <h3>Drag & Drop Core</h3>
            <p>Modular, type-safe drag and drop built on Svelte 5 attachments. Create isolated instances with middleware support.</p>
            <div class="feature-demo">
               <div class="demo-draggable" draggable="true">
                  Drag me around!
               </div>
               <div class="demo-dropzone" onclick={simulateDrop}>
                  Drop zone (drops: {dropCount})
               </div>
            </div>
            <a href="/dnd" class="demo-link">Try Interactive Demo →</a>
         </div>

         <div class="feature-card">
            <span class="feature-icon">👻</span>
            <h3>Ghost Middleware</h3>
            <p>Custom drag images that follow your cursor. Create beautiful, interactive drag experiences with any DOM element.</p>
            <div class="feature-demo">
               <div class="demo-draggable ghost" draggable="true">
                  👻 Drag with custom ghost
               </div>
               <div class="ghost-preview">Custom ghost follows cursor</div>
            </div>
            <a href="/dnd" class="demo-link">Try Interactive Demo →</a>
         </div>

         <div class="feature-card">
            <span class="feature-icon">✅</span>
            <h3>Validation Middleware</h3>
            <p>Visual feedback and validation logic for drop zones. Automatic class management for valid/invalid states.</p>
            <div class="feature-demo">
               <div class="demo-draggable valid" draggable="true">
                  Valid item ✅
               </div>
               <div class="demo-dropzone validation">
                  Validating drop zone
               </div>
            </div>
            <a href="/dnd" class="demo-link">Try Interactive Demo →</a>
         </div>

         <div class="feature-card">
            <span class="feature-icon">🔧</span>
            <h3>TypeScript First</h3>
            <p>Built with TypeScript from the ground up. Full type safety, excellent IntelliSense, and zero runtime overhead.</p>
            <div class="feature-demo">
               <pre><code>const dnd: DndInstance = createDnd()
// Full type safety! 🎉</code></pre>
            </div>
         </div>

         <div class="feature-card">
            <span class="feature-icon">📦</span>
            <h3>Zero Dependencies</h3>
            <p>Built purely on Svelte 5 primitives. Tree-shakeable, lightweight, and no external dependencies to worry about.</p>
            <div class="feature-demo">
               <pre><code>// Only what you need
import &#123; hoverable &#125; from 'attach-this'</code></pre>
            </div>
         </div>
      </div>

      <!-- Quick Start Example -->
      <div class="code-section">
         <h3>🚀 Quick Start Example</h3>
         <pre><code><span class="hljs-comment">// Import what you need</span>
<span class="hljs-keyword">import</span> &#123; hoverable, createDnd &#125; <span class="hljs-keyword">from</span> <span class="hljs-string">'attach-this'</span>

<span class="hljs-comment">// Create DND instance</span>
<span class="hljs-keyword">const</span> dnd = <span class="hljs-function">createDnd</span>()

<span class="hljs-comment">// Define data and callbacks</span>
<span class="hljs-keyword">const</span> itemData = () => <span class="hljs-string">"Hello World"</span>
itemData.drop = () => <span class="hljs-function">console.log</span>(<span class="hljs-string">"Dropped!"</span>)

<span class="hljs-comment">&lt;!-- Use in your Svelte components --&gt;</span>
<span class="hljs-tag">&lt;div</span> <span class="hljs-attr">&#123;...hoverable&#125;</span><span class="hljs-tag">&gt;</span>
  Hovering: &#123;$hoverable?.tagName || 'nothing'&#125;
<span class="hljs-tag">&lt;/div&gt;</span>

<span class="hljs-tag">&lt;div</span> <span class="hljs-attr">&#123;@attach</span> <span class="hljs-attr">dnd.draggable(itemData)&#125;</span><span class="hljs-tag">&gt;</span>Drag me<span class="hljs-tag">&lt;/div&gt;</span>
<span class="hljs-tag">&lt;div</span> <span class="hljs-attr">&#123;@attach</span> <span class="hljs-attr">dnd.dropzone()&#125;</span><span class="hljs-tag">&gt;</span>Drop here<span class="hljs-tag">&lt;/div&gt;</span></code></pre>
      </div>
   </div>
</section>

<!-- Installation Section -->
<section id="installation" class="installation">
   <div class="container">
      <h2>Get Started in Seconds</h2>
      <div class="install-code">
         npm install attach-this
      </div>
      <p style="color: rgba(255,255,255,0.8); max-width: 600px; margin: 0 auto;">
         Compatible with Svelte 5 and above. Zero configuration required - just install and start building amazing interactions.
      </p>
   </div>
</section>

<!-- Advanced Examples Section -->
<section class="examples">
   <div class="container">
      <h2>Advanced Examples</h2>
      
      <div class="code-section">
         <h3>🎯 Hoverable with Reactive State</h3>
         <pre><code><span class="hljs-keyword">import</span> &#123; hoverable &#125; <span class="hljs-keyword">from</span> <span class="hljs-string">'attach-this'</span>

<span class="hljs-comment">// Multiple independent hoverable elements</span>
<span class="hljs-tag">&lt;div</span> <span class="hljs-attr">&#123;...hoverable&#125;</span><span class="hljs-tag">&gt;</span>Element 1<span class="hljs-tag">&lt;/div&gt;</span>
<span class="hljs-tag">&lt;div</span> <span class="hljs-attr">&#123;...hoverable&#125;</span><span class="hljs-tag">&gt;</span>Element 2<span class="hljs-tag">&lt;/div&gt;</span>

<span class="hljs-comment">&lt;!-- Reactive display --&gt;</span>
<span class="hljs-tag">&lt;p&gt;</span>Currently hovering: &#123;$hoverable?.textContent&#125;<span class="hljs-tag">&lt;/p&gt;</span>

<span class="hljs-comment">&lt;!-- Automatic CSS classes --&gt;</span>
<span class="hljs-tag">&lt;style&gt;</span>
  <span class="hljs-selector-class">.element</span><span class="hljs-selector-pseudo">:global(.hovering)</span> &#123;
    <span class="hljs-attribute">background</span>: hotpink;
    <span class="hljs-attribute">transform</span>: <span class="hljs-built_in">scale</span>(<span class="hljs-number">1.05</span>);
  &#125;
<span class="hljs-tag">&lt;/style&gt;</span></code></pre>
      </div>

      <div class="code-section">
         <h3>👻 Drag & Drop with Custom Ghost</h3>
         <pre><code><span class="hljs-keyword">import</span> &#123; createDnd &#125; <span class="hljs-keyword">from</span> <span class="hljs-string">'attach-this'</span>
<span class="hljs-keyword">import</span> &#123; createGhostMiddleware &#125; <span class="hljs-keyword">from</span> <span class="hljs-string">'attach-this'</span>

<span class="hljs-keyword">const</span> dnd = <span class="hljs-function">createDnd</span>()
dnd.<span class="hljs-function">use</span>(<span class="hljs-function">createGhostMiddleware</span>())

<span class="hljs-comment">// Create custom ghost element</span>
<span class="hljs-keyword">const</span> ghost = document.<span class="hljs-function">createElement</span>(<span class="hljs-string">'div'</span>)
ghost.style.cssText = <span class="hljs-string">`
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
  padding: 1rem;
  border-radius: 8px;
`</span>

<span class="hljs-keyword">const</span> itemData = () => <span class="hljs-string">"Premium Item"</span>
itemData.ghost = ghost</code></pre>
      </div>

      <div class="code-section">
         <h3>✅ Validation with Visual Feedback</h3>
         <pre><code><span class="hljs-keyword">import</span> &#123; createValidationMiddleware, classes &#125; <span class="hljs-keyword">from</span> <span class="hljs-string">'attach-this'</span>

<span class="hljs-keyword">const</span> validation = <span class="hljs-function">createValidationMiddleware</span>()
dnd.<span class="hljs-function">use</span>(validation.middleware)

<span class="hljs-comment">// Validation logic</span>
<span class="hljs-keyword">const</span> validate = (dataCallback) => &#123;
  <span class="hljs-keyword">const</span> data = <span class="hljs-function">dataCallback</span>()
  <span class="hljs-keyword">if</span> (data.type !== <span class="hljs-string">'allowed'</span>) <span class="hljs-keyword">return</span>
  
  <span class="hljs-keyword">return</span> () => &#123;
    <span class="hljs-function">console.log</span>(<span class="hljs-string">`Dropped: $&#123;data.name&#125;`</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">true</span>
  &#125;
&#125;

<span class="hljs-comment">// Add visual feedback</span>
<span class="hljs-keyword">const</span> setupClasses = <span class="hljs-function">classes</span>(<span class="hljs-string">'valid'</span>, <span class="hljs-string">'invalid'</span>)
<span class="hljs-function">setupClasses</span>(validate)</code></pre>
      </div>
   </div>
</section>

<!-- Documentation Section -->
<section class="docs-section">
   <div class="container">
      <h2>Documentation & Resources</h2>
      <div class="docs-grid">
         <div class="doc-card">
            <span class="doc-icon">🎯</span>
            <h3>Hoverable Demo</h3>
            <p>Interactive examples of the hoverable dollar store with nested elements, reactive state, and visual feedback.</p>
            <a href="/hoverable" class="btn btn-secondary">Try Hoverable Demo</a>
         </div>

         <div class="doc-card">
            <span class="doc-icon">🔄</span>
            <h3>DND Test Suite</h3>
            <p>Complete drag and drop examples showing core functionality, ghost middleware, validation, and combined features.</p>
            <a href="/dnd" class="btn btn-secondary">Try DND Demo</a>
         </div>

         <div class="doc-card">
            <span class="doc-icon">💻</span>
            <h3>Source Code</h3>
            <p>Open source on GitHub. View the code, report issues, and contribute to the project.</p>
            <a href="https://github.com/your-repo/attach-this" class="btn btn-secondary" target="_blank" rel="noopener">View on GitHub</a>
         </div>
      </div>
   </div>
</section>

<!-- Footer -->
<footer>
   <div class="container">
      <div class="footer-content">
         <div class="footer-section">
            <h4>Examples</h4>
            <a href="/hoverable">Hoverable Demo</a>
            <a href="/dnd">DND Test Suite</a>
            <a href="/#features">Features Overview</a>
            <a href="/#installation">Installation</a>
         </div>
         <div class="footer-section">
            <h4>Community</h4>
            <a href="https://github.com/your-repo/attach-this" target="_blank" rel="noopener">GitHub</a>
            <a href="https://github.com/your-repo/attach-this/issues" target="_blank" rel="noopener">Issues</a>
            <a href="https://github.com/your-repo/attach-this/discussions" target="_blank" rel="noopener">Discussions</a>
         </div>
         <div class="footer-section">
            <h4>Resources</h4>
            <a href="https://svelte.dev/docs/svelte/attachments" target="_blank" rel="noopener">Svelte 5 Attachments</a>
            <a href="https://github.com/your-repo/attach-this/blob/main/CHANGELOG.md" target="_blank" rel="noopener">Changelog</a>
            <a href="https://github.com/your-repo/attach-this/blob/main/LICENSE" target="_blank" rel="noopener">License</a>
         </div>
      </div>
      <div class="footer-bottom">
         <p>&copy; 2025 attach-this. Built with ❤️ for the Svelte community.</p>
      </div>
   </div>
</footer>

<style>
   /* Hero Section */
   .hero {
      padding: 4rem 0;
      text-align: center;
      position: relative;
   }
   
   .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 50% 50%, rgba(78, 205, 196, 0.1) 0%, transparent 50%);
      pointer-events: none;
   }
   
   .hero-content {
      position: relative;
      z-index: 2;
   }
   
   .hero h1 {
      font-size: clamp(3rem, 8vw, 6rem);
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: float 6s ease-in-out infinite;
   }
   
   .hero p {
      font-size: 1.25rem;
      color: #b0b0b0;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
   }
   
   .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
   }
   
   .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border: none;
      border-radius: 50px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      font-size: 1rem;
   }
   
   .btn-primary {
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
   }
   
   .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
   }
   
   .btn-secondary {
      background: transparent;
      color: #e0e0e0;
      border: 2px solid #555;
   }
   
   .btn-secondary:hover {
      border-color: #4ecdc4;
      color: #4ecdc4;
      transform: translateY(-2px);
   }
   
   /* Features Grid */
   .features {
      padding: 4rem 0;
   }
   
   .features h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #ffffff;
   }
   
   .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
   }
   
   .feature-card {
      background: rgba(42, 42, 42, 0.8);
      border: 1px solid #444;
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
   }
   
   .feature-card:hover {
      transform: translateY(-8px);
      border-color: #4ecdc4;
      box-shadow: 0 16px 40px rgba(78, 205, 196, 0.2);
   }
   
   .feature-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
   }
   
   .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #ffffff;
   }
   
   .feature-card p {
      color: #b0b0b0;
      margin-bottom: 1.5rem;
   }
   
   .feature-demo {
      background: #333;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      border: 1px solid #555;
      position: relative;
      overflow: hidden;
   }
   
   .demo-link {
      color: #4ecdc4;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: color 0.3s ease;
   }
   
   .demo-link:hover {
      color: #ff6b6b;
   }
   
   /* Demo Elements */
   .demo-hoverable {
      background: #1a2332;
      color: #64b5f6;
      padding: 1rem;
      border: 2px dashed #2196f3;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      user-select: none;
   }
   
   .demo-hoverable:global(.hovering) {
      border-color: hotpink;
      background: #4a1a3a;
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(255, 105, 180, 0.3);
   }
   
   .demo-draggable {
      background: #e3f2fd;
      color: #0d47a1;
      padding: 1rem;
      border: 1px solid #2196f3;
      border-radius: 8px;
      cursor: grab;
      user-select: none;
      transition: all 0.2s ease;
      text-align: center;
      margin-bottom: 1rem;
   }
   
   .demo-draggable:active {
      cursor: grabbing;
      transform: scale(0.95);
   }
   
   .demo-draggable.ghost {
      background: #ffe0b2;
      color: #e65100;
      border-color: #ff9800;
   }
   
   .demo-draggable.valid {
      background: #c8e6c9;
      color: #1b5e20;
      border-color: #4caf50;
   }
   
   .demo-dropzone {
      background: #f3e5f5;
      color: #4a148c;
      padding: 2rem 1rem;
      border: 2px dashed #9c27b0;
      border-radius: 8px;
      text-align: center;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      cursor: pointer;
   }
   
   .demo-dropzone:hover {
      background: #e1bee7;
      transform: scale(1.02);
   }
   
   .demo-dropzone.validation {
      border-color: #ff9800;
      background: #fff3e0;
      color: #e65100;
   }
   
   .ghost-preview {
      font-size: 0.8rem;
      color: #999;
      text-align: center;
      margin-top: 0.5rem;
   }
   
   /* Code Examples */
   .code-section {
      background: rgba(26, 26, 26, 0.9);
      border-radius: 16px;
      padding: 2rem;
      margin: 3rem 0;
      border: 1px solid #333;
   }
   
   .code-section h3 {
      color: #4ecdc4;
      margin-bottom: 1rem;
      font-size: 1.25rem;
   }
   
   pre {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 1.5rem;
      overflow-x: auto;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9rem;
      line-height: 1.4;
   }
   
   code {
      color: #e0e0e0;
   }
   
   /* Installation */
   .installation {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 4rem 0;
      text-align: center;
      margin: 4rem 0;
   }
   
   .installation h2 {
      color: white;
      font-size: 2.5rem;
      margin-bottom: 2rem;
   }
   
   .install-code {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 1rem 2rem;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 1.2rem;
      color: white;
      display: inline-block;
      margin-bottom: 2rem;
   }
   
   /* Examples section */
   .examples {
      padding: 4rem 0;
   }
   
   .examples h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #ffffff;
   }
   
   /* Documentation section */
   .docs-section {
      padding: 4rem 0;
      background: rgba(26, 26, 26, 0.5);
   }
   
   .docs-section h2 {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 3rem;
      color: #ffffff;
   }
   
   .docs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
   }
   
   .doc-card {
      background: rgba(42, 42, 42, 0.8);
      border: 1px solid #444;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
   }
   
   .doc-card:hover {
      transform: translateY(-4px);
      border-color: #4ecdc4;
      box-shadow: 0 8px 25px rgba(78, 205, 196, 0.2);
   }
   
   .doc-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
   }
   
   .doc-card h3 {
      color: #ffffff;
      margin-bottom: 1rem;
   }
   
   .doc-card p {
      color: #b0b0b0;
      margin-bottom: 2rem;
   }
   
   /* Footer */
   footer {
      background: #1a1a1a;
      padding: 3rem 0;
      text-align: center;
      border-top: 1px solid #333;
   }
   
   .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
      text-align: left;
   }
   
   .footer-section h4 {
      color: #4ecdc4;
      margin-bottom: 1rem;
   }
   
   .footer-section a {
      color: #b0b0b0;
      text-decoration: none;
      display: block;
      margin-bottom: 0.5rem;
      transition: color 0.3s ease;
   }
   
   .footer-section a:hover {
      color: #4ecdc4;
   }
   
   .footer-bottom {
      border-top: 1px solid #333;
      padding-top: 2rem;
      color: #666;
   }
   
   /* Animations */
   @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
   }
   
   /* Responsive */
   @media (max-width: 768px) {
      .hero {
         padding: 3rem 0;
      }
      
      .cta-buttons {
         flex-direction: column;
         align-items: center;
      }
      
      .features-grid {
         grid-template-columns: 1fr;
      }
      
      .docs-grid {
         grid-template-columns: 1fr;
      }
      
      .footer-content {
         grid-template-columns: 1fr;
         text-align: center;
      }
   }
</style>
