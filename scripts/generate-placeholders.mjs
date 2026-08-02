/**
 * 실제 웨딩 사진이 준비되기 전까지 사용할 로컬 placeholder 이미지를 만든다.
 * 외부(Unsplash 등) 이미지를 런타임에 의존하지 않기 위한 스크립트.
 *
 *   node scripts/generate-placeholders.mjs
 *
 * 실제 사진을 넣을 때는 public/images/wedding/ 의 같은 파일명으로 덮어쓰거나
 * src/config/wedding.ts 의 경로를 바꾸면 된다.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "images", "wedding");

/** 사진이 들어갈 자리이므로, 사진처럼 차분한 웜 톤 그라디언트를 사용한다. */
const TONES = [
  ["#e9e3d8", "#cfc6b6"],
  ["#e4ddd2", "#c4bbaa"],
  ["#ded6c9", "#bab0a0"],
  ["#eae5dc", "#cbc2b4"],
  ["#e0d9cd", "#b7ada0"],
  ["#e7e0d4", "#c8bfae"],
];

function svg({ width, height, tone, label }) {
  const [from, to] = tone;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="42%" r="78%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.14"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.055"/>
  <rect width="100%" height="100%" fill="url(#v)"/>

  <g opacity="0.34" fill="none" stroke="#6f685c" stroke-width="${Math.max(1, width / 900)}">
    <circle cx="${width / 2}" cy="${height * 0.46}" r="${Math.min(width, height) * 0.17}"/>
  </g>

  <text x="50%" y="${height - height * 0.06}" text-anchor="middle"
        font-family="Georgia, serif" font-size="${Math.round(width * 0.028)}"
        letter-spacing="${width * 0.008}" fill="#6f685c" opacity="0.5">${label}</text>
</svg>`;
}

const FILES = [
  { name: "hero.jpg", width: 1200, height: 1500, label: "HERO" },
  { name: "couple.jpg", width: 1200, height: 1500, label: "COUPLE" },
  { name: "ending.jpg", width: 1200, height: 1500, label: "ENDING" },
  { name: "01.jpg", width: 1200, height: 1500, label: "01" },
  { name: "02.jpg", width: 1000, height: 1000, label: "02" },
  { name: "03.jpg", width: 1000, height: 1000, label: "03" },
  { name: "04.jpg", width: 1000, height: 1500, label: "04" },
  { name: "05.jpg", width: 1500, height: 1000, label: "05" },
  { name: "06.jpg", width: 1000, height: 1500, label: "06" },
  { name: "07.jpg", width: 1000, height: 1000, label: "07" },
  { name: "08.jpg", width: 1000, height: 1000, label: "08" },
  { name: "09.jpg", width: 1500, height: 1000, label: "09" },
  { name: "og.jpg", width: 1200, height: 630, label: "OUR WEDDING DAY" },
];

await mkdir(OUT, { recursive: true });

for (const [i, file] of FILES.entries()) {
  const markup = svg({ ...file, tone: TONES[i % TONES.length] });
  const buffer = await sharp(Buffer.from(markup)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  await writeFile(path.join(OUT, file.name), buffer);
  console.log(`✓ ${file.name} (${file.width}×${file.height})`);
}
