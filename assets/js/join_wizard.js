// LANverse Join Party Wizard Logic - Host Wizard Style

// Mock data for demo
const mockResources = [
  { id: 1, name: 'Cold Drinks', emoji: '🥤', total: 5, remaining: 3 },
  { id: 2, name: 'Powerbank', emoji: '🔋', total: 2, remaining: 1 },
  { id: 3, name: 'Snacks', emoji: '🍿', total: 4, remaining: 4 },
];
const mockTickets = [
  { id: 1, tier: 'General', price: 5, remaining: 10 },
  { id: 2, tier: 'VIP', price: 12, remaining: 2 },
];
const ticketingEnabled = true;
const resourceContributionAllowed = true;

// State
let joinStep = 0;
let joinType = null; // 'contribute' or 'ticket'
let selectedResources = {};
let selectedTicket = null;
let ticketQty = 1;
let vibeMessage = '';

const stepCards = [
  document.getElementById('join-step-0'),
  document.getElementById('join-step-1A'),
  document.getElementById('join-step-1B'),
  document.getElementById('join-step-2'),
  document.getElementById('join-step-3'),
];
const stepDots = Array.from(document.querySelectorAll('#joinStepIndicator .step-dot'));

function showJoinStep(idx) {
  stepCards.forEach((card, i) => {
    card.classList.toggle('active', i === idx || (i === 2 && idx === 1 && joinType === 'ticket'));
  });
  stepDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
    dot.classList.toggle('completed', i < idx);
  });
  joinStep = idx;
  onJoinStepShow(idx);
}

function onJoinStepShow(idx) {
  switch(idx) {
    case 0: validateJoinStep0(); break;
    case 1:
      if (joinType === 'contribute') renderResourceList();
      validateJoinStep1A();
      break;
    case 2:
      if (joinType === 'ticket') renderTicketTiers();
      validateJoinStep1B();
      break;
    case 3: validateJoinStep2(); break;
    case 4: renderSummary(); break;
  }
}

// Step 1: Join Type
const contributeOption = document.getElementById('contributeOption');
const ticketOption = document.getElementById('ticketOption');
const joinNext0 = document.getElementById('join-next-0');
contributeOption.onclick = () => {
  joinType = 'contribute';
  contributeOption.classList.add('selected');
  ticketOption.classList.remove('selected');
  joinNext0.disabled = false;
  joinNext0.classList.add('active');
};
ticketOption.onclick = () => {
  joinType = 'ticket';
  ticketOption.classList.add('selected');
  contributeOption.classList.remove('selected');
  joinNext0.disabled = false;
  joinNext0.classList.add('active');
};
function validateJoinStep0() {
  joinNext0.disabled = !joinType;
  joinNext0.classList.toggle('active', !!joinType);
}
joinNext0.onclick = () => {
  if (!joinType) return;
  if (joinType === 'contribute') {
    showJoinStep(1);
  } else {
    showJoinStep(2);
  }
};

// Step 2A: Resource Contribution
const joinBack1A = document.getElementById('join-back-1A');
const joinNext1A = document.getElementById('join-next-1A');
function renderResourceList() {
  const container = document.getElementById('resourceList');
  container.innerHTML = '';
  mockResources.forEach(item => {
    const div = document.createElement('div');
    div.className = 'resource-item';
    div.innerHTML = `
      <span>${item.emoji} ${item.name}</span>
      <div class="quantity-selector">
        <button class="quantity-btn" ${item.remaining === 0 ? 'disabled' : ''} data-action="decrement" data-id="${item.id}">-</button>
        <span id="qty-${item.id}">${selectedResources[item.id] || 0}</span>
        <button class="quantity-btn" ${item.remaining === 0 ? 'disabled' : ''} data-action="increment" data-id="${item.id}">+</button>
        <span class="remaining">/${item.remaining} left</span>
      </div>
    `;
    container.appendChild(div);
  });
  container.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.onclick = (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      const action = btn.getAttribute('data-action');
      const item = mockResources.find(r => r.id === id);
      if (action === 'increment' && (selectedResources[id] || 0) < item.remaining) {
        selectedResources[id] = (selectedResources[id] || 0) + 1;
      } else if (action === 'decrement' && (selectedResources[id] || 0) > 0) {
        selectedResources[id] = (selectedResources[id] || 0) - 1;
      }
      document.getElementById(`qty-${id}`).textContent = selectedResources[id] || 0;
      validateJoinStep1A();
    };
  });
}
function validateJoinStep1A() {
  const valid = Object.values(selectedResources).some(qty => qty > 0);
  joinNext1A.disabled = !valid;
  joinNext1A.classList.toggle('active', valid);
}
joinBack1A.onclick = () => showJoinStep(0);
joinNext1A.onclick = () => showJoinStep(3);

// Step 2B: Ticket Purchase
const joinBack1B = document.getElementById('join-back-1B');
const joinNext1B = document.getElementById('join-next-1B');
function renderTicketTiers() {
  const container = document.getElementById('ticketTiers');
  container.innerHTML = '';
  mockTickets.forEach(tier => {
    const div = document.createElement('div');
    div.className = 'ticket-tier';
    div.innerHTML = `
      <span>${tier.tier} - $${tier.price} <span class="remaining">(${tier.remaining} left)</span></span>
      <div class="quantity-selector">
        <button class="quantity-btn" data-action="decrement" data-id="${tier.id}">-</button>
        <span id="ticket-qty-${tier.id}">${selectedTicket && selectedTicket.id === tier.id ? ticketQty : 0}</span>
        <button class="quantity-btn" data-action="increment" data-id="${tier.id}">+</button>
      </div>
    `;
    div.onclick = (e) => {
      if (e.target.classList.contains('quantity-btn')) return;
      selectedTicket = tier;
      ticketQty = 1;
      renderTicketTiers();
      validateJoinStep1B();
    };
    container.appendChild(div);
  });
  // Quantity buttons
  container.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-id'));
      const action = btn.getAttribute('data-action');
      if (!selectedTicket || selectedTicket.id !== id) {
        selectedTicket = mockTickets.find(t => t.id === id);
        ticketQty = 1;
        renderTicketTiers();
        validateJoinStep1B();
        return;
      }
      if (action === 'increment' && ticketQty < selectedTicket.remaining) {
        ticketQty++;
      } else if (action === 'decrement' && ticketQty > 1) {
        ticketQty--;
      }
      document.getElementById(`ticket-qty-${id}`).textContent = ticketQty;
      validateJoinStep1B();
    };
  });
}
function validateJoinStep1B() {
  const valid = selectedTicket && ticketQty > 0;
  joinNext1B.disabled = !valid;
  joinNext1B.classList.toggle('active', valid);
}
joinBack1B.onclick = () => showJoinStep(0);
joinNext1B.onclick = () => showJoinStep(3);

// Step 3: Vibe Message
const joinBack2 = document.getElementById('join-back-2');
const joinNext2 = document.getElementById('join-next-2');
const vibeTextarea = document.getElementById('vibeMessage');
function validateJoinStep2() {
  joinNext2.classList.add('active'); // Always enabled
}
joinBack2.onclick = () => {
  if (joinType === 'contribute') showJoinStep(1);
  else showJoinStep(2);
};
joinNext2.onclick = () => showJoinStep(4);
vibeTextarea.addEventListener('input', e => {
  vibeMessage = e.target.value;
});

// Step 4: Confirmation
const joinBack3 = document.getElementById('join-back-3');
const confirmJoin = document.getElementById('confirmJoin');
function renderSummary() {
  const summary = document.getElementById('summary');
  let html = `<b>Join Type:</b> ${joinType === 'contribute' ? 'Contribute Resources' : 'Buy Ticket'}<br>`;
  if (joinType === 'contribute') {
    html += '<b>Items:</b> ' + mockResources.filter(r => selectedResources[r.id] > 0).map(r => `${selectedResources[r.id]}x ${r.name}`).join(', ') + '<br>';
  } else if (joinType === 'ticket') {
    html += `<b>Ticket:</b> ${selectedTicket.tier} x${ticketQty} ($${selectedTicket.price * ticketQty})<br>`;
  }
  if (vibeMessage) {
    html += `<b>Message:</b> ${vibeMessage}<br>`;
  }
  summary.innerHTML = html;
}
joinBack3.onclick = () => showJoinStep(3);
confirmJoin.onclick = () => {
  // Simulate join, then redirect
  window.location.href = 'lobby.html';
};

// On load
showJoinStep(0); 