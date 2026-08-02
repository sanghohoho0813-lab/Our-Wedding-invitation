/**
 * Google Drive 원본 → 웹용 이미지 생성
 *  - EXIF 회전 자동 적용
 *  원본은 EXIF 회전을 적용하면 18장 중 17장이 세로 2:3, 1장이 가로 3:2 이다.
 *  - 갤러리는 원본 프레임 그대로(긴 변 1600px) 내보내고, 카드 크롭은 CSS 가 담당한다.
 *    (전체화면 뷰어에서는 자르지 않은 사진이 보여야 하므로)
 *  - hero 는 세로 화면에 맞춰 9:16 으로 미리 잘라 둔다.
 */
import sharp from "/home/user/Our-Wedding-invitation/node_modules/sharp/lib/index.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = "/home/user/Our-Wedding-invitation/public/images/wedding";
const SRC = "/tmp/claude-0/-home-user-Our-Wedding-invitation/3dc6b2c4-6e54-5429-8cae-ac6f92de7ea0/scratchpad/orig";

const HERO = "HYU01670";

// 낮(화이트 드레스) → golden hour(블랙 드레스) 순서
const GALLERY = [
  "HYU00266",
  "HYU00295",
  "HYU00483",
  "HYU00551",
  "HYU00588",
  "HYU00953",
  "HYU01011",
  "1779521348873",
  "1779526636519",
  "DSC04359",
  "HYU01082",
  "HYU01200",
  "HYU01264",
  "HYU01437",
  "1779526736771",
  "HYU01529",
  "HYU01549",
];

const kb = (b) => `${Math.round(b / 1024)}KB`;

// EXIF 회전을 적용한 원본 픽셀
const rotated = await sharp(path.join(SRC, `${HERO}.jpg`)).rotate().toBuffer({ resolveWithObject: true });
const HW = rotated.info.width;
const HH = rotated.info.height;

// ── HERO — 세로 9:16 크롭 (두 사람이 가운데 오도록 가로 위치를 잡았다) ──
{
  const cw = Math.round(HH * (1200 / 2133));
  const left = Math.max(0, Math.min(HW - cw, Math.round((HW - cw) / 2) - 50));
  const buf = await sharp(rotated.data)
    .extract({ left, top: 0, width: cw, height: HH })
    .resize(1200, 2133)
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
  await writeFile(path.join(OUT, "hero.jpg"), buf);
  console.log(`hero.jpg      1200×2133  ${kb(buf.length)}  (${HERO}, left=${left}/${HW})`);
}

// ── OG — 1200×630 (얼굴이 들어가도록 위쪽 밴드를 사용) ──
{
  const ch = Math.round(HW / (1200 / 630));
  const top = Math.max(0, Math.min(HH - ch, 500));
  const buf = await sharp(rotated.data)
    .extract({ left: 0, top, width: HW, height: ch })
    .resize(1200, 630)
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  await writeFile(path.join(OUT, "og.jpg"), buf);
  console.log(`og.jpg        1200×630   ${kb(buf.length)}`);
}

// ── GALLERY — 원본 프레임 유지 ───────────────────────────
let total = 0;
for (const [i, name] of GALLERY.entries()) {
  const n = String(i + 1).padStart(2, "0");
  const { data, info } = await sharp(path.join(SRC, `${name}.jpg`))
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  await writeFile(path.join(OUT, `${n}.jpg`), data);
  total += data.length;
  console.log(`${n}.jpg  ${String(info.width).padStart(4)}×${info.height}  ${kb(data.length).padStart(6)}  (${name})`);
}
console.log(`\n갤러리 ${GALLERY.length}장 합계 ${kb(total)}`);
