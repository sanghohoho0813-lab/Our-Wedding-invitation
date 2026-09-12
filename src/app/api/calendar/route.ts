import { buildIcs } from "@/lib/calendar";

/** 빌드 시점에 한 번 만들어 두고 정적 파일처럼 내려준다. */
export const dynamic = "force-static";

/** 캘린더 앱이 바로 열리도록 text/calendar 로 응답한다. */
export function GET() {
  return new Response(buildIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wedding.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
