/**
 * Generates the placeholder lo-fi background loop: public/audio/lofi.wav
 * A mellow jazzy pad progression (Am7 → Fmaj7 → Cmaj7 → G7) with sub bass,
 * soft vinyl crackle and hiss. Replace with a real track whenever you like —
 * just keep the filename (or update the src in PlayerBar.tsx).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SAMPLE_RATE = 22050;
const BPM = 70;
const BEAT = 60 / BPM;
const BARS = 8;
const DURATION = BARS * 4 * BEAT;
const N = Math.floor(DURATION * SAMPLE_RATE);

const freq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// [chord tones (midi), bass note (midi)]
const CHORDS = [
  { notes: [57, 60, 64, 67], bass: 33 }, // Am7
  { notes: [53, 57, 60, 64], bass: 29 }, // Fmaj7
  { notes: [48, 52, 55, 59], bass: 36 }, // Cmaj7
  { notes: [55, 59, 62, 65], bass: 31 }, // G7
];

const chordLength = N / CHORDS.length;
const samples = new Float64Array(N);

// deterministic pseudo-random for crackle
let seed = 20261015;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

const smoothstep = (edge0, edge1, x) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

for (let i = 0; i < N; i++) {
  const chord = CHORDS[Math.floor(i / chordLength) % CHORDS.length];
  const localT = (i % chordLength) / SAMPLE_RATE;
  const chordDur = chordLength / SAMPLE_RATE;

  // pad envelope: slow bloom in and out per chord, overlapping tails
  const attack = smoothstep(0, 1.6, localT);
  const release = 1 - smoothstep(chordDur - 1.8, chordDur, localT);
  const env = attack * release;

  let pad = 0;
  for (const midi of chord.notes) {
    const f = freq(midi);
    // slightly detuned unison pair + faint 2nd harmonic = warm pad
    pad += Math.sin(2 * Math.PI * f * (i / SAMPLE_RATE));
    pad += 0.6 * Math.sin(2 * Math.PI * f * 1.003 * (i / SAMPLE_RATE));
    pad += 0.12 * Math.sin(2 * Math.PI * f * 2 * (i / SAMPLE_RATE));
  }
  pad *= 0.09 * env;

  // sub bass, one note per chord with its own envelope
  const bassEnv = smoothstep(0, 0.4, localT) * (1 - smoothstep(chordDur - 0.6, chordDur, localT));
  const bass = 0.16 * bassEnv * Math.sin(2 * Math.PI * freq(chord.bass) * (i / SAMPLE_RATE));

  // vinyl crackle: sparse filtered impulses
  const crackleNoise = rand() < 0.0016 ? (rand() * 2 - 1) * 0.5 : 0;
  const crackle = crackleNoise + samples[Math.max(0, i - 1)] * 0.86;

  // gentle hiss
  const hiss = (rand() * 2 - 1) * 0.006;

  samples[i] = pad + bass + crackle + hiss;
}

// seamless loop: crossfade the last 0.4s into the first
const fadeLen = Math.floor(0.4 * SAMPLE_RATE);
for (let i = 0; i < fadeLen; i++) {
  const t = i / fadeLen;
  samples[i] = samples[i] * t + samples[N - fadeLen + i] * (1 - t);
}
// trim the crossfade source region influence (soft fade its tail out)
for (let i = N - fadeLen; i < N; i++) {
  samples[i] *= (N - i) / fadeLen;
}

// master soft clip + normalize
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(samples[i]));
const gain = 0.82 / peak;
const pcm = Buffer.alloc(N * 2);
for (let i = 0; i < N; i++) {
  const v = Math.tanh(samples[i] * gain) * 32767;
  pcm.writeInt16LE(Math.round(v), i * 2);
}

// WAV header (PCM 16-bit mono)
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(SAMPLE_RATE * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);

const outPath = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio", "lofi.wav");
writeFileSync(outPath, Buffer.concat([header, pcm]));
console.log(`wrote ${outPath} (${((36 + pcm.length) / 1024 / 1024).toFixed(2)} MB, ${DURATION.toFixed(1)}s loop)`);
