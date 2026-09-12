/**
 * 오시는 길 지도 이미지 생성
 *
 * OpenStreetMap 타일을 이어 붙여 예식장 주변 지도를 한 장으로 만든다.
 * (API 키가 필요 없고, 만들어진 이미지는 저장소에 그대로 들어간다)
 *
 * 좌표나 확대 수준을 바꾸고 싶으면 아래 MAP 값을 고치고 다시 실행하세요.
 *   node scripts/build-map.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAP = {
  /** 연세대학교 신촌캠퍼스 동문회관 (서울 서대문구 연세로 50) */
  lat: 37.5660508,
  lon: 126.9439162,
  zoom: 16,
  width: 1200,
  height: 720,
  /** 지도 위에 찍을 이름 */
  label: "연세대학교 동문회관",
  out: path.join(process.cwd(), "public", "images", "wedding", "map.jpg"),
};

const TILE = 256;
const UA = "our-wedding-invitation/1.0 (personal wedding page)";

/* ── 슬리피 맵 좌표 변환 ─────────────────────────────────── */
const lonToX = (lon, z) => ((lon + 180) / 360) * 2 ** z;
const latToY = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
};

const centerX = lonToX(MAP.lon, MAP.zoom) * TILE;
const centerY = latToY(MAP.lat, MAP.zoom) * TILE;

/** 잘라낼 영역(픽셀)의 좌상단 */
const left = Math.round(centerX - MAP.width / 2);
const top = Math.round(centerY - MAP.height / 2);

const tileX0 = Math.floor(left / TILE);
const tileY0 = Math.floor(top / TILE);
const tileX1 = Math.floor((left + MAP.width - 1) / TILE);
const tileY1 = Math.floor((top + MAP.height - 1) / TILE);

/* ── 타일 받아서 이어 붙이기 ─────────────────────────────── */
const composites = [];
for (let x = tileX0; x <= tileX1; x += 1) {
  for (let y = tileY0; y <= tileY1; y += 1) {
    const url = `https://tile.openstreetmap.org/${MAP.zoom}/${x}/${y}.png`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`타일을 받지 못했습니다: ${url} (${res.status})`);
    composites.push({
      input: Buffer.from(await res.arrayBuffer()),
      left: (x - tileX0) * TILE,
      top: (y - tileY0) * TILE,
    });
  }
}
console.log(`타일 ${composites.length}장 내려받음`);

const canvasW = (tileX1 - tileX0 + 1) * TILE;
const canvasH = (tileY1 - tileY0 + 1) * TILE;

const stitched = await sharp({
  create: { width: canvasW, height: canvasH, channels: 3, background: "#ffffff" },
})
  .composite(composites)
  .png()
  .toBuffer();

/* ── 청첩장 톤에 맞게 색을 눌러준다 ──────────────────────── */
const base = await sharp(stitched)
  .extract({ left: left - tileX0 * TILE, top: top - tileY0 * TILE, width: MAP.width, height: MAP.height })
  // 원본 OSM 타일은 색이 강해서 아이보리 톤과 부딪힌다. 채도를 낮추고 살짝 따뜻하게.
  .modulate({ saturation: 0.3, brightness: 1.04 })
  .tint("#fbf8f2")
  .toBuffer();

/* ── 예식장 표시 ─────────────────────────────────────────
   저작자 표기(© OpenStreetMap)는 화면 폭에 따라 잘릴 수 있어서
   이미지에 굽지 않고 Location 컴포넌트에서 지도 아래에 적는다. */
const cx = MAP.width / 2;
const cy = MAP.height / 2;
const overlay = Buffer.from(`
<svg width="${MAP.width}" height="${MAP.height}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="40" fill="#8c6f4e" opacity="0.14" />
  <!-- 물방울 모양 핀 -->
  <path d="M ${cx} ${cy + 6}
           c -13 -18 -20 -27 -20 -37
           a 20 20 0 1 1 40 0
           c 0 10 -7 19 -20 37 z"
        fill="#8c6f4e" stroke="#ffffff" stroke-width="3.5" />
  <circle cx="${cx}" cy="${cy - 31}" r="7" fill="#ffffff" />
  <g>
    <rect x="${cx - 120}" y="${cy + 18}" width="240" height="42" rx="21"
          fill="#ffffff" opacity="0.94" />
    <text x="${cx}" y="${cy + 45}" text-anchor="middle"
          font-family="Apple SD Gothic Neo, Malgun Gothic, Noto Sans KR, sans-serif"
          font-size="21" fill="#3d3a34">${MAP.label}</text>
  </g>
</svg>`);

await mkdir(path.dirname(MAP.out), { recursive: true });
const buf = await sharp(base)
  .composite([{ input: overlay }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();
await writeFile(MAP.out, buf);

console.log(`map.jpg ${MAP.width}×${MAP.height} ${Math.round(buf.length / 1024)}KB`);
