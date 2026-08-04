"use client";

// Persistent localStorage key
const SOUND_STORAGE_KEY = "impossible_quiz_sound_enabled";

// Safe check for browser environment
const isBrowser = typeof window !== "undefined";

/**
 * Checks if sound is currently enabled.
 * Defaults to false (sound OFF on first visit).
 */
export function isSoundEnabled(): boolean {
  if (!isBrowser) return false;
  try {
    const value = localStorage.getItem(SOUND_STORAGE_KEY);
    return value === "true";
  } catch (e) {
    console.error("Failed to read sound preference:", e);
    return false;
  }
}

/**
 * Sets the sound enabled preference and dispatches a sync event.
 */
export function setSoundEnabled(enabled: boolean) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "true" : "false");
    // Dispatch event for other components to synchronize state
    window.dispatchEvent(new CustomEvent("sound-toggle-updated", { detail: enabled }));
  } catch (e) {
    console.error("Failed to save sound preference:", e);
  }
}

/**
 * Browser-native Web Audio API synthesizer for retro chiptune/terminal sounds.
 * Guarantees zero external licensing issues or asset dependency issues.
 */
class SoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (!isBrowser) return null;
    if (this.ctx) return this.ctx;

    // Initialize on first user-triggered play request to comply with autoplay policy
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser.", e);
    }
    return this.ctx;
  }

  /**
   * Play correct answer chime (Retro upbeat double beep)
   */
  public playCorrect() {
    if (!isSoundEnabled()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First note (high E)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5

    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.25);

    // Second note (even higher G) delayed slightly
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, now + 0.08); // G5

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.15, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.3);
  }

  /**
   * Play incorrect buzz (Low warning slide)
   */
  public playIncorrect() {
    if (!isSoundEnabled()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.3);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    // Low-pass filter to make sawtooth sound less harsh
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Play weighted/serious tone for life lost
   */
  public playLifeLost() {
    if (!isSoundEnabled()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(110, now); // A2
    osc1.frequency.linearRampToValueAtTime(55, now + 0.6); // A1

    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(111, now); // Detuned slightly
    osc2.frequency.linearRampToValueAtTime(55.5, now + 0.6);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(250, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  }

  /**
   * Play achievement unlock dynamic rise
   */
  public playAchievement() {
    if (!isSoundEnabled()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Quick rising scale arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
    const noteDuration = 0.08;

    notes.forEach((freq, idx) => {
      const noteTime = now + idx * noteDuration;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.005, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.25);
    });
  }

  /**
   * Play triumphant victory sting
   */
  public playVictory() {
    if (!isSoundEnabled()) return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Chord progression with a triumphant sweep
    // C major, then G major, then C major high octave
    const playChord = (frequencies: number[], startTime: number, duration: number) => {
      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    };

    // Chord 1: C major (C4, E4, G4)
    playChord([261.63, 329.63, 392.00], now, 0.4);

    // Chord 2: F major (F4, A4, C5)
    playChord([349.23, 440.00, 523.25], now + 0.3, 0.4);

    // Chord 3: G major (G4, B4, D5)
    playChord([392.00, 493.88, 587.33], now + 0.6, 0.4);

    // Chord 4: Triumphant C5 major (C5, E5, G5, C6)
    playChord([523.25, 659.25, 783.99, 1046.50], now + 0.9, 1.2);
  }
}

export const sound = new SoundSynthesizer();
