/**
 * 청첩장은 브라우저 창이 아니라 화면을 꽉 채운 상자(#page-scroll) 안에서 스크롤된다.
 *
 * 창 자체가 스크롤되면 카카오톡 · 크롬 같은 앱이 위로 올릴 때마다
 * 주소창과 아래 버튼 줄을 꺼냈다 숨겼다 하는데, 그때마다 화면 높이가 바뀌어
 * 긴 페이지 전체를 다시 계산하느라 스크롤이 멈칫한다.
 * 안쪽 상자가 스크롤되면 앱은 스크롤된 줄 모르므로 도구 막대가 움직이지 않는다.
 */
export const SCROLL_ROOT_ID = "page-scroll";

export function getScrollRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById(SCROLL_ROOT_ID);
}

/**
 * 모달 · 입장 화면이 떠 있는 동안 뒤쪽이 스크롤되지 않게 막는다.
 * 돌려줄 함수를 부르면 원래대로 풀린다. 스크롤 위치는 그대로 유지된다.
 */
export function lockScroll(): () => void {
  const root = getScrollRoot();
  if (!root) return () => undefined;

  const prev = root.style.overflowY;
  root.style.overflowY = "hidden";
  return () => {
    root.style.overflowY = prev;
  };
}

export function scrollToTop({ smooth = true } = {}) {
  getScrollRoot()?.scrollTo({ top: 0, behavior: smooth ? "smooth" : "instant" });
}
