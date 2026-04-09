/* ================================================
   ANIMATIONS.JS — GSAP ScrollTrigger animations
   Section-specific animation sequences
   ================================================ */

class SiteAnimations {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    gsap.registerPlugin(ScrollTrigger);
    this.initialized = true;

    // Small delay to ensure DOM is ready
    requestAnimationFrame(() => {
      this.setupTrackAnimations();
      this.setupCarinoAnimations();
      this.setupDragonBallAnimations();
      this.setupSmithsAnimations();
      this.setupSignAnimations();
      this.setupProposalAnimations();
    });
  }

  /* ========================
     Generic Track Animations
     (lyrics fade in, messages appear)
     ======================== */
  setupTrackAnimations() {
    // Each track: fade in lyrics line by line
    document.querySelectorAll('.track').forEach(track => {
      const lines = track.querySelectorAll('.lyric-line');
      const message = track.querySelector('.personal-message');
      const divider = track.querySelector('.divider');
      const header = track.querySelector('.track-header');
      const number = track.querySelector('.track-number');

      // Track header
      if (header) {
        gsap.fromTo(header,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: track,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Track number
      if (number) {
        gsap.fromTo(number,
          { opacity: 0 },
          {
            opacity: 0.08,
            duration: 1,
            scrollTrigger: {
              trigger: track,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Lyric lines — stagger
      if (lines.length > 0) {
        gsap.fromTo(lines,
          { opacity: 0, y: 25 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.25,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: lines[0].closest('.lyric'),
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Divider
      if (divider) {
        gsap.fromTo(divider,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 0.3, scaleX: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: divider,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Personal message
      if (message) {
        gsap.fromTo(message,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: message,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    });
  }

  /* ========================
     CARIÑO — Track 1
     ======================== */
  setupCarinoAnimations() {
    // Nothing extra beyond generic for now — watercolor particles handle the vibe
  }

  /* ========================
     DRAGON BALL GT — Track 2
     ======================== */
  setupDragonBallAnimations() {
    const section = document.getElementById('dragonball');
    if (!section) return;

    // Constellation stars appear
    const stars = section.querySelectorAll('.star-dot');
    const lines = section.querySelectorAll('.constellation-line');
    const meetGlow = section.querySelector('.meeting-glow');
    const lyricExtra = section.querySelector('.lyric-extra');

    if (stars.length > 0) {
      gsap.fromTo(stars,
        { opacity: 0, scale: 0 },
        {
          opacity: 1, scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: section.querySelector('.constellation-hands'),
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // Constellation lines draw
    if (lines.length > 0) {
      gsap.to(lines, {
        strokeDashoffset: 0,
        duration: 1.2,
        stagger: 0.06,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section.querySelector('.constellation-hands'),
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        }
      });
    }

    // Meeting glow
    if (meetGlow) {
      gsap.fromTo(meetGlow,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1, scale: 1.5,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section.querySelector('.constellation-hands'),
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // "Me dê as mãos"
    if (lyricExtra) {
      gsap.fromTo(lyricExtra,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: lyricExtra,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  }

  /* ========================
     THE SMITHS — Track 3
     ======================== */
  setupSmithsAnimations() {
    const section = document.getElementById('smiths');
    if (!section) return;

    const lights = section.querySelectorAll('.street-light');
    const bus = document.getElementById('bus');
    const eternalLight = document.getElementById('eternal-light');
    const lightGlow = section.querySelector('.light-glow-circle');
    const lightText = section.querySelector('.light-text');

    // Street lights turn on sequentially
    if (lights.length > 0) {
      lights.forEach((light, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: `top ${70 - i * 8}%`,
          onEnter: () => light.classList.add('lit'),
          onLeaveBack: () => light.classList.remove('lit'),
        });
      });
    }

    // Bus drives across (slow, cinematic)
    if (bus) {
      gsap.fromTo(bus,
        { x: -200 },
        {
          x: window.innerWidth + 200,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 30%',
            scrub: 3,
          }
        }
      );
    }

    // Fireflies activate on section enter
    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 20%',
      onEnter: () => section.classList.add('active'),
      onLeave: () => section.classList.remove('active'),
      onEnterBack: () => section.classList.add('active'),
      onLeaveBack: () => section.classList.remove('active'),
    });

    // Eternal light glow
    if (lightGlow) {
      gsap.fromTo(lightGlow,
        { opacity: 0, scale: 0.3 },
        {
          opacity: 1, scale: 1,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: eternalLight,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    // Light text
    if (lightText) {
      gsap.fromTo(lightText,
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: eternalLight,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  }

  /* ========================
     SIGN OF THE TIMES — Track 4
     ======================== */
  setupSignAnimations() {
    const section = document.getElementById('signofthetimes');
    if (!section) return;

    const lensFlare = document.getElementById('lens-flare');
    const secondaryLyric = section.querySelector('.lyric.secondary');

    // Lens flare
    if (lensFlare) {
      gsap.fromTo(lensFlare,
        { opacity: 0, scale: 0.5, x: 50 },
        {
          opacity: 1, scale: 1, x: 0,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: 2,
          }
        }
      );
    }

    // Secondary lyrics
    if (secondaryLyric) {
      const secLines = secondaryLyric.querySelectorAll('.lyric-line');
      gsap.fromTo(secLines,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          stagger: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: secondaryLyric,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  }

  /* ========================
     PROPOSAL — UP Theme
     ======================== */
  setupProposalAnimations() {
    const section = document.getElementById('proposal');
    if (!section) return;

    const house = document.getElementById('up-house');
    const proposalName = document.getElementById('proposal-name');
    const proposalQ = document.getElementById('proposal-question');
    const proposalAsk = document.getElementById('proposal-ask');
    const proposalBtns = document.getElementById('proposal-buttons');

    // Create balloons
    this.createBalloons();

    // House floats up
    if (house) {
      gsap.fromTo(house,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 40%',
            toggleActions: 'play none none none',
          }
        }
      );

      // Gentle float animation after appearing
      gsap.to(house, {
        y: -10,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2,
      });
    }

    // Proposal text sequence
    const proposalTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 30%',
        toggleActions: 'play none none none',
      }
    });

    if (proposalName) {
      proposalTl.fromTo(proposalName,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out' }
      );
    }

    if (proposalQ) {
      proposalTl.fromTo(proposalQ,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (proposalAsk) {
      proposalTl.fromTo(proposalAsk,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' },
        '-=0.2'
      );
    }

    if (proposalBtns) {
      proposalTl.fromTo(proposalBtns,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.2'
      );
    }
  }

  /* ========================
     Create Balloons (DOM)
     ======================== */
  createBalloons() {
    const container = document.getElementById('balloons');
    if (!container) return;

    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f1c40f',
      '#9b59b6', '#e67e22', '#1abc9c', '#e8a0bf',
      '#ff6b9d', '#00bcd4', '#ff9800', '#8bc34a',
      '#ff5252', '#7c4dff', '#64ffda', '#ffd740',
    ];

    const balloonCount = 30;

    for (let i = 0; i < balloonCount; i++) {
      const balloon = document.createElement('div');
      balloon.classList.add('balloon');

      const color = colors[i % colors.length];
      balloon.style.backgroundColor = color;
      balloon.style.left = `${Math.random() * 90 + 5}%`;
      balloon.style.bottom = `-80px`;

      // Highlight for 3D illusion
      const highlight = document.createElement('div');
      highlight.classList.add('balloon-highlight');
      balloon.appendChild(highlight);

      container.appendChild(balloon);

      // Animate balloon rising with GSAP
      const delay = Math.random() * 3;
      const duration = 4 + Math.random() * 4;
      const xDrift = (Math.random() - 0.5) * 80;

      gsap.fromTo(balloon,
        {
          opacity: 0,
          y: 0,
          x: 0,
          scale: 0.6 + Math.random() * 0.5,
          rotation: (Math.random() - 0.5) * 10,
        },
        {
          opacity: 0.9,
          y: -(window.innerHeight * 1.3 + Math.random() * 200),
          x: xDrift,
          rotation: (Math.random() - 0.5) * 20,
          duration: duration,
          delay: delay,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: '#proposal',
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
          onComplete: () => {
            // Reset and rise again
            this.loopBalloon(balloon, xDrift);
          }
        }
      );
    }
  }

  loopBalloon(balloon, xDrift) {
    balloon.style.left = `${Math.random() * 90 + 5}%`;

    gsap.set(balloon, { y: 0, x: 0, opacity: 0 });

    gsap.to(balloon, {
      opacity: 0.85,
      y: -(window.innerHeight * 1.3 + Math.random() * 200),
      x: (Math.random() - 0.5) * 80,
      rotation: (Math.random() - 0.5) * 20,
      duration: 5 + Math.random() * 4,
      delay: Math.random() * 2,
      ease: 'power1.out',
      onComplete: () => this.loopBalloon(balloon, xDrift),
    });
  }

  /* ========================
     Celebration animation
     ======================== */
  playCelebration() {
    const celebration = document.getElementById('celebration');
    const content = document.getElementById('celebration-content');

    if (!celebration) return;

    celebration.classList.add('show');

    // Scroll to celebration
    setTimeout(() => {
      celebration.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    // Fade in content
    setTimeout(() => {
      gsap.fromTo(content,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }
      );
    }, 600);
  }
}

// Export
window.SiteAnimations = SiteAnimations;
