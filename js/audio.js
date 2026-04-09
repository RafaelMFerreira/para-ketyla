/* ================================================
   AUDIO.JS — Audio Manager with Crossfade
   Plays respective songs for each section
   ================================================ */

class AudioManager {
  constructor() {
    this.tracks = {};
    this.currentTrackId = null;
    this.isMuted = false;
    this.isInitialized = false;
    this.masterVolume = 0.5;
    this.fadeTimer = null;
    this.pendingTrack = null;
  }

  /**
   * Initialize audio elements — must be called from a user gesture (tap/click)
   */
  init() {
    if (this.isInitialized) return;

    // ============================================================
    // 🎵 CONFIGURAÇÃO DAS MÚSICAS
    // Ajuste o "startTime" (em segundos) para escolher de que
    // ponto cada música começa a tocar.
    //
    // Exemplo: startTime: 45 → começa no 0:45 da música
    //          startTime: 0  → começa do início
    // ============================================================
    const trackList = {
      carino: { src: 'audio/carino.mp3', startTime: 65 },
      dragonball: { src: 'audio/dragonball-gt.mp3', startTime: 54 },
      smiths: { src: 'audio/there-is-a-light.mp3', startTime: 60 },
      signofthetimes: { src: 'audio/sign-of-the-times.mp3', startTime: 15 },
      proposal: { src: 'audio/married-life-up.mp3', startTime: 0 },
      celebration: { src: 'audio/married-life-up.mp3', startTime: 0 },
    };

    Object.entries(trackList).forEach(([id, config]) => {
      const audio = new Audio();
      audio.src = config.src;
      audio.loop = true;
      audio.volume = 0;
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';

      // Handle load errors gracefully
      audio.addEventListener('error', () => {
        console.warn(`⚠️ Audio not found: ${config.src} — Add this file to play music in the "${id}" section.`);
        this.tracks[id].failed = true;
      });

      audio.addEventListener('canplaythrough', () => {
        this.tracks[id].loaded = true;

        // If this track was pending play, start it now
        if (this.pendingTrack === id) {
          this.pendingTrack = null;
          this.play(id);
        }
      }, { once: true });

      this.tracks[id] = { audio, loaded: false, failed: false, startTime: config.startTime || 0 };
    });

    this.isInitialized = true;
    console.log('🎵 Audio Manager initialized. Add MP3 files to the audio/ folder.');
  }

  /**
   * Play a track with crossfade from current track
   */
  async play(trackId) {
    if (!this.isInitialized) return;
    if (trackId === this.currentTrackId) return;

    const newTrack = this.tracks[trackId];
    if (!newTrack || newTrack.failed) return;

    // If track isn't loaded yet, set it as pending
    if (!newTrack.loaded) {
      this.pendingTrack = trackId;
      return;
    }

    const oldTrackId = this.currentTrackId;
    const oldTrack = oldTrackId ? this.tracks[oldTrackId] : null;
    this.currentTrackId = trackId;

    // Start new track
    try {
      // Don't reset time if it's the same audio source (celebration reuses UP theme)
      if (!oldTrack || oldTrack.audio.src !== newTrack.audio.src) {
        newTrack.audio.currentTime = newTrack.startTime || 0;
      }
      newTrack.audio.volume = 0;
      await newTrack.audio.play();
    } catch (e) {
      console.warn('Audio play failed:', e.message);
      this.currentTrackId = oldTrackId;
      return;
    }

    // Crossfade
    this.crossfade(oldTrack, newTrack, 2500);
  }

  /**
   * Smooth crossfade between two tracks
   */
  crossfade(fromTrack, toTrack, durationMs) {
    if (this.fadeTimer) cancelAnimationFrame(this.fadeTimer);

    const startTime = performance.now();
    const targetVol = this.isMuted ? 0 : this.masterVolume;
    const fromStartVol = fromTrack ? fromTrack.audio.volume : 0;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease in-out curve
      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Fade out old track
      if (fromTrack && fromTrack.audio) {
        fromTrack.audio.volume = Math.max(0, fromStartVol * (1 - ease));
      }

      // Fade in new track
      if (toTrack && toTrack.audio) {
        toTrack.audio.volume = targetVol * ease;
      }

      if (progress < 1) {
        this.fadeTimer = requestAnimationFrame(step);
      } else {
        // Cleanup: pause old track
        if (fromTrack && fromTrack.audio) {
          fromTrack.audio.pause();
          fromTrack.audio.volume = 0;
        }
        this.fadeTimer = null;
      }
    };

    this.fadeTimer = requestAnimationFrame(step);
  }

  /**
   * Stop a specific section's audio (for sections with no music)
   */
  fadeOut(durationMs = 2000) {
    if (!this.currentTrackId) return;

    const track = this.tracks[this.currentTrackId];
    this.currentTrackId = null;

    if (!track) return;

    this.crossfade(track, null, durationMs);

    // Pause after fade completes
    setTimeout(() => {
      if (track.audio) {
        track.audio.pause();
      }
    }, durationMs + 100);
  }

  /**
   * Toggle mute/unmute
   */
  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      // Mute all
      Object.values(this.tracks).forEach(t => {
        if (t.audio) t.audio.volume = 0;
      });
    } else {
      // Unmute current track
      if (this.currentTrackId && this.tracks[this.currentTrackId]) {
        this.tracks[this.currentTrackId].audio.volume = this.masterVolume;
      }
    }

    return this.isMuted;
  }

  /**
   * Stop everything
   */
  stopAll() {
    if (this.fadeTimer) cancelAnimationFrame(this.fadeTimer);
    Object.values(this.tracks).forEach(t => {
      if (t.audio) {
        t.audio.pause();
        t.audio.volume = 0;
      }
    });
    this.currentTrackId = null;
  }
}

// Export
window.AudioManager = AudioManager;
