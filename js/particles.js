/* ================================================
   PARTICLES.JS — Canvas-based particle systems
   Gold particles, star field, confetti
   ================================================ */

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.activeEffect = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  start(effect) {
    if (this.activeEffect === effect) return;
    this.stop();
    this.activeEffect = effect;
    this.particles = [];

    switch (effect) {
      case 'intro':
        this.initIntroParticles();
        break;
      case 'carino':
        this.initWatercolor();
        break;
      case 'stars':
        this.initStarField();
        break;
      case 'none':
        return;
    }

    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.activeEffect = null;
    this.clear();
  }

  animate() {
    this.clear();

    switch (this.activeEffect) {
      case 'intro':
        this.drawIntroParticles();
        break;
      case 'carino':
        this.drawWatercolor();
        break;
      case 'stars':
        this.drawStarField();
        break;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /* ========================
     INTRO — Floating gold/pink particles
     ======================== */
  initIntroParticles() {
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        radius: Math.random() * 2.5 + 0.5,
        color: Math.random() > 0.5 ? '#d4a574' : '#e8a0bf',
        alpha: Math.random() * 0.4 + 0.1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  drawIntroParticles() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap around
      if (p.x < -10) p.x = this.w + 10;
      if (p.x > this.w + 10) p.x = -10;
      if (p.y < -10) p.y = this.h + 10;
      if (p.y > this.h + 10) p.y = -10;

      const currentAlpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = currentAlpha;
      this.ctx.fill();

      // Glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      const glow = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      glow.addColorStop(0, p.color);
      glow.addColorStop(1, 'transparent');
      this.ctx.fillStyle = glow;
      this.ctx.globalAlpha = currentAlpha * 0.3;
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }

  /* ========================
     CARIÑO — Watercolor blobs
     ======================== */
  initWatercolor() {
    const colors = ['#d4915e', '#c76b4a', '#e8a0bf', '#d4a574', '#f5e6d3'];
    const count = 12;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        radius: Math.random() * 60 + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.04 + 0.01,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.008 + 0.002,
      });
    }
  }

  drawWatercolor() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      if (p.x < -100) p.x = this.w + 100;
      if (p.x > this.w + 100) p.x = -100;
      if (p.y < -100) p.y = this.h + 100;
      if (p.y > this.h + 100) p.y = -100;

      const scale = 0.8 + 0.2 * Math.sin(p.pulse);
      const r = p.radius * scale;

      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      this.ctx.fillStyle = grad;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }

  /* ========================
     STARS — Star field with shooting stars
     ======================== */
  initStarField() {
    // Static stars
    const starCount = 120;
    for (let i = 0; i < starCount; i++) {
      this.particles.push({
        type: 'star',
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        radius: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }
    // Shooting stars (spawned periodically)
    this._shootingStarTimer = 0;
    this._shootingStars = [];
  }

  drawStarField() {
    // Static stars
    this.particles.forEach(p => {
      if (p.type !== 'star') return;
      p.pulse += p.pulseSpeed;
      const alpha = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#fff';
      this.ctx.globalAlpha = alpha;
      this.ctx.fill();

      // Subtle glow on brighter stars
      if (p.radius > 1.2) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        const glow = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        glow.addColorStop(0, 'rgba(255,215,0,0.3)');
        glow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glow;
        this.ctx.globalAlpha = alpha * 0.4;
        this.ctx.fill();
      }
    });

    // Shooting stars
    this._shootingStarTimer++;
    if (this._shootingStarTimer > 180 && Math.random() < 0.02) {
      this._shootingStarTimer = 0;
      this._shootingStars.push({
        x: Math.random() * this.w * 0.8,
        y: Math.random() * this.h * 0.4,
        vx: 4 + Math.random() * 3,
        vy: 2 + Math.random() * 2,
        length: 60 + Math.random() * 40,
        alpha: 1,
        decay: 0.015,
      });
    }

    this._shootingStars = this._shootingStars.filter(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= s.decay;

      if (s.alpha <= 0) return false;

      const angle = Math.atan2(s.vy, s.vx);
      const endX = s.x - Math.cos(angle) * s.length;
      const endY = s.y - Math.sin(angle) * s.length;

      const grad = this.ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
      grad.addColorStop(1, 'transparent');

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(endX, endY);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      return true;
    });

    this.ctx.globalAlpha = 1;
  }
}

/* ========================
   CONFETTI SYSTEM (separate canvas)
   ======================== */
class ConfettiSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.pieces = [];
    this.animationId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    this.canvas.width = this.canvas.parentElement.offsetWidth || window.innerWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight || window.innerHeight;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  burst(count = 150) {
    this.resize();
    const colors = [
      '#9b59b6', '#e74c3c', '#e8a0bf', '#ffd700',
      '#3498db', '#2ecc71', '#f39c12', '#d4a574',
      '#ff6b9d', '#c39bd3', '#76d7c4', '#f7dc6f'
    ];

    for (let i = 0; i < count; i++) {
      const isHeart = Math.random() < 0.15;
      this.pieces.push({
        x: this.w / 2 + (Math.random() - 0.5) * 100,
        y: this.h * 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: -(Math.random() * 10 + 5),
        width: Math.random() * 10 + 5,
        height: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        gravity: 0.15 + Math.random() * 0.1,
        alpha: 1,
        isHeart,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.1 + 0.03,
      });
    }

    if (!this.animationId) this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    this.pieces = this.pieces.filter(p => {
      p.vy += p.gravity;
      p.x += p.vx + Math.sin(p.wobble) * 0.5;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.wobble += p.wobbleSpeed;
      p.vx *= 0.99;

      if (p.y > this.h + 20) return false;
      if (p.y > this.h * 0.7) {
        p.alpha -= 0.01;
        if (p.alpha <= 0) return false;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.alpha;

      if (p.isHeart) {
        this.drawHeart(p.width * 0.8, p.color);
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      }

      this.ctx.restore();
      return true;
    });

    this.ctx.globalAlpha = 1;

    if (this.pieces.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
    }
  }

  drawHeart(size, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    const s = size * 0.5;
    this.ctx.moveTo(0, s * 0.3);
    this.ctx.bezierCurveTo(-s, -s * 0.5, -s * 2, s * 0.3, 0, s * 1.5);
    this.ctx.bezierCurveTo(s * 2, s * 0.3, s, -s * 0.5, 0, s * 0.3);
    this.ctx.fill();
  }
}

// Export to global scope
window.ParticleSystem = ParticleSystem;
window.ConfettiSystem = ConfettiSystem;
