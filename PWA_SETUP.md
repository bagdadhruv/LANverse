# LANverse PWA Setup Guide

## Overview

LANverse has been converted to a Progressive Web App (PWA) that provides a native app-like experience. The PWA starts from the authentication page (`auth.html`) and provides a seamless experience for users to discover and join local parties.

## PWA Features

### ✅ Implemented Features

1. **App Installation**
   - Install prompt appears on supported browsers
   - App can be installed on home screen
   - Works on Android, iOS, and desktop

2. **Offline Functionality**
   - Service worker caches essential files
   - App works offline after first visit
   - Automatic updates when online

3. **Native App Experience**
   - Standalone mode (no browser UI)
   - Custom splash screen
   - App shortcuts for quick actions

4. **Push Notifications**
   - Service worker handles notifications
   - Background sync capabilities
   - Notification actions (View Party, Close)

5. **Responsive Design**
   - Works on all device sizes
   - Touch-friendly interface
   - Mobile-first design

## File Structure

```
LANverse/
├── manifest.json              # PWA manifest
├── service-worker.js          # Service worker for offline functionality
├── assets/
│   ├── js/
│   │   └── pwa-install.js    # PWA installation logic
│   └── images/
│       └── icon.svg          # Base icon for generating PNGs
├── auth.html                  # PWA entry point (authentication)
├── home.html                  # Main app interface
├── index.html                 # Marketing landing page
└── generate-icons.html        # Icon generation tool
```

## Setup Instructions

### 1. Generate App Icons

1. Open `generate-icons.html` in a web browser
2. Click "Download All Icons" to generate PNG icons
3. Save the downloaded icons to `assets/images/` with the following names:
   - `icon-72.png`
   - `icon-96.png`
   - `icon-128.png`
   - `icon-144.png`
   - `icon-152.png`
   - `icon-192.png`
   - `icon-384.png`
   - `icon-512.png`

### 2. Serve the App

The PWA must be served over HTTPS (required for service workers). You can use:

**Local Development:**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

**Production:**
- Deploy to any HTTPS hosting service
- Ensure all files are accessible
- Set up proper caching headers

### 3. Test the PWA

1. **Installation Test:**
   - Visit the site on a mobile device or desktop
   - Look for the install prompt
   - Install the app to home screen

2. **Offline Test:**
   - Load the app once while online
   - Turn off internet connection
   - Refresh the page - should still work

3. **Update Test:**
   - Modify any file
   - Reload the page
   - Should see update notification

## User Flow

### Marketing Site (index.html)
- Landing page for new users
- "Download PWA" button
- Install prompt appears automatically
- Redirects to auth.html after installation

### PWA Entry Point (auth.html)
- First screen users see in the PWA
- Login/Signup functionality
- Redirects to home.html after authentication

### Main App (home.html)
- Core application interface
- Party discovery and management
- Navigation to other app sections

## Browser Support

### Full PWA Support
- Chrome (Android/Desktop)
- Edge (Windows)
- Safari (iOS 11.3+)
- Firefox (Android/Desktop)

### Limited Support
- Internet Explorer (no PWA features)
- Older browsers (fallback to web app)

## PWA Manifest Configuration

The `manifest.json` includes:

- **App Identity**: Name, description, icons
- **Display Mode**: Standalone (native app experience)
- **Start URL**: `/auth.html` (authentication first)
- **Theme Colors**: Purple gradient theme
- **Shortcuts**: Quick access to Host Party and My Events
- **Screenshots**: For app store listings

## Service Worker Features

### Caching Strategy
- **Static Files**: Cached on install
- **Dynamic Content**: Network-first with cache fallback
- **API Requests**: Network-first with cache fallback

### Offline Support
- Essential pages cached
- Graceful degradation
- Offline indicator (can be added)

### Background Sync
- Push notifications
- Offline action queuing
- Automatic sync when online

## Customization

### Colors and Theme
Edit the manifest.json:
```json
{
  "theme_color": "#a259ff",
  "background_color": "#0a0a0f"
}
```

### App Icons
Replace the icons in `assets/images/` with your custom designs.

### Install Prompt
Customize the install button in `assets/js/pwa-install.js`:
```javascript
showInstallButton() {
  // Customize button appearance and behavior
}
```

## Troubleshooting

### Install Prompt Not Showing
- Ensure HTTPS is enabled
- Check browser compatibility
- Verify manifest.json is valid
- Clear browser cache

### Service Worker Not Registering
- Check for JavaScript errors
- Verify service-worker.js path
- Ensure HTTPS connection
- Check browser console for errors

### Offline Not Working
- Verify files are being cached
- Check service worker cache strategy
- Test with browser dev tools

## Performance Optimization

### Loading Speed
- Minimize initial bundle size
- Use efficient caching strategies
- Optimize images and assets

### Battery Life
- Minimize background sync
- Efficient service worker logic
- Optimize network requests

## Security Considerations

### HTTPS Requirement
- PWA features require HTTPS
- Use valid SSL certificates
- Redirect HTTP to HTTPS

### Content Security Policy
Add CSP headers for security:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

## Analytics and Tracking

The PWA includes installation tracking:
```javascript
trackInstallation() {
  // Google Analytics tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'pwa_install', {
      'event_category': 'engagement',
      'event_label': 'lanverse_pwa'
    });
  }
}
```

## Future Enhancements

### Planned Features
- [ ] Offline party browsing
- [ ] Background location updates
- [ ] Advanced push notifications
- [ ] App shortcuts customization
- [ ] Offline messaging
- [ ] Photo sharing capabilities

### Performance Improvements
- [ ] Lazy loading for images
- [ ] Advanced caching strategies
- [ ] Bundle optimization
- [ ] Critical CSS inlining

## Support

For issues or questions:
- Check browser console for errors
- Verify HTTPS setup
- Test on multiple devices
- Review PWA best practices

---

**LANverse PWA** - Find. Join. Party. 🎉 