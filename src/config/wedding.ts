/**
 * ─────────────────────────────────────────────────────────────
 *  청첩장 전체 데이터
 * ─────────────────────────────────────────────────────────────
 *  이 파일 하나만 수정하면 청첩장의 모든 내용이 바뀝니다.
 *  컴포넌트 안에는 이름 / 날짜 / 주소 / 계좌번호를 하드코딩하지 않습니다.
 *
 *  ※ 이름·부모님 성함·예식장·날짜·사진·음악은 실제 정보입니다.
 *     연락처(전화번호)와 계좌번호, 교통 안내만 아직 임시값입니다.
 * ─────────────────────────────────────────────────────────────
 */

export type GalleryImage = {
  /** /public 기준 경로 또는 외부 CDN URL */
  src: string;
  alt: string;
  /**
   * 사진의 어느 부분을 보여줄지 지정합니다. (CSS object-position)
   * 갤러리 카드는 비율이 통일되어 있으므로, 인물이 잘리는 사진은
   * "center 30%" 처럼 값을 조정해 주세요. 생략하면 "center" 입니다.
   */
  objectPosition?: string;
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
    name: "김상호",
    firstName: "상호",
    lastName: "김",
    englishName: "Sangho",
    /** TODO: 실제 번호로 교체 */
    phone: "010-0000-0000",
    /** 부모님 표기가 필요 없으면 father/mother를 빈 문자열로 두세요. */
    father: "김영훈",
    mother: "원정연",
    /** 부모님 성함 앞 고인 표기가 필요할 때 사용 (예: "故") */
    fatherPrefix: "",
    motherPrefix: "",
    /** "장남" / "차남" 등 */
    relation: "장남",
  },

  /* ── 신부 ─────────────────────────────────────────────── */
  bride: {
    name: "창지윤",
    firstName: "지윤",
    lastName: "창",
    englishName: "Jiyoon",
    /** TODO: 실제 번호로 교체 */
    phone: "010-0000-0000",
    father: "창지환",
    mother: "유병연",
    fatherPrefix: "",
    motherPrefix: "",
    relation: "장녀",
  },

  /* ── 예식 정보 ────────────────────────────────────────── */
  wedding: {
    /** YYYY-MM-DD (요일·달력·D-day가 이 값에서 자동 계산됩니다) */
    date: "2026-12-20",
    /** HH:mm — 24시간 표기 */
    time: "13:00",
    /** 화면에 보여줄 시간 문구 */
    timeLabel: "오후 1시",
    venue: "연세대학교 신촌캠퍼스 동문회관",
    /** 홀 이름이 정해지면 입력하세요. 비워두면 화면에 표시되지 않습니다. */
    hall: "",
    address: "서울 서대문구 연세로 50",
    /** 네이버지도 · 카카오맵 버튼이 이 검색어로 열립니다. */
    mapQuery: "연세대학교 동문회관",
    /** 지도 캡처 이미지를 넣고 싶다면 경로를 지정하세요. (비우면 안내 블록 표시) */
    mapImage: "",
    /** 예식장 대표번호 — 비워두면 표시되지 않습니다. */
    tel: "",
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

  /* ── 신랑·신부 소개 ───────────────────────────────────── */
  couple: {
    /** 부모님 성함을 함께 표시할지 여부 */
    showParents: true,
  },

  /* ── 갤러리 ───────────────────────────────────────────── */
  /**
   * 웨딩 사진은 전부 이 배열 한 곳에만 넣습니다.
   * (가로 스와이프 갤러리에 순서대로 표시됩니다.)
   * 장수를 늘리거나 줄여도 갤러리와 뷰어가 알아서 맞춰집니다.
   */
  gallery: [
    { src: "/images/wedding/01.jpg", alt: "호숫가에서 입맞추는 신랑과 신부" },
    { src: "/images/wedding/02.jpg", alt: "면사포를 쓰고 이마를 맞댄 두 사람" },
    { src: "/images/wedding/03.jpg", alt: "다리를 배경으로 마주 안은 신랑과 신부" },
    { src: "/images/wedding/04.jpg", alt: "부케를 든 신랑과 면사포를 쓴 신부" },
    { src: "/images/wedding/05.jpg", alt: "계단에 나란히 앉은 신랑과 신부" },
    { src: "/images/wedding/06.jpg", alt: "잔디밭에 누워 마주 보는 두 사람" },
    { src: "/images/wedding/07.jpg", alt: "꽃밭에서 뒤돌아보며 웃는 신부" },
    { src: "/images/wedding/08.jpg", alt: "잔디밭에 앉아 서로를 담는 신랑과 신부" },
    { src: "/images/wedding/09.jpg", alt: "나무가 늘어선 길을 함께 걷는 두 사람" },
    { src: "/images/wedding/10.jpg", alt: "붉은 장미 부케를 든 신부의 옆모습" },
    { src: "/images/wedding/11.jpg", alt: "단풍나무 아래 나란히 앉은 두 사람" },
    { src: "/images/wedding/12.jpg", alt: "하늘을 배경으로 신부를 안아 올린 신랑" },
    { src: "/images/wedding/13.jpg", alt: "장미 부케를 들고 마주 보며 웃는 두 사람" },
    { src: "/images/wedding/14.jpg", alt: "면사포 너머로 장미 부케를 든 신부" },
    { src: "/images/wedding/15.jpg", alt: "손하트 너머로 바라본 신부" },
    { src: "/images/wedding/16.jpg", alt: "잔디밭에서 마주 안은 신랑과 신부" },
    { src: "/images/wedding/17.jpg", alt: "손하트 너머로 바라본 신랑" },
  ] satisfies GalleryImage[],

  /* ── 교통 안내 ────────────────────────────────────────── */
  /** TODO: 예식장에서 안내받은 실제 정보로 확인 후 교체하세요. */
  transportation: {
    subway: ["2호선 신촌역에서 도보 약 10분", "경의중앙선 신촌역에서 도보 약 12분"],
    bus: ["연세대학교 · 신촌역 정류장 하차"],
    parking: ["교내 주차장 이용", "예식 당일 주차 안내는 예식장에 문의해 주세요."],
    /** 셔틀 등 추가 안내가 없으면 빈 배열로 두세요. */
    etc: [],
  },

  /* ── 마음 전하실 곳 ───────────────────────────────────── */
  /** TODO: 실제 계좌번호로 교체 */
  accounts: {
    groom: [
      { bank: "은행명", holder: "김상호", number: "000000-00-000000", relation: "신랑" },
      { bank: "은행명", holder: "김영훈", number: "000-000-000000", relation: "아버지" },
      { bank: "은행명", holder: "원정연", number: "000-0000-0000-00", relation: "어머니" },
    ] satisfies Account[],
    bride: [
      { bank: "은행명", holder: "창지윤", number: "0000-000-000000", relation: "신부" },
      { bank: "은행명", holder: "창지환", number: "000-000000-000", relation: "아버지" },
      { bank: "은행명", holder: "유병연", number: "0000-00-0000000", relation: "어머니" },
    ] satisfies Account[],
  },

  /* ── 혼주 연락처 ──────────────────────────────────────── */
  /**
   * 신랑·신부 연락처는 COUPLE 섹션에서 groom.phone / bride.phone 을 사용합니다.
   * 중복을 피하기 위해 여기에는 혼주(부모님)만 둡니다.
   */
  contacts: {
    groom: [
      { role: "신랑 아버지", name: "김영훈", phone: "010-0000-0000" },
      { role: "신랑 어머니", name: "원정연", phone: "010-0000-0000" },
    ] satisfies ContactPerson[],
    bride: [
      { role: "신부 아버지", name: "창지환", phone: "010-0000-0000" },
      { role: "신부 어머니", name: "유병연", phone: "010-0000-0000" },
    ] satisfies ContactPerson[],
  },

  /* ── 대표 사진 ────────────────────────────────────────── */
  images: {
    /** 첫 화면 사진 — 이 한 장이 청첩장의 첫인상을 결정합니다. */
    hero: "/images/wedding/hero.jpg",
    heroAlt: "노을빛 잔디밭에서 입맞추는 신랑과 신부",
    /** 첫 화면에서 사진의 어느 부분을 보여줄지 (CSS object-position) */
    heroPosition: "50% 42%",
  },

  /* ── 음악 ─────────────────────────────────────────────── */
  music: {
    /**
     * 음원 파일을 public/audio/ 에 넣은 뒤 true 로 바꾸면
     * 우측 상단에 음악 컨트롤이 나타납니다. (false 면 아무 요청도 하지 않습니다.)
     */
    enabled: true,
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
    title: "김상호 ♥ 창지윤 결혼합니다",
    description:
      "2026년 12월 20일 일요일 오후 1시, 연세대학교 신촌캠퍼스 동문회관에서 저희 두 사람의 새로운 시작에 초대합니다.",
    ogImage: "/images/wedding/og.jpg",
    /** 카카오 JavaScript 키. 값을 넣으면 카카오톡 공유가 활성화됩니다. */
    kakaoJavascriptKey: "",
  },
} as const;

export type WeddingConfig = typeof wedding;
