/**
 * ─────────────────────────────────────────────────────────────
 *  Supabase 연결 (축하 메시지 · 게스트스냅)
 * ─────────────────────────────────────────────────────────────
 *  Vercel 에 Supabase 를 연결하면 아래 두 값이 환경 변수로 들어온다.
 *    NEXT_PUBLIC_SUPABASE_URL
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY  (또는 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
 *
 *  표와 사진 보관함은 supabase/setup.sql 을 Supabase SQL Editor 에서
 *  한 번 실행하면 만들어진다. (README 6-1 참고)
 *
 *  두 값 모두 "공개해도 되는 키"다. 누가 무엇을 할 수 있는지는
 *  Supabase 쪽 규칙(RLS)이 정한다 — 읽기 · 새로 쓰기만 되고 지우기 · 고치기는 안 된다.
 *  SDK 없이 fetch 로 직접 부른다. (청첩장 용량을 늘리지 않기 위해)
 * ─────────────────────────────────────────────────────────────
 */

// NEXT_PUBLIC_ 값은 빌드할 때 글자 그대로 박혀야 하므로 하나씩 직접 적는다.
const URL_ = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
const KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const SNAP_BUCKET = "guest-snaps";

/** Supabase 가 연결되어 있는가 */
export function supabaseReady() {
  return Boolean(URL_ && KEY);
}

/** 새 형식 키(sb_publishable_…)는 apikey 머리말로만 보낸다. */
function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { apikey: KEY };
  if (!KEY.startsWith("sb_")) headers.Authorization = `Bearer ${KEY}`;
  return headers;
}

/** 표에서 읽기 — query 는 PostgREST 형식 (예: "select=*&order=created_at.desc") */
export async function selectRows<T>(table: string, query: string): Promise<T[]> {
  const res = await fetch(`${URL_}/rest/v1/${table}?${query}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`select_${res.status}`);
  return (await res.json()) as T[];
}

/** 표에 한 줄 쓰기 — 저장된 줄을 돌려준다. */
export async function insertRow<T>(table: string, row: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${URL_}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`insert_${res.status}`);
  const rows = (await res.json()) as T[];
  return rows[0];
}

/**
 * 사진 보관함에 파일 올리기.
 * 영상은 크기가 커서 진행률을 보여주려고 XMLHttpRequest 를 쓴다.
 */
export function uploadFile(
  path: string,
  file: Blob,
  onProgress?: (ratio: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${URL_}/storage/v1/object/${SNAP_BUCKET}/${path}`);
    for (const [k, v] of Object.entries(authHeaders())) xhr.setRequestHeader(k, v);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "31536000");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`upload_${xhr.status}`));
    xhr.onerror = () => reject(new Error("upload_network"));
    xhr.send(file);
  });
}

/** 보관함 파일의 공개 주소 */
export function publicUrl(path: string) {
  return `${URL_}/storage/v1/object/public/${SNAP_BUCKET}/${path}`;
}
