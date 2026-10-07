"use client";

import { useEffect } from "react";

/**
 * 첫 화면 높이를 "처음 열었을 때의 화면 높이"로 고정한다. (--app-h)
 *
 * 카카오톡 같은 인앱 브라우저는 주소창 · 버튼 줄이 나타나고 사라질 때
 * 화면 높이 자체가 바뀐다. 첫 화면이 그 높이를 따라 늘었다 줄었다 하면
 * 아래 내용 전체가 위아래로 밀리며 스크롤이 덜컥거린다.
 * 그래서 폭이 바뀔 때(가로 전환 · 폴더블 펼침)만 다시 잰다.
 */
export function ViewportHeight() {
  useEffect(() => {
    const root = document.documentElement;
    let width = window.innerWidth;

    const set = () => root.style.setProperty("--app-h", `${window.innerHeight}px`);
    set();

    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      set();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return null;
}
