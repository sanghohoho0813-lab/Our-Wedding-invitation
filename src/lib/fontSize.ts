/** 글자 크기 — 기본 / 10% 크게 / 20% 크게 (globals.css 의 --fs 가 실제 배율을 맡는다) */
export const FONT_SIZE_STEPS = ["100", "110", "120"] as const;
export type FontSizeStep = (typeof FONT_SIZE_STEPS)[number];

export const FONT_SIZE_KEY = "wedding:fs";

/**
 * 첫 화면이 그려지기 전에 저장해 둔 글자 크기를 적용하는 짧은 스크립트.
 * (그러지 않으면 기본 크기로 잠깐 보였다가 커지며 화면이 출렁인다) — layout 의 <head> 에서 쓴다.
 */
export const FONT_SIZE_BOOT = `try{var f=localStorage.getItem("${FONT_SIZE_KEY}");if(f==="110"||f==="120")document.documentElement.dataset.fs=f}catch(e){}`;
