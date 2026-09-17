/**
 * SRI SRI RADHA KRISHNA - PRE-RADHASHTAMI CONTROLLER
 * - Plays user's chosen devotional background music from 0.0s
 * - 0.0s to 5.7s: Muted video golden line formation
 * - At 5.7s: Celestial bloom transition into Pre-Radhashtami Poster
 * - Golden glowing Lotus Feet button with rippling energy circles and pointer
 * - On clicking Lotus Feet: Reveals Personalized Invitation Card with Radha Rani shower
 * - Supports URL parameters: ?id=h.g.vamshi_mohan_prabhu or ?name=Devotee+Name&photo=URL
 */

document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  initBackgroundMusic();
  initPersonalizedData();
  initDarshanController();
});

/* ==========================================================================
   1. DEVOTIONAL BACKGROUND MUSIC (From 0.0s)
   ========================================================================== */
function initBackgroundMusic() {
  const bgMusic = document.getElementById('bgMusic');
  if (!bgMusic) return;

  bgMusic.volume = 0.8;
  let audioStarted = false;

  function attemptPlay() {
    if (audioStarted) return;
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audioStarted = true;
          cleanupListeners();
        })
        .catch(() => {
          // Autoplay policy prevented immediate playback without interaction
        });
    }
  }

  // 1. Immediate trigger on execution
  attemptPlay();

  // 2. Trigger on window load
  window.addEventListener('load', attemptPlay, { once: true });

  // 3. User gesture fallback (touch, click, scroll, keydown) to immediately unlock audio
  function unlockOnGesture() {
    attemptPlay();
    if (audioStarted) cleanupListeners();
  }

  const events = ['pointerdown', 'touchstart', 'touchend', 'click', 'scroll', 'keydown'];
  events.forEach(evt => window.addEventListener(evt, unlockOnGesture, { passive: true }));

  function cleanupListeners() {
    events.forEach(evt => window.removeEventListener(evt, unlockOnGesture));
  }
}


/* ==========================================================================
   2. PERSONALIZED DEVOTEE INVITATION DATA (Supports Multiple Prabhus via URL)
   ========================================================================== */
// Pre-registered Prabhu profiles dictionary (matching the Vercel site architecture)
const DEVOTEE_REGISTRY = {
  'h.g.vishnu_murti_prabhu': {
    name: 'H.G. VISHNU MURTI PRABHU',
    photo: 'images/vishnu_murti_prabhu.jpg',
    card: 'images/radharani_dupatta_vishnu_murti.png'
  },
  'vishnu_murti_prabhu': {
    name: 'H.G. VISHNU MURTI PRABHU',
    photo: 'images/vishnu_murti_prabhu.jpg',
    card: 'images/radharani_dupatta_vishnu_murti.png'
  },
  'h.g.vishnu_murti': {
    name: 'H.G. VISHNU MURTI PRABHU',
    photo: 'images/vishnu_murti_prabhu.jpg',
    card: 'images/radharani_dupatta_vishnu_murti.png'
  },
  'vishnu_murti': {
    name: 'H.G. VISHNU MURTI PRABHU',
    photo: 'images/vishnu_murti_prabhu.jpg',
    card: 'images/radharani_dupatta_vishnu_murti.png'
  },
  'h.g.abhaya_hari_prabhu': {
    name: 'H.G. ABHAYA HARI PRABHU',
    photo: 'images/abhaya_hari_prabhu.jpg',
    card: 'images/radharani_dupatta_abhaya_hari.png'
  },
  'abhaya_hari_prabhu': {
    name: 'H.G. ABHAYA HARI PRABHU',
    photo: 'images/abhaya_hari_prabhu.jpg',
    card: 'images/radharani_dupatta_abhaya_hari.png'
  },
  'h.g.abhaya_hari': {
    name: 'H.G. ABHAYA HARI PRABHU',
    photo: 'images/abhaya_hari_prabhu.jpg',
    card: 'images/radharani_dupatta_abhaya_hari.png'
  },
  'abhaya_hari': {
    name: 'H.G. ABHAYA HARI PRABHU',
    photo: 'images/abhaya_hari_prabhu.jpg',
    card: 'images/radharani_dupatta_abhaya_hari.png'
  },
  'h.g.madan_gopal_prabhu': {
    name: 'H.G. MADAN GOPAL PRABHU',
    photo: 'images/madan_gopal_prabhu.jpg',
    card: 'images/radharani_dupatta_madan_gopal.png'
  },
  'madan_gopal_prabhu': {
    name: 'H.G. MADAN GOPAL PRABHU',
    photo: 'images/madan_gopal_prabhu.jpg',
    card: 'images/radharani_dupatta_madan_gopal.png'
  },
  'h.g.madan_gopal': {
    name: 'H.G. MADAN GOPAL PRABHU',
    photo: 'images/madan_gopal_prabhu.jpg',
    card: 'images/radharani_dupatta_madan_gopal.png'
  },
  'madan_gopal': {
    name: 'H.G. MADAN GOPAL PRABHU',
    photo: 'images/madan_gopal_prabhu.jpg',
    card: 'images/radharani_dupatta_madan_gopal.png'
  },
  'h.g.vishnu_murti_prabhu': {
    name: 'H.G. VISHNU MURTI PRABHU',
    photo: 'images/vishnu_murti_prabhu.jpg',
    card: 'images/radharani_dupatta_vishnu_murti.png'
  },
  'vishnu_murti_prabhu': {
    name: 'H.G. VISHNU MURTI PRABHU',
    photo: 'images/vishnu_murti_prabhu.jpg',
    card: 'images/radharani_dupatta_vishnu_murti.png'
  },
  'h.g.vishnu_murti': {
    name: 'H.G. VISHNU MURTI PRABHU',
    photo: 'images/vishnu_murti_prabhu.jpg',
    card: 'images/radharani_dupatta_vishnu_murti.png'
  },
  'vishnu_murti': {
    name: 'H.G. VISHNU MURTI PRABHU',
    photo: 'images/vishnu_murti_prabhu.jpg',
    card: 'images/radharani_dupatta_vishnu_murti.png'
  },
  'h.g.amitasan_prabhu': {
    name: 'H.G. AMITASAN PRABHU',
    photo: 'images/amitasan_prabhu.jpg',
    card: 'images/radharani_dupatta_amitasan.png'
  },
  'amitasan_prabhu': {
    name: 'H.G. AMITASAN PRABHU',
    photo: 'images/amitasan_prabhu.jpg',
    card: 'images/radharani_dupatta_amitasan.png'
  },
  'h.g.amitasan': {
    name: 'H.G. AMITASAN PRABHU',
    photo: 'images/amitasan_prabhu.jpg',
    card: 'images/radharani_dupatta_amitasan.png'
  },
  'amitasan': {
    name: 'H.G. AMITASAN PRABHU',
    photo: 'images/amitasan_prabhu.jpg',
    card: 'images/radharani_dupatta_amitasan.png'
  },
  'h.g.anantsesh_prabhu': {
    name: 'H.G. ANANTSESH PRABHU',
    photo: 'images/anantsesh_prabhu.jpg',
    card: 'images/radharani_dupatta_anantsesh.png'
  },
  'anantsesh_prabhu': {
    name: 'H.G. ANANTSESH PRABHU',
    photo: 'images/anantsesh_prabhu.jpg',
    card: 'images/radharani_dupatta_anantsesh.png'
  },
  'h.g.anantsesh': {
    name: 'H.G. ANANTSESH PRABHU',
    photo: 'images/anantsesh_prabhu.jpg',
    card: 'images/radharani_dupatta_anantsesh.png'
  },
  'anantsesh': {
    name: 'H.G. ANANTSESH PRABHU',
    photo: 'images/anantsesh_prabhu.jpg',
    card: 'images/radharani_dupatta_anantsesh.png'
  },
  'h.g.krishna_charan_prabhu': {
    name: 'H.G. KRISHNA CHARAN PRABHU',
    photo: 'images/krishna_charan_prabhu.jpg',
    card: 'images/radharani_dupatta_krishna_charan.png'
  },
  'krishna_charan_prabhu': {
    name: 'H.G. KRISHNA CHARAN PRABHU',
    photo: 'images/krishna_charan_prabhu.jpg',
    card: 'images/radharani_dupatta_krishna_charan.png'
  },
  'h.g.krishna_charan': {
    name: 'H.G. KRISHNA CHARAN PRABHU',
    photo: 'images/krishna_charan_prabhu.jpg',
    card: 'images/radharani_dupatta_krishna_charan.png'
  },
  'krishna_charan': {
    name: 'H.G. KRISHNA CHARAN PRABHU',
    photo: 'images/krishna_charan_prabhu.jpg',
    card: 'images/radharani_dupatta_krishna_charan.png'
  },
  'h.g.raghav_charan_prabhu': {
    name: 'H.G. RAGHAV CHARAN PRABHU',
    photo: 'images/raghav_charan_prabhu.jpg',
    card: 'images/radharani_dupatta_raghav_charan.png'
  },
  'raghav_charan_prabhu': {
    name: 'H.G. RAGHAV CHARAN PRABHU',
    photo: 'images/raghav_charan_prabhu.jpg',
    card: 'images/radharani_dupatta_raghav_charan.png'
  },
  'h.g.raghav_charan': {
    name: 'H.G. RAGHAV CHARAN PRABHU',
    photo: 'images/raghav_charan_prabhu.jpg',
    card: 'images/radharani_dupatta_raghav_charan.png'
  },
  'raghav_charan': {
    name: 'H.G. RAGHAV CHARAN PRABHU',
    photo: 'images/raghav_charan_prabhu.jpg',
    card: 'images/radharani_dupatta_raghav_charan.png'
  },
  'h.g.amshumaan_prabhu': {
    name: 'H.G. AMSHUMAAN PRABHU',
    photo: 'images/amshumaan_prabhu.jpg',
    card: 'images/radharani_dupatta_amshumaan.png'
  },
  'amshumaan_prabhu': {
    name: 'H.G. AMSHUMAAN PRABHU',
    photo: 'images/amshumaan_prabhu.jpg',
    card: 'images/radharani_dupatta_amshumaan.png'
  },
  'h.g.amshumaan': {
    name: 'H.G. AMSHUMAAN PRABHU',
    photo: 'images/amshumaan_prabhu.jpg',
    card: 'images/radharani_dupatta_amshumaan.png'
  },
  'amshumaan': {
    name: 'H.G. AMSHUMAAN PRABHU',
    photo: 'images/amshumaan_prabhu.jpg',
    card: 'images/radharani_dupatta_amshumaan.png'
  },
  'h.g.nikhileswar': {
    name: 'H.G. NIKHILESWAR PRABHU',
    photo: 'images/nikhileswar_prabhu.jpg',
    card: 'images/radharani_dupatta_nikhileswar_prabhu.png'
  },
  'nikhileswar': {
    name: 'H.G. NIKHILESWAR PRABHU',
    photo: 'images/nikhileswar_prabhu.jpg',
    card: 'images/radharani_dupatta_nikhileswar_prabhu.png'
  },
  'h.g.nikhileswar_prabhu': {
    name: 'H.G. NIKHILESWAR PRABHU',
    photo: 'images/nikhileswar_prabhu.jpg',
    card: 'images/radharani_dupatta_nikhileswar_prabhu.png'
  },
  'nikhileswar_prabhu': {
    name: 'H.G. NIKHILESWAR PRABHU',
    photo: 'images/nikhileswar_prabhu.jpg',
    card: 'images/radharani_dupatta_nikhileswar_prabhu.png'
  },
  'h.g.prabal_krishna_prabhu': {
    name: 'H.G. PRABAL KRISHNA PRABHU',
    photo: 'images/prabal_krishna_prabhu.jpg',
    card: 'images/radharani_dupatta_prabal_krishna.png'
  },
  'prabal_krishna_prabhu': {
    name: 'H.G. PRABAL KRISHNA PRABHU',
    photo: 'images/prabal_krishna_prabhu.jpg',
    card: 'images/radharani_dupatta_prabal_krishna.png'
  },
  'prabal_krishna': {
    name: 'H.G. PRABAL KRISHNA PRABHU',
    photo: 'images/prabal_krishna_prabhu.jpg',
    card: 'images/radharani_dupatta_prabal_krishna.png'
  },
  'prabalkrishna': {
    name: 'H.G. PRABAL KRISHNA PRABHU',
    photo: 'images/prabal_krishna_prabhu.jpg',
    card: 'images/radharani_dupatta_prabal_krishna.png'
  },
  'h.g.siddha_swaroop_prabhu': {
    name: 'H.G. SIDDHA SWAROOP PRABHU',
    photo: 'images/siddha_swaroop_prabhu.jpg',
    card: 'images/radharani_dupatta_siddha_swaroop.png'
  },
  'siddha_swaroop_prabhu': {
    name: 'H.G. SIDDHA SWAROOP PRABHU',
    photo: 'images/siddha_swaroop_prabhu.jpg',
    card: 'images/radharani_dupatta_siddha_swaroop.png'
  },
  'siddha_swaroop': {
    name: 'H.G. SIDDHA SWAROOP PRABHU',
    photo: 'images/siddha_swaroop_prabhu.jpg',
    card: 'images/radharani_dupatta_siddha_swaroop.png'
  },
  'siddhaswaroop': {
    name: 'H.G. SIDDHA SWAROOP PRABHU',
    photo: 'images/siddha_swaroop_prabhu.jpg',
    card: 'images/radharani_dupatta_siddha_swaroop.png'
  },
  'h.g.vamshi_mohan_prabhu': {
    name: 'H.G. VAMSHI MOHAN PRABHU',
    photo: 'images/vamshi_mohan_prabhu.jpg',
    card: 'images/radharani_dupatta_transparent.png'
  },
  'vamshi_mohan_prabhu': {
    name: 'H.G. VAMSHI MOHAN PRABHU',
    photo: 'images/vamshi_mohan_prabhu.jpg',
    card: 'images/radharani_dupatta_transparent.png'
  },
  'radha_raman_prabhu': {
    name: 'H.G. RADHA RAMAN PRABHU',
    photo: 'images/vamshi_mohan_prabhu.jpg'
  },
  'gauranga_prabhu': {
    name: 'H.G. GAURANGA PRABHU',
    photo: 'images/vamshi_mohan_prabhu.jpg'
  },
  'madhav_prabhu': {
    name: 'H.G. MADHAV PRABHU',
    photo: 'images/vamshi_mohan_prabhu.jpg'
  }
};

function initPersonalizedData() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id') || urlParams.get('prabhu') || '';
  const customName = urlParams.get('name') || '';
  const customPhoto = urlParams.get('photo') || '';

  const nameEl = document.getElementById('devoteeName');
  const photoEl = document.getElementById('devoteePhoto');
  const cardBgArtwork = document.getElementById('cardBgArtwork');
  const namePlate = document.getElementById('devoteeNamePlate');
  const photoFrame = document.getElementById('devoteePhotoFrame');

  let profile = null;

  if (idParam && DEVOTEE_REGISTRY[idParam.toLowerCase()]) {
    profile = DEVOTEE_REGISTRY[idParam.toLowerCase()];
  } else if (customName) {
    profile = {
      name: decodeURIComponent(customName.replace(/\+/g, ' ')).toUpperCase(),
      photo: customPhoto ? decodeURIComponent(customPhoto) : 'images/vamshi_mohan_prabhu.jpg'
    };
  }

  // If a specific custom prabhu name is passed
  if (profile) {
    if (nameEl) nameEl.textContent = profile.name;
    if (photoEl && profile.photo) photoEl.src = profile.photo;
    
    // Dedicated pre-rendered high-res dupatta card
    if (profile.card) {
      if (namePlate) namePlate.style.display = 'none';
      if (photoFrame) photoFrame.style.display = 'none';
      if (cardBgArtwork) cardBgArtwork.src = profile.card;
    } else {
      // Dynamic prabhu overlay on card
      if (namePlate) namePlate.style.display = 'block';
      if (photoFrame) photoFrame.style.display = 'block';
      if (cardBgArtwork) cardBgArtwork.src = 'images/radharani_dupatta_transparent.png';
    }
  } else {
    // Default: H.G. Vamshi Mohan Prabhu on transparent dupatta card
    if (namePlate) namePlate.style.display = 'none';
    if (photoFrame) photoFrame.style.display = 'none';
    if (cardBgArtwork) cardBgArtwork.src = 'images/radharani_dupatta_transparent.png';
  }
}


/* ==========================================================================
   3. DARSHAN VIDEO & SEAMLESS 5.7s TRANSITION CONTROLLER
   ========================================================================== */
function initDarshanController() {
  const video = document.getElementById('darshanVideo');
  const bloom = document.getElementById('bloomOverlay');
  const finalImg = document.getElementById('finalImage');
  const lotusZone = document.getElementById('lotusFeetTouchZone');
  const lotusBtn = document.getElementById('lotusFeetBtn');
  const darshanFrame = document.getElementById('darshanFrame');
  const cardCenter = document.getElementById('invitationCardCenter');

  if (!video) return;

  video.muted = true;
  video.playsInline = true;

  const TRANSITION_TIME = 5.0; // Transition at 5.0 seconds
  let transitionDone = false;

  function triggerDivineTransition() {
    if (transitionDone) return;
    transitionDone = true;

    // 1. Golden bloom flash bursts outward
    if (bloom) bloom.classList.add('flash');

    // 2. Pre-Radhashtami Poster materializes seamlessly
    if (finalImg) finalImg.classList.add('revealed');

    // 3. Fade video away cleanly
    setTimeout(() => {
      video.pause();
      video.classList.add('faded');
    }, 350);

    // 4. Activate glowing Lotus Feet with pulsating dark-yellow rings (EXACTLY 3 seconds after image reveal)
    setTimeout(() => {
      if (lotusZone) {
        lotusZone.classList.add('active');
      }
    }, 3000);
  }

  // High precision time check
  function checkTime() {
    if (!transitionDone && video.currentTime >= TRANSITION_TIME) {
      triggerDivineTransition();
    }
    if (!transitionDone) {
      requestAnimationFrame(checkTime);
    }
  }

  video.addEventListener('play', () => requestAnimationFrame(checkTime));
  video.addEventListener('timeupdate', () => {
    if (!transitionDone && video.currentTime >= TRANSITION_TIME) {
      triggerDivineTransition();
    }
  });

  // Fallback timer
  video.addEventListener('playing', () => {
    setTimeout(() => {
      if (!transitionDone) triggerDivineTransition();
    }, 5100);
  }, { once: true });


  // ========================================================================
  // 4. TOUCHING LOTUS FEET -> BLURS BACKGROUND POSTER & GROWS INVITATION CARD
  // ========================================================================
  const popupWrapper = document.getElementById('invitationPopup');

  if (lotusBtn) {
    lotusBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // 1. Hide the lotus feet pointer and glowing rings
      if (lotusZone) lotusZone.classList.add('hidden');

      // 2. Poster background (darshanFrame) blurs smoothly while staying visible!
      if (darshanFrame) darshanFrame.classList.add('blurred');
      document.body.classList.add('card-open');

      // 3. Floating Invitation Card pops up in center with smooth spring zoom
      setTimeout(() => {
        if (popupWrapper) popupWrapper.classList.add('active');
      }, 150);
    });
  }

  // Tap anywhere outside the card to dismiss if desired
  if (popupWrapper) {
    popupWrapper.addEventListener('click', (e) => {
      if (cardCenter && !cardCenter.contains(e.target)) {
        popupWrapper.classList.remove('active');
        setTimeout(() => {
          if (darshanFrame) darshanFrame.classList.remove('blurred');
          document.body.classList.remove('card-open');
          if (lotusZone) lotusZone.classList.remove('hidden');
        }, 250);
      }
    });
  }
}


/* ==========================================================================
   5. AMBIENT FALLING FLOWER PETALS (CANVAS)
   ========================================================================== */
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const COUNT = 45;
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -25;
      this.sz = Math.random() * 9 + 6;
      this.vy = Math.random() * 1.3 + 0.6;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.angle = Math.random() * 360;
      this.spin = (Math.random() - 0.5) * 3;
      const colors = ['#38bdf8', '#60a5fa', '#7dd3fc', '#0ea5e9', '#93c5fd', '#bae6fd'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.35;
    }
    update() {
      this.y += this.vy;
      this.x += this.vx;
      this.angle += this.spin;
      if (this.y > H + 30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.sz, -this.sz * 0.9, this.sz * 1.8, 0, 0, this.sz * 2);
      ctx.bezierCurveTo(-this.sz * 1.8, 0, -this.sz, -this.sz * 0.9, 0, 0);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < COUNT; i++) {
    petals.push(new Petal());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (const p of petals) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(loop);
  }
  loop();
}
