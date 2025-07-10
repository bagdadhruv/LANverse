// Profile Page JavaScript
class ProfileManager {
  constructor() {
    this.currentFilter = 'all';
    this.mediaData = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadMediaData();
    this.setupModals();
    this.setupAnimations();
  }

  setupEventListeners() {
    // Card flip functionality
    const flipBtn = document.getElementById('flipBtn');
    const closeBackBtn = document.getElementById('closeBackBtn');
    const profileCard = document.getElementById('profileCard');

    if (flipBtn) {
      flipBtn.addEventListener('click', () => this.flipCard());
    }

    if (closeBackBtn) {
      closeBackBtn.addEventListener('click', () => this.flipCard());
    }

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilterChange(e.target.dataset.filter);
      });
    });

    // Action buttons
    const editProfileBtn = document.getElementById('editProfileBtn');
    const followBtn = document.getElementById('followBtn');
    const messageBtn = document.getElementById('messageBtn');

    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => this.handleEditProfile());
    }

    if (followBtn) {
      followBtn.addEventListener('click', () => this.handleFollow());
    }

    if (messageBtn) {
      messageBtn.addEventListener('click', () => this.handleMessage());
    }

    // Story bubbles
    const storyBubbles = document.querySelectorAll('.story-bubble');
    storyBubbles.forEach(bubble => {
      bubble.addEventListener('click', (e) => this.handleStoryClick(e));
    });

    // Media items
    document.addEventListener('click', (e) => {
      if (e.target.closest('.media-item')) {
        this.handleMediaClick(e.target.closest('.media-item'));
      }
    });

    // Settings and share modals
    const settingsBtn = document.getElementById('settingsBtn');
    const shareBtn = document.getElementById('shareBtn');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const closeShareModal = document.getElementById('closeShareModal');

    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.openModal('settingsModal'));
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.openModal('shareModal'));
    }

    if (closeSettingsModal) {
      closeSettingsModal.addEventListener('click', () => this.closeModal('settingsModal'));
    }

    if (closeShareModal) {
      closeShareModal.addEventListener('click', () => this.closeModal('shareModal'));
    }

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
      }
    });

    // Settings toggles
    const darkModeToggle = document.getElementById('darkModeToggle');
    const notificationsToggle = document.getElementById('notificationsToggle');

    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', () => this.handleDarkModeToggle());
    }

    if (notificationsToggle) {
      notificationsToggle.addEventListener('change', () => this.handleNotificationsToggle());
    }

    // Share options
    const shareOptions = document.querySelectorAll('.share-option');
    shareOptions.forEach(option => {
      option.addEventListener('click', (e) => this.handleShareOption(e));
    });
  }

  flipCard() {
    const profileCard = document.getElementById('profileCard');
    if (profileCard) {
      profileCard.classList.toggle('flipped');
      
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }

  handleFilterChange(filter) {
    this.currentFilter = filter;
    
    // Update active filter button
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // Filter media items
    this.filterMedia(filter);
  }

  filterMedia(filter) {
    const mediaGrid = document.getElementById('mediaGrid');
    if (!mediaGrid) return;

    const mediaItems = mediaGrid.querySelectorAll('.media-item');
    
    mediaItems.forEach(item => {
      const itemFilter = item.dataset.filter || 'all';
      const shouldShow = filter === 'all' || itemFilter === filter;
      
      if (shouldShow) {
        item.style.display = 'block';
        item.style.animation = 'fadeIn 0.3s ease-in-out';
      } else {
        item.style.display = 'none';
      }
    });
  }

  loadMediaData() {
    // Simulate loading media data
    this.mediaData = [
      { id: 1, type: 'moments', src: '🎉', title: 'Neon Nights' },
      { id: 2, type: 'hosted', src: '🎧', title: 'DJ Set' },
      { id: 3, type: 'attended', src: '🏠', title: 'House Party' },
      { id: 4, type: 'liked', src: '🎪', title: 'Festival' },
      { id: 5, type: 'moments', src: '🍹', title: 'Cocktails' },
      { id: 6, type: 'hosted', src: '📸', title: 'Memories' },
      { id: 7, type: 'attended', src: '🎵', title: 'Live Music' },
      { id: 8, type: 'liked', src: '🎭', title: 'Costume Party' },
      { id: 9, type: 'moments', src: '🔥', title: 'Fire Show' },
      { id: 10, type: 'hosted', src: '🎨', title: 'Art Party' },
      { id: 11, type: 'attended', src: '🌙', title: 'Moonlight' },
      { id: 12, type: 'liked', src: '⭐', title: 'VIP Event' }
    ];

    this.renderMediaGrid();
  }

  renderMediaGrid() {
    const mediaGrid = document.getElementById('mediaGrid');
    if (!mediaGrid) return;

    mediaGrid.innerHTML = '';

    this.mediaData.forEach(item => {
      const mediaItem = this.createMediaItem(item);
      mediaGrid.appendChild(mediaItem);
    });
  }

  createMediaItem(item) {
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    mediaItem.dataset.filter = item.type;
    mediaItem.dataset.id = item.id;

    mediaItem.innerHTML = `
      <div class="media-placeholder">${item.src}</div>
      <div class="media-overlay">
        <span class="media-title">${item.title}</span>
      </div>
    `;

    return mediaItem;
  }

  handleStoryClick(event) {
    const storyBubble = event.currentTarget;
    const storyLabel = storyBubble.querySelector('.story-label').textContent;
    
    // Add click animation
    storyBubble.style.transform = 'scale(0.95)';
    setTimeout(() => {
      storyBubble.style.transform = '';
    }, 150);

    // Show story (in a real app, this would open a story viewer)
    this.showNotification(`Opening story: ${storyLabel}`);
  }

  handleMediaClick(mediaItem) {
    const itemId = mediaItem.dataset.id;
    const item = this.mediaData.find(d => d.id == itemId);
    
    if (item) {
      this.showNotification(`Opening media: ${item.title}`);
    }
  }

  handleEditProfile() {
    this.showNotification('Edit Profile clicked - would open edit form');
  }

  handleFollow() {
    const followBtn = document.getElementById('followBtn');
    if (followBtn) {
      const isFollowing = followBtn.classList.contains('following');
      
      if (isFollowing) {
        followBtn.classList.remove('following');
        followBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M20 8V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M23 11H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Follow
        `;
        this.showNotification('Unfollowed');
      } else {
        followBtn.classList.add('following');
        followBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 11L12 8L15 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Following
        `;
        this.showNotification('Followed!');
      }
    }
  }

  handleMessage() {
    this.showNotification('Message button clicked - would open chat');
  }

  setupModals() {
    // Modal functionality is handled in setupEventListeners
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }

  handleDarkModeToggle() {
    const isDarkMode = document.getElementById('darkModeToggle').checked;
    document.body.classList.toggle('light-mode', !isDarkMode);
    this.showNotification(`Dark mode ${isDarkMode ? 'enabled' : 'disabled'}`);
  }

  handleNotificationsToggle() {
    const notificationsEnabled = document.getElementById('notificationsToggle').checked;
    this.showNotification(`Notifications ${notificationsEnabled ? 'enabled' : 'disabled'}`);
  }

  handleShareOption(event) {
    const option = event.currentTarget;
    const optionText = option.querySelector('span:last-child').textContent;
    
    switch (optionText) {
      case 'Copy Link':
        this.copyToClipboard('https://lanverse.app/profile/alexchen');
        this.showNotification('Profile link copied!');
        break;
      case 'QR Code':
        this.showNotification('QR Code generated!');
        break;
      case 'Share':
        this.shareProfile();
        break;
    }
  }

  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  shareProfile() {
    if (navigator.share) {
      navigator.share({
        title: 'Alex Chen on LANverse',
        text: 'Check out this awesome profile on LANverse!',
        url: 'https://lanverse.app/profile/alexchen'
      });
    } else {
      this.showNotification('Sharing not supported on this device');
    }
  }

  setupAnimations() {
    // Add entrance animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.profile-card, .story-highlights, .media-section, .action-buttons');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius);
      padding: 1rem 1.5rem;
      color: var(--white);
      backdrop-filter: var(--backdrop-blur);
      box-shadow: var(--glass-shadow);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Utility method to update profile stats
  updateStats(stats) {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3 && stats) {
      statNumbers[0].textContent = stats.hosted || '12';
      statNumbers[1].textContent = stats.attended || '47';
      statNumbers[2].textContent = stats.tagged || '89';
    }
  }
}

// Initialize the profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProfileManager();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  .notification {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  .action-btn.following {
    background: linear-gradient(135deg, var(--neon-green), var(--neon-blue)) !important;
  }

  .media-item {
    position: relative;
    overflow: hidden;
  }

  .media-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
    padding: 0.5rem;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .media-item:hover .media-overlay {
    transform: translateY(0);
  }

  .media-title {
    font-size: 0.8rem;
    font-weight: 600;
  }
`;
document.head.appendChild(style);

// Add touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - could be used for next profile
      console.log('Swipe left detected');
    } else {
      // Swipe right - could be used for previous profile
      console.log('Swipe right detected');
    }
  }
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'Escape':
      // Close any open modals
      const activeModals = document.querySelectorAll('.modal.active');
      activeModals.forEach(modal => modal.classList.remove('active'));
      break;
    case 'Enter':
      // Trigger flip card if focused on flip button
      const focusedElement = document.activeElement;
      if (focusedElement && focusedElement.id === 'flipBtn') {
        focusedElement.click();
      }
      break;
  }
});

// Add service worker registration for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} 