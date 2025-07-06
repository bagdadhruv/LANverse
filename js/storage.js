/**
 * LANverse - Local Storage Manager
 * Handles all localStorage operations for the PWA
 */

class StorageManager {
    constructor() {
        this.keys = {
            EVENTS: 'lanverse_events',
            USER_PROFILE: 'lanverse_user_profile',
            JOINED_EVENTS: 'lanverse_joined_events',
            HOSTED_EVENTS: 'lanverse_hosted_events',
            CHAT_MESSAGES: 'lanverse_chat_messages',
            RESOURCES: 'lanverse_resources',
            SETTINGS: 'lanverse_settings'
        };
        
        // Initialize default data if not exists
        this.initializeDefaults();
    }

    /**
     * Initialize default data structure if localStorage is empty
     */
    initializeDefaults() {
        if (!this.getEvents()) {
            this.setEvents(this.getDefaultEvents());
        }
        
        if (!this.getUserProfile()) {
            this.setUserProfile(this.getDefaultUserProfile());
        }
    }

    /**
     * Generic localStorage methods
     */
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    /**
     * Event management methods
     */
    getEvents() {
        return this.getItem(this.keys.EVENTS) || [];
    }

    setEvents(events) {
        return this.setItem(this.keys.EVENTS, events);
    }

    addEvent(event) {
        const events = this.getEvents();
        event.id = this.generateId();
        event.createdAt = new Date().toISOString();
        events.push(event);
        this.setEvents(events);
        return event;
    }

    updateEvent(eventId, updates) {
        const events = this.getEvents();
        const index = events.findIndex(event => event.id === eventId);
        if (index !== -1) {
            events[index] = { ...events[index], ...updates };
            this.setEvents(events);
            return events[index];
        }
        return null;
    }

    deleteEvent(eventId) {
        const events = this.getEvents();
        const filteredEvents = events.filter(event => event.id !== eventId);
        return this.setEvents(filteredEvents);
    }

    getEventById(eventId) {
        const events = this.getEvents();
        return events.find(event => event.id === eventId) || null;
    }

    /**
     * User profile methods
     */
    getUserProfile() {
        return this.getItem(this.keys.USER_PROFILE);
    }

    setUserProfile(profile) {
        return this.setItem(this.keys.USER_PROFILE, profile);
    }

    updateUserProfile(updates) {
        const profile = this.getUserProfile() || {};
        const updatedProfile = { ...profile, ...updates };
        return this.setUserProfile(updatedProfile);
    }

    /**
     * Joined events methods
     */
    getJoinedEvents() {
        return this.getItem(this.keys.JOINED_EVENTS) || [];
    }

    addJoinedEvent(eventId, contribution) {
        const joinedEvents = this.getJoinedEvents();
        const existingIndex = joinedEvents.findIndex(item => item.eventId === eventId);
        
        if (existingIndex === -1) {
            joinedEvents.push({
                eventId,
                contribution,
                joinedAt: new Date().toISOString()
            });
            this.setItem(this.keys.JOINED_EVENTS, joinedEvents);
        }
        
        return joinedEvents;
    }

    removeJoinedEvent(eventId) {
        const joinedEvents = this.getJoinedEvents();
        const filteredEvents = joinedEvents.filter(item => item.eventId !== eventId);
        return this.setItem(this.keys.JOINED_EVENTS, filteredEvents);
    }

    /**
     * Hosted events methods
     */
    getHostedEvents() {
        return this.getItem(this.keys.HOSTED_EVENTS) || [];
    }

    addHostedEvent(eventId) {
        const hostedEvents = this.getHostedEvents();
        if (!hostedEvents.includes(eventId)) {
            hostedEvents.push(eventId);
            this.setItem(this.keys.HOSTED_EVENTS, hostedEvents);
        }
        return hostedEvents;
    }

    /**
     * Chat messages methods
     */
    getChatMessages(eventId) {
        const allMessages = this.getItem(this.keys.CHAT_MESSAGES) || {};
        return allMessages[eventId] || [];
    }

    addChatMessage(eventId, message) {
        const allMessages = this.getItem(this.keys.CHAT_MESSAGES) || {};
        if (!allMessages[eventId]) {
            allMessages[eventId] = [];
        }
        
        const newMessage = {
            id: this.generateId(),
            text: message.text,
            author: message.author,
            timestamp: new Date().toISOString()
        };
        
        allMessages[eventId].push(newMessage);
        this.setItem(this.keys.CHAT_MESSAGES, allMessages);
        return newMessage;
    }

    /**
     * Utility methods
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    clearAllData() {
        Object.values(this.keys).forEach(key => {
            this.removeItem(key);
        });
        this.initializeDefaults();
    }

    /**
     * Default data generators
     */
    getDefaultEvents() {
        return [
            {
                id: 'event_1',
                title: 'Weekend Gaming Marathon',
                location: 'Downtown Community Center',
                date: '2024-02-15',
                time: '18:00',
                description: 'Join us for an epic weekend of gaming! Bring your favorite games and let\'s have some fun.',
                host: 'GameMaster_X',
                attendees: 12,
                maxAttendees: 20,
                resources: ['Gaming Consoles', 'Snacks', 'Drinks'],
                requiredResources: [
                    { type: 'Gaming Setup', count: 2, fulfilled: 1 },
                    { type: 'Snacks', count: 5, fulfilled: 3 },
                    { type: 'Drinks', count: 3, fulfilled: 2 }
                ],
                ticketPrice: 0,
                tags: ['Gaming', 'Community', 'Fun'],
                image: '/assets/gaming-event.jpg',
                createdAt: '2024-01-15T10:00:00Z'
            },
            {
                id: 'event_2',
                title: 'Tech Meetup & Networking',
                location: 'Innovation Hub',
                date: '2024-02-20',
                time: '19:00',
                description: 'Network with fellow tech enthusiasts and share your latest projects!',
                host: 'TechNinja',
                attendees: 8,
                maxAttendees: 15,
                resources: ['Projector', 'Refreshments'],
                requiredResources: [
                    { type: 'Presentation Equipment', count: 1, fulfilled: 1 },
                    { type: 'Refreshments', count: 3, fulfilled: 1 }
                ],
                ticketPrice: 15,
                tags: ['Tech', 'Networking', 'Learning'],
                image: '/assets/tech-event.jpg',
                createdAt: '2024-01-10T14:30:00Z'
            },
            {
                id: 'event_3',
                title: 'Board Game Night',
                location: 'Cozy Corner Cafe',
                date: '2024-02-18',
                time: '20:00',
                description: 'Bring your favorite board games and enjoy a relaxing evening with friends!',
                host: 'BoardGameBuff',
                attendees: 6,
                maxAttendees: 12,
                resources: ['Board Games', 'Snacks'],
                requiredResources: [
                    { type: 'Board Games', count: 4, fulfilled: 2 },
                    { type: 'Snacks', count: 2, fulfilled: 2 }
                ],
                ticketPrice: 0,
                tags: ['Board Games', 'Social', 'Relaxing'],
                image: '/assets/boardgame-event.jpg',
                createdAt: '2024-01-12T16:20:00Z'
            }
        ];
    }

    getDefaultUserProfile() {
        return {
            id: 'user_default',
            name: 'LANverse User',
            email: '',
            location: 'Your City',
            joinedAt: new Date().toISOString(),
            eventsHosted: 0,
            eventsJoined: 0,
            reputation: 0,
            badges: [],
            preferences: {
                notifications: true,
                location: true,
                theme: 'dark'
            }
        };
    }
}

// Create global instance
const storage = new StorageManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}