/**
 * LANverse - Main Application
 * Handles PWA functionality, navigation, and global app state
 */

class LANverseApp {
    constructor() {
        this.isOnline = navigator.onLine;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupPWA();
        this.setupGlobalEventListeners();
        this.setupNetworkStatusListener();
        this.initializeCurrentPage();
        this.showInstallPrompt();
    }

    /**
     * Setup Progressive Web App features
     */
    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }

        // Handle app install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Handle navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                this.handleNavigation(e);
            }
        });

        // Handle back button
        window.addEventListener('popstate', (e) => {
            this.handleBackNavigation(e);
        });

        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('lanverse-form')) {
                e.preventDefault();
                this.handleFormSubmission(e);
            }
        });
    }

    /**
     * Setup network status listener
     */
    setupNetworkStatusListener() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNetworkStatus('Connected', 'success');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNetworkStatus('Offline - Some features may be limited', 'warning');
        });
    }

    /**
     * Initialize current page functionality
     */
    initializeCurrentPage() {
        const page = this.getCurrentPage();
        
        switch (page) {
            case 'home':
                this.initHomePage();
                break;
            case 'create-event':
                this.initCreateEventPage();
                break;
            case 'join-event':
                this.initJoinEventPage();
                break;
            case 'event-lobby':
                this.initEventLobbyPage();
                break;
            case 'profile':
                this.initProfilePage();
                break;
            default:
                console.log('Unknown page:', page);
        }
    }

    /**
     * Get current page name from URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page === '' || page === 'index' ? 'home' : page;
    }

    /**
     * Initialize home page
     */
    initHomePage() {
        // Events are loaded by EventsManager
        this.setupSearchFunctionality();
        this.setupFilterFunctionality();
    }

    /**
     * Setup search functionality
     */
    setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const query = e.target.value.trim();
                    if (window.eventsManager) {
                        if (query) {
                            window.eventsManager.searchEvents(query);
                        } else {
                            window.eventsManager.refresh();
                        }
                    }
                }, 300);
            });
        }
    }

    /**
     * Setup filter functionality
     */
    setupFilterFunctionality() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                if (window.eventsManager) {
                    if (category === 'all') {
                        window.eventsManager.refresh();
                    } else {
                        window.eventsManager.filterByCategory(category);
                    }
                }
                
                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    /**
     * Initialize create event page
     */
    initCreateEventPage() {
        // This will be implemented when we create the create-event page
        console.log('Create event page initialized');
    }

    /**
     * Initialize join event page
     */
    initJoinEventPage() {
        // This will be implemented when we create the join-event page
        console.log('Join event page initialized');
    }

    /**
     * Initialize event lobby page
     */
    initEventLobbyPage() {
        // This will be implemented when we create the event-lobby page
        console.log('Event lobby page initialized');
    }

    /**
     * Initialize profile page
     */
    initProfilePage() {
        // This will be implemented when we update the profile page
        console.log('Profile page initialized');
    }

    /**
     * Handle navigation clicks
     */
    handleNavigation(e) {
        const href = e.target.getAttribute('href');
        
        // Only handle internal links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    /**
     * Handle back navigation
     */
    handleBackNavigation(e) {
        // Update current page
        this.currentPage = this.getCurrentPage();
        this.initializeCurrentPage();
    }

    /**
     * Handle form submissions
     */
    handleFormSubmission(e) {
        const form = e.target;
        const formData = new FormData(form);
        const formType = form.dataset.formType;
        
        switch (formType) {
            case 'create-event':
                this.handleCreateEvent(formData);
                break;
            case 'join-event':
                this.handleJoinEvent(formData);
                break;
            case 'profile-update':
                this.handleProfileUpdate(formData);
                break;
            default:
                console.log('Unknown form type:', formType);
        }
    }

    /**
     * Handle create event form
     */
    handleCreateEvent(formData) {
        // This will be implemented with the create event wizard
        console.log('Create event form submitted');
    }

    /**
     * Handle join event form
     */
    handleJoinEvent(formData) {
        // This will be implemented with the join event wizard
        console.log('Join event form submitted');
    }

    /**
     * Handle profile update form
     */
    handleProfileUpdate(formData) {
        // Update user profile
        const updates = {};
        for (let [key, value] of formData.entries()) {
            updates[key] = value;
        }
        
        storage.updateUserProfile(updates);
        this.showNotification('Profile updated successfully!', 'success');
    }

    /**
     * Show install button for PWA
     */
    showInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'block';
            installBtn.addEventListener('click', () => {
                this.installApp();
            });
        }
    }

    /**
     * Install the PWA
     */
    installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                this.deferredPrompt = null;
            });
        }
    }

    /**
     * Show install prompt
     */
    showInstallPrompt() {
        // Show install prompt after 30 seconds if not already installed
        setTimeout(() => {
            if (!window.matchMedia('(display-mode: standalone)').matches && 
                !window.navigator.standalone) {
                this.showNotification('Install LANverse for a better experience!', 'info', 5000);
            }
        }, 30000);
    }

    /**
     * Show network status notification
     */
    showNetworkStatus(message, type) {
        this.showNotification(message, type, 3000);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info', duration = 5000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }

    /**
     * Get query parameter from URL
     */
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * Update page title
     */
    updatePageTitle(title) {
        document.title = `${title} - LANverse`;
    }

    /**
     * Check if user is authenticated (mock implementation)
     */
    isAuthenticated() {
        return storage.getUserProfile() !== null;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return storage.getUserProfile();
    }

    /**
     * Utility method to format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    /**
     * Utility method to format date
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lanverseApp = new LANverseApp();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LANverseApp;
}