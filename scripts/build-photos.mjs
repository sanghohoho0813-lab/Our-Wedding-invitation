/**
 * 원본 사진 → 웹용 이미지 생성
 *
 *  - EXIF 회전 자동 적용
 *  - 섹션별로 어울리는 사진을 골라 필요한 비율로 내보낸다.
 *  - 갤러리는 원본 프레임을 유지한다.
 *    (카드 크롭은 CSS 가 담당하고, 전체화면 뷰어에서는 자르지 않은 사진을 보여주므로)
 *
 *  crop 을 지정하면 그 영역만 잘라낸 뒤 크기를 맞춘다. (인물을 크게 보여줄 때 사용)
 *  crop 이 없으면 position 전략으로 자동 크롭한다. (기본 attention)
 *  brightness 를 지정하면 그만큼 밝기를 올린다. (1 = 원본)
 *
 *  사진을 바꾸고 싶으면 아래 PICKS / GALLERY 의 파일명만 수정하고 다시 실행하세요.
 *    node scripts/build-photos.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images", "wedding");
/** 원본 사진이 들어 있는 폴더 */
const SRC = process.env.PHOTO_SRC ?? path.join(process.cwd(), "..", "photos");

/* ── 섹션별 사진 ─────────────────────────────────────────── */
const PICKS = {
  // 첫 화면 — 세로로 길게 잘려도 두 사람이 가운데 오는 컷
  // 첫 화면은 위아래 그라데이션이 얹히므로 사진을 아주 살짝 밝게 보정한다
  hero: {
    file: "HYU01511",
    out: "hero.jpg",
    width: 1200,
    height: 2133,
    quality: 82,
    brightness: 1.07,
  },
  // 인용구
  quote: { file: "HYU01444", out: "quote.jpg", width: 1200, height: 1500 },
  // 신랑 / 신부 카드 — 카드가 작으므로 얼굴이 잘 보이도록 직접 잘라낸다
  groom: {
    file: "HYU00541",
    out: "groom.jpg",
    width: 900,
    height: 1125,
    crop: { left: 1120, top: 90, width: 840, height: 1050 },
  },
  bride: {
    file: "HYU01011",
    out: "bride.jpg",
    width: 900,
    height: 1125,
    crop: { left: 900, top: 1380, width: 960, height: 1200 },
  },
  // 예식 안내
  info: { file: "HYU01059", out: "info.jpg", width: 1200, height: 1500 },
  // D-day 배너
  dday: { file: "HYU01665", out: "dday.jpg", width: 1400, height: 1050 },
  // 게스트스냅 (카메라를 들고 있는 컷)
  guestSnap: { file: "HYU00912", out: "guestsnap.jpg", width: 1400, height: 1050 },
  // 마무리
  ending1: { file: "DSC04429", out: "ending-1.jpg", width: 1400, height: 1050 },
  // 두 사람의 가운데가 화면 가운데 오도록 자동 크롭 대신 가운데 크롭을 쓴다
  ending2: { file: "HYU01617", out: "ending-2.jpg", width: 1400, height: 1050, position: "centre" },
};

/** 공유 미리보기는 첫 화면 사진에서 가로로 잘라 쓴다. */
const OG = { file: PICKS.hero.file, out: "og.jpg", width: 1200, height: 630, brightness: PICKS.hero.brightness };

/* ── 갤러리 (낮 → 노을 순서) ─────────────────────────────── */
const GALLERY = [
  ["HYU00266", "호숫가에서 입맞추는 신랑과 신부"],
  ["HYU00295", "면사포를 쓰고 이마를 맞댄 두 사람"],
  ["HYU00881", "다리를 배경으로 손을 맞잡은 신랑과 신부"],
  ["HYU00644", "강가에서 마주 안은 신랑과 신부"],
  ["HYU00588", "계단에 나란히 앉은 신랑과 신부"],
  ["HYU00515", "부케를 건네는 신랑과 웃는 신부"],
  ["HYU00951", "잔디밭 돗자리에 누워 마주 보는 두 사람"],
  ["HYU01013", "붉은 꽃밭을 함께 걷는 신랑과 신부"],
  ["HYU00653", "나무가 늘어선 길을 함께 걷는 두 사람"],
  ["HYU01082", "단풍나무 아래 나란히 앉은 두 사람"],
  ["HYU01109", "장미 부케를 들고 나란히 선 신랑과 신부"],
  ["HYU01197", "하늘을 배경으로 서로를 안은 두 사람"],
  ["HYU01264", "마주 보며 활짝 웃는 신랑과 신부"],
  ["HYU01424", "면사포 아래에서 마주 안은 두 사람"],
  ["HYU01656", "노을빛 들판에서 입맞추는 신랑과 신부"],
];

const kb = (b) => `${Math.round(b / 1024)}KB`;
const src = (name) => path.join(SRC, `${name}.jpg`);

await mkdir(OUT, { recursive: true });

/* ── 섹션 사진 ───────────────────────────────────────────── */
for (const [key, p] of Object.entries(PICKS)) {
  // EXIF 회전을 먼저 적용해야 crop 좌표가 눈에 보이는 사진과 일치한다.
  const rotated = await sharp(src(p.file)).rotate().toBuffer();
  const pipeline = sharp(rotated);
  if (p.crop) pipeline.extract(p.crop);

  pipeline.resize(p.width, p.height, { fit: "cover", position: p.position ?? "attention" });
  if (p.brightness) pipeline.modulate({ brightness: p.brightness });

  const buf = await pipeline.jpeg({ quality: p.quality ?? 80, mozjpeg: true }).toBuffer();
  await writeFile(path.join(OUT, p.out), buf);
  console.log(`${p.out.padEnd(14)} ${p.width}×${p.height}  ${kb(buf.length).padStart(6)}  (${p.file}) ← ${key}`);
}

/* ── 공유 미리보기 ───────────────────────────────────────── */
{
  const ogPipeline = sharp(src(OG.file))
    .rotate()
    .resize(OG.width, OG.height, { fit: "cover", position: "attention" });
  if (OG.brightness) ogPipeline.modulate({ brightness: OG.brightness });

  const buf = await ogPipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  await writeFile(path.join(OUT, OG.out), buf);
  console.log(`${OG.out.padEnd(14)} ${OG.width}×${OG.height}   ${kb(buf.length).padStart(6)}  (${OG.file})`);
}

/* ── 갤러리 ──────────────────────────────────────────────── */
let total = 0;
for (const [i, [file]] of GALLERY.entries()) {
  const n = String(i + 1).padStart(2, "0");
  const { data, info } = await sharp(src(file))
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  await writeFile(path.join(OUT, `${n}.jpg`), data);
  total += data.length;
  console.log(`${`${n}.jpg`.padEnd(14)} ${info.width}×${info.height} ${kb(data.length).padStart(6)}  (${file})`);
}
console.log(`\n갤러리 ${GALLERY.length}장 합계 ${kb(total)}`);

/** config 에 그대로 붙여넣을 수 있는 갤러리 배열 */
console.log(
  "\n" +
    GALLERY.map(
      ([, alt], i) =>
        `    { src: "/images/wedding/${String(i + 1).padStart(2, "0")}.jpg", alt: "${alt}" },`,
    ).join("\n"),
);
