import { wedding } from "@/config/wedding";
import { parseWeddingDate } from "@/lib/date";

/** 예식 시간이 정해져 있지 않을 때 기본으로 잡는 소요 시간(시간). */
const DURATION_HOURS = 2;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Date → "20261220T130000" (타임존 지정과 함께 쓰는 지역 시간 표기) */
function toLocalStamp(d: Date) {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

function eventTitle() {
  return `${wedding.groom.name} ♥ ${wedding.bride.name} 결혼식`;
}

function eventLocation() {
  const hall = wedding.wedding.hall ? ` ${wedding.wedding.hall}` : "";
  return `${wedding.wedding.venue}${hall} (${wedding.wedding.address})`;
}

/** 예식 시작 / 종료 시각 */
export function weddingRange() {
  const start = parseWeddingDate(wedding.wedding.date, wedding.wedding.time);
  const end = new Date(start.getTime() + DURATION_HOURS * 60 * 60 * 1000);
  return { start, end };
}

/**
 * 구글 캘린더 "일정 추가" 링크.
 * 안드로이드 / PC 에서는 앱이나 웹 캘린더가 바로 열린다.
 */
export function googleCalendarUrl() {
  const { start, end } = weddingRange();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(),
    dates: `${toLocalStamp(start)}/${toLocalStamp(end)}`,
    details: `${wedding.share.description}\n\n${wedding.share.url}`,
    location: eventLocation(),
    ctz: "Asia/Seoul",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ── .ics 파일 ───────────────────────────────────────────── */

/** RFC 5545 의 TEXT 값 규칙에 맞게 이스케이프한다. */
function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * 한 줄을 75 바이트로 접는다. (RFC 5545)
 * 한글은 한 글자가 여러 바이트라서 글자 수가 아니라 바이트 기준으로 잘라야 한다.
 */
function foldLine(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;

  const out: string[] = [];
  const decoder = new TextDecoder();
  let start = 0;
  let limit = 75;

  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // 멀티바이트 문자 중간에서 자르지 않도록 뒤로 물러난다.
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end -= 1;
    out.push((out.length === 0 ? "" : " ") + decoder.decode(bytes.slice(start, end)));
    start = end;
    limit = 74; // 이어지는 줄은 맨 앞 공백 한 칸을 포함해 75 바이트
  }

  return out.join("\r\n");
}

/** 청첩장 정보로 만든 .ics 본문 */
export function buildIcs() {
  const { start, end } = weddingRange();
  const uid = `wedding-${wedding.wedding.date}@${new URL(wedding.share.url).hostname}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Our Wedding Invitation//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Seoul",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0900",
    "TZOFFSETTO:+0900",
    "TZNAME:KST",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    // 빌드할 때마다 파일이 달라지지 않도록 예식 날짜를 기준으로 고정한다.
    `DTSTAMP:${wedding.wedding.date.replace(/-/g, "")}T000000Z`,
    `DTSTART;TZID=Asia/Seoul:${toLocalStamp(start)}`,
    `DTEND;TZID=Asia/Seoul:${toLocalStamp(end)}`,
    `SUMMARY:${escapeText(eventTitle())}`,
    `LOCATION:${escapeText(eventLocation())}`,
    `DESCRIPTION:${escapeText(`${wedding.share.description}\n\n${wedding.share.url}`)}`,
    `URL:${wedding.share.url}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-P1D",
    `DESCRIPTION:${escapeText(`내일은 ${eventTitle()} 입니다`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n") + "\r\n";
}
