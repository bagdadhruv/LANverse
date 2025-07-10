// Social stories data - ready for backend integration
let parties = [];

// Initialize social stories when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded fired');
  
  // Initialize with placeholder data - will be replaced by backend API calls
  parties = [
    {
      poster: 'https://placehold.co/600x180/23234d/fff?text=Party+Poster',
      host: '@vibeyjen',
      hostAvatar: 'https://placehold.co/56x56/ff4ecd/fff?text=Avatar',
      eventTag: '#NeonJam',
      stories: [
        { media: 'https://placehold.co/600x400/23234d/00eaff?text=Story+1', type: 'image', username: '@vibeyjen' },
        { media: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video', username: '@vibeyjen' }
      ]
    },
    {
      poster: 'https://placehold.co/600x180/23234d/fff?text=Party+Poster+2',
      host: '@djNova',
      hostAvatar: 'https://placehold.co/56x56/00eaff/fff?text=Avatar',
      eventTag: '#GlowFest',
      stories: [
        { media: 'https://placehold.co/600x400/23234d/ff4ecd?text=Story+2', type: 'image', username: '@djNova' }
      ]
    }
  ];
  
  console.log('Using placeholder parties:', parties);
  renderPartyCard();
});

let currentParty = 0;
let currentStory = 0;
let isSwiping = false;
let startX = 0, startY = 0, dx = 0, dy = 0;
let mouseDown = false;

const partyPoster = document.getElementById('party-poster');
const partyPosterBlur = document.getElementById('party-poster-blur');
const hostAvatar = document.getElementById('host-avatar');
const eventTag = document.getElementById('event-tag');
const hostProfileLink = document.getElementById('host-profile-link');
const storyCarousel = document.getElementById('story-carousel');

function setPosterWithFallback(img, src) {
  img.onerror = () => { img.onerror = null; img.src = 'https://placehold.co/600x180/23234d/fff?text=Party+Poster'; };
  img.src = src;
}
function setAvatarWithFallback(img, src) {
  img.onerror = () => { img.onerror = null; img.src = 'https://placehold.co/56x56/ff4ecd/fff?text=Avatar'; };
  img.src = src;
}

function renderPartyCard() {
  const party = parties[currentParty];
  setPosterWithFallback(partyPoster, party.poster);
  setAvatarWithFallback(hostAvatar, party.hostAvatar);
  eventTag.textContent = party.eventTag;
  hostProfileLink.href = `profile.html?user=${encodeURIComponent(party.host)}`;
  renderStories();
}

function renderStories() {
  const party = parties[currentParty];
  console.log('Rendering stories for party:', party);
  console.log('Current story index:', currentStory);
  storyCarousel.innerHTML = '';
  party.stories.forEach((story, idx) => {
    console.log('Creating story slide:', idx, story);
    const slide = document.createElement('div');
    slide.className = 'story-slide';
    if (idx === currentStory) slide.classList.add('active');
    // Media
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'story-media';
    if (story.type === 'image') {
      const img = document.createElement('img');
      img.src = story.media;
      img.alt = 'Story';
      img.onload = () => console.log('Image loaded:', story.media);
      img.onerror = () => console.error('Image failed to load:', story.media);
      mediaDiv.appendChild(img);
    } else if (story.type === 'video') {
      const vid = document.createElement('video');
      vid.src = story.media;
      vid.controls = true;
      vid.autoplay = false;
      vid.playsInline = true;
      vid.onloadstart = () => console.log('Video loading:', story.media);
      vid.onerror = () => console.error('Video failed to load:', story.media);
      mediaDiv.appendChild(vid);
    }
    // Username overlay
    const username = document.createElement('div');
    username.className = 'story-username';
    username.textContent = story.username;
    mediaDiv.appendChild(username);
    slide.appendChild(mediaDiv);
    storyCarousel.appendChild(slide);
  });
}

// Swipe logic (vertical: party, horizontal: story)
function handleSwipeStart(x, y) {
  if (isSwiping) return;
  isSwiping = true;
  startX = x;
  startY = y;
  dx = 0; dy = 0;
}
function handleSwipeMove(x, y) {
  if (!isSwiping) return;
  dx = x - startX;
  dy = y - startY;
}
function handleSwipeEnd() {
  isSwiping = false;
  // Vertical swipe: change party card
  if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) {
    if (dy < 0) nextParty(); // swipe up
    else prevParty(); // swipe down
  }
  // Horizontal swipe: change story
  else if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) nextStory(); // swipe left
    else prevStory(); // swipe right
  }
  dx = 0; dy = 0;
}
// Touch events
storyCarousel.addEventListener('touchstart', e => {
  const touch = e.touches[0];
  handleSwipeStart(touch.clientX, touch.clientY);
});
storyCarousel.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  handleSwipeMove(touch.clientX, touch.clientY);
});
storyCarousel.addEventListener('touchend', e => {
  handleSwipeEnd();
});
// Mouse events
storyCarousel.addEventListener('mousedown', e => {
  mouseDown = true;
  handleSwipeStart(e.clientX, e.clientY);
});
storyCarousel.addEventListener('mousemove', e => {
  if (!mouseDown) return;
  handleSwipeMove(e.clientX, e.clientY);
});
storyCarousel.addEventListener('mouseup', e => {
  if (!mouseDown) return;
  mouseDown = false;
  handleSwipeEnd();
});
storyCarousel.addEventListener('mouseleave', e => {
  if (!mouseDown) return;
  mouseDown = false;
  handleSwipeEnd();
});

function nextStory() {
  const party = parties[currentParty];
  if (currentStory < party.stories.length - 1) {
    currentStory++;
    renderStories();
  }
}
function prevStory() {
  if (currentStory > 0) {
    currentStory--;
    renderStories();
  }
}
function nextParty() {
  if (currentParty < parties.length - 1) {
    currentParty++;
  } else {
    currentParty = 0;
  }
  currentStory = 0;
  renderPartyCard();
}
function prevParty() {
  if (currentParty > 0) {
    currentParty--;
  } else {
    currentParty = parties.length - 1;
  }
  currentStory = 0;
  renderPartyCard();
}

// Initial render will be called after DOMContentLoaded 