"use client";

import { CalendarPlus } from "lucide-react";

import { googleCalendarUrl } from "@/lib/calendar";

/** 애플 기기인지 (아이폰 / 아이패드 / 맥) */
function isApple() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod|Macintosh/.test(ua);
}

/**
 * 예식 일정을 하객의 캘린더에 담아주는 버튼.
 *
 * 애플 기기는 .ics 를 내려주면 캘린더 앱이 바로 열리고,
 * 그 밖에는 구글 캘린더의 일정 추가 화면을 연다.
 */
export function AddToCalendar() {
  const handleClick = () => {
    if (isApple()) {
      window.location.href = "/api/calendar";
      return;
    }
    window.open(googleCalendarUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-10 text-center">
      <button
        type="button"
        onClick={handleClick}
        className="btn-outline inline-flex items-center gap-2 active:bg-paper-deep"
      >
        <CalendarPlus size={15} strokeWidth={1.4} aria-hidden="true" />
        캘린더에 추가
      </button>
    </div>
  );
}
