import { wedding } from "@/config/wedding";

type KakaoShare = {
  sendDefault: (payload: Record<string, unknown>) => void;
};

type KakaoSDK = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: KakaoShare;
};

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

export function canWebShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export async function webShare(url: string): Promise<"shared" | "cancelled" | "unsupported"> {
  if (!canWebShare()) return "unsupported";
  try {
    await navigator.share({
      title: wedding.share.title,
      text: wedding.share.description,
      url,
    });
    return "shared";
  } catch {
    return "cancelled";
  }
}

export function isKakaoReady() {
  return Boolean(wedding.share.kakaoJavascriptKey) && typeof window !== "undefined" && Boolean(window.Kakao);
}

/**
 * 카카오톡 공유.
 *
 * 사용하려면
 *   1) config/wedding.ts 의 share.kakaoJavascriptKey 에 JavaScript 키를 넣고
 *   2) app/layout.tsx 에 주석으로 남겨둔 Kakao SDK <Script> 를 활성화하면
 * 별도 코드 수정 없이 바로 동작합니다.
 */
export function kakaoShare(url: string): boolean {
  if (!isKakaoReady()) return false;

  const kakao = window.Kakao!;
  if (!kakao.isInitialized()) kakao.init(wedding.share.kakaoJavascriptKey);

  kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: wedding.share.title,
      description: wedding.share.description,
      imageUrl: new URL(wedding.share.ogImage, wedding.share.url).toString(),
      link: { mobileWebUrl: url, webUrl: url },
    },
    buttons: [
      {
        title: "청첩장 보기",
        link: { mobileWebUrl: url, webUrl: url },
      },
    ],
  });
  return true;
}
