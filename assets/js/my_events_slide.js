// Mock events for the slide
const myEventsSlideData = [
  {
    id: 1,
    name: "Poolside Sundowner",
    banner: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    location: "Venice Beach, CA",
    distance: "2.3 km away",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day from now
    attendees: [
      { name: "Alex", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { name: "Sam", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { name: "Jordan", avatar: null },
      { name: "Taylor", avatar: null },
    ],
    status: "upcoming",
    hosted: false,
    joined: true,
  },
  {
    id: 2,
    name: "Neon Night Jam",
    banner: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    location: "Downtown LA",
    distance: "5.1 km away",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    attendees: [
      { name: "You", avatar: null },
      { name: "Chris", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
      { name: "Morgan", avatar: null },
    ],
    status: "upcoming",
    hosted: true,
    joined: true,
  },
  {
    id: 3,
    name: "Silent Disco 4.0",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    location: "Santa Monica",
    distance: "7.8 km away",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    attendees: [
      { name: "Alex", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { name: "Jamie", avatar: null },
    ],
    status: "past",
    hosted: false,
    joined: true,
  },
  {
    id: 4,
    name: "College Dorm Party",
    banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    location: "UCLA Campus",
    distance: "On campus",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    attendees: [
      { name: "You", avatar: null },
      { name: "Sam", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    ],
    status: "past",
    hosted: true,
    joined: true,
  },
  {
    id: 5,
    name: "Esports Showdown",
    banner: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    location: "Las Vegas, NV",
    distance: "420 km away",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    attendees: [
      { name: "You", avatar: null },
      { name: "Alex", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { name: "Sam", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { name: "Chris", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
    ],
    status: "upcoming",
    hosted: false,
    joined: true,
  },
];

const slideFilter = document.getElementById('myEventsSlideFilter');
const slideCarousel = document.getElementById('myEventsSlideCarousel');
const slideIndicators = document.getElementById('myEventsSlideIndicators');

let filteredSlides = myEventsSlideData;
let currentSlide = 0;
let autoSlideTimer = null;

function renderSlides() {
  slideCarousel.innerHTML = '';
  if (filteredSlides.length === 0) {
    slideCarousel.innerHTML = `<div class="no-events-slide-placeholder">No events yet.<br><button class="slide-action-btn" onclick="alert('Create your first event!')">Create Event</button></div>`;
    slideIndicators.innerHTML = '';
    return;
  }
  filteredSlides.forEach((event, idx) => {
    const card = document.createElement('div');
    card.className = 'my-events-slide-card';
    card.setAttribute('tabindex', '0');
    // Banner
    const banner = document.createElement('img');
    banner.className = 'slide-banner';
    banner.src = event.banner;
    banner.alt = event.name;
    card.appendChild(banner);
    // Gradient overlay
    const grad = document.createElement('div');
    grad.className = 'slide-gradient ' + event.status + (event.hosted ? ' hosted' : '');
    card.appendChild(grad);
    // Content
    const content = document.createElement('div');
    content.className = 'slide-content';
    // Title
    const title = document.createElement('div');
    title.className = 'slide-title';
    title.textContent = event.name;
    content.appendChild(title);
    // Meta
    const meta = document.createElement('div');
    meta.className = 'slide-meta';
    // Location
    const loc = document.createElement('span');
    loc.className = 'slide-location';
    loc.innerHTML = '📍 ' + event.location + (event.distance ? ` <span style="opacity:0.7;font-size:0.95em;">(${event.distance})</span>` : '');
    meta.appendChild(loc);
    // Date & Time
    const date = document.createElement('span');
    date.className = 'slide-date';
    date.innerHTML = '📅 ' + event.date.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    meta.appendChild(date);
    // Attendees
    const att = document.createElement('span');
    att.className = 'slide-attendees';
    att.innerHTML = '🧑‍🤝‍🧑 ';
    // Avatars
    const avatars = document.createElement('span');
    avatars.className = 'slide-attendees-avatars';
    event.attendees.slice(0, 3).forEach(a => {
      if (a.avatar) {
        const img = document.createElement('img');
        img.className = 'slide-avatar';
        img.src = a.avatar;
        img.alt = a.name;
        avatars.appendChild(img);
      } else {
        const initials = document.createElement('span');
        initials.className = 'slide-avatar-initials';
        initials.textContent = a.name.split(' ').map(n => n[0]).join('').toUpperCase();
        avatars.appendChild(initials);
      }
    });
    att.appendChild(avatars);
    if (event.attendees.length > 3) {
      const more = document.createElement('span');
      more.className = 'slide-attendees-more';
      more.textContent = `+${event.attendees.length - 3}`;
      att.appendChild(more);
    }
    meta.appendChild(att);
    content.appendChild(meta);
    // Badges
    const badges = document.createElement('div');
    badges.className = 'slide-badges';
    if (event.status === 'upcoming') badges.innerHTML += '<span class="slide-badge upcoming">Upcoming</span>';
    if (event.status === 'past') badges.innerHTML += '<span class="slide-badge past">Ended</span>';
    if (event.hosted) badges.innerHTML += '<span class="slide-badge hosted">Hosted</span>';
    content.appendChild(badges);
    // Actions
    const actions = document.createElement('div');
    actions.className = 'slide-actions';
    // View Details
    const viewBtn = document.createElement('button');
    viewBtn.className = 'slide-action-btn';
    viewBtn.textContent = 'View Details';
    viewBtn.onclick = () => alert('View details for ' + event.name);
    actions.appendChild(viewBtn);
    // Edit (hosted only)
    if (event.hosted) {
      const editBtn = document.createElement('button');
      editBtn.className = 'slide-action-btn edit';
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => alert('Edit event: ' + event.name);
      actions.appendChild(editBtn);
    }
    // Repeat (past events)
    if (event.status === 'past') {
      const repeatBtn = document.createElement('button');
      repeatBtn.className = 'slide-action-btn repeat';
      repeatBtn.textContent = 'Repeat';
      repeatBtn.onclick = () => alert('Repeat event: ' + event.name);
      actions.appendChild(repeatBtn);
    }
    content.appendChild(actions);
    card.appendChild(content);
    slideCarousel.appendChild(card);
  });
  renderIndicators();
  snapToSlide(currentSlide, true);
}

function renderIndicators() {
  slideIndicators.innerHTML = '';
  for (let i = 0; i < filteredSlides.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'my-events-slide-dot' + (i === currentSlide ? ' active' : '');
    dot.onclick = () => snapToSlide(i);
    slideIndicators.appendChild(dot);
  }
}

function snapToSlide(idx, instant = false) {
  if (filteredSlides.length === 0) return;
  currentSlide = Math.max(0, Math.min(idx, filteredSlides.length - 1));
  const card = slideCarousel.children[currentSlide];
  if (card) {
    card.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  }
  Array.from(slideIndicators.children).forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

// Touch/drag support
let startX = 0, scrollLeft = 0, isDown = false;
slideCarousel.addEventListener('mousedown', e => {
  isDown = true;
  startX = e.pageX - slideCarousel.offsetLeft;
  scrollLeft = slideCarousel.scrollLeft;
});
slideCarousel.addEventListener('mouseleave', () => { isDown = false; });
slideCarousel.addEventListener('mouseup', () => { isDown = false; });
slideCarousel.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slideCarousel.offsetLeft;
  slideCarousel.scrollLeft = scrollLeft - (x - startX);
});
// Touch
slideCarousel.addEventListener('touchstart', e => {
  isDown = true;
  startX = e.touches[0].pageX - slideCarousel.offsetLeft;
  scrollLeft = slideCarousel.scrollLeft;
});
slideCarousel.addEventListener('touchend', () => { isDown = false; });
slideCarousel.addEventListener('touchmove', e => {
  if (!isDown) return;
  const x = e.touches[0].pageX - slideCarousel.offsetLeft;
  slideCarousel.scrollLeft = scrollLeft - (x - startX);
});
// Snap to nearest slide on scroll end
slideCarousel.addEventListener('scroll', () => {
  if (filteredSlides.length === 0) return;
  let minDist = Infinity, idx = 0;
  Array.from(slideCarousel.children).forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    const dist = Math.abs(rect.left + rect.width/2 - window.innerWidth/2);
    if (dist < minDist) { minDist = dist; idx = i; }
  });
  currentSlide = idx;
  renderIndicators();
});

// Insert arrow buttons
const leftArrow = document.createElement('button');
leftArrow.className = 'my-events-slide-arrow left';
leftArrow.innerHTML = '&#8592;';
leftArrow.setAttribute('aria-label', 'Previous Event');
const rightArrow = document.createElement('button');
rightArrow.className = 'my-events-slide-arrow right';
rightArrow.innerHTML = '&#8594;';
rightArrow.setAttribute('aria-label', 'Next Event');
slideCarousel.parentElement.insertBefore(leftArrow, slideCarousel);
slideCarousel.parentElement.appendChild(rightArrow);

leftArrow.addEventListener('click', () => {
  if (filteredSlides.length === 0) return;
  snapToSlide(Math.max(0, currentSlide - 1));
});
rightArrow.addEventListener('click', () => {
  if (filteredSlides.length === 0) return;
  snapToSlide(Math.min(filteredSlides.length - 1, currentSlide + 1));
});

// Filter
slideFilter.addEventListener('change', () => {
  const val = slideFilter.value;
  if (val === 'all') filteredSlides = myEventsSlideData;
  else if (val === 'upcoming') filteredSlides = myEventsSlideData.filter(e => e.status === 'upcoming');
  else if (val === 'hosted') filteredSlides = myEventsSlideData.filter(e => e.hosted);
  else if (val === 'past') filteredSlides = myEventsSlideData.filter(e => e.status === 'past');
  currentSlide = 0;
  renderSlides();
});

// Initial render
renderSlides(); 