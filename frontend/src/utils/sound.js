// CozyCritters Retro 8-bit sound synthesizer using Web Audio API

let audioCtx = null;
let isMuted = localStorage.getItem('cozy_critter_muted') === 'true';

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const soundManager = {
  getMuteState: () => isMuted,
  
  toggleMute: () => {
    isMuted = !isMuted;
    localStorage.setItem('cozy_critter_muted', isMuted);
    return isMuted;
  },

  // Play a simple button click / selection sound
  playClick: () => {
    if (isMuted) return;
    const ctx = initAudio();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  },

  // Play chewing sound (Feed action)
  playEat: () => {
    if (isMuted) return;
    const ctx = initAudio();
    const now = ctx.currentTime;

    // We chain a couple of small "munch" bites together
    const playMunch = (delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now + delay);
      osc.frequency.exponentialRampToValueAtTime(50, now + delay + 0.1);

      gain.gain.setValueAtTime(0.15, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.1);
    };

    playMunch(0);
    playMunch(0.15);
    playMunch(0.3);
  },

  // Play a happy jump / boing chirp (Play action)
  playBoing: () => {
    if (isMuted) return;
    const ctx = initAudio();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  },

  // Play a soft snore (Sleep action)
  playSnore: () => {
    if (isMuted) return;
    const ctx = initAudio();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Slow rise and fall in pitch and volume to mimic peaceful breathing
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.4);
    osc.frequency.linearRampToValueAtTime(180, now + 0.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
  },

  // Play a cute "sparkle/level-up" sound for success/adoption
  playSuccess: () => {
    if (isMuted) return;
    const ctx = initAudio();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (major arpeggio)
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0.08, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.15);
    });
  }
};
