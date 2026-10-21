/**
 * Tiny synthesized sound design for the studio — no audio files. Nothing
 * is created until the user enables sound (the toggle click doubles as the
 * user gesture the autoplay policy wants); every helper is a safe no-op
 * while disabled.
 */

let context: AudioContext | null = null;
let master: GainNode | null = null;

const STORAGE_KEY = "bhavik-studios-sound";
const MASTER_GAIN = 0.1;

export function isSoundEnabled(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  try {
    if (enabled) {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Private mode: sound just won't persist across visits.
  }
  if (!enabled) teardown();
}

/** Lazily create/wake the context; null while sound is disabled. */
function acquire(): AudioContext | null {
  if (!isSoundEnabled()) return null;
  if (!context) {
    try {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = MASTER_GAIN;
      master.connect(context.destination);
    } catch {
      return null;
    }
  }
  if (context.state === "suspended") void context.resume();
  return context;
}

function teardown(): void {
  stopWhir();
  if (context) void context.close();
  context = null;
  master = null;
}

/** attack/release envelope into a gain node, starting at `at`. */
function envelope(
  gain: GainNode,
  peak: number,
  attack: number,
  release: number,
  at: number,
): void {
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + release);
}

function noiseBuffer(audio: AudioContext, seconds: number): AudioBuffer {
  const length = Math.ceil(audio.sampleRate * seconds);
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/** Soft rising confirmation — buttons and toggles. */
export function blip(): void {
  const audio = acquire();
  if (!audio || !master) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const at = audio.currentTime;
  osc.type = "sine";
  osc.frequency.setValueAtTime(720, at);
  osc.frequency.exponentialRampToValueAtTime(1150, at + 0.08);
  envelope(gain, 0.5, 0.012, 0.12, at);
  osc.connect(gain).connect(master);
  osc.start(at);
  osc.stop(at + 0.16);
}

/** Barely-there hover tick. */
export function tick(): void {
  const audio = acquire();
  if (!audio || !master) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const at = audio.currentTime;
  osc.type = "triangle";
  osc.frequency.value = 1800;
  envelope(gain, 0.12, 0.004, 0.035, at);
  osc.connect(gain).connect(master);
  osc.start(at);
  osc.stop(at + 0.05);
}

/** Scene-change whoosh: band-passed noise sweep. */
export function whoosh(): void {
  const audio = acquire();
  if (!audio || !master) return;
  const duration = 0.4;
  const source = audio.createBufferSource();
  const filter = audio.createBiquadFilter();
  const gain = audio.createGain();
  const at = audio.currentTime;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(300, at);
  filter.frequency.exponentialRampToValueAtTime(1600, at + duration);
  filter.Q.value = 1.2;
  envelope(gain, 0.35, 0.06, duration - 0.06, at);
  source.buffer = noiseBuffer(audio, duration);
  source.connect(filter).connect(gain).connect(master);
  source.start(at);
}

let whirNodes: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

/** Low projector hum, looping until stopped. */
export function startWhir(): void {
  const audio = acquire();
  if (!audio || !master || whirNodes) return;
  const source = audio.createBufferSource();
  const filter = audio.createBiquadFilter();
  const gain = audio.createGain();
  source.buffer = noiseBuffer(audio, 2);
  source.loop = true;
  filter.type = "lowpass";
  filter.frequency.value = 420;
  gain.gain.value = 0.0001;
  gain.gain.exponentialRampToValueAtTime(0.28, audio.currentTime + 0.6);
  source.connect(filter).connect(gain).connect(master);
  source.start();
  whirNodes = { source, gain };
}

export function stopWhir(): void {
  if (!whirNodes || !context) return;
  const { source, gain } = whirNodes;
  whirNodes = null;
  try {
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setValueAtTime(
      Math.max(gain.gain.value, 0.0001),
      context.currentTime,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.25);
    source.stop(context.currentTime + 0.3);
  } catch {
    source.stop();
  }
}
