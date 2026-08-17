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

// Background options with user's specific files: bg1.JPEG to bg4.JPEG
const BACKGROUNDS = [
  { id: 'user-bg1', name: 'Foto 1 (bg1.jpeg)', url: './backgrounds/bg1.jpeg' },
  { id: 'user-bg2', name: 'Foto 2 (bg2.jpeg)', url: './backgrounds/bg2.jpeg' },
  { id: 'user-bg3', name: 'Foto 3 (bg3.jpeg)', url: './backgrounds/bg3.jpeg' },
  { id: 'user-bg4', name: 'Foto 4 (bg4.jpeg)', url: './backgrounds/bg4.jpeg' },
  { id: 'soft-pastel', name: 'Soft Pastel (Default)', url: '' },
  { id: 'night-city', name: 'City Night Lights', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80' },
  { id: 'cozy-cafe', name: 'Cozy Cafe', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80' }
];

let currentBgIndex = 0;
let autoSlideInterval = null;
let isAutoSlide = true; // Auto slideshow default on with Syarifa's photos

// Rejection phrases
const NO_PHRASES = [
  'Enggak ah',
  'Yakin gamau? 🥺',
  'Coba pikirin lagi dong...',
  'Masa gamau siiih 😭',
  'sakit hati sii aku ditolak...',
  'PENCET GAK IYAANYA!!',
  'Pencet yang pink ajaa sayang.. ✨',
  'Gak ada pilihan lain pokoknya!',
  'Ayo dong pliss 💖',
  'Udah takdirnya pencet IYAAA! 😉'
];

let noCount = 0;

// State details customized for Syarifa Alisa Putri
const details = {
  partnerName: 'Syarifa Alisa Putri',
  myPhone: '',
  locationName: 'Rahasia 🤫✨',
  locationAddress: 'pokoknyaa gabakal cemberut deh, promise 🤙💖',
  dateTime: 'Malam ini pukul 18.30 (dijemput di depan gerbang biru)',
  dresscode: 'Casual & Santai (Kaos/Outer yang nyaman & wangi)',
  transportation: 'pake rebecca dulu lah ya, helikopter masih dipake prabowo 🛵💨',
  specialNotes: 'Jangan crop top an dut, dingin.'
};

// Music Player Logic (The 1975 - Love It If We Made It)
let isMusicPlaying = false;

function tryPlayMusic() {
  const music = document.getElementById('bg-music');
  if (music && !isMusicPlaying) {
    music.volume = 0.55;
    const playPromise = music.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          updateMusicUI(true);
        })
        .catch(() => {
          isMusicPlaying = false;
          updateMusicUI(false);
        });
    }
  }
}

function toggleMusic() {
  const music = document.getElementById('bg-music');
  if (!music) return;
  if (isMusicPlaying) {
    music.pause();
    isMusicPlaying = false;
    updateMusicUI(false);
  } else {
    music.volume = 0.55;
    music.play().then(() => {
      isMusicPlaying = true;
      updateMusicUI(true);
    }).catch(e => console.log('Audio play error:', e));
  }
}

function updateMusicUI(playing) {
  const icon = document.getElementById('music-icon');
  const label = document.getElementById('music-label');
  const btn = document.getElementById('btn-music-toggle');
  if (playing) {
    if (icon) {
      icon.innerText = '🔊';
      icon.classList.add('animate-bounce');
    }
    if (label) label.innerText = 'The 1975 🎶';
    if (btn) btn.classList.add('text-rose-500');
  } else {
    if (icon) {
      icon.innerText = '🔇';
      icon.classList.remove('animate-bounce');
    }
    if (label) label.innerText = 'Putar Musik';
    if (btn) btn.classList.remove('text-rose-500');
  }
}

// Check query param for custom name
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('to') || params.get('name') || params.get('n');
  if (name) {
    details.partnerName = name;
  }
  
  document.getElementById('question-heading').innerText = `Hai ${details.partnerName}, malem ini mau keluar sama aku gak?`;
  
  updateDetailsUI();
  renderBackgroundGrid();
  
  // Set default background to first photo
  setBackground(BACKGROUNDS[0].url);
  startAutoSlide();

  // Attempt autoplay immediately
  tryPlayMusic();

  // Also trigger autoplay seamlessly on user's first touch / click anywhere on the page
  const startMusicOnFirstInteraction = () => {
    tryPlayMusic();
    document.removeEventListener('click', startMusicOnFirstInteraction);
    document.removeEventListener('touchstart', startMusicOnFirstInteraction);
  };
  document.addEventListener('click', startMusicOnFirstInteraction, { once: true });
  document.addEventListener('touchstart', startMusicOnFirstInteraction, { once: true });
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
      particleCount: 90,
      spread: 75,
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
    document.getElementById('invitation-for').innerText = `Undangan resmi untuk ${details.partnerName} 💖`;
  }
}

// Copy Text
function copyInvitation() {
  const summary = `🎉 *UNDANGAN KENCAN MALAM INI* 🎉
Hai ${details.partnerName}! Undangan kencan kita udah siap:

📅 *Waktu:* ${details.dateTime}
📍 *Lokasi Penjemputan:* ${details.locationName} (${details.locationAddress})
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
  const confirmationMessage = `Iyaa sayangg, aku terima ya tawarannya, love you more 💖✨`;
  const phone = '6285890999711';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(confirmationMessage)}`;
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
    // Graceful fallback in case file extension differences (.JPEG / .jpeg / .jpg)
    bgImg.onerror = () => {
      if (url.endsWith('.JPEG')) {
        bgImg.src = url.replace('.JPEG', '.jpeg');
      } else if (url.endsWith('.jpeg')) {
        bgImg.src = url.replace('.jpeg', '.jpg');
      }
    };
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
      item.innerHTML = `<img src="${bg.url}" onerror="this.src='https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80'" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" /><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div><span class="relative z-10 text-[10px] font-bold text-white line-clamp-1">${bg.name}</span>`;
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

function startAutoSlide() {
  const btn = document.getElementById('btn-auto-slide');
  btn.classList.add('bg-rose-500', 'text-white');
  btn.classList.remove('bg-white', 'dark:bg-slate-800');
  btn.innerText = '⏸ Slideshow Aktif (7s)';
  if (autoSlideInterval) clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    currentBgIndex = (currentBgIndex + 1) % BACKGROUNDS.length;
    setBackground(BACKGROUNDS[currentBgIndex].url);
  }, 7000);
}

function toggleAutoSlide() {
  isAutoSlide = !isAutoSlide;
  const btn = document.getElementById('btn-auto-slide');
  if (isAutoSlide) {
    startAutoSlide();
  } else {
    btn.classList.remove('bg-rose-500', 'text-white');
    btn.classList.add('bg-white', 'dark:bg-slate-800');
    btn.innerText = '▶ Putar Slideshow Otomatis';
    clearInterval(autoSlideInterval);
  }
}

function randomBackground() {
  const rand = Math.floor(Math.random() * BACKGROUNDS.length);
  currentBgIndex = rand;
  setBackground(BACKGROUNDS[rand].url);
}

// Card Transparency & Photo Visibility Controls
let transparencyMode = 0; // 0: Semi-translucent Glass (default), 1: Ultra Clear Glass, 2: Solid
const TRANSPARENCY_STYLES = [
  { label: 'Kaca Bersih ✨', cardClass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-white/60 dark:border-white/10' },
  { label: 'Super Bening 👁️', cardClass: 'bg-white/50 dark:bg-slate-950/50 backdrop-blur-xs border-white/40 dark:border-white/10 shadow-2xl' },
  { label: 'Solid ⚪', cardClass: 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-none border-rose-100 dark:border-slate-800' }
];

function toggleCardTransparency() {
  transparencyMode = (transparencyMode + 1) % TRANSPARENCY_STYLES.length;
  applyTransparency();
}

function applyTransparency() {
  const card = document.getElementById('main-card');
  const label = document.getElementById('glass-label');
  if (!card) return;

  // Remove existing transparency classes
  card.className = 'w-full max-w-xl rounded-[28px] sm:rounded-[44px] p-6 sm:p-10 shadow-2xl transition-all duration-300 text-center ' + TRANSPARENCY_STYLES[transparencyMode].cardClass;
  
  if (label) {
    label.innerText = TRANSPARENCY_STYLES[transparencyMode].label;
  }
}

// Dark Mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}
