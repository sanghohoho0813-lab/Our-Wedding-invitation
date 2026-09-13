import { wedding } from "@/config/wedding";

/**
 * 화면에 보여줄 예식 장소 한 줄.
 *   "연세대학교 신촌캠퍼스 동문회관 2층"
 * 홀 이름이 정해지면 층 뒤에 함께 붙는다.
 */
export function venueLine() {
  const { venue, ceremonyFloor, hall } = wedding.wedding;
  return [venue, ceremonyFloor, hall].filter(Boolean).join(" ");
}

/**
 * 네이버지도 버튼 주소.
 * 확정된 장소 링크가 있으면 그것을 쓰고, 없으면 검색으로 대체한다.
 * (검색어는 실제 등록 상호인 mapQuery 를 쓴다 — 화면 표시용 이름과 다르다)
 */
export function naverMapHref() {
  const { naverMapUrl, mapQuery, venue } = wedding.wedding;
  if (naverMapUrl) return naverMapUrl;
  return `https://map.naver.com/v5/search/${encodeURIComponent(mapQuery || venue)}`;
}

export function kakaoMapHref() {
  const { mapQuery, venue } = wedding.wedding;
  return `https://map.kakao.com/?q=${encodeURIComponent(mapQuery || venue)}`;
}
