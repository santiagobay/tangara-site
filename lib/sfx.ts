/**
 * Tangara sound design — every sound is synthesised with the Web Audio API (no audio files).
 * Soft sine/triangle tones tuned to an A-minor pentatonic scale, plus filtered noise for air,
 * all sent through a gentle echo so the UI sounds calm and spacious, like the visuals.
 *
 * Sound is OFF by default and only starts after the visitor turns it on (browser autoplay
 * rules + good manners). The choice is remembered per browser.
 */

export type SfxName =
  | "hover"
  | "click"
  | "whoosh"
  | "close"
  | "success"
  | "tick"
  | "on"
  | "off"
  | "pop"
  | "chime";

const KEY = "tangara-sound";
/** A-minor pentatonic, two octaves — used by pads and melodic cues. */
export const SCALE = [440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];
export const NOTE_NAMES = ["A", "C", "D", "E", "G", "A", "C", "D"];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let wet: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let enabled = false;
const subs = new Set<(on: boolean) => void>();

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    const comp = ctx.createDynamicsCompressor();
    master.connect(analyser);
    analyser.connect(comp).connect(ctx.destination);

    // Soft feedback echo — the "space" every sound sits in.
    wet = ctx.createGain();
    wet.gain.value = 0.3;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.19;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2400;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    wet.connect(delay);
    delay.connect(lp);
    lp.connect(fb).connect(delay);
    lp.connect(master);

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type ToneOpts = { type?: OscillatorType; dur?: number; gain?: number; at?: number; to?: number; send?: boolean };
function tone(freq: number, { type = "sine", dur = 0.2, gain = 0.1, at = 0, to, send = false }: ToneOpts = {}) {
  if (!ctx || !master) return;
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur * 0.8);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  if (send && wet) g.connect(wet);
  o.start(t);
  o.stop(t + dur + 0.05);
}

type NoiseOpts = { dur?: number; gain?: number; filter?: BiquadFilterType; f0?: number; f1?: number; q?: number; at?: number; send?: boolean };
function noise({ dur = 0.2, gain = 0.1, filter = "bandpass", f0 = 1000, f1, q = 1, at = 0, send = false }: NoiseOpts = {}) {
  if (!ctx || !master || !noiseBuf) return;
  const t = ctx.currentTime + at;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + dur * 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master);
  if (send && wet) g.connect(wet);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.05);
}

const lastPlayed: Partial<Record<SfxName, number>> = {};
const minGap: Partial<Record<SfxName, number>> = { hover: 45, tick: 28, pop: 30 };

export const sfx = {
  get enabled() {
    return enabled;
  },
  init() {
    try {
      enabled = localStorage.getItem(KEY) === "on";
    } catch {
      enabled = false;
    }
    subs.forEach((f) => f(enabled));
  },
  setEnabled(on: boolean) {
    enabled = on;
    try {
      localStorage.setItem(KEY, on ? "on" : "off");
    } catch {
      /* storage blocked — preference just won't persist */
    }
    if (on) ensure();
    subs.forEach((f) => f(on));
    if (on) sfx.play("on");
    else if (ctx) {
      tone(783.99, { gain: 0.07, dur: 0.12 });
      tone(523.25, { gain: 0.07, dur: 0.22, at: 0.08 });
    }
  },
  subscribe(f: (on: boolean) => void) {
    subs.add(f);
    return () => void subs.delete(f);
  },
  analyser() {
    return analyser;
  },
  /** Melodic pad from the shared scale (index wraps). */
  note(i: number, opts: { gain?: number; dur?: number } = {}) {
    if (!enabled || !ensure()) return;
    const f = SCALE[((i % SCALE.length) + SCALE.length) % SCALE.length];
    tone(f, { type: "sine", gain: opts.gain ?? 0.16, dur: opts.dur ?? 1.1, send: true });
    tone(f * 2, { type: "triangle", gain: (opts.gain ?? 0.16) * 0.18, dur: 0.35 });
  },
  play(name: SfxName) {
    if (!enabled || !ensure()) return;
    const now = performance.now();
    const gap = minGap[name] ?? 0;
    if (gap && now - (lastPlayed[name] ?? 0) < gap) return;
    lastPlayed[name] = now;

    switch (name) {
      case "hover":
        tone(1318.5, { gain: 0.035, dur: 0.07, to: 1567.98 });
        break;
      case "click":
        tone(440, { type: "triangle", gain: 0.13, dur: 0.13, to: 220 });
        noise({ filter: "highpass", f0: 3500, gain: 0.04, dur: 0.03 });
        break;
      case "whoosh":
        noise({ filter: "bandpass", f0: 280, f1: 2600, q: 1.4, gain: 0.16, dur: 0.5, send: true });
        tone(523.25, { gain: 0.04, dur: 0.5, at: 0.18, send: true });
        break;
      case "close":
        noise({ filter: "bandpass", f0: 2600, f1: 260, q: 1.4, gain: 0.14, dur: 0.42 });
        tone(329.63, { type: "triangle", gain: 0.06, dur: 0.18, at: 0.3 });
        break;
      case "success":
        [659.25, 880, 1318.5].forEach((f, i) => tone(f, { gain: 0.09, dur: 0.5, at: i * 0.085, send: true }));
        break;
      case "chime":
        [880, 1174.66].forEach((f, i) => tone(f, { gain: 0.07, dur: 0.7, at: i * 0.06, send: true }));
        break;
      case "tick":
        noise({ filter: "highpass", f0: 5200, gain: 0.03, dur: 0.018 });
        break;
      case "pop":
        tone(620 + Math.random() * 260, { gain: 0.08, dur: 0.09, to: 1400 });
        break;
      case "on":
        tone(523.25, { gain: 0.08, dur: 0.14 });
        tone(783.99, { gain: 0.08, dur: 0.45, at: 0.09, send: true });
        break;
      case "off":
        tone(783.99, { gain: 0.07, dur: 0.12 });
        tone(523.25, { gain: 0.07, dur: 0.22, at: 0.08 });
        break;
    }
  },
};
