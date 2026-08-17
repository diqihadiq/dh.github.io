// Sound Synthesizers with Web Audio API (No external sound files required)
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playPop() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

function playSuccess() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + i * 0.07;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch (e) {}
}

function playLockSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.setValueAtTime(160, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
}

// Background options
const BACKGROUNDS = [
  { id: 'soft-pastel', name: 'Soft Pastel (Default)', url: '' },
  { id: 'night-city', name: 'City Night Lights', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80' },
  { id: 'cozy-cafe', name: 'Cozy Cafe', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80' },
  { id: 'sunset', name: 'Romantic Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80' },
  { id: 'street-food', name: 'Street Food Vibe', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80' },
  { id: 'folder-1', name: 'Folder /backgrounds/bg-1.jpg', url: './backgrounds/bg-1.jpg' },
  { id: 'folder-2', name: 'Folder /backgrounds/bg-2.jpg', url: './backgrounds/bg-2.jpg' }
];

let currentBgIndex = 0;
let autoSlideInterval = null;
let isAutoSlide = false;

// Rejection phrases
const NO_PHRASES = [
  'Enggak',
  'Yakin gamau? 🥺',
  'Coba pikirin lagi dong...',
  'Masa gamau siiih 😭',
  'Jangan gitu dong...',
  'Tombol IYA makin gede lho! 😂',
  'Pencet yang pink ajaa ✨',
  'Gak ada pilihan lain pokoknya!',
  'Ayo dong pliss 💖',
  'Udah takdirnya pencet IYA! 😉'
];

let noCount = 0;

// State details
const details = {
  partnerName: '',
  myPhone: '',
  locationName: 'Kedai Angkringan / Street Food Center',
  locationAddress: 'Tempat jajan enak, ngemil & ngobrol santai',
  dateTime: '19:30 WIB Malam Ini',
  dresscode: 'Casual & Santai (Kaos/Outer yang nyaman & wangi)',
  transportation: 'Motoran santai nikmatin angin malam bareng 🛵💨',
  specialNotes: 'Siapin perut kosong dan senyuman terbaik kamu ya! 😊💖'
};

// Check query param for custom name (?to=Putri or ?name=Putri)
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('to') || params.get('name') || params.get('n');
  if (name) {
    details.partnerName = name;
    document.getElementById('question-heading').innerText = `Hai ${name}, malem ini mau keluar sama aku gak?`;
  }
  updateDetailsUI();
  renderBackgroundGrid();
});

// Stepper
function showStep(stepNum) {
  document.getElementById('step-1').classList.add('hidden');
  document.getElementById('step-2').classList.add('hidden');
  document.getElementById('step-3').classList.add('hidden');
  document.getElementById(`step-${stepNum}`).classList.remove('hidden');
}

// Step 1 logic
function handleReject() {
  playPop();
  noCount++;
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const rejectHint = document.getElementById('reject-hint');
  const rejectCounter = document.getElementById('reject-counter');

  // Scale up Yes button smoothly
  const scale = Math.min(1 + noCount * 0.22, 2.4);
  btnYes.style.transform = `scale(${scale})`;

  // Change No button text
  btnNo.innerText = NO_PHRASES[noCount % NO_PHRASES.length];

  // Show badge
  rejectCounter.innerText = `Ditolak ${noCount}x 😜`;
  rejectCounter.classList.remove('hidden');

  if (noCount >= 3) {
    rejectHint.classList.remove('hidden');
  }
}

function handleAccept() {
  playSuccess();
  showStep(2);
}

// Step 2 logic
function handleLockedDinner() {
  playLockSound();
  const alertBox = document.getElementById('locked-alert');
  const card = document.getElementById('card-mewah');
  
  card.classList.add('shake');
  setTimeout(() => card.classList.remove('shake'), 400);
  
  alertBox.classList.remove('hidden');
}

function closeLockedAlert() {
  document.getElementById('locked-alert').classList.add('hidden');
}

function handleChooseMurah() {
  playSuccess();
  showStep(3);
  triggerConfetti();
}

// Step 3 Confetti
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// Update Details UI
function updateDetailsUI() {
  document.getElementById('detail-location').innerText = details.locationName;
  document.getElementById('detail-address').innerText = details.locationAddress;
  document.getElementById('detail-time').innerText = details.dateTime;
  document.getElementById('detail-dresscode').innerText = details.dresscode;
  document.getElementById('detail-transport').innerText = details.transportation;
  document.getElementById('detail-notes').innerText = `"${details.specialNotes}"`;
  
  if (details.partnerName) {
    document.getElementById('invitation-for').innerText = `Undangan resmi untuk ${details.partnerName}`;
  }
}

// Copy Text
function copyInvitation() {
  const summary = `🎉 *UNDANGAN KENCAN MALAM INI* 🎉
Hai ${details.partnerName || 'kamu'}! Undangan kencan kita udah siap:

📅 *Waktu:* ${details.dateTime}
📍 *Lokasi:* ${details.locationName} (${details.locationAddress})
👗 *Dresscode:* ${details.dresscode}
🛵 *Transportasi:* ${details.transportation}
💌 *Notes:* ${details.specialNotes}

Sampai ketemu malem ini ya! ❤️✨`;

  navigator.clipboard.writeText(summary).then(() => {
    const copyBtn = document.getElementById('btn-copy');
    copyBtn.innerText = '✅ Tersalin!';
    setTimeout(() => {
      copyBtn.innerText = '📋 Salin Undangan';
    }, 2500);
  });
}

// Share WhatsApp
function shareWhatsApp() {
  const summary = `🎉 *UNDANGAN KENCAN MALAM INI* 🎉
Hai ${details.partnerName || 'kamu'}! Undangan kencan kita udah siap:

📅 *Waktu:* ${details.dateTime}
📍 *Lokasi:* ${details.locationName} (${details.locationAddress})
👗 *Dresscode:* ${details.dresscode}
🛵 *Transportasi:* ${details.transportation}
💌 *Notes:* ${details.specialNotes}

Sampai ketemu malem ini ya! ❤️✨`;

  const phone = details.myPhone.replace(/[^0-9]/g, '');
  const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(summary)}` : `https://wa.me/?text=${encodeURIComponent(summary)}`;
  window.open(url, '_blank');
}

// Reset to Step 1
function resetAll() {
  noCount = 0;
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  btnYes.style.transform = 'scale(1)';
  btnNo.innerText = 'Enggak';
  document.getElementById('reject-counter').classList.add('hidden');
  document.getElementById('reject-hint').classList.add('hidden');
  showStep(1);
}

// Edit Modal
function openEditModal() {
  document.getElementById('edit-name').value = details.partnerName;
  document.getElementById('edit-time').value = details.dateTime;
  document.getElementById('edit-location').value = details.locationName;
  document.getElementById('edit-address').value = details.locationAddress;
  document.getElementById('edit-dresscode').value = details.dresscode;
  document.getElementById('edit-transport').value = details.transportation;
  document.getElementById('edit-phone').value = details.myPhone;
  document.getElementById('edit-notes').value = details.specialNotes;
  document.getElementById('edit-modal').classList.remove('hidden');
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
}

function saveEditDetails(e) {
  e.preventDefault();
  details.partnerName = document.getElementById('edit-name').value;
  details.dateTime = document.getElementById('edit-time').value;
  details.locationName = document.getElementById('edit-location').value;
  details.locationAddress = document.getElementById('edit-address').value;
  details.dresscode = document.getElementById('edit-dresscode').value;
  details.transportation = document.getElementById('edit-transport').value;
  details.myPhone = document.getElementById('edit-phone').value;
  details.specialNotes = document.getElementById('edit-notes').value;
  
  updateDetailsUI();
  closeEditModal();
}

// Background Management
function setBackground(url) {
  const bgImg = document.getElementById('bg-image');
  if (!url) {
    bgImg.style.opacity = '0';
  } else {
    bgImg.src = url;
    bgImg.style.opacity = '1';
  }
}

function openBgModal() {
  document.getElementById('bg-modal').classList.remove('hidden');
}

function closeBgModal() {
  document.getElementById('bg-modal').classList.add('hidden');
}

function renderBackgroundGrid() {
  const grid = document.getElementById('bg-grid');
  grid.innerHTML = '';
  BACKGROUNDS.forEach((bg, idx) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'group relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-700 hover:border-rose-400 aspect-video flex flex-col justify-end p-2 text-left cursor-pointer transition-all';
    
    if (bg.url) {
      item.innerHTML = `<img src="${bg.url}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" /><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div><span class="relative z-10 text-[10px] font-bold text-white line-clamp-1">${bg.name}</span>`;
    } else {
      item.innerHTML = `<div class="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-200 dark:from-slate-800 dark:to-slate-900"></div><span class="relative z-10 text-[10px] font-bold text-gray-800 dark:text-white line-clamp-1">${bg.name}</span>`;
    }

    item.onclick = () => {
      currentBgIndex = idx;
      setBackground(bg.url);
      closeBgModal();
    };

    grid.appendChild(item);
  });
}

function handleCustomUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const newBg = { id: `custom-${Date.now()}`, name: file.name, url: event.target.result };
      BACKGROUNDS.unshift(newBg);
      renderBackgroundGrid();
      setBackground(newBg.url);
      closeBgModal();
    };
    reader.readAsDataURL(file);
  }
}

function handleCustomLocalPath(e) {
  e.preventDefault();
  const input = document.getElementById('input-local-path');
  let path = input.value.trim();
  if (path) {
    if (!path.startsWith('./') && !path.startsWith('/') && !path.startsWith('http')) {
      path = `./backgrounds/${path}`;
    }
    const newBg = { id: `local-${Date.now()}`, name: path.replace('./backgrounds/', ''), url: path };
    BACKGROUNDS.unshift(newBg);
    renderBackgroundGrid();
    setBackground(newBg.url);
    input.value = '';
    closeBgModal();
  }
}

function toggleAutoSlide() {
  isAutoSlide = !isAutoSlide;
  const btn = document.getElementById('btn-auto-slide');
  if (isAutoSlide) {
    btn.classList.add('bg-rose-500', 'text-white');
    btn.classList.remove('bg-gray-100', 'dark:bg-slate-800');
    btn.innerText = '⏸ Slideshow Aktif (7s)';
    autoSlideInterval = setInterval(() => {
      currentBgIndex = (currentBgIndex + 1) % BACKGROUNDS.length;
      setBackground(BACKGROUNDS[currentBgIndex].url);
    }, 7000);
  } else {
    btn.classList.remove('bg-rose-500', 'text-white');
    btn.classList.add('bg-gray-100', 'dark:bg-slate-800');
    btn.innerText = '▶ Putar Slideshow Otomatis';
    clearInterval(autoSlideInterval);
  }
}

function randomBackground() {
  const rand = Math.floor(Math.random() * BACKGROUNDS.length);
  currentBgIndex = rand;
  setBackground(BACKGROUNDS[rand].url);
}

// Dark Mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}