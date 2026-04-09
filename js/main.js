/* ================================================
   MAIN.JS — App Initialization & Event Handling
   Orchestrates the full experience
   ================================================ */

(function () {
  'use strict';

  // Systems
  let particles;
  let confetti;
  let animations;
  let audioManager;
  let currentSection = 'intro';

  // Section → audio track mapping
  const sectionAudio = {
    intro: null,         // No music on intro
    carino: 'carino',
    dragonball: 'dragonball',
    smiths: 'smiths',
    signofthetimes: 'signofthetimes',
    proposal: 'proposal',
    celebration: 'celebration',
  };

  // Section → particle effect mapping
  const sectionParticles = {
    intro: 'intro',
    carino: 'carino',
    dragonball: 'stars',
    smiths: 'none',
    signofthetimes: 'none',
    proposal: 'none',
    celebration: 'none',
  };

  /* ========================
     INITIALIZATION
     ======================== */
  function init() {
    // Wait for GSAP to load
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    // Initialize systems
    particles = new ParticleSystem('particles-canvas');
    confetti = new ConfettiSystem('confetti-canvas');
    animations = new SiteAnimations();
    audioManager = new AudioManager();

    // Start intro particles
    particles.start('intro');

    // Start vinyl spinning slowly
    const vinyl = document.getElementById('vinyl');
    if (vinyl) vinyl.classList.add('spinning');

    // Setup interactions
    setupPlayButton();
    setupSectionObserver();
    setupYesButtons();
    setupMuteButton();
  }

  /* ========================
     PLAY BUTTON — Start experience
     ======================== */
  function setupPlayButton() {
    const playBtn = document.getElementById('play-btn');
    const scrollHint = document.getElementById('scroll-hint');

    if (!playBtn) return;

    playBtn.addEventListener('click', () => {
      // Initialize audio on first user gesture — CRITICAL for mobile
      audioManager.init();

      // Animate button out
      gsap.to(playBtn, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          playBtn.style.display = 'none';
        }
      });

      // Animate vinyl up/shrink
      const vinylWrapper = document.querySelector('.vinyl-wrapper');
      gsap.to(vinylWrapper, {
        y: -30,
        scale: 0.85,
        duration: 1,
        ease: 'power2.inOut',
      });

      // Show scroll hint
      setTimeout(() => {
        if (scrollHint) {
          gsap.to(scrollHint, {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          });
        }
      }, 800);

      // Show mute button
      const muteBtn = document.getElementById('mute-btn');
      if (muteBtn) {
        setTimeout(() => {
          muteBtn.classList.add('visible');
        }, 1200);
      }

      // Enable scrolling
      setTimeout(() => {
        const scrollContainer = document.getElementById('scroll-container');
        if (scrollContainer) scrollContainer.classList.add('scrollable');

        // Initialize GSAP animations
        animations.init();

        // Refresh ScrollTrigger after enabling scroll
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 200);
      }, 600);
    });
  }

  /* ========================
     SECTION OBSERVER — Switch particles + audio
     ======================== */
  function setupSectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            const sectionId = entry.target.id;

            if (sectionId !== currentSection) {
              currentSection = sectionId;

              // Switch particle effect
              const effect = sectionParticles[sectionId];
              if (particles) {
                if (!effect || effect === 'none') {
                  particles.stop();
                } else {
                  particles.start(effect);
                }
              }

              // Switch audio track
              const trackId = sectionAudio[sectionId];
              if (audioManager && audioManager.isInitialized) {
                if (trackId) {
                  audioManager.play(trackId);
                } else {
                  audioManager.fadeOut(1500);
                }
              }
            }
          }
        });
      },
      {
        root: document.getElementById('scroll-container'),
        threshold: [0.35],
        rootMargin: '0px',
      }
    );

    // Observe all sections
    Object.keys(sectionAudio).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ========================
     MUTE BUTTON
     ======================== */
  function setupMuteButton() {
    const muteBtn = document.getElementById('mute-btn');
    if (!muteBtn) return;

    muteBtn.addEventListener('click', () => {
      if (!audioManager) return;

      const isMuted = audioManager.toggleMute();
      muteBtn.classList.toggle('muted', isMuted);
      muteBtn.setAttribute('aria-label', isMuted ? 'Ativar som' : 'Desativar som');

      // Update icon
      const icon = muteBtn.querySelector('.mute-icon');
      if (icon) {
        icon.textContent = isMuted ? '🔇' : '🔊';
      }
    });
  }

  /* ========================
     YES BUTTONS — Celebration trigger
     ======================== */
  function setupYesButtons() {
    const btn1 = document.getElementById('btn-yes-1');
    const btn2 = document.getElementById('btn-yes-2');

    const handleYes = () => {
      // Disable buttons
      if (btn1) btn1.disabled = true;
      if (btn2) btn2.disabled = true;

      // Play celebration
      if (animations) {
        animations.playCelebration();
      }

      // Switch to celebration audio (keeps UP theme playing)
      if (audioManager && audioManager.isInitialized) {
        audioManager.play('celebration');
      }

      // Burst confetti after scroll
      setTimeout(() => {
        if (confetti) {
          confetti.burst(200);
          setTimeout(() => confetti.burst(100), 800);
          setTimeout(() => confetti.burst(80), 1600);
          setTimeout(() => confetti.burst(60), 3000);
        }
      }, 800);

      // Stop canvas particles
      if (particles) {
        particles.stop();
      }
    };

    if (btn1) btn1.addEventListener('click', handleYes);
    if (btn2) btn2.addEventListener('click', handleYes);
  }

  /* ========================
     START
     ======================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
