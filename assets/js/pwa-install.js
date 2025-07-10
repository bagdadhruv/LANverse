// LANverse PWA Installation Handler
// Manages PWA installation, updates, and service worker registration

(function() {
  'use strict';
  
  console.log('📱 LANverse PWA Install Handler loaded');
  
  let deferredPrompt;
  let isInstalled = false;
  
  // Check if PWA is already installed
  function checkInstallation() {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isNavigatorStandalone = window.navigator.standalone === true;
    const hasPWAFlag = window.location.search.includes('pwa=true');
    
    if (isStandalone || isNavigatorStandalone) {
      console.log('✅ PWA is installed and running in standalone mode');
      isInstalled = true;
      hideInstallButton();
      return true;
    }
    
    // Check if PWA is installed but not in standalone mode
    if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      console.log('⚠️ PWA is installed but not in standalone mode');
      isInstalled = true;
      hideInstallButton();
      return true;
    }
    
    // If we're in browser mode and not on the landing page, don't show install button
    if (!isStandalone && !hasPWAFlag && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      console.log('🌐 Browser mode on internal page - hiding install button');
      hideInstallButton();
      return false;
    }
    
    console.log('📱 PWA is not installed');
    return false;
  }
  
  // Register service worker with error handling
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      console.log('🔧 Registering service worker...');
      
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
          console.log('✅ Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', function() {
            console.log('🔄 Service Worker update found');
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', function() {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New service worker installed, reload to update');
                showUpdateNotification();
              }
            });
          });
        })
        .catch(function(error) {
          console.warn('⚠️ Service Worker registration failed:', error);
          
          // Handle specific SSL errors and unknown errors
          if (error.name === 'SecurityError' || error.message.includes('SSL certificate') || error.message.includes('unknown error')) {
            console.log('🔒 SSL/Network error - this is expected with self-signed certificates');
            console.log('📱 PWA features will work but service worker is disabled');
            console.log('💡 For production, use a valid SSL certificate');
          } else {
            console.error('❌ Service Worker registration error:', error);
          }
        });
    } else {
      console.log('⚠️ Service Worker not supported');
    }
  }
  
  // Show update notification
  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: linear-gradient(135deg, #a259ff, #ff6b9d);
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 300px;
      ">
        <h4 style="margin: 0 0 0.5rem 0;">🔄 Update Available</h4>
        <p style="margin: 0 0 1rem 0; font-size: 0.9rem;">A new version of LANverse is available.</p>
        <button onclick="window.location.reload()" style="
          background: white;
          color: #a259ff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font-weight: bold;
        ">Update Now</button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: transparent;
          color: white;
          border: 1px solid white;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          margin-left: 0.5rem;
        ">Later</button>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }
  
  // Handle beforeinstallprompt event
  function handleBeforeInstallPrompt(e) {
    console.log('📱 Before install prompt triggered');
    e.preventDefault();
    deferredPrompt = e;
    
    // Only show install button on landing page or if explicitly in PWA mode
    const isLandingPage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    const hasPWAFlag = window.location.search.includes('pwa=true');
    
    if (isLandingPage || hasPWAFlag) {
      showInstallButton();
    } else {
      console.log('🌐 Not showing install button on internal page');
    }
  }
  
  // Handle appinstalled event
  function handleAppInstalled(e) {
    console.log('✅ PWA installed successfully');
    isInstalled = true;
    hideInstallButton();
    showInstallSuccess();
  }
  
  // Show install button
  function showInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    const ctaInstallBtn = document.getElementById('cta-pwa-install-btn');
    
    if (installBtn) {
      installBtn.style.display = 'inline-block';
    }
    
    if (ctaInstallBtn) {
      ctaInstallBtn.style.display = 'inline-block';
    }
    
    // Hide download button if install button is shown
    const downloadBtn = document.getElementById('download-pwa-btn');
    if (downloadBtn) {
      downloadBtn.style.display = 'none';
    }
  }
  
  // Hide install button
  function hideInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    const ctaInstallBtn = document.getElementById('cta-pwa-install-btn');
    
    if (installBtn) {
      installBtn.style.display = 'none';
    }
    
    if (ctaInstallBtn) {
      ctaInstallBtn.style.display = 'none';
    }
  }
  
  // Show install success message
  function showInstallSuccess() {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(162, 89, 255, 0.3);
        border-radius: 1rem;
        padding: 2rem;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        max-width: 400px;
      ">
        <h3 style="color: #a259ff; margin-bottom: 1rem;">🎉 LANverse Installed!</h3>
        <p style="margin-bottom: 1.5rem;">Your PWA has been installed successfully. Open it from your apps or desktop for the best experience!</p>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: linear-gradient(135deg, #a259ff, #ff6b9d);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: bold;
        ">Got it!</button>
      </div>
    `;
    document.body.appendChild(successDiv);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 8000);
  }
  
  // Install the PWA
  function installApp() {
    if (!deferredPrompt) {
      console.log('⚠️ No install prompt available');
      return;
    }
    
    console.log('📱 Installing PWA...');
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log('📱 User choice:', choiceResult.outcome);
      deferredPrompt = null;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
        isInstalled = true;
        hideInstallButton();
      } else {
        console.log('❌ User dismissed the install prompt');
      }
    });
  }
  
  // Show install guide
  function showInstallGuide() {
    const guide = document.getElementById('install-guide');
    if (guide) {
      guide.style.display = 'flex';
    }
  }
  
  // Initialize PWA installation handler
  function init() {
    console.log('📱 Initializing PWA installation handler...');
    
    // Check if already installed
    checkInstallation();
    
    // Register service worker
    registerServiceWorker();
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for successful installation
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // Monitor display mode changes
    window.matchMedia('(display-mode: standalone)').addEventListener('change', function(e) {
      console.log('📱 Display mode changed:', e.matches ? 'standalone' : 'browser');
      if (e.matches) {
        isInstalled = true;
        hideInstallButton();
      } else {
        checkInstallation();
      }
    });
    
    // Add click handlers for install buttons
    document.addEventListener('click', function(e) {
      if (e.target.id === 'pwa-install-btn' || e.target.id === 'cta-pwa-install-btn') {
        e.preventDefault();
        installApp();
      }
    });
    
    // Export for external use
    window.lanversePWA = {
      installApp,
      showInstallGuide,
      isInstalled: () => isInstalled,
      checkInstallation
    };
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})(); 