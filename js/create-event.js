/**
 * Create Event Wizard
 * Handles step-by-step event creation with validation
 */

class CreateEventWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.resources = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setMinDate();
        this.addInitialResource();
        this.updateStepNavigation();
    }

    /**
     * Setup event listeners for the wizard
     */
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('next-step').addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('prev-step').addEventListener('click', () => {
            this.previousStep();
        });

        // Form submission
        document.getElementById('create-event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Add resource button
        document.getElementById('add-resource').addEventListener('click', () => {
            this.addResource();
        });

        // Form input changes for live preview
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', () => {
                this.updatePreview();
            });
        });

        // Remove resource buttons (delegated)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove-resource')) {
                this.removeResource(e.target.closest('.resource-item'));
            }
        });
    }

    /**
     * Set minimum date to today
     */
    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('event-date').setAttribute('min', today);
    }

    /**
     * Add initial resource item
     */
    addInitialResource() {
        // The initial resource item is already in the HTML
        this.updateResourceEventListeners();
    }

    /**
     * Add a new resource item
     */
    addResource() {
        const container = document.querySelector('.resources-container');
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        resourceItem.innerHTML = `
            <input type="text" placeholder="Resource type (e.g., Gaming Console)" 
                   class="resource-type">
            <input type="number" placeholder="Qty" min="1" class="resource-qty">
            <button type="button" class="btn-remove-resource">Remove</button>
        `;
        container.appendChild(resourceItem);
        this.updateResourceEventListeners();
    }

    /**
     * Remove a resource item
     */
    removeResource(resourceItem) {
        const container = document.querySelector('.resources-container');
        if (container.children.length > 1) {
            resourceItem.remove();
        } else {
            // Clear the inputs instead of removing the last item
            resourceItem.querySelector('.resource-type').value = '';
            resourceItem.querySelector('.resource-qty').value = '';
        }
        this.updatePreview();
    }

    /**
     * Update resource event listeners
     */
    updateResourceEventListeners() {
        document.querySelectorAll('.resource-type, .resource-qty').forEach(input => {
            input.removeEventListener('input', this.updatePreview);
            input.addEventListener('input', () => {
                this.updatePreview();
            });
        });
    }

    /**
     * Move to next step
     */
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepDisplay();
                this.updateStepNavigation();
                this.updatePreview();
            }
        }
    }

    /**
     * Move to previous step
     */
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateStepNavigation();
        }
    }

    /**
     * Validate current step
     */
    validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('input[required], textarea[required], select[required]');
        
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Additional validation for specific steps
        if (this.currentStep === 2) {
            isValid = this.validateDateTime() && isValid;
        }

        return isValid;
    }

    /**
     * Validate date and time
     */
    validateDateTime() {
        const dateInput = document.getElementById('event-date');
        const timeInput = document.getElementById('event-time');
        
        if (dateInput.value && timeInput.value) {
            const eventDateTime = new Date(`${dateInput.value}T${timeInput.value}`);
            const now = new Date();
            
            if (eventDateTime <= now) {
                this.showFieldError(dateInput, 'Event date and time must be in the future');
                return false;
            }
        }
        
        return true;
    }

    /**
     * Show field error
     */
    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#ff4444';
        
        const errorElement = document.createElement('small');
        errorElement.className = 'field-error';
        errorElement.style.color = '#ff4444';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.style.borderColor = '#333';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Update step display
     */
    updateStepDisplay() {
        // Update progress bar
        document.querySelectorAll('.progress-step').forEach(step => {
            const stepNumber = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update form steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        document.querySelector(`[data-step="${this.currentStep}"]`).classList.add('active');
    }

    /**
     * Update step navigation buttons
     */
    updateStepNavigation() {
        const prevBtn = document.getElementById('prev-step');
        const nextBtn = document.getElementById('next-step');
        const submitBtn = document.getElementById('submit-event');

        prevBtn.style.display = this.currentStep === 1 ? 'none' : 'block';
        
        if (this.currentStep === this.totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    /**
     * Update preview in step 4
     */
    updatePreview() {
        if (this.currentStep === 4) {
            this.updateFormData();
            
            // Update basic information
            document.getElementById('preview-title').textContent = this.formData.title || '-';
            document.getElementById('preview-description').textContent = this.formData.description || '-';
            document.getElementById('preview-category').textContent = this.formData.category || '-';
            document.getElementById('preview-max-attendees').textContent = this.formData.maxAttendees || '-';
            
            // Update location and time
            document.getElementById('preview-location').textContent = this.formData.location || '-';
            document.getElementById('preview-date').textContent = this.formData.date ? this.formatDate(this.formData.date) : '-';
            document.getElementById('preview-time').textContent = this.formData.time ? this.formatTime(this.formData.time) : '-';
            document.getElementById('preview-duration').textContent = this.formData.duration ? `${this.formData.duration} hours` : '-';
            
            // Update resources
            document.getElementById('preview-price').textContent = this.formData.ticketPrice > 0 ? `$${this.formData.ticketPrice}` : 'Free';
            
            const resourcesContainer = document.getElementById('preview-resources');
            const resources = this.getResources();
            if (resources.length > 0) {
                resourcesContainer.innerHTML = resources.map(resource => 
                    `<span class="preview-resource-item">${resource.type} (${resource.qty})</span>`
                ).join('');
            } else {
                resourcesContainer.textContent = '-';
            }
            
            document.getElementById('preview-tags').textContent = this.formData.tags || '-';
        }
    }

    /**
     * Update form data object
     */
    updateFormData() {
        const form = document.getElementById('create-event-form');
        const formData = new FormData(form);
        
        for (let [key, value] of formData.entries()) {
            this.formData[key] = value;
        }
    }

    /**
     * Get resources from form
     */
    getResources() {
        const resources = [];
        const resourceItems = document.querySelectorAll('.resource-item');
        
        resourceItems.forEach(item => {
            const type = item.querySelector('.resource-type').value.trim();
            const qty = parseInt(item.querySelector('.resource-qty').value) || 1;
            
            if (type) {
                resources.push({ type, qty, fulfilled: 0 });
            }
        });
        
        return resources;
    }

    /**
     * Submit the form
     */
    submitForm() {
        if (this.validateCurrentStep()) {
            this.updateFormData();
            
            // Prepare event data
            const eventData = {
                title: this.formData.title,
                description: this.formData.description,
                category: this.formData.category,
                location: this.formData.location,
                address: this.formData.address || '',
                date: this.formData.date,
                time: this.formData.time,
                duration: parseInt(this.formData.duration) || 3,
                maxAttendees: parseInt(this.formData.maxAttendees),
                ticketPrice: parseFloat(this.formData.ticketPrice) || 0,
                requiredResources: this.getResources(),
                allowResourceOnly: this.formData.allowResourceOnly === 'on',
                tags: this.formData.tags ? this.formData.tags.split(',').map(tag => tag.trim()) : [],
                host: storage.getUserProfile().name || 'Anonymous',
                attendees: 0,
                resources: []
            };

            // Show loading state
            this.showLoading();

            // Simulate API call delay
            setTimeout(() => {
                try {
                    // Save event to storage
                    const savedEvent = storage.addEvent(eventData);
                    
                    // Add to hosted events
                    storage.addHostedEvent(savedEvent.id);
                    
                    // Show success and redirect
                    this.showSuccess(savedEvent);
                    
                } catch (error) {
                    console.error('Error creating event:', error);
                    this.showError('Failed to create event. Please try again.');
                }
            }, 1500);
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        const form = document.getElementById('create-event-form');
        form.classList.add('form-loading');
        document.getElementById('submit-event').textContent = 'Creating Event...';
    }

    /**
     * Show success state
     */
    showSuccess(event) {
        const formContainer = document.querySelector('.form-container .container');
        formContainer.innerHTML = `
            <div class="form-success">
                <h2>🎉 Event Created Successfully!</h2>
                <p>Your event "${event.title}" has been created and is now live.</p>
                <a href="event-lobby.html?id=${event.id}" class="btn btn-primary">View Event</a>
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
            </div>
        `;
        
        // Update page title
        document.title = 'Event Created - LANverse';
        
        // Show notification
        if (window.lanverseApp) {
            window.lanverseApp.showNotification('Event created successfully!', 'success');
        }
    }

    /**
     * Show error state
     */
    showError(message) {
        const form = document.getElementById('create-event-form');
        form.classList.remove('form-loading');
        document.getElementById('submit-event').textContent = 'Create Event';
        
        if (window.lanverseApp) {
            window.lanverseApp.showNotification(message, 'error');
        }
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
}

// Initialize wizard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the create-event page
    if (document.getElementById('create-event-form')) {
        window.createEventWizard = new CreateEventWizard();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CreateEventWizard;
}