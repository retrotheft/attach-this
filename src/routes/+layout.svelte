<script>
   import '../app.css'
</script>

<!-- Header -->
<header>
   <nav>
      <div class="container">
         <div class="nav-content">
            <a href="/" class="logo">attach-this</a>
            <ul class="nav-links">
               <li><a href="/#features">Features</a></li>
               <li><a href="/hoverable">Hoverable Demo</a></li>
               <li><a href="/dnd">DND Demo</a></li>
               <li><a href="https://github.com/your-repo/attach-this" target="_blank" rel="noopener">GitHub</a></li>
            </ul>
         </div>
      </div>
   </nav>
</header>

<main>
   <slot />
</main>

<style>
   header {
      background: rgba(42, 42, 42, 0.95);
      backdrop-filter: blur(10px);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      border-bottom: 1px solid #444;
   }
   
   .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
   }
   
   .logo {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
   }
   
   .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
   }
   
   .nav-links a {
      color: #e0e0e0;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
   }
   
   .nav-links a:hover {
      color: #4ecdc4;
   }
   
   .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      transition: width 0.3s ease;
   }
   
   .nav-links a:hover::after {
      width: 100%;
   }
   
   main {
      padding-top: 80px; /* Account for fixed header */
   }
   
   /* Mobile responsiveness */
   @media (max-width: 768px) {
      .nav-links {
         gap: 1rem;
         font-size: 0.9rem;
      }
      
      .logo {
         font-size: 1.25rem;
      }
   }
   
   @media (max-width: 640px) {
      .nav-links {
         display: none;
      }
      
      .nav-content {
         justify-content: center;
      }
   }
</style>
