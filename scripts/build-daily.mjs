/**
 * 연애 · 일상 사진 → 웹용 이미지 생성
 *
 * 스튜디오 웨딩 사진과 달리 휴대폰으로 찍은 사진들이라
 * "우리의 일상" 섹션에 따로 모아 둔다.
 *
 *   PHOTO_SRC=/받아둔/폴더 node scripts/build-daily.mjs
 *
 * 사진을 더하거나 순서를 바꾸고 싶으면 아래 PHOTOS 만 고치고 다시 실행하세요.
 * 실행하면 config 에 그대로 붙여넣을 수 있는 배열이 마지막에 출력됩니다.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images", "daily");
const SRC = process.env.PHOTO_SRC ?? path.join(process.cwd(), "..", "daily");

/** 데이트 → 일상 → 운동 → 여행(베트남) 순 */
const PHOTOS = [
  ["IMG_2159", "벚꽃 아래에서 볼을 맞댄 두 사람"],
  ["IMG_0042", "숲이 보이는 난간에서 함께 웃는 두 사람"],
  ["IMG_7018", "꽃밭을 배경으로 나란히 선 두 사람"],
  ["IMG_3584", "겨울 바다에서 볼에 입맞추는 두 사람"],
  ["IMG_0047", "야경 조명 앞에서 장난스럽게 웃는 두 사람"],
  ["IMG_0032", "마주 앉아 함께 저녁을 먹는 두 사람"],
  ["IMG_3575", "음료를 앞에 두고 붙어 앉은 두 사람"],
  ["IMG_0113", "인형뽑기장 불빛 아래에서 웃는 두 사람"],
  ["IMG_8701", "인형뽑기장에서 나란히 기댄 두 사람"],
  ["IMG_3572", "네 컷 사진기로 남긴 두 사람"],
  ["IMG_3590", "조명 아래에서 얼굴을 맞댄 두 사람"],
  ["IMG_3592", "저녁 자리에서 함께 찍은 두 사람"],
  ["IMG_3594", "거울에 비친 두 사람"],
  ["IMG_3971", "집에서 장난스럽게 찍은 두 사람"],
  ["IMG_0034", "운동하는 서로를 찍어주는 두 사람"],
  ["IMG_0035", "운동복 차림으로 나란히 선 두 사람"],
  ["IMG_0102", "운동 중에 마주 본 두 사람"],
  ["IMG_1323", "운동기구 위에서 힘내는 신부"],
  ["IMG_3571", "양이 있는 초원에서 마주 안은 두 사람"],
  ["IMG_7332", "양이 있는 초원에 나란히 선 두 사람"],
  ["IMG_3567", "강가 노을을 배경으로 안은 두 사람"],
  ["IMG_3603", "야자수가 보이는 창가에서 웃는 두 사람"],
  ["IMG_3576", "물가에서 어깨를 맞댄 두 사람"],
  ["IMG_0106", "분홍색 지프차에 앉은 신랑"],
  ["IMG_0108", "물 위에서 손으로 하트를 만든 두 사람"],
  ["IMG_7334", "모래언덕에서 함께 뛰어오른 두 사람"],
  ["IMG_7335", "모래언덕에서 마주 본 두 사람"],
];

const kb = (b) => `${Math.round(b / 1024)}KB`;
const src = (name) => path.join(SRC, `${name}.jpg`);

await mkdir(OUT, { recursive: true });

let total = 0;
for (const [i, [file]] of PHOTOS.entries()) {
  const n = String(i + 1).padStart(2, "0");
  const { data, info } = await sharp(src(file))
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  await writeFile(path.join(OUT, `${n}.jpg`), data);
  total += data.length;
  console.log(`${`${n}.jpg`.padEnd(10)} ${info.width}×${info.height} ${kb(data.length).padStart(6)} (${file})`);
}
console.log(`\n일상 ${PHOTOS.length}장 합계 ${kb(total)}`);

console.log(
  "\n" +
    PHOTOS.map(
      ([, alt], i) => `    { src: "/images/daily/${String(i + 1).padStart(2, "0")}.jpg", alt: "${alt}" },`,
    ).join("\n"),
);
