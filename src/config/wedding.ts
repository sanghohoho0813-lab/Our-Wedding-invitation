/**
 * ─────────────────────────────────────────────────────────────
 *  청첩장 전체 데이터
 * ─────────────────────────────────────────────────────────────
 *  이 파일 하나만 수정하면 청첩장의 모든 내용이 바뀝니다.
 *  컴포넌트 안에는 이름 / 날짜 / 주소 / 계좌번호를 하드코딩하지 않습니다.
 *
 *  ※ 현재 값은 모두 임시(placeholder) 데이터입니다.
 * ─────────────────────────────────────────────────────────────
 */

export type GalleryOrientation = "portrait" | "landscape" | "square";

export type GalleryImage = {
  /** /public 기준 경로 또는 외부 CDN URL */
  src: string;
  alt: string;
  orientation: GalleryOrientation;
};

export type Account = {
  bank: string;
  holder: string;
  number: string;
  /** 예: "신랑", "아버지", "어머니" */
  relation?: string;
};

export type ContactPerson = {
  role: string;
  name: string;
  phone: string;
};

export const wedding = {
  /* ── 신랑 ─────────────────────────────────────────────── */
  groom: {
    name: "김민준",
    /** 이름 표기용 성/이름 분리 (HERO, ENDING에서 사용) */
    firstName: "민준",
    lastName: "김",
    englishName: "Minjun",
    phone: "010-0000-0000",
    /** 부모님 표기가 필요 없으면 father/mother를 빈 문자열로 두세요. */
    father: "김○○",
    mother: "박○○",
    /** 부모님 성함 뒤 고인 표기가 필요할 때 사용 (예: "故") */
    fatherPrefix: "",
    motherPrefix: "",
    /** "장남" / "차남" 등 */
    relation: "장남",
  },

  /* ── 신부 ─────────────────────────────────────────────── */
  bride: {
    name: "이서연",
    firstName: "서연",
    lastName: "이",
    englishName: "Seoyeon",
    phone: "010-0000-0000",
    father: "이○○",
    mother: "최○○",
    fatherPrefix: "",
    motherPrefix: "",
    relation: "장녀",
  },

  /* ── 예식 정보 ────────────────────────────────────────── */
  wedding: {
    /** YYYY-MM-DD (D-day 계산 기준) */
    date: "2026-12-20",
    /** HH:mm — 24시간 표기. D-day 및 캘린더 계산에 사용 */
    time: "14:00",
    /** 화면에 보여줄 시간 문구 */
    timeLabel: "오후 2시",
    venue: "그랜드 하우스",
    hall: "3층 그랜드홀",
    address: "서울특별시 중구 세종대로 000",
    /** 지도 검색어 (네이버/카카오 지도 버튼에 사용) */
    mapQuery: "그랜드 하우스 웨딩홀",
    /** 지도 이미지를 직접 넣고 싶다면 경로를 지정하세요. (없으면 미니멀 도식 표시) */
    mapImage: "",
    tel: "02-000-0000",
  },

  /* ── 초대의 글 ────────────────────────────────────────── */
  invitation: {
    heading: "INVITATION",
    /** 줄바꿈은 배열 항목으로 구분합니다. */
    body: [
      "함께한 시간 끝에",
      "저희 두 사람이 같은 방향을 바라보며",
      "새로운 시작을 하려 합니다.",
      "",
      "소중한 날,",
      "함께 자리해 축복해 주시면",
      "감사하겠습니다.",
    ],
  },

  /* ── 커플 소개 ────────────────────────────────────────── */
  couple: {
    image: "/images/wedding/couple.jpg",
    imageAlt: "신랑 신부가 나란히 서 있는 사진",
    caption: "우리, 오래 걸어온 길 위에서",
    /** 부모님 성함을 화면에 표시할지 여부 */
    showParents: true,
  },

  /* ── 갤러리 ───────────────────────────────────────────── */
  gallery: [
    { src: "/images/wedding/01.jpg", alt: "웨딩 사진 1", orientation: "portrait" },
    { src: "/images/wedding/02.jpg", alt: "웨딩 사진 2", orientation: "square" },
    { src: "/images/wedding/03.jpg", alt: "웨딩 사진 3", orientation: "square" },
    { src: "/images/wedding/04.jpg", alt: "웨딩 사진 4", orientation: "portrait" },
    { src: "/images/wedding/05.jpg", alt: "웨딩 사진 5", orientation: "landscape" },
    { src: "/images/wedding/06.jpg", alt: "웨딩 사진 6", orientation: "portrait" },
    { src: "/images/wedding/07.jpg", alt: "웨딩 사진 7", orientation: "square" },
    { src: "/images/wedding/08.jpg", alt: "웨딩 사진 8", orientation: "square" },
    { src: "/images/wedding/09.jpg", alt: "웨딩 사진 9", orientation: "landscape" },
  ] satisfies GalleryImage[],

  /* ── 교통 안내 ────────────────────────────────────────── */
  transportation: {
    subway: ["1·2호선 시청역 4번 출구에서 도보 5분", "5호선 광화문역 5번 출구에서 도보 8분"],
    bus: ["간선 100, 150, 401 — 시청앞 정류장 하차", "지선 7011 — 세종대로 사거리 하차"],
    parking: ["건물 지하 1~4층 주차장 이용 (2시간 무료)", "만차 시 인근 공영주차장 이용 가능"],
    /** 셔틀/기타 안내가 없으면 빈 배열로 두세요. */
    etc: [],
  },

  /* ── 마음 전하실 곳 ───────────────────────────────────── */
  accounts: {
    groom: [
      { bank: "국민은행", holder: "김민준", number: "000000-00-000000", relation: "신랑" },
      { bank: "신한은행", holder: "김○○", number: "000-000-000000", relation: "아버지" },
      { bank: "농협은행", holder: "박○○", number: "000-0000-0000-00", relation: "어머니" },
    ] satisfies Account[],
    bride: [
      { bank: "우리은행", holder: "이서연", number: "0000-000-000000", relation: "신부" },
      { bank: "하나은행", holder: "이○○", number: "000-000000-000", relation: "아버지" },
      { bank: "카카오뱅크", holder: "최○○", number: "0000-00-0000000", relation: "어머니" },
    ] satisfies Account[],
  },

  /* ── 연락처 ───────────────────────────────────────────── */
  contacts: {
    groom: [
      { role: "신랑", name: "김민준", phone: "010-0000-0000" },
      { role: "신랑 아버지", name: "김○○", phone: "010-0000-0000" },
      { role: "신랑 어머니", name: "박○○", phone: "010-0000-0000" },
    ] satisfies ContactPerson[],
    bride: [
      { role: "신부", name: "이서연", phone: "010-0000-0000" },
      { role: "신부 아버지", name: "이○○", phone: "010-0000-0000" },
      { role: "신부 어머니", name: "최○○", phone: "010-0000-0000" },
    ] satisfies ContactPerson[],
  },

  /* ── 사진 (섹션별 대표 이미지) ────────────────────────── */
  images: {
    hero: "/images/wedding/hero.jpg",
    heroAlt: "예식장 앞에 나란히 선 신랑 신부",
    ending: "/images/wedding/ending.jpg",
    endingAlt: "손을 맞잡은 신랑 신부",
  },

  /* ── 음악 ─────────────────────────────────────────────── */
  music: {
    /**
     * 음원 파일을 public/audio/ 에 넣은 뒤 true 로 바꾸면
     * 우측 상단에 음악 컨트롤이 나타납니다. (false 면 아무 요청도 하지 않습니다.)
     */
    enabled: false,
    /** .aif / .aiff 원본은 mp3 또는 m4a로 변환해 넣어주세요. (README 참고) */
    src: "/audio/wedding-theme.mp3",
    title: "Our Theme",
    /** true면 첫 화면 터치 시 자동으로 재생을 시도합니다. */
    playOnFirstInteraction: true,
  },

  /* ── 마무리 문구 ──────────────────────────────────────── */
  ending: {
    message: "우리의 시작을\n함께해 주세요.",
    signature: "Thank you",
  },

  /* ── 공유 / SEO ───────────────────────────────────────── */
  share: {
    /** 배포 후 실제 도메인으로 바꿔주세요. (OG 이미지 절대경로 생성에 사용) */
    url: "https://our-wedding-invitation.vercel.app",
    title: "김민준 ♥ 이서연 결혼합니다",
    description: "2026년 12월 20일 일요일 오후 2시, 저희 두 사람의 새로운 시작에 초대합니다.",
    ogImage: "/images/wedding/og.jpg",
    /** 카카오 JavaScript 키. 값을 넣으면 카카오톡 공유가 활성화됩니다. */
    kakaoJavascriptKey: "",
  },
} as const;

export type WeddingConfig = typeof wedding;
