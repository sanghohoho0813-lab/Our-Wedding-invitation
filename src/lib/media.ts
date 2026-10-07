/**
 * 하객이 고른 사진 · 영상을 올리기 전에 손보는 도구.
 *
 * 휴대폰 사진은 한 장에 3~10MB 라 그대로 올리면 느리고, 보는 사람도 오래 기다린다.
 * 화면에서 보기 충분한 크기(긴 변 2000px)로 줄이고, 목록용 작은 그림도 따로 만든다.
 */

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

function draw(source: CanvasImageSource, w: number, h: number, max: number) {
  const scale = Math.min(1, max / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

/** 사진을 줄여 JPEG 본편 + 작은 그림을 만든다. 읽을 수 없는 형식이면 null */
export async function preparePhoto(file: File): Promise<{ full: Blob; thumb: Blob } | null> {
  let bitmap: ImageBitmap;
  try {
    // 휴대폰 사진의 회전 정보(EXIF)를 반영해 눕지 않게 한다.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }

  try {
    const fullCanvas = draw(bitmap, bitmap.width, bitmap.height, 2000);
    const thumbCanvas = draw(bitmap, bitmap.width, bitmap.height, 480);
    if (!fullCanvas || !thumbCanvas) return null;
    const [full, thumb] = await Promise.all([
      canvasToBlob(fullCanvas, 0.85),
      canvasToBlob(thumbCanvas, 0.75),
    ]);
    return full && thumb ? { full, thumb } : null;
  } finally {
    bitmap.close();
  }
}

/** 영상의 첫 장면으로 작은 그림을 만든다. 실패하면 null (목록에 재생 표시만 나온다) */
export function videoThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    let settled = false;

    const finish = (blob: Blob | null) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      resolve(blob);
    };

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;

    video.onloadeddata = () => {
      video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
    };
    video.onseeked = async () => {
      const canvas = draw(video, video.videoWidth, video.videoHeight, 480);
      finish(canvas ? await canvasToBlob(canvas, 0.75) : null);
    };
    video.onerror = () => finish(null);
    window.setTimeout(() => finish(null), 8000);
  });
}

/** 보관함 안 파일 이름 — 날짜 폴더 + 겹치지 않는 이름 */
export function snapPath(ext: string, suffix = "") {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const id = `${now.getTime().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return `${now.getFullYear()}${p(now.getMonth() + 1)}${p(now.getDate())}/${id}${suffix}.${ext}`;
}

/** 영상 파일 확장자 — 보관함이 받는 형식으로 맞춘다. */
export function videoExt(file: File) {
  if (file.type === "video/quicktime") return "mov";
  if (file.type === "video/webm") return "webm";
  if (file.type === "video/3gpp") return "3gp";
  return "mp4";
}
