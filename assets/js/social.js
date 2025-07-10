// Placeholder feed data - ready for backend integration
const dummyFeed = [
  {
    user: "@vibeyjen",
    avatar: "assets/images/vibeyjen.jpg",
    event: "#NeonJam",
    media: "assets/images/party1.jpg",
    caption: "Late night vibes at Neon Jam 🔥"
  },
  {
    user: "@rohanxparty",
    avatar: "assets/images/rohanxparty.jpg",
    event: "#SilentDisco",
    media: "assets/images/party2.jpg",
    caption: "This DJ is killing it 🎧 #SilentDisco"
  },
  {
    user: "@lanversequeen",
    avatar: "assets/images/lanversequeen.jpg",
    event: "#EraParty",
    media: "assets/images/party3.jpg",
    caption: "POV: Your party era ✨🪩"
  }
];

const dummyMentions = [
  {
    user: "@rohanxparty",
    text: "mentioned you: 'This DJ is killing it 🎧 #SilentDisco'"
  },
  {
    user: "@lanversequeen",
    text: "shouted you out: 'POV: Your party era ✨🪩'"
  }
];

// Render feed
function renderFeed() {
  const feed = document.getElementById('moments-feed');
  feed.innerHTML = '';
  dummyFeed.forEach((post, idx) => {
    const card = document.createElement('div');
    card.className = 'moment-card glass';
    card.innerHTML = `
      <div class="moment-header">
        <span class="event-tag">${post.event}</span>
        <div class="user-info">
          <span class="avatar-ring"></span>
          <img src="${post.avatar}" class="avatar-img" />
          <span class="username">${post.user}</span>
        </div>
      </div>
      <div class="moment-media" tabindex="0">
        <img src="${post.media}" alt="Party" />
      </div>
      <div class="moment-caption">${post.caption}</div>
      <div class="moment-actions">
        <button class="like-btn" title="Like">❤️</button>
        <button class="comment-btn" title="Comment">💬</button>
        <button class="repost-btn" title="Repost">🔁</button>
        <div class="reactions">
          <span title="Fire">🔥</span><span title="Disco">🪩</span><span title="DJ">🎧</span><span title="Love">😍</span>
        </div>
      </div>
    `;
    // Like animation
    card.querySelector('.like-btn').addEventListener('dblclick', function(e) {
      this.classList.add('liked');
      this.style.transform = 'scale(1.4)';
      setTimeout(() => {
        this.style.transform = '';
        this.classList.remove('liked');
      }, 400);
    });
    // Lightbox
    card.querySelector('.moment-media').addEventListener('click', function() {
      openLightbox(post.media);
    });
    feed.appendChild(card);
  });
}

// Render mentions
function renderMentions() {
  const panel = document.getElementById('mentions-panel');
  panel.innerHTML = '';
  dummyMentions.forEach(mention => {
    const card = document.createElement('div');
    card.className = 'mention-card glass';
    card.innerHTML = `
      <span class="mention-user">${mention.user}</span>
      <span class="mention-text">${mention.text}</span>
      <div class="mention-actions">
        <button>Reply</button>
        <button>😊</button>
        <button>GIF</button>
      </div>
    `;
    panel.appendChild(card);
  });
}

// Tab switching
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    if (this.dataset.tab === 'feed') {
      document.getElementById('moments-feed').style.display = '';
      document.getElementById('mentions-panel').style.display = 'none';
    } else {
      document.getElementById('moments-feed').style.display = 'none';
      document.getElementById('mentions-panel').style.display = '';
      renderMentions();
    }
  });
});

// FAB and Modal
const fab = document.getElementById('fab');
const modal = document.getElementById('create-post-modal');
const closeModal = document.getElementById('close-modal');
fab.addEventListener('click', () => {
  modal.style.display = 'flex';
});
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Create Post (dummy, just closes modal and shows toast)
document.getElementById('create-post-form').addEventListener('submit', function(e) {
  e.preventDefault();
  modal.style.display = 'none';
  showToast('Moment posted! 🎉');
});

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2200);
}

// Lightbox (simple)
function openLightbox(src) {
  const lightbox = document.createElement('div');
  lightbox.style.position = 'fixed';
  lightbox.style.top = 0;
  lightbox.style.left = 0;
  lightbox.style.width = '100vw';
  lightbox.style.height = '100vh';
  lightbox.style.background = 'rgba(0,0,0,0.88)';
  lightbox.style.display = 'flex';
  lightbox.style.alignItems = 'center';
  lightbox.style.justifyContent = 'center';
  lightbox.style.zIndex = 9999;
  lightbox.innerHTML = `<img src="${src}" style="max-width:90vw; max-height:80vh; border-radius:18px; box-shadow:0 0 32px #00eaff;" />`;
  lightbox.addEventListener('click', () => document.body.removeChild(lightbox));
  document.body.appendChild(lightbox);
}

// Initial render
renderFeed(); 