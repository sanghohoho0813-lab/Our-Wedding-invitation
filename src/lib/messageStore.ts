/**
 * ─────────────────────────────────────────────────────────────
 *  축하 메시지 저장소 (서버 전용)
 * ─────────────────────────────────────────────────────────────
 *  하객이 남긴 메시지는 Upstash Redis 에 쌓이고,
 *  신랑 · 신부만 /messages 페이지에서 비밀번호로 열어볼 수 있다.
 *
 *  Vercel 에서 한 번만 연결해 주면 된다. (README "축하 메시지" 참고)
 *    1) Vercel 프로젝트 → Storage → Upstash for Redis 만들기 → 이 프로젝트에 연결
 *       → KV_REST_API_URL · KV_REST_API_TOKEN 이 자동으로 들어온다.
 *    2) Settings → Environment Variables 에 MESSAGES_PASSWORD 추가
 *    3) 다시 배포
 *
 *  로컬에서 시험할 때는 MESSAGES_STORE=memory 로 띄우면 메모리에만 저장된다.
 * ─────────────────────────────────────────────────────────────
 */

export type Side = "groom" | "bride";

export type CheerMessage = {
  id: string;
  side: Side;
  name: string;
  message: string;
  /** ISO 문자열 */
  createdAt: string;
};

const LIST_KEY = "wedding:messages";

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

const inMemory = () => process.env.MESSAGES_STORE === "memory";

/** 시험용 — 서버가 다시 뜨면 사라진다. */
const memory: { list: string[]; hits: Map<string, { n: number; until: number }> } = {
  list: [],
  hits: new Map(),
};

/** 저장소가 연결되어 있는가 */
export function isStoreReady() {
  return inMemory() || redisConfig() !== null;
}

async function redis<T>(command: (string | number)[]): Promise<T> {
  const config = redisConfig();
  if (!config) throw new Error("store_not_configured");

  const res = await fetch(config.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis_${res.status}`);
  const data = (await res.json()) as { result: T; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

export async function addMessage(input: Omit<CheerMessage, "id" | "createdAt">) {
  const entry: CheerMessage = {
    ...input,
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const raw = JSON.stringify(entry);

  if (inMemory()) memory.list.unshift(raw);
  else await redis(["LPUSH", LIST_KEY, raw]);
  return entry;
}

export async function listMessages(): Promise<CheerMessage[]> {
  const raw = inMemory() ? memory.list : await redis<string[]>(["LRANGE", LIST_KEY, 0, -1]);
  return raw.flatMap((item) => {
    try {
      return [JSON.parse(item) as CheerMessage];
    } catch {
      return [];
    }
  });
}

/**
 * 같은 곳에서 짧은 시간에 너무 많이 보내면 막는다. (장난 · 자동 전송 방지)
 * 10분에 8번까지.
 */
export async function allowSubmit(clientKey: string) {
  const limit = 8;
  const windowSec = 600;
  const key = `wedding:rate:${clientKey}`;

  if (inMemory()) {
    const now = Date.now();
    const hit = memory.hits.get(key);
    if (!hit || hit.until < now) {
      memory.hits.set(key, { n: 1, until: now + windowSec * 1000 });
      return true;
    }
    hit.n += 1;
    return hit.n <= limit;
  }

  const n = await redis<number>(["INCR", key]);
  if (n === 1) await redis(["EXPIRE", key, windowSec]);
  return n <= limit;
}
