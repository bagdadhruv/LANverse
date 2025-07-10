// LANverse Standalone Mode Enforcer
// Forces the PWA to run in true standalone mode without browser UI

(function() {
  'use strict';
  
  console.log('🔒 LANverse Standalone Enforcer loaded');
  
  // Check if we're in standalone mode
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://') ||
           window.location.search.includes('pwa=true');
  }
  
  // Check if we're in a PWA context
  function isPWA() {
    return 'serviceWorker' in navigator && 
           (window.location.protocol === 'https:' || window.location.hostname === 'localhost');
  }
  
  // Force standalone mode gently
  function forceStandalone() {
    console.log('🔒 Checking standalone mode...');
    
    const currentMode = isStandalone() ? 'standalone' : 'browser';
    console.log(`📱 Current display mode: ${currentMode}`);
    
    if (!isStandalone() && isPWA()) {
      console.log('⚠️ Not in standalone mode, applying gentle standalone appearance...');
      
      // Add URL parameter to indicate PWA mode (only if not already present)
      if (!window.location.search.includes('pwa=true')) {
        const separator = window.location.search ? '&' : '?';
        const newUrl = window.location.href + separator + 'pwa=true';
        window.history.replaceState(null, '', newUrl);
      }
      
      // Add gentle standalone-specific styles (no aggressive overrides)
      const style = document.createElement('style');
      style.textContent = `
        /* Gentle fullscreen appearance */
        html, body {
          margin: 0;
          padding: 0;
          background: #0a0a0f;
          color: white;
          font-family: 'Inter', sans-serif;
        }
        
        /* Hide scrollbars */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Prevent zoom on mobile */
        @media screen and (max-width: 768px) {
          html, body {
            touch-action: manipulation;
            -webkit-text-size-adjust: none;
          }
        }
        
        /* Gentle app-like appearance */
        body {
          background: #0a0a0f;
          color: white;
          font-family: 'Inter', sans-serif;
        }
        
        /* Subtle PWA mode indicator */
        @media (display-mode: browser) {
          body::before {
            content: '🔒 PWA Mode';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #a259ff, #ff6b9d);
            color: white;
            padding: 0.25rem;
            text-align: center;
            font-size: 0.7rem;
            font-weight: bold;
            z-index: 10000;
            opacity: 0.8;
          }
        }
      `;
      document.head.appendChild(style);
      
      // Show gentle standalone mode indicator
      showStandaloneIndicator();
    }
  }
  
  // Show standalone mode indicator
  function showStandaloneIndicator() {
    // Only show if not already present
    if (document.getElementById('standalone-indicator')) {
      return;
    }
    
    const indicator = document.createElement('div');
    indicator.id = 'standalone-indicator';
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #a259ff, #ff6b9d);
        color: white;
        padding: 0.25rem;
        text-align: center;
        font-size: 0.7rem;
        font-weight: bold;
        z-index: 10000;
        opacity: 0.8;
      ">
        🔒 LANverse PWA Mode
      </div>
    `;
    document.body.appendChild(indicator);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }, 3000);
  }
  
  // Handle navigation gently
  function handleNavigation() {
    // Only block external links in standalone mode
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && link.href && !link.href.startsWith(window.location.origin)) {
        if (isStandalone()) {
          e.preventDefault();
          console.log('🚫 External link blocked in PWA mode:', link.href);
          // Show a gentle message instead of alert
          showMessage('External links are disabled in PWA mode for security.');
        }
      }
    });
    
    // Handle internal navigation gently
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        // For internal links, ensure they stay in PWA mode
        if (isStandalone()) {
          console.log('🔒 Internal navigation in standalone mode:', link.href);
          // Add PWA parameter to internal links if not present
          if (!link.href.includes('pwa=true')) {
            const separator = link.href.includes('?') ? '&' : '?';
            link.href = link.href + separator + 'pwa=true';
          }
        }
      }
    });
  }
  
  // Show gentle message instead of alert
  function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(162, 89, 255, 0.3);
        border-radius: 0.5rem;
        padding: 1rem;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        max-width: 300px;
        color: white;
        font-size: 0.9rem;
      ">
        ${message}
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: linear-gradient(135deg, #a259ff, #ff6b9d);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          margin-top: 0.5rem;
          font-size: 0.8rem;
        ">OK</button>
      </div>
    `;
    document.body.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 5000);
  }
  
  // Prevent browser UI gently
  function preventBrowserUI() {
    // Only disable context menu in standalone mode
    document.addEventListener('contextmenu', function(e) {
      if (isStandalone()) {
        e.preventDefault();
        return false;
      }
    });
    
    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', function() {
      if (isStandalone()) {
        console.log('🔒 Fullscreen state changed in standalone mode');
      }
    });
    
    // Prevent window.open calls in standalone mode
    const originalOpen = window.open;
    window.open = function(url, target, features) {
      if (isStandalone()) {
        console.log('🚫 Blocked window.open in standalone mode:', url);
        return null;
      }
      return originalOpen.call(this, url, target, features);
    };
  }
  
  // Enhanced navigation handler for PWA (without aggressive overrides)
  function setupPWANavigation() {
    console.log('🔒 Setting up PWA navigation handlers');
    
    // Monitor history changes gently
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(state, title, url) {
      if (isStandalone() && url && url.startsWith(window.location.origin)) {
        console.log('🔒 PWA navigation (pushState):', url);
        // Add PWA parameter if not present
        if (!url.includes('pwa=true')) {
          const separator = url.includes('?') ? '&' : '?';
          url = url + separator + 'pwa=true';
        }
      }
      return originalPushState.call(this, state, title, url);
    };
    
    window.history.replaceState = function(state, title, url) {
      if (isStandalone() && url && url.startsWith(window.location.origin)) {
        console.log('🔒 PWA navigation (replaceState):', url);
        // Add PWA parameter if not present
        if (!url.includes('pwa=true')) {
          const separator = url.includes('?') ? '&' : '?';
          url = url + separator + 'pwa=true';
        }
      }
      return originalReplaceState.call(this, state, title, url);
    };
  }
  
  // Initialize standalone enforcement
  function init() {
    console.log('🔒 Initializing standalone enforcer...');
    
    // Check current mode
    const currentMode = isStandalone() ? 'standalone' : 'browser';
    console.log(`📱 Current display mode: ${currentMode}`);
    
    // Force standalone if needed
    forceStandalone();
    
    // Set up navigation handling
    handleNavigation();
    
    // Prevent browser UI
    preventBrowserUI();
    
    // Set up PWA navigation
    setupPWANavigation();
    
    // Monitor for mode changes
    window.matchMedia('(display-mode: standalone)').addEventListener('change', function(e) {
      console.log('🔒 Display mode changed:', e.matches ? 'standalone' : 'browser');
      if (e.matches) {
        showStandaloneIndicator();
      }
    });
    
    // Add standalone mode info to page (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      addStandaloneInfo();
    }
    
    // Check standalone mode periodically (less frequently)
    setInterval(() => {
      if (!isStandalone() && isPWA()) {
        console.log('🔒 Re-checking standalone mode...');
        forceStandalone();
      }
    }, 5000); // Check every 5 seconds instead of 2
  }
  
  // Add standalone mode information to the page (development only)
  function addStandaloneInfo() {
    const info = document.createElement('div');
    info.id = 'pwa-mode-info';
    info.style.cssText = `
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.7rem;
      z-index: 9999;
      opacity: 0.5;
      transition: opacity 0.3s;
    `;
    info.innerHTML = `
      <div>🔒 ${isStandalone() ? 'Standalone' : 'Browser'} Mode</div>
      <div>📱 PWA: ${isPWA() ? 'Yes' : 'No'}</div>
    `;
    
    // Show on hover
    info.addEventListener('mouseenter', () => info.style.opacity = '1');
    info.addEventListener('mouseleave', () => info.style.opacity = '0.5');
    
    document.body.appendChild(info);
    
    // Remove after 10 seconds
    setTimeout(() => {
      if (info.parentNode) {
        info.parentNode.removeChild(info);
      }
    }, 10000);
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Export for external use
  window.LANverseStandalone = {
    isStandalone,
    isPWA,
    forceStandalone,
    showStandaloneIndicator
  };
  
})(); 