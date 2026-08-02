const WEEKDAY_KO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"] as const;
const WEEKDAY_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

/** "2026-12-20" + "14:00" → 로컬 Date */
export function parseWeddingDate(date: string, time = "00:00"): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh || 0, mm || 0, 0, 0);
}

export function getYear(date: string) {
  return Number(date.split("-")[0]);
}

export function getMonth(date: string) {
  return Number(date.split("-")[1]);
}

export function getDay(date: string) {
  return Number(date.split("-")[2]);
}

/** "2026. 12. 20" */
export function formatDotted(date: string) {
  const [y, m, d] = date.split("-");
  return `${y}. ${m}. ${d}`;
}

export function weekdayKo(date: string) {
  return WEEKDAY_KO[parseWeddingDate(date).getDay()];
}

const MONTH_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** "December" */
export function monthEn(date: string) {
  return MONTH_EN[getMonth(date) - 1];
}

export function weekdayEn(date: string) {
  return WEEKDAY_EN[parseWeddingDate(date).getDay()];
}

/** "Sun, Dec 20th, 2026" */
export function formatEnDate(date: string) {
  const d = parseWeddingDate(date);
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = MONTH_EN[d.getMonth()].slice(0, 3);
  const weekday = WEEKDAY_EN[d.getDay()].charAt(0) + WEEKDAY_EN[d.getDay()].slice(1).toLowerCase();
  return `${weekday}, ${month} ${day}${suffix}, ${d.getFullYear()}`;
}

export type DdayState =
  | { status: "before"; days: number }
  | { status: "today" }
  | { status: "after"; days: number };

/** 자정 기준 남은 일수 계산 (시/분 무시) */
export function getDday(date: string, now: Date = new Date()): DdayState {
  const target = parseWeddingDate(date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (diff > 0) return { status: "before", days: diff };
  if (diff === 0) return { status: "today" };
  return { status: "after", days: -diff };
}

export type CalendarCell = { day: number | null; isWedding: boolean; weekday: number };

/** 해당 월의 달력 그리드(일요일 시작)를 만든다. */
export function buildMonthGrid(date: string): CalendarCell[] {
  const year = getYear(date);
  const month = getMonth(date);
  const weddingDay = getDay(date);

  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ day: null, isWedding: false, weekday: i % 7 });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push({ day: d, isWedding: d === weddingDay, weekday: cells.length % 7 });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, isWedding: false, weekday: cells.length % 7 });
  }
  return cells;
}

export { MONTH_EN, WEEKDAY_EN, WEEKDAY_KO };
