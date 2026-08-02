/**
 * 청첩장 배경음악 생성 — "Our Theme"
 *
 * 잔잔하고 밝은 분위기를 목표로, D major / 66BPM 에서
 *   · 오르골(뮤직박스) 느낌의 아르페지오
 *   · 따뜻한 패드
 *   · 아주 단순한 멜로디
 *   · 낮은 베이스
 * 를 합성하고, 부드러운 리버브를 건 뒤 mp3 로 인코딩한다.
 *
 * 끝과 처음이 자연스럽게 이어지도록(무한 반복 재생) 꼬리를 앞부분에 겹쳐 넣는다.
 */
// 실행하려면: npm i -D @breezystack/lamejs
import lamejs from "@breezystack/lamejs";
import { writeFile } from "node:fs/promises";

const SR = 44100;
const BPM = 66;
const BEAT = 60 / BPM; // 0.909s
const BAR = BEAT * 4; // 3.636s
const BARS = 20;
const TAIL = 5; // 초 — 루프 이음새용 여유

const LEN = Math.round(BAR * BARS * SR);
const TOTAL = LEN + Math.round(TAIL * SR);

const L = new Float32Array(TOTAL);
const R = new Float32Array(TOTAL);

/** 음이름 → 주파수 (A4 = 440) */
const SEMI = { C: -9, "C#": -8, D: -7, "D#": -6, E: -5, F: -4, "F#": -3, G: -2, "G#": -1, A: 0, "A#": 1, B: 2 };
function freq(note) {
  const m = /^([A-G]#?)(\d)$/.exec(note);
  const n = SEMI[m[1]] + (Number(m[2]) - 4) * 12;
  return 440 * Math.pow(2, n / 12);
}

/**
 * 한 음 렌더링.
 * type: "box"(오르골) | "pad" | "bass" | "lead"
 */
function note({ at, note: nm, dur, gain = 0.2, type = "box", pan = 0 }) {
  const f = freq(nm);
  const start = Math.round(at * SR);
  const n = Math.round(dur * SR);

  // 음색별 배음 구성
  const partials =
    type === "box"
      ? [[1, 1], [2, 0.34], [3, 0.12], [4.2, 0.05]]
      : type === "pad"
        ? [[1, 1], [2, 0.22], [3, 0.07]]
        : type === "lead"
          ? [[1, 1], [2, 0.18], [3, 0.06]]
          : [[1, 1], [2, 0.08]];

  const attack = type === "pad" ? 1.1 : type === "lead" ? 0.06 : 0.004;
  const decay = type === "pad" ? dur : type === "box" ? 1.5 : type === "lead" ? 2.2 : 2.0;
  const detune = type === "pad" ? 0.6 : 0; // 살짝 어긋난 두 겹으로 따뜻하게

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    if (start + i >= TOTAL) break;

    // 엔벨로프 — 부드러운 어택 + 지수 감쇠 + 끝단 페이드
    const a = attack === 0 ? 1 : Math.min(1, t / attack);
    const d = Math.exp(-t / decay);
    const rel = Math.min(1, (dur - t) / 0.25);
    const env = a * d * Math.max(0, rel);
    if (env < 1e-5) continue;

    let s = 0;
    for (const [mul, amp] of partials) {
      s += Math.sin(2 * Math.PI * f * mul * t) * amp;
      if (detune) s += Math.sin(2 * Math.PI * (f + detune) * mul * t) * amp * 0.7;
    }
    s *= env * gain;

    const lg = Math.min(1, 1 - pan);
    const rg = Math.min(1, 1 + pan);
    L[start + i] += s * lg;
    R[start + i] += s * rg;
  }
}

/* ── 곡 구성 ──────────────────────────────────────────────
   I – V/vii – vi – IV  (D – A/C# – Bm7 – G) 4마디를 5번 반복
   ------------------------------------------------------- */
const PROG = [
  { pad: ["D3", "F#3", "A3"], bass: "D2", arp: ["D4", "F#4", "A4", "D5", "A4", "F#4"] },
  { pad: ["C#3", "E3", "A3"], bass: "A2", arp: ["C#4", "E4", "A4", "C#5", "A4", "E4"] },
  { pad: ["B2", "D3", "F#3"], bass: "B2", arp: ["B3", "D4", "F#4", "B4", "F#4", "D4"] },
  { pad: ["G2", "B2", "D3"], bass: "G2", arp: ["G3", "B3", "D4", "G4", "D4", "B3"] },
];

// 멜로디 — 마디당 2~3음, 단순하고 밝게 (마디 index: [음, 박, 길이])
const MELODY = {
  4: [["F#5", 0, 2], ["A5", 2, 2]],
  5: [["E5", 0, 2], ["C#5", 2, 2]],
  6: [["D5", 0, 3], ["F#5", 3, 1]],
  7: [["B4", 0, 2], ["D5", 2, 2]],
  8: [["A5", 0, 2], ["F#5", 2, 1], ["E5", 3, 1]],
  9: [["E5", 0, 2], ["A4", 2, 2]],
  10: [["F#5", 0, 3], ["A5", 3, 1]],
  11: [["G5", 0, 2], ["F#5", 2, 2]],
  12: [["D5", 0, 4]],
  13: [["C#5", 0, 2], ["E5", 2, 2]],
  14: [["D5", 0, 2], ["F#5", 2, 2]],
  15: [["A4", 0, 4]],
};

for (let bar = 0; bar < BARS; bar++) {
  const c = PROG[bar % 4];
  const t0 = bar * BAR;

  // 패드 — 마디 전체를 채운다
  for (const p of c.pad) {
    note({ at: t0, note: p, dur: BAR * 1.05, gain: 0.05, type: "pad" });
  }

  // 베이스 — 마디 첫 박
  note({ at: t0, note: c.bass, dur: BAR, gain: 0.09, type: "bass" });

  // 오르골 아르페지오 — 8분음표 6개(점2분 느낌으로 여유있게)
  const step = BEAT / 2;
  const intro = bar < 2 || bar >= 18; // 앞뒤는 조금 더 조용하게
  c.arp.forEach((n, i) => {
    note({
      at: t0 + i * step * 1.25,
      note: n,
      dur: 2.2,
      gain: (intro ? 0.075 : 0.1) * (i === 0 ? 1.15 : 1),
      type: "box",
      pan: (i % 2 === 0 ? -1 : 1) * 0.16,
    });
  });

  // 멜로디
  for (const [n, beat, len] of MELODY[bar] ?? []) {
    note({ at: t0 + beat * BEAT, note: n, dur: len * BEAT + 1.2, gain: 0.115, type: "lead", pan: 0.05 });
  }
}

/* ── 리버브 (아주 옅게) ──────────────────────────────────── */
function reverb(ch, other) {
  const out = new Float32Array(ch.length);
  out.set(ch);
  const taps = [
    [0.0297, 0.26],
    [0.0411, 0.22],
    [0.0672, 0.18],
    [0.1103, 0.14],
    [0.1871, 0.1],
  ];
  for (const [time, gain] of taps) {
    const d = Math.round(time * SR);
    for (let i = d; i < ch.length; i++) {
      out[i] += ch[i - d] * gain + other[i - d] * gain * 0.35;
    }
  }
  // 꼬리를 길게 늘이는 피드백 딜레이
  const fd = Math.round(0.23 * SR);
  for (let i = fd; i < out.length; i++) out[i] += out[i - fd] * 0.24;
  return out;
}

const Lw = reverb(L, R);
const Rw = reverb(R, L);

// dry/wet 믹스
for (let i = 0; i < TOTAL; i++) {
  L[i] = L[i] * 0.72 + Lw[i] * 0.28;
  R[i] = R[i] * 0.72 + Rw[i] * 0.28;
}

/* ── 이음새 없는 루프: 꼬리를 앞부분에 겹쳐 넣는다 ──────── */
for (let i = 0; i < TOTAL - LEN; i++) {
  L[i] += L[LEN + i];
  R[i] += R[LEN + i];
}

/* ── 마스터: soft clip + 노멀라이즈 ──────────────────────── */
let peak = 0;
for (let i = 0; i < LEN; i++) {
  L[i] = Math.tanh(L[i] * 1.1);
  R[i] = Math.tanh(R[i] * 1.1);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;

const li = new Int16Array(LEN);
const ri = new Int16Array(LEN);
for (let i = 0; i < LEN; i++) {
  li[i] = Math.max(-32768, Math.min(32767, Math.round(L[i] * norm * 32767)));
  ri[i] = Math.max(-32768, Math.min(32767, Math.round(R[i] * norm * 32767)));
}

/* ── 품질 점검 ──────────────────────────────────────────── */
{
  const rms = [];
  for (let sec = 0; sec < Math.floor(LEN / SR); sec++) {
    let sum = 0;
    for (let i = sec * SR; i < (sec + 1) * SR; i++) sum += (L[i] * norm) ** 2 + (R[i] * norm) ** 2;
    rms.push(Math.sqrt(sum / (2 * SR)));
  }
  const db = (v) => (20 * Math.log10(Math.max(v, 1e-9))).toFixed(1);
  console.log("RMS(dBFS) per 4s:", rms.filter((_, i) => i % 4 === 0).map(db).join(" "));
  console.log("min/max RMS:", db(Math.min(...rms)), "/", db(Math.max(...rms)));
  const silent = rms.filter((v) => v < 0.002).length;
  console.log("무음에 가까운 구간(초):", silent);
  // 루프 이음새: 마지막 샘플과 첫 샘플의 차이
  const seam = Math.abs(L[LEN - 1] - L[0]) + Math.abs(R[LEN - 1] - R[0]);
  const avgStep = Math.abs(L[1000] - L[999]) + Math.abs(R[1000] - R[999]);
  console.log("루프 이음새 delta:", seam.toFixed(5), "(일반 인접 샘플 차이:", avgStep.toFixed(5), ")");
  let clipped = 0;
  for (let i = 0; i < LEN; i++) if (Math.abs(L[i] * norm) > 0.995 || Math.abs(R[i] * norm) > 0.995) clipped++;
  console.log("클리핑 샘플 수:", clipped);
}

/* ── mp3 인코딩 ─────────────────────────────────────────── */
const enc = new lamejs.Mp3Encoder(2, SR, 128);
const chunks = [];
const BLOCK = 1152;
for (let i = 0; i < LEN; i += BLOCK) {
  const buf = enc.encodeBuffer(li.subarray(i, i + BLOCK), ri.subarray(i, i + BLOCK));
  if (buf.length) chunks.push(Buffer.from(buf));
}
const end = enc.flush();
if (end.length) chunks.push(Buffer.from(end));

const mp3 = Buffer.concat(chunks);
await writeFile(new URL("../public/audio/wedding-theme.mp3", import.meta.url), mp3);

console.log(`길이 ${(LEN / SR).toFixed(1)}초 · ${Math.round(mp3.length / 1024)}KB · peak ${peak.toFixed(2)}`);
