import { createHash, timingSafeEqual } from "node:crypto";

import { addMessage, allowSubmit, isStoreReady, listMessages, type Side } from "@/lib/messageStore";

/** 하객마다 다른 내용이 오가므로 매번 새로 처리한다. */
export const dynamic = "force-dynamic";

const LIMITS = { name: 20, message: 500 } as const;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** 같은 길이로 맞춘 뒤 비교해 비밀번호 길이가 드러나지 않게 한다. */
function samePassword(given: string, expected: string) {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/** 축하 메시지 남기기 */
export async function POST(request: Request) {
  if (!isStoreReady()) return json({ error: "not_ready" }, 503);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  // 사람 눈에는 보이지 않는 칸 — 채워져 오면 자동 전송 프로그램이다. 조용히 성공한 척한다.
  if (typeof body.website === "string" && body.website.trim()) return json({ ok: true }, 201);

  const side = body.side;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (side !== "groom" && side !== "bride") return json({ error: "side" }, 400);
  if (!name || name.length > LIMITS.name) return json({ error: "name" }, 400);
  if (!message || message.length > LIMITS.message) return json({ error: "message" }, 400);

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  try {
    if (!(await allowSubmit(createHash("sha256").update(ip).digest("hex").slice(0, 16)))) {
      return json({ error: "too_many" }, 429);
    }
    await addMessage({ side: side as Side, name, message });
    return json({ ok: true }, 201);
  } catch {
    return json({ error: "store_failed" }, 502);
  }
}

/** 신랑 · 신부용 — 비밀번호가 맞을 때만 목록을 준다. */
export async function GET(request: Request) {
  const expected = process.env.MESSAGES_PASSWORD;
  if (!isStoreReady() || !expected) return json({ error: "not_ready" }, 503);

  const given = request.headers.get("x-messages-password") ?? "";
  if (!given || !samePassword(given, expected)) return json({ error: "unauthorized" }, 401);

  try {
    return json({ messages: await listMessages() });
  } catch {
    return json({ error: "store_failed" }, 502);
  }
}
