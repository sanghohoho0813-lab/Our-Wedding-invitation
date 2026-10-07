"use client";

import { useEffect } from "react";

import { scrollToTop } from "@/lib/scroll";

/**
 * 페이지를 옮겨 다닐 때 스크롤 상자 위치를 맨 위로.
 * 청첩장은 창이 아니라 #page-scroll 상자 안에서 스크롤되므로
 * Next.js 의 기본 "맨 위로" 동작이 닿지 않는다. (lib/scroll.ts)
 */
export function ScrollReset() {
  useEffect(() => scrollToTop({ smooth: false }), []);
  return null;
}
