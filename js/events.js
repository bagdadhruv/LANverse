/**
 * LANverse - Events Manager
 * Handles event display, filtering, and interactions
 */

class EventsManager {
    constructor() {
        this.currentLocation = null;
        this.init();
    }

    init() {
        this.loadEvents();
        this.setupEventListeners();
        this.getCurrentLocation();
    }

    /**
     * Load and display events on the home page
     */
    loadEvents() {
        const events = storage.getEvents();
        
        if (events.length === 0) {
            this.showEmptyState();
            return;
        }

        // Sort events by date and separate featured vs nearby
        const sortedEvents = this.sortEventsByDate(events);
        const featuredEvents = this.getFeaturedEvents(sortedEvents);
        const nearbyEvents = this.getNearbyEvents(sortedEvents);

        this.renderFeaturedEvents(featuredEvents);
        this.renderNearbyEvents(nearbyEvents);
        this.hideEmptyState();
    }

    /**
     * Sort events by date (upcoming first)
     */
    sortEventsByDate(events) {
        return events.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateA - dateB;
        });
    }

    /**
     * Get featured events (high attendance, recent, etc.)
     */
    getFeaturedEvents(events) {
        return events
            .filter(event => event.attendees > 5 || event.ticketPrice > 0)
            .slice(0, 3);
    }

    /**
     * Get nearby events (for now, just the remaining events)
     */
    getNearbyEvents(events) {
        const featured = this.getFeaturedEvents(events);
        const featuredIds = featured.map(e => e.id);
        return events.filter(event => !featuredIds.includes(event.id)).slice(0, 6);
    }

    /**
     * Render featured events section
     */
    renderFeaturedEvents(events) {
        const container = document.getElementById('featured-events-grid');
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = '<p class="no-events">No featured events available</p>';
            return;
        }

        container.innerHTML = events.map(event => this.createEventCard(event)).join('');
    }

    /**
     * Render nearby events section
     */
    renderNearbyEvents(events) {
        const container = document.getElementById('nearby-events-grid');
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = '<p class="no-events">No nearby events available</p>';
            return;
        }

        container.innerHTML = events.map(event => this.createEventCard(event)).join('');
    }

    /**
     * Create event card HTML
     */
    createEventCard(event) {
        const eventDate = new Date(event.date + 'T' + event.time);
        const formattedDate = this.formatDate(eventDate);
        const formattedTime = this.formatTime(event.time);
        
        const resourcesHtml = event.requiredResources
            .slice(0, 3)
            .map(resource => `<span class="resource-tag">${resource.type}</span>`)
            .join('');

        const priceDisplay = event.ticketPrice > 0 
            ? `$${event.ticketPrice}` 
            : 'Free';

        return `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    <div class="event-date">${formattedDate}</div>
                    <div class="event-placeholder-bg"></div>
                </div>
                <div class="event-content">
                    <h3 class="event-title">${this.escapeHtml(event.title)}</h3>
                    <div class="event-location">📍 ${this.escapeHtml(event.location)}</div>
                    <p class="event-description">${this.escapeHtml(event.description)}</p>
                    <div class="event-resources">
                        ${resourcesHtml}
                        ${event.requiredResources.length > 3 ? '<span class="resource-tag">+' + (event.requiredResources.length - 3) + ' more</span>' : ''}
                    </div>
                    <div class="event-footer">
                        <div class="event-attendees">${event.attendees}/${event.maxAttendees} going</div>
                        <div class="event-price">${priceDisplay}</div>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-primary join-event-btn" data-event-id="${event.id}">
                            Join Event
                        </button>
                        <button class="btn btn-secondary view-event-btn" data-event-id="${event.id}">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show empty state when no events are available
     */
    showEmptyState() {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.style.display = 'block';
        }
    }

    /**
     * Hide empty state when events are available
     */
    hideEmptyState() {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Event card click handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('join-event-btn')) {
                const eventId = e.target.getAttribute('data-event-id');
                this.handleJoinEvent(eventId);
            } else if (e.target.classList.contains('view-event-btn')) {
                const eventId = e.target.getAttribute('data-event-id');
                this.handleViewEvent(eventId);
            }
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuToggle && navLinks) {
            mobileMenuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    }

    /**
     * Handle join event action
     */
    handleJoinEvent(eventId) {
        // For now, redirect to join page (to be created)
        window.location.href = `join-event.html?id=${eventId}`;
    }

    /**
     * Handle view event details
     */
    handleViewEvent(eventId) {
        // For now, redirect to event details page (to be created)
        window.location.href = `event-lobby.html?id=${eventId}`;
    }

    /**
     * Get current location (mock implementation)
     */
    getCurrentLocation() {
        // Mock location for now
        this.currentLocation = {
            lat: 40.7128,
            lng: -74.0060,
            city: 'New York'
        };
    }

    /**
     * Calculate distance between two points (simplified)
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        // Simple distance calculation (not accurate, just for demo)
        const dx = lat2 - lat1;
        const dy = lng2 - lng1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Format date for display
     */
    formatDate(date) {
        const options = { 
            month: 'short', 
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Format time for display
     */
    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Refresh events display
     */
    refresh() {
        this.loadEvents();
    }

    /**
     * Filter events by category
     */
    filterByCategory(category) {
        const events = storage.getEvents();
        const filteredEvents = events.filter(event => 
            event.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
        );
        
        this.renderFeaturedEvents(filteredEvents.slice(0, 3));
        this.renderNearbyEvents(filteredEvents.slice(3));
    }

    /**
     * Search events by title or description
     */
    searchEvents(query) {
        const events = storage.getEvents();
        const searchTerm = query.toLowerCase();
        
        const filteredEvents = events.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm)
        );
        
        this.renderFeaturedEvents(filteredEvents.slice(0, 3));
        this.renderNearbyEvents(filteredEvents.slice(3));
    }
}

// Initialize events manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eventsManager = new EventsManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventsManager;
}