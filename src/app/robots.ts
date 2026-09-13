import type { MetadataRoute } from "next";

/**
 * 연락처 · 계좌번호 등 개인정보가 들어가는 페이지이므로
 * 검색엔진 수집을 막는다. (링크로 직접 들어오는 하객에게는 영향 없음)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
