/**
 * 연애·일상 사진 → 웹용 이미지 생성
 *
 * 스튜디오 웨딩 사진과 달리 휴대폰으로 찍은 사진들이라
 * 갤러리 뒷부분과 타임라인에 들어간다.
 *
 *   PHOTO_SRC=/받아둔/폴더 node scripts/build-daily.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images", "daily");
const SRC = process.env.PHOTO_SRC ?? path.join(process.cwd(), "..", "daily");

/** 타임라인 — 정사각형으로 잘라 쓰는 사진 */
const TIMELINE = [
  { file: "IMG_0108", out: "thailand.jpg", size: 900 },
];

/** 갤러리 뒤쪽에 이어붙일 일상 사진 (시간 순서보다 흐름을 우선) */
const GALLERY = [
  ["IMG_2159", "벚꽃 아래에서 볼을 맞댄 두 사람"],
  ["IMG_0042", "숲이 보이는 난간에서 함께 웃는 두 사람"],
  ["IMG_7018", "꽃밭을 배경으로 나란히 선 두 사람"],
  ["IMG_0032", "마주 앉아 함께 저녁을 먹는 두 사람"],
  ["IMG_0113", "인형뽑기장 불빛 아래에서 웃는 두 사람"],
  ["IMG_3567", "강가 노을을 배경으로 안은 두 사람"],
  ["IMG_0108", "물 위에서 손으로 하트를 만든 두 사람"],
  ["IMG_7334", "모래언덕에서 함께 뛰어오른 두 사람"],
  ["IMG_7335", "모래언덕에서 마주 본 두 사람"],
  ["IMG_3603", "야자수가 보이는 창가에서 웃는 두 사람"],
  ["IMG_7332", "양이 있는 초원에 나란히 선 두 사람"],
  ["IMG_3584", "겨울 바다에서 볼에 입맞추는 두 사람"],
];

const kb = (b) => `${Math.round(b / 1024)}KB`;
const src = (name) => path.join(SRC, `${name}.jpg`);

await mkdir(OUT, { recursive: true });

for (const p of TIMELINE) {
  const buf = await sharp(src(p.file))
    .rotate()
    .resize(p.size, p.size, { fit: "cover", position: "attention" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  await writeFile(path.join(OUT, p.out), buf);
  console.log(`${p.out.padEnd(16)} ${p.size}×${p.size} ${kb(buf.length).padStart(6)} (${p.file})`);
}

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
  console.log(`${`${n}.jpg`.padEnd(16)} ${info.width}×${info.height} ${kb(data.length).padStart(6)} (${file})`);
}
console.log(`\n일상 ${GALLERY.length}장 합계 ${kb(total)}`);
console.log(
  "\n" +
    GALLERY.map(
      ([, alt], i) => `    { src: "/images/daily/${String(i + 1).padStart(2, "0")}.jpg", alt: "${alt}" },`,
    ).join("\n"),
);
