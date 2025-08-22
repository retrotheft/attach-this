<a href="https://github.com/epicenter-so/epicenter" target="_blank">
   <div>
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
         <!-- Pure black background -->
         <rect width="400" height="400" fill="#000000" />
         <!-- Top-left circle (gray) - drawn first so it appears behind -->
         <circle cx="170" cy="170" r="100" fill="#cccccc" opacity="1" />
         <!-- Bottom-right circle (pure white) - drawn second so it appears in front -->
         <circle cx="230" cy="230" r="100" fill="#ffffff" opacity="1" />
      </svg>
      <p>epicenter</p>
   </div>
</a>

<style>
   a {
      display: contents;
   }

   div {
      --scale: 2px;
      font-family: "Manrope", sans-serif;
      font-weight: 600;
      width: calc(var(--scale) * 88);
      height: calc(var(--scale) * 31);
      display: flex;
      position: absolute;
      right: 55px;
      bottom: 70px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
   }

   div::before {
      content: "sponsored by";
      position: absolute;
      bottom: 100%;
      right: 0;
      font-size: 0.7rem;
      color: #ddd;
      font-weight: 400;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
   }

   div::after {
      content: "proud supporters of open source";
      font-family: "Lato", sans-serif;
      font-size: 0.7rem;
      font-weight: 400;
      letter-spacing: 0.07em;
      position: absolute;
      top: 105%;
      left: 0;
      right: 0;
      color: #eee;
      margin-top: 4px;
      font-style: italic;
      text-align: center;
   }

   svg {
      border: 1px solid #d1d5db;
      border-right: none;
      background: white;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
   }

   p {
      display: flex;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      color: #1a1a1a;
      font-size: 1.2rem;
      letter-spacing: 0.001em;
      font-weight: 700;
      flex-grow: 1;
      margin: 0;
      border: 1px solid #d1d5db;
      border-left: none;
      justify-content: center;
      align-items: center;
      transition: background 0.2s ease;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
   }

   p:hover {
      background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
   }
</style>
