/**
 * 사진 로딩 중에 보여줄 아주 작은 미리보기(blur) 생성
 *
 * 갤러리처럼 사진이 많은 화면에서, 다 내려받기 전까지 회색 빈칸이 보이는 대신
 * 흐릿한 색감이 먼저 깔리도록 한다.
 *
 *   node scripts/build-blur.mjs
 *
 * public/images 아래 모든 jpg 를 훑어 src/config/blur.ts 를 다시 만든다.
 * 사진을 바꾸거나 추가한 뒤에 한 번 실행하면 된다.
 */
import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "images");
const OUT = path.join(process.cwd(), "src", "config", "blur.ts");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

const files = (await walk(ROOT)).sort();
const entries = [];

for (const file of files) {
  const key = "/" + path.relative(path.join(process.cwd(), "public"), file).split(path.sep).join("/");
  // 가로 16px 이면 눈에는 색감만 남고 용량은 200 바이트 안팎이 된다.
  const buf = await sharp(file)
    .rotate()
    .resize(16, 16, { fit: "inside" })
    .jpeg({ quality: 40 })
    .toBuffer();
  entries.push([key, `data:image/jpeg;base64,${buf.toString("base64")}`]);
}

const body = entries.map(([k, v]) => `  "${k}": "${v}",`).join("\n");
const total = entries.reduce((sum, [, v]) => sum + v.length, 0);

await writeFile(
  OUT,
  `/**
 * 사진 로딩 중에 깔아둘 흐릿한 미리보기.
 *
 * 직접 고치지 마세요 — \`node scripts/build-blur.mjs\` 가 다시 만듭니다.
 * (public/images 아래 사진을 바꾸거나 추가한 뒤에 실행)
 */
export const blurDataUrls: Record<string, string> = {
${body}
};

/** 해당 사진의 미리보기. 없으면 undefined */
export function blurFor(src: string) {
  return blurDataUrls[src];
}
`,
  "utf8",
);

console.log(`${entries.length}장, 합계 ${Math.round(total / 1024)}KB → src/config/blur.ts`);
